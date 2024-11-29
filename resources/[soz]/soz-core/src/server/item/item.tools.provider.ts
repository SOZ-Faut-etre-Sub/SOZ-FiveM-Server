import { Exportable } from '@public/core/decorators/exports';
import { Item } from '@public/shared/item';

import { Once } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent } from '../../shared/event';
import { InventoryItem, isInventoryItemExpired } from '../../shared/inventory';
import { Inventory } from '../inventory/inventory';
import { Notifier } from '../notifier';
import { ObjectProvider } from '../object/object.provider';
import { PlayerService } from '../player/player.service';
import { ItemService } from './item.service';

@Provider()
export class ItemToolsProvider {
    @Inject(ItemService)
    private item: ItemService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(ObjectProvider)
    private objectProvider: ObjectProvider;

    @Inject(Notifier)
    private notifier: Notifier;

    @Once()
    public onStart() {
        ['umbrella', 'umbrella_white', 'umbrella_black'].forEach(item => {
            this.item.setItemUseCallback(item, (source, item: Item) => {
                TriggerClientEvent(ClientEvent.ITEM_UMBRELLA_TOGGLE, source, item.name);
            });
        });

        this.item.setItemUseCallback('walkstick', source => {
            TriggerClientEvent(ClientEvent.ITEM_WALK_STICK_TOGGLE, source);
        });

        this.item.setItemUseCallback('protestsign', source => {
            TriggerClientEvent(ClientEvent.ITEM_PROTEST_SIGN_TOGGLE, source);
        });

        this.item.setItemUseCallback('900k_album', (source, item: Item) => {
            TriggerClientEvent(ClientEvent.ITEM_ALBUM_USE, source, item.name);
        });

        this.item.setItemUseCallback('binoculars', (source: number) =>
            TriggerClientEvent(ClientEvent.BINOCULARS_TOGGLE, source)
        );
        this.item.setItemUseCallback('cardbord', async source => {
            const position = await this.objectProvider.getGroundPositionForObject(source, 'prop_cardbordbox_03a', 90);

            await this.objectProvider.onPlaceObject(source, 'cardbord', 'prop_cardbordbox_03a', position);
        });
        this.item.setItemUseCallback('diving_gear', this.useDrivingGear.bind(this));

        this.item.setItemUseCallback('gift_blue', this.useGift.bind(this));
        this.item.setItemUseCallback('gift_gold', this.useGift.bind(this));
        this.item.setItemUseCallback('gift_green', this.useGift.bind(this));
        this.item.setItemUseCallback('gift_red', this.useGift.bind(this));
    }

    public useDrivingGear(source: number) {
        const player = this.playerService.getPlayer(source);

        const scuba = player.metadata.scuba;
        TriggerClientEvent(ClientEvent.ITEM_SCUBA_TOOGLE, source, !scuba);
    }

    public async useGift(source: number, item: Item, inventoryItem: InventoryItem, inventory: Inventory) {
        if (!inventory.removeAtSlot(inventoryItem.slot, 1)) {
            return;
        }

        inventoryItem.metadata.crateElements.map(gift => {
            inventory.add(gift.name, gift.amount, { ...gift.metadata });
        });

        let giftLabel = item.label;

        if (inventoryItem.metadata.label) {
            giftLabel = item.label + ' "' + inventoryItem.metadata.label + '"';
        }

        this.notifier.notify(source, 'Vous avez ouvert votre ~g~' + giftLabel + '~s~ !', 'success');
    }

    @Exportable('ItemIsExpired')
    public itemIsExpired(item: InventoryItem) {
        return isInventoryItemExpired(item);
    }
}
