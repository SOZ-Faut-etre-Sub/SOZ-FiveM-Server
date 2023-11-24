import { Module } from '../../core/decorators/module';
import { AlbumProvider } from './album.provider';
import { ItemBookProvider } from './item.book.provider';
import { ItemCameraProvider } from './item.camera.provider';
import { ItemHalloweenProvider } from './item.halloween.provider';
import { ItemMicrophoneProvider } from './item.microphone.provider';
import { ItemParachuteProvider } from './item.parachute.provider';
import { ItemProvider } from './item.provider';

@Module({
    providers: [
        ItemProvider,
        AlbumProvider,
        ItemBookProvider,
        ItemCameraProvider,
        ItemMicrophoneProvider,
        ItemHalloweenProvider,
        ItemParachuteProvider,
    ],
})
export class ItemModule {}
