import { Module } from '../../../core/decorators/module';
import { UpwFacilityProvider } from './upw.facility.provider';
import { UpwOrderProvider } from './upw.order.provider';

@Module({
    providers: [UpwFacilityProvider, UpwOrderProvider],
})
export class UpwModule {}
