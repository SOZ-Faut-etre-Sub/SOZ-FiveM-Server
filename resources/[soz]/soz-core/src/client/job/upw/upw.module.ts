import { Module } from '../../../core/decorators/module';
import { UpwChargerProvider } from './upw.charger.provider';
import { UpwCloakroomProvider } from './upw.cloakroom.provider';
import { UpwMenuProvider } from './upw.menu.provider';
import { UpwOrderProvider } from './upw.order.provider';
import { UpwVehicleProvider } from './upw.vehicle.provider';

@Module({
    providers: [UpwMenuProvider, UpwCloakroomProvider, UpwOrderProvider, UpwChargerProvider, UpwVehicleProvider],
})
export class UpwModule {}
