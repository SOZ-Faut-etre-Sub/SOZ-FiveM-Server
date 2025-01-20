import { Module } from '../../core/decorators/module';
import { PhoneAppBankProvider } from './apps/phone.app.bank.provider';
import { PhoneAppNewsProvider } from './apps/phone.app.news.provider';
import { PhoneAppNotesProvider } from './apps/phone.app.notes.provider';
import { PhoneAppPhotosProvider } from './apps/phone.app.photos.provider';
import { PhoneAppSnakeProvider } from './apps/phone.app.snake.provider';
import { PhoneAppTetrisProvider } from './apps/phone.app.tetris.provider';
import { PhoneManager } from './phone.manager';
import { PhoneProvider } from './phone.provider';
import { PhoneSimCard } from './phone.simcard';
import { PhoneSimCardContacts } from './phone.simcard.contacts';
import { PhoneSimCardMessages } from './phone.simcard.messages';
import { PhoneState } from './phone.state';

@Module({
    providers: [
        PhoneState,
        PhoneManager,
        PhoneProvider,
        PhoneSimCard,
        PhoneSimCardContacts,
        PhoneSimCardMessages,
        // Apps
        PhoneAppBankProvider,
        PhoneAppNewsProvider,
        PhoneAppNotesProvider,
        PhoneAppPhotosProvider,
        PhoneAppTetrisProvider,
        PhoneAppSnakeProvider,
    ],
})
export class PhoneModule {}
