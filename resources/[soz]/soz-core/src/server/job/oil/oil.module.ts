import { Module } from '../../../core/decorators/module';
import { OilStationProvider } from './oil.station.provider';

@Module({
    providers: [OilStationProvider],
})
export class OilModule {}
