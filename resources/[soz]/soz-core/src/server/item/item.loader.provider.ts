import { Once } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ItemService } from './item.service';

@Provider()
export class ItemLoaderProvider {
    @Inject(ItemService)
    private item: ItemService;

    @Once()
    public onStartLoadItems() {
        this.item.loadItems();
    }
}
