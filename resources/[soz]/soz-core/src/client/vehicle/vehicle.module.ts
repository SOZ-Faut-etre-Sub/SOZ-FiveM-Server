import { Module } from '../../core/decorators/module';
import { VehicleAirProvider } from './vehicle.air.provider';
import { VehicleGarageProvider } from './vehicle.garage.provider';
import { VehicleLockProvider } from './vehicle.lock.provider';
import { VehicleMenuProvider } from './vehicle.menu.provider';
import { VehicleSeatbeltProvider } from './vehicle.seatbelt.provider';
import { VehicleSpawnProvider } from './vehicle.spawn.provider';
import { VehicleStateProvider } from './vehicle.state.provider';

@Module({
    providers: [
        VehicleLockProvider,
        VehicleSeatbeltProvider,
        VehicleAirProvider,
        VehicleMenuProvider,
        VehicleSpawnProvider,
        VehicleStateProvider,
        VehicleGarageProvider,
    ],
})
export class VehicleModule {}
