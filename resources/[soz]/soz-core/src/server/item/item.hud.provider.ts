import { Once } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent } from '../../shared/event';
import { Notifier } from '../notifier';
import { ItemService } from './item.service';

@Provider()
export class ItemHudProvider {
    @Inject(ItemService)
    private item: ItemService;

    @Inject(Notifier)
    private readonly notifier: Notifier;

    @Once()
    public onStart() {
        this.item.setItemUseCallback('smartwatchuiwi', (source: number) => {
            TriggerClientEvent(ClientEvent.ITEM_WATCH_USE, source);
        });
        this.item.setItemUseCallback('halloween_smartwatch_nocturnal_vein', (source: number) => {
            TriggerClientEvent(ClientEvent.ITEM_WATCH_USE, source);
        });

        this.item.setItemUseCallback('compass', source => {
            this.notifier.notify(source, "PTDR, tu crois que t'es Jack Sparrow ou quoi ?", 'info');
        });
    }
}
