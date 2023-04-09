import { Once, OnceStep, OnEvent } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { FieldProvider } from '@public/server/farm/field.provider';
import { InventoryManager } from '@public/server/inventory/inventory.manager';
import { ItemService } from '@public/server/item/item.service';
import { Notifier } from '@public/server/notifier';
import { ProgressService } from '@public/server/player/progress.service';
import { ServerEvent } from '@public/shared/event';
import { JobType } from '@public/shared/job';

const EasterHarvestDrop: Record<string, number> = {
    golden_egg: 0.01,
    chocolat_egg: 0.5,
    chocolat_milk_egg: 1,
};

const EASTER_FIELD = 'easter_field';
@Provider()
export class FoodHarvestProvider {
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
        await this.fieldService.createField({
            identifier: EASTER_FIELD,
            owner: JobType.Food,
            item: null,
            capacity: 200,
            maxCapacity: 200,
            refill: {
                delay: 5 * 60 * 1000,
                amount: 30,
            },
            harvest: {
                delay: 0,
                amount: 1,
            },
        });
    }

    @OnEvent(ServerEvent.FOOD_EASTER_HARVEST)
    async onHarvest(source: number) {
        this.notifier.notify(source, 'Vous ~g~commencez~s~ à récolter');

        while (await this.doHarvest(source, 'Vous récoltez des oeufs.')) {
            /* empty */
        }
        this.notifier.notify(source, 'Vous avez ~r~terminé~s~ de récolter.', 'success');
    }

    async doHarvest(source: number, label: string) {
        const { completed } = await this.progressService.progress(source, 'food_easter_harvest', label, 5000, {
            name: 'weed_stand_checkingleaves_kneeling_01_inspector',
            dictionary: 'anim@amb@business@weed@weed_inspecting_lo_med_hi@',
            flags: 1,
        });

        if (!completed) {
            this.notifier.notify(source, `Vous avez ~r~arrêté~s~ de récolter.`, 'error');
            return false;
        }

        if (!this.fieldService.harvestField(EASTER_FIELD, 1)) {
            this.notifier.notify(source, `Le champs est épuisé.`);
            return false;
        }

        const rng = Math.random();
        let item: string = null;
        for (const [item_name, value] of Object.entries(EasterHarvestDrop)) {
            if (rng < value) {
                item = item_name;
                break;
            }
        }

        if (!item) {
            return true;
        }

        if (!this.inventoryManager.canCarryItem(source, item, 1)) {
            this.notifier.notify(
                source,
                `Vous ne possédez pas suffisamment de place dans votre inventaire pour récolter.`
            );
            return false;
        }

        const { success, reason } = this.inventoryManager.addItemToInventory(source, item, 1);
        if (success) {
            this.notifier.notify(source, `Vous avez récolté un ~b~${this.itemService.getItem(item).label}.`);
        } else if (reason == 'invalid_weight') {
            this.notifier.notify(source, 'Vos poches sont pleines...', 'error');
            return false;
        } else {
            this.notifier.notify(source, `Il y a eu une erreur: ${item} ${reason}`, 'error');
            return false;
        }
        return true;
    }
}
