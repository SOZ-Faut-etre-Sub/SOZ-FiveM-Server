import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Book } from '../../shared/book';
import { ClientEvent } from '../../shared/event';
import { NuiDispatch } from '../nui/nui.dispatch';

@Provider()
export class ItemBookProvider {
    @Inject(NuiDispatch)
    private readonly dispatch: NuiDispatch;

    @OnEvent(ClientEvent.ITEM_BOOK_USE)
    public useBook(book: Book) {
        this.dispatch.dispatch('book', 'Show', book);
    }
}
