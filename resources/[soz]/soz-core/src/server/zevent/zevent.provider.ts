import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ServerEvent } from '../../shared/event';
import { InventoryManager } from '../item/inventory.manager';
import { Notifier } from '../notifier';

@Provider()
export class ZEventProvider {
    private readonly ITEM_ID = 'zevent2022_popcorn';
    private readonly AMOUNT_TO_GIVE = 1;
    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(Notifier)
    private notifier: Notifier;

    @OnEvent(ServerEvent.ZEVENT_GET_POPCORN)
    public onGetPopcorn(source: number) {
        if (!this.inventoryManager.canCarryItem(source, this.ITEM_ID, this.AMOUNT_TO_GIVE)) {
            this.notifier.notify(source, `Tu as les poches pleines.`, 'error');
            return;
        }
        this.inventoryManager.addItemToInventory(source, this.ITEM_ID, this.AMOUNT_TO_GIVE);
        this.notifier.notify(source, `Vous avez pris du pop-corn. Bon appétit !`, 'success');
    }
}
