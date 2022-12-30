import { Module } from '../../core/decorators/module';
import { VehicleAdminProvider } from '../admin/vehicle.admin.provider';
import { VehicleCommandProvider } from './vehicle.command.provider';
import { VehicleConditionProvider } from './vehicle.condition.provider';
import { VehicleCustomProvider } from './vehicle.custom.provider';
import { VehicleDealershipProvider } from './vehicle.dealership.provider';
import { VehicleFuelProvider } from './vehicle.fuel.provider';
import { VehicleGarageProvider } from './vehicle.garage.provider';
import { VehicleKeysProvider } from './vehicle.keys.provider';
import { VehicleLockProvider } from './vehicle.lock.provider';
import { VehicleMigrationProvider } from './vehicle.migration.provider';
import { VehicleProvider } from './vehicle.provider';
import { VehicleRadarProvider } from './vehicle.radar.provider';
import { VehicleService } from './vehicle.service';
import { VehicleSpawner } from './vehicle.spawner';

@Module({
    providers: [
        VehicleAdminProvider,
        VehicleCommandProvider,
        VehicleConditionProvider,
        VehicleCustomProvider,
        VehicleDealershipProvider,
        VehicleFuelProvider,
        VehicleGarageProvider,
        VehicleKeysProvider,
        VehicleLockProvider,
        VehicleMigrationProvider,
        VehicleProvider,
        VehicleService,
        VehicleSpawner,
        VehicleRadarProvider,
    ],
})
export class VehicleModule {}
