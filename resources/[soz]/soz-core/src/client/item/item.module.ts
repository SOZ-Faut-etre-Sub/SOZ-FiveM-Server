import { Module } from '../../core/decorators/module';
import { AlbumProvider } from './album.provider';
import { ItemBookProvider } from './item.book.provider';
import { ItemCameraProvider } from './item.camera.provider';
import { ItemMicrophoneProvider } from './item.microphone.provider';
import { ItemProvider } from './item.provider';

@Module({
    providers: [ItemProvider, AlbumProvider, ItemBookProvider, ItemCameraProvider, ItemMicrophoneProvider],
})
export class ItemModule {}
