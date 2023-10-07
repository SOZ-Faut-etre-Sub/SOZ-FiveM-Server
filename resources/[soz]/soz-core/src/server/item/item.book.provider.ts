import { Once } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { BOOK_LIST } from '../../shared/book';
import { ClientEvent } from '../../shared/event';
import { ItemService } from './item.service';

@Provider()
export class ItemBookProvider {
    @Inject(ItemService)
    private item: ItemService;

    @Once()
    public onStart() {
        for (const book of BOOK_LIST) {
            this.item.setItemUseCallback(book.item, (source: number) => {
                TriggerClientEvent(ClientEvent.ITEM_BOOK_USE, source, book);
            });
        }
    }
}
