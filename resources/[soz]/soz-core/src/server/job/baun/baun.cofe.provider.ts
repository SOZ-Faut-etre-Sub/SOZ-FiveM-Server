import { OnEvent } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { FieldProvider } from '@public/server/farm/field.provider';
import { InventoryManager } from '@public/server/inventory/inventory.manager';
import { ItemService } from '@public/server/item/item.service';
import { Notifier } from '@public/server/notifier';
import { ProgressService } from '@public/server/player/progress.service';
import { ServerEvent } from '@public/shared/event';

const EasterHarvestDrop: Record<string, number> = {
    golden_egg: 0.01,
    chocolat_egg: 0.5,
    chocolat_milk_egg: 1,
};

@Provider()
export class BaunCofeProvider {
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

    @OnEvent(ServerEvent.BAUN_COFE)
    async onMakeCofe(source: number) {
        this.notifier.notify(source, 'Vous ~g~commencez~s~ à faire du café.');

        while (await this.doMakeCofe(source)) {
            /* empty */
        }
        this.notifier.notify(source, 'Vous avez ~r~terminé~s~ de faire du café.', 'success');
    }

    async doMakeCofe(source: number) {
        const { completed } = await this.progressService.progress(
            source,
            'dispenser_buy',
            'Vous faites du café.',
            1000,
            {
                dictionary: 'mini@sprunk',
                name: 'plyr_buy_drink_pt1',
                flags: 16,
                options: {
                    repeat: true,
                },
            },
            {
                useAnimationService: true,
                disableMovement: true,
                disableCarMovement: false,
                disableMouse: false,
                disableCombat: true,
            }
        );
        if (!completed) {
            return false;
        }

        if (!this.inventoryManager.canCarryItem(source, 'coffee', 1)) {
            this.notifier.notify(
                source,
                `Vous ne possédez pas suffisamment de place dans votre inventaire pour faire un café.`
            );
            return false;
        }

        const { success, reason } = this.inventoryManager.addItemToInventory(source, 'coffee', 1);
        if (success) {
            this.notifier.notify(source, `Vous avez récolté un ~b~${this.itemService.getItem('coffee').label}.`);
        } else if (reason == 'invalid_weight') {
            this.notifier.notify(source, 'Vos poches sont pleines...', 'error');
            return false;
        } else {
            this.notifier.notify(source, `Il y a eu une erreur: ${'coffee'} ${reason}`, 'error');
            return false;
        }
        return true;
    }
}


