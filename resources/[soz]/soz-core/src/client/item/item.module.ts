import { Module } from '../../core/decorators/module';
import { AlbumProvider } from './album.provider';
import { ItemProvider } from './item.provider';

@Module({
    providers: [ItemProvider, AlbumProvider],
})
export class ItemModule {}
