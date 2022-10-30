import { Module } from '../../core/decorators/module';
import { VehicleAdminProvider } from '../admin/vehicle.admin.provider';
import { VehicleCommandProvider } from './vehicle.command.provider';
import { VehicleCustomProvider } from './vehicle.custom.provider';
import { VehicleDealershipProvider } from './vehicle.dealership.provider';
import { VehicleFuelProvider } from './vehicle.fuel.provider';
import { VehicleGarageProvider } from './vehicle.garage.provider';
import { VehicleLockProvider } from './vehicle.lock.provider';
import { VehicleProvider } from './vehicle.provider';
import { VehicleService } from './vehicle.service';
import { VehicleSpawner } from './vehicle.spawner';
import { VehicleStateProvider } from './vehicle.state.provider';

@Module({
    providers: [
        VehicleAdminProvider,
        VehicleCommandProvider,
        VehicleCustomProvider,
        VehicleDealershipProvider,
        VehicleFuelProvider,
        VehicleGarageProvider,
        VehicleLockProvider,
        VehicleProvider,
        VehicleService,
        VehicleSpawner,
        VehicleStateProvider,
    ],
})
export class VehicleModule {}
