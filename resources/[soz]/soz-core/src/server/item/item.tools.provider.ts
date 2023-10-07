import { Item } from '@public/shared/item';

import { Once } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent } from '../../shared/event';
import { ItemService } from './item.service';

@Provider()
export class ItemToolsProvider {
    @Inject(ItemService)
    private item: ItemService;

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
    }
}
