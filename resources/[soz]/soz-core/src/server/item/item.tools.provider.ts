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

    private async useUmbrella(source: number): Promise<void> {
        TriggerClientEvent(ClientEvent.ITEM_UMBRELLA_TOGGLE, source);
    }

    private async useAlbum(source: number, item: Item): Promise<void> {
        TriggerClientEvent(ClientEvent.ITEM_ALBUM_USE, source, item.name);
    }

    @Once()
    public onStart() {
        this.item.setItemUseCallback('umbrella', this.useUmbrella.bind(this));
        this.item.setItemUseCallback('900k_album', this.useAlbum.bind(this));
    }
}
