import { Once, OnceStep, OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { InventoryFactory } from '@public/server/inventory/inventory.factory';
import { ItemService } from '@public/server/item/item.service';
import { Monitor } from '@public/server/monitor/monitor';
import { Notifier } from '@public/server/notifier';
import { ProgressService } from '@public/server/player/progress.service';
import { ServerEvent } from '@public/shared/event';
import { FieldItem, getAmount } from '@public/shared/field';
import { DMC_FIELDS } from '@public/shared/job/dmc';
import { toVector3Object, Vector3 } from '@public/shared/polyzone/vector';

import { ADD_ERROR_MESSAGE } from '../../../shared/inventory';
import { isOk } from '../../../shared/result';
import { FieldProvider } from '../../field/field.provider';

const fieldMessage = {
    dmc_iron_field: 'de fer et charbon',
    dmc_aluminium_field: "d'aluminium",
    dmc_uranium_field: "d'uranium",
};

@Provider()
export class DmcHarvestProvider {
    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(InventoryFactory)
    private inventoryFactory: InventoryFactory;

    @Inject(FieldProvider)
    private fieldService: FieldProvider;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(Monitor)
    private monitor: Monitor;

    @Once(OnceStep.RepositoriesLoaded)
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
            `Récolte ${fieldMessage[field]}...`,
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
                canCancel: true,
            }
        );

        if (!completed) {
            this.notifier.notify(source, `Vous avez ~r~arrêté~s~ de miner.`, 'error');
            return false;
        }

        if (!(await this.fieldService.harvestField(field, 1))) {
            this.notifier.notify(source, `La mine est épuisée.`);
            return false;
        }

        const fieldItems = DMC_FIELDS[field].item as FieldItem[];
        const items = [];

        for (const fieldItem of fieldItems) {
            const amount = getAmount(fieldItem.amount);
            items.push({ name: fieldItem.name, amount });
        }

        const inventory = await this.inventoryFactory.getPlayerInventory(source);

        if (!inventory.canCarryItems(items)) {
            this.notifier.notify(
                source,
                `Vous ne possédez pas suffisamment de place dans votre inventaire pour récolter.`
            );
            return false;
        }

        for (const item of items) {
            const result = inventory.add(item.name, item.amount);
            if (isOk(result)) {
                const itemInfo = this.itemService.getItem(item.name);
                this.notifier.notify(source, `Vous avez récolté ~b~${item.amount} ~b~${itemInfo.label}.`);

                this.monitor.traceEvent('job_dmc_harvest', {
                    item_id: item.name,
                    player_source: source,
                    item_label: itemInfo.label,
                    amount: item.amount,
                    position: toVector3Object(GetEntityCoords(GetPlayerPed(source)) as Vector3),
                    field: field,
                });
            } else if (result.err == 'not_enough_space') {
                this.notifier.notify(source, 'Vos poches sont pleines...', 'error');
                return false;
            } else {
                this.notifier.notify(source, `Il y a eu une erreur: ${item} ${ADD_ERROR_MESSAGE[result.err]}`, 'error');
                return false;
            }
        }

        return true;
    }
}
