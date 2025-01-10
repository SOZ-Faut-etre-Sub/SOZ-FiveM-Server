import { Module } from '../../core/decorators/module';
import { PhoneAppNewsProvider } from './apps/phone.app.news.provider';
import { PhoneAppNotesProvider } from './apps/phone.app.notes.provider';
import { PhoneAppPhotosProvider } from './apps/phone.app.photos.provider';
import { PhoneAppTaxProvider } from './apps/phone.app.tax.provider';
import { PhoneAppTetrisProvider } from './apps/phone.app.tetris.provider';
import { PhoneProvider } from './phone.provider';
import { PhoneSimCard } from './phone.simcard';

@Module({
    providers: [
        PhoneProvider,
        PhoneSimCard,
        // Apps
        PhoneAppNewsProvider,
        PhoneAppNotesProvider,
        PhoneAppPhotosProvider,
        PhoneAppTaxProvider,
        PhoneAppTetrisProvider,
    ],
})
export class PhoneModule {}
