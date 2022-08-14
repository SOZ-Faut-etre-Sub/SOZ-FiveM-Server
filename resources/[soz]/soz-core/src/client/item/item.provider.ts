import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ItemService } from './item.service';

@Provider()
export class ItemProvider {
    @Inject(ItemService)
    private item: ItemService;
}
