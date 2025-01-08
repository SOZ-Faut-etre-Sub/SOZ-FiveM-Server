import { Module } from '../../core/decorators/module';
import { PhoneAppNotesProvider } from './apps/phone.app.notes.provider';
import { PhoneAppPhotosProvider } from './apps/phone.app.photos.provider';
import { PhoneAppTaxProvider } from './apps/phone.app.tax.provider';
import { PhoneAppTetrisProvider } from './apps/phone.app.tetris.provider';
import { PhoneSimCard } from './phone.simcard';

@Module({
    providers: [
        PhoneSimCard,
        // Apps
        PhoneAppNotesProvider,
        PhoneAppPhotosProvider,
        PhoneAppTaxProvider,
        PhoneAppTetrisProvider,
    ],
})
export class PhoneModule {}
