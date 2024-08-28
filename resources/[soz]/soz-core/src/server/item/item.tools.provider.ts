import { Exportable } from '@public/core/decorators/exports';
import { InventoryItem, Item } from '@public/shared/item';

import { Once } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent } from '../../shared/event';
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
    private readonly notifier: Notifier;

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
        this.item.setItemUseCallback('cardbord', async source => {
            const position = await this.objectProvider.getGroundPositionForObject(source, 'prop_cardbordbox_03a', 90);

            await this.objectProvider.onPlaceObject(source, 'cardbord', 'prop_cardbordbox_03a', position);
        });
        this.item.setItemUseCallback('diving_gear', this.useDrivingGear.bind(this));
        this.item.setItemUseCallback('compass', source => {
            this.notifier.notify(source, "PTDR, tu crois que t'es Jack Sparrow ou quoi ?", 'info');
        });
    }

    public useDrivingGear(source: number) {
        const player = this.playerService.getPlayer(source);

        const scuba = player.metadata.scuba;
        TriggerClientEvent(ClientEvent.ITEM_SCUBA_TOOGLE, source, !scuba);
    }

    @Exportable('ItemIsExpired')
    public itemIsExpired(item: InventoryItem) {
        return this.item.isItemExpired(item);
    }
}
