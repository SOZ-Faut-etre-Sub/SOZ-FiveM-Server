import { Once } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent } from '../../shared/event';
import { ItemService } from './item.service';

@Provider()
export class ItemVoipProvider {
    @Inject(ItemService)
    private item: ItemService;

    @Once()
    public onStart() {
        this.item.setItemUseCallback('radio', (source: number) => {
            TriggerClientEvent(ClientEvent.VOIP_ITEM_RADIO_TOGGLE, source);
        });
        this.item.setItemUseCallback('megaphone', (source: number) => {
            TriggerClientEvent(ClientEvent.VOIP_ITEM_MEGAPHONE_TOGGLE, source);
        });
        this.item.setItemUseCallback('microphone', (source: number) => {
            TriggerClientEvent(ClientEvent.VOIP_ITEM_MICROPHONE_TOGGLE, source);
        });
    }
}
