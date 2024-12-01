import { Once, OnceStep, OnEvent } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { ItemService } from '@public/server/item/item.service';
import { Notifier } from '@public/server/notifier';
import { ProgressService } from '@public/server/player/progress.service';
import { ServerEvent } from '@public/shared/event';
import { JobType } from '@public/shared/job';

import { ADD_ERROR_MESSAGE } from '../../../shared/inventory';
import { isOk } from '../../../shared/result';
import { FieldProvider } from '../../field/field.provider';
import { InventoryFactory } from '../../inventory/inventory.factory';

const GARLIC_FIELD = 'garlic_field';
@Provider()
export class FDFHarvestProvider {
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

    @Once(OnceStep.RepositoriesLoaded)
    public async init() {
        await this.fieldService.createField({
            identifier: GARLIC_FIELD,
            owner: JobType.FDF,
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

    @OnEvent(ServerEvent.FDF_GARLIC_HARVEST)
    async onHarvest(source: number) {
        this.notifier.notify(source, 'Vous ~g~commencez~s~ à récolter');

        while (await this.doHarvest(source, "Vous récoltez de l'ail.")) {
            /* empty */
        }
        this.notifier.notify(source, 'Vous avez ~r~terminé~s~ de récolter.', 'success');
    }

    async doHarvest(source: number, label: string) {
        const { completed } = await this.progressService.progress(source, 'fdf_garlic_harvest', label, 5000, {
            name: 'weed_stand_checkingleaves_kneeling_01_inspector',
            dictionary: 'anim@amb@business@weed@weed_inspecting_lo_med_hi@',
            flags: 1,
        });

        if (!completed) {
            this.notifier.notify(source, `Vous avez ~r~arrêté~s~ de récolter.`, 'error');
            return false;
        }

        if (!(await this.fieldService.harvestField(GARLIC_FIELD, 1))) {
            this.notifier.notify(source, `Le champs est épuisé.`);
            return false;
        }

        const item: string = 'garlic';

        if (!item) {
            return true;
        }

        const inventory = await this.inventoryFactory.getPlayerInventory(source);

        if (!inventory) {
            return false;
        }

        if (!inventory.canCarryItem(item, 1)) {
            this.notifier.notify(
                source,
                `Vous ne possédez pas suffisamment de place dans votre inventaire pour récolter.`
            );
            return false;
        }

        const result = inventory.add(item, 1);

        if (isOk(result)) {
            this.notifier.notify(source, `Vous avez récolté une ~b~${this.itemService.getItem(item).label}.`);
        } else if (result.err == 'not_enough_space') {
            this.notifier.notify(source, 'Vos poches sont pleines...', 'error');
            return false;
        } else {
            this.notifier.notify(source, `Il y a eu une erreur: ${item} ${ADD_ERROR_MESSAGE[result.err]}`, 'error');
            return false;
        }
        return true;
    }
}
