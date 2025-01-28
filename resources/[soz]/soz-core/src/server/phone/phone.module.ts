import { Module } from '../../core/decorators/module';
import { PhoneAppNewsProvider } from './apps/phone.app.news.provider';
import { PhoneAppNotesProvider } from './apps/phone.app.notes.provider';
import { PhoneAppPhotosProvider } from './apps/phone.app.photos.provider';
import { PhoneAppSnakeProvider } from './apps/phone.app.snake.provider';
import { PhoneAppSocietyProvider } from './apps/phone.app.society.provider';
import { PhoneAppTetrisProvider } from './apps/phone.app.tetris.provider';
import { PhoneProvider } from './phone.provider';
import { PhoneSimCard } from './phone.simcard';
import { PhoneSimCardCalls } from './phone.simcard.calls';
import { PhoneSimCardContacts } from './phone.simcard.contacts';
import { PhoneSimCardMessages } from './phone.simcard.messages';

@Module({
    providers: [
        PhoneProvider,
        PhoneSimCard,
        PhoneSimCardCalls,
        PhoneSimCardContacts,
        PhoneSimCardMessages,
        // Apps
        PhoneAppSocietyProvider,
        PhoneAppNewsProvider,
        PhoneAppNotesProvider,
        PhoneAppPhotosProvider,
        PhoneAppTetrisProvider,
        PhoneAppSnakeProvider,
    ],
})
export class PhoneModule {}
