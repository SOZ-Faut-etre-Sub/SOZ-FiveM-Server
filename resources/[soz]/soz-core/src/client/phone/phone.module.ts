import { Module } from '../../core/decorators/module';
import { PhoneAppBankProvider } from './apps/phone.app.bank.provider';
import { PhoneAppNotesProvider } from './apps/phone.app.notes.provider';
import { PhoneAppPhotosProvider } from './apps/phone.app.photos.provider';
import { PhoneAppTetrisProvider } from './apps/phone.app.tetris.provider';
import { PhoneManager } from './phone.manager';
import { PhoneProvider } from './phone.provider';
import { PhoneSimCard } from './phone.simcard';
import { PhoneState } from './phone.state';

@Module({
    providers: [
        PhoneState,
        PhoneManager,
        PhoneProvider,
        PhoneSimCard,
        // Apps
        PhoneAppBankProvider,
        PhoneAppNotesProvider,
        PhoneAppPhotosProvider,
        PhoneAppTetrisProvider,
    ],
})
export class PhoneModule {}
