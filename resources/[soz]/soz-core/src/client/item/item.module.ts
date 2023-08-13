import { Module } from '../../core/decorators/module';
import { AlbumProvider } from './album.provider';
import { ItemBookProvider } from './item.book.provider';
import { ItemProvider } from './item.provider';

@Module({
    providers: [ItemProvider, AlbumProvider, ItemBookProvider],
})
export class ItemModule {}
