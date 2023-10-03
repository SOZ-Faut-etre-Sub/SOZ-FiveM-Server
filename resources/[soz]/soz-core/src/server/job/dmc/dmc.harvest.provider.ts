import { Once, OnceStep, OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { FieldProvider } from '@public/server/farm/field.provider';
import { InventoryManager } from '@public/server/inventory/inventory.manager';
import { ItemService } from '@public/server/item/item.service';
import { Notifier } from '@public/server/notifier';
import { ProgressService } from '@public/server/player/progress.service';
import { ServerEvent } from '@public/shared/event';
import { FieldItem } from '@public/shared/field';
import { DMC_FIELDS } from '@public/shared/job/dmc';

@Provider()
export class DmcHarvestProvider {
    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(FieldProvider)
    private fieldService: FieldProvider;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Once(OnceStep.Start)
    public async init() {
        for (const field of Object.values(DMC_FIELDS)) {
            await this.fieldService.createField({
                ...field,
            });
        }
    }

    @OnEvent(ServerEvent.DMC_HARVEST)
    async onHarvest(source: number, field: string) {
        this.notifier.notify(source, 'Vous ~g~commencez~s~ à miner.');

        while (await this.doHarvest(source, field)) {
            /* empty */
        }
    }

    async doHarvest(source: number, field: string) {
        const { completed } = await this.progressService.progress(
            source,
            'dmc_harvest',
            `Récolte ${field == 'dmc_iron_field' ? 'de fer et charbon' : "d'aluminium"}...`,
            4500,
            {
                name: 'ground_attack_on_spot',
                dictionary: 'melee@large_wpn@streamed_core',
                options: {
                    repeat: true,
                    enablePlayerControl: false,
                },
            },
            {
                useAnimationService: true,
                canCancel: true,
            }
        );

        if (!completed) {
            this.notifier.notify(source, `Vous avez ~r~arrêté~s~ de miner.`, 'error');
            return false;
        }

        if (!this.fieldService.harvestField(field, 1)) {
            this.notifier.notify(source, `La mine est épuisée.`);
            return false;
        }

        const items = DMC_FIELDS[field].item as FieldItem[];

        if (!this.inventoryManager.canCarryItems(source, items)) {
            this.notifier.notify(
                source,
                `Vous ne possédez pas suffisamment de place dans votre inventaire pour récolter.`
            );
            return false;
        }

        for (const item of items) {
            const { success, reason } = await this.inventoryManager.addItemToInventory(source, item.name, item.amount);
            if (success) {
                this.notifier.notify(
                    source,
                    `Vous avez récolté ~b~${item.amount} ~b~${this.itemService.getItem(item.name).label}.`
                );
            } else if (reason == 'invalid_weight') {
                this.notifier.notify(source, 'Vos poches sont pleines...', 'error');
                return false;
            } else {
                this.notifier.notify(source, `Il y a eu une erreur: ${item} ${reason}`, 'error');
                return false;
            }
        }
        return true;
    }
}
