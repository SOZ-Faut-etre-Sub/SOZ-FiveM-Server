import { Once } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent } from '../../shared/event';
import { CommonItem, InventoryItem } from '../../shared/item';
import { InventoryManager } from '../inventory/inventory.manager';
import { Notifier } from '../notifier';
import { PlayerService } from '../player/player.service';
import { ItemService } from './item.service';

@Provider()
export class ItemOutFitProvider {
    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(ItemService)
    private item: ItemService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    public async useOutFit(source: number, item: CommonItem, inventoryItem: InventoryItem) {
        const player = this.playerService.getPlayer(source);
        if (!player) return;

        if (
            (player.skin.Model.Hash === GetHashKey('mp_m_freemode_01') && item.name !== 'ffs_crafted_outfit_m') ||
            (player.skin.Model.Hash === GetHashKey('mp_f_freemode_01') && item.name !== 'ffs_crafted_outfit_f')
        ) {
            this.notifier.notify(source, `Cette tenue n'est pas adaptée.`, 'warning');
            return;
        }

        this.inventoryManager.removeItemFromInventory(source, item.name, 1, inventoryItem.metadata);
        TriggerClientEvent(ClientEvent.PLAYER_SET_OUTFIT_FROM_ITEM, source, inventoryItem.metadata);
    }

    @Once()
    public onStart() {
        this.item.setItemUseCallback('ffs_crafted_outfit_m', this.useOutFit.bind(this));
        this.item.setItemUseCallback('ffs_crafted_outfit_f', this.useOutFit.bind(this));
    }
}