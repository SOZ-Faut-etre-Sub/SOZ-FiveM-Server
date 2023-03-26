import { Module } from '../../../core/decorators/module';
import { UpwFacilityProvider } from './upw.facility.provider';

@Module({
    providers: [UpwFacilityProvider],
})
export class UpwModule {}
