import { Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { NuiDispatch } from '../nui/nui.dispatch';
import { ItemService } from './item.service';

@Provider()
export class ItemProvider {
    @Inject(ItemService)
    private item: ItemService;

    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    @Once(OnceStep.NuiLoaded)
    async onStart(): Promise<void> {
        this.nuiDispatch.dispatch('item', 'SetItems', this.item.getItems());
    }
}
