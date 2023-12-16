import { Exportable } from '@public/core/decorators/exports';
import { InventoryItem, Item } from '@public/shared/item';

import { Once, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { InventoryManager } from '../inventory/inventory.manager';
import { Notifier } from '../notifier';
import { PlayerService } from '../player/player.service';
import { ItemService } from './item.service';

@Provider()
export class ItemToolsProvider {
    @Inject(ItemService)
    private item: ItemService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(Notifier)
    private notifier: Notifier;

    @Once()
    public onStart() {
        this.item.setItemUseCallback('umbrella', source => {
            TriggerClientEvent(ClientEvent.ITEM_UMBRELLA_TOGGLE, source);
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
        this.item.setItemUseCallback('cardbord', source =>
            this.onPlaceProps(source, 'cardbord', 'prop_cardbordbox_03a', 90, 0)
        );
        this.item.setItemUseCallback('diving_gear', this.useDrivingGear.bind(this));
    }

    public useDrivingGear(source: number) {
        const player = this.playerService.getPlayer(source);

        const scuba = player.metadata.scuba;
        this.playerService.setPlayerMetadata(source, 'scuba', !scuba);

        TriggerClientEvent(ClientEvent.ITEM_SCUBA_TOOGLE, source, !scuba);
    }

    @Exportable('ItemIsExpired')
    public itemIsExpired(item: InventoryItem) {
        return this.item.isItemExpired(item);
    }

    @OnEvent(ServerEvent.JOBS_PLACE_PROPS)
    public onPlaceProps(source: number, item: string, props: string, rotation: number, offset: number) {
        if (this.inventoryManager.removeItemFromInventory(source, item)) {
            TriggerClientEvent('job:client:AddObject', source, GetHashKey(props), rotation, offset);
        } else {
            this.notifier.notify(source, 'Vous ne possédez pas cet objet.', 'error');
        }
    }
}
