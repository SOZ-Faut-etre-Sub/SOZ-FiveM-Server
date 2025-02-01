import { Module } from '../../core/decorators/module';
import { PhoneAppBankProvider } from './apps/phone.app.bank.provider';
import { PhoneAppDarkWebProvider } from './apps/phone.app.darkweb.provider';
import { PhoneAppNewsProvider } from './apps/phone.app.news.provider';
import { PhoneAppNotesProvider } from './apps/phone.app.notes.provider';
import { PhoneAppPhotosProvider } from './apps/phone.app.photos.provider';
import { PhoneAppSnakeProvider } from './apps/phone.app.snake.provider';
import { PhoneAppSocietyProvider } from './apps/phone.app.society.provider';
import { PhoneAppTetrisProvider } from './apps/phone.app.tetris.provider';
import { PhoneAppWeatherProvider } from './apps/phone.app.weather.provider';
import { PhoneManager } from './phone.manager';
import { PhoneProvider } from './phone.provider';
import { PhoneSimCard } from './phone.simcard';
import { PhoneSimCardCalls } from './phone.simcard.calls';
import { PhoneSimCardContacts } from './phone.simcard.contacts';
import { PhoneSimCardMessages } from './phone.simcard.messages';
import { PhoneState } from './phone.state';

@Module({
    providers: [
        PhoneState,
        PhoneManager,
        PhoneProvider,
        PhoneSimCard,
        PhoneSimCardCalls,
        PhoneSimCardContacts,
        PhoneSimCardMessages,
        // Apps
        PhoneAppDarkWebProvider,
        PhoneAppSocietyProvider,
        PhoneAppBankProvider,
        PhoneAppNewsProvider,
        PhoneAppNotesProvider,
        PhoneAppPhotosProvider,
        PhoneAppTetrisProvider,
        PhoneAppSnakeProvider,
        PhoneAppWeatherProvider,
    ],
})
export class PhoneModule {}
