import { ClientEvent } from '@public/shared/event';

import { Once } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ItemService } from '../item/item.service';

@Provider()
export class SozedexProvider {
    @Inject(ItemService)
    private itemService: ItemService;

    private async useSozedex(source: number): Promise<void> {
        TriggerClientEvent(ClientEvent.NUI_SHOW_SOZEDEX, source);
    }

    @Once()
    public onStart() {
        this.itemService.setItemUseCallback('sozedex', this.useSozedex.bind(this));
    }
}
