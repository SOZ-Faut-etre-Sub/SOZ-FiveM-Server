import { Module } from '../../../core/decorators/module';
import { UpwChargerProvider } from './upw.charger.provider';
import { UpwMenuProvider } from './upw.menu.provider';
import { UpwOrderProvider } from './upw.order.provider';
import { UpwVehicleProvider } from './upw.vehicle.provider';

@Module({
    providers: [UpwMenuProvider, UpwOrderProvider, UpwChargerProvider, UpwVehicleProvider],
})
export class UpwModule {}
