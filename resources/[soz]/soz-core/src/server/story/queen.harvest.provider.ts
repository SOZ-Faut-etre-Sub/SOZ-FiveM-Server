import { Once, OnceStep, OnEvent } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { FieldProvider } from '@public/server/farm/field.provider';
import { ItemService } from '@public/server/item/item.service';
import { Notifier } from '@public/server/notifier';
import { ProgressService } from '@public/server/player/progress.service';
import { ServerEvent } from '@public/shared/event';

import { ADD_ERROR_MESSAGE } from '../../shared/inventory';
import { isOk } from '../../shared/result';
import { InventoryFactory } from '../inventory/inventory.factory';

const BLOOD_FIELD = 'blood_field';
const BLOOD_ITEM = 'halloween_pure_blood';
const BLOOD_ITEM_AMOUNT = 2;

@Provider()
export class QueenHarvestProvider {
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
            identifier: BLOOD_FIELD,
            owner: '',
            item: BLOOD_ITEM,
            capacity: 50_000,
            refill: {
                delay: 5 * 60 * 1000,
                amount: 500,
            },
            maxCapacity: 50_000,
            harvest: {
                delay: 0,
                amount: BLOOD_ITEM_AMOUNT,
            },
        });
    }

    @OnEvent(ServerEvent.HALLOWEEN_BLOOD_HARVEST)
    async onHarvest(source: number) {
        this.notifier.notify(source, 'Vous ~g~commencez~s~ à sucer');

        while (await this.doHarvest(source, 'Vous récupérez du sang.')) {
            /* empty */
        }
        this.notifier.notify(source, 'Vous avez ~r~terminé~s~ de récupérez du sang.', 'success');
    }

    async doHarvest(source: number, label: string) {
        const { completed } = await this.progressService.progress(source, 'halloween_blood_harvest', label, 5000, {
            dictionary: 'mp_ped_interaction',
            name: 'kisses_guy_a',
            flags: 1,
        });

        if (!completed) {
            this.notifier.notify(source, `Vous avez ~r~arrêté~s~ de récupérer du sang.`, 'error');
            return false;
        }

        if (!(await this.fieldService.harvestField(BLOOD_FIELD, BLOOD_ITEM_AMOUNT))) {
            this.notifier.notify(source, `Notre reine n'a plus de sang à donner...`, 'error');
            return false;
        }

        const inventory = await this.inventoryFactory.getPlayerInventory(source);

        if (!inventory.canCarryItem(BLOOD_ITEM, BLOOD_ITEM_AMOUNT)) {
            this.notifier.notify(source, `Vous ne possédez pas suffisamment de place dans votre inventaire.`);
            return false;
        }

        const result = inventory.add(BLOOD_ITEM, BLOOD_ITEM_AMOUNT);

        if (isOk(result)) {
            this.notifier.notify(
                source,
                `Vous avez récupéré deux fioles de ~b~${this.itemService.getItem(BLOOD_ITEM).label}.`
            );
        } else if (result.err == 'not_enough_space') {
            this.notifier.notify(source, 'Vos poches sont pleines...', 'error');
            return false;
        } else {
            this.notifier.notify(
                source,
                `Il y a eu une erreur: ${BLOOD_ITEM} ${ADD_ERROR_MESSAGE[result.err]}`,
                'error'
            );
            return false;
        }
        return true;
    }
}
