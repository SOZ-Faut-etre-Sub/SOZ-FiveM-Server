import { Module } from '../../core/decorators/module';
import { VehicleAirProvider } from './vehicle.air.provider';
import { VehicleCarWashProvider } from './vehicle.carwash.provider';
import { VehicleConditionProvider } from './vehicle.condition.provider';
import { VehicleCustomProvider } from './vehicle.custom.provider';
import { VehicleFuelProvider } from './vehicle.fuel.provider';
import { VehicleGarageProvider } from './vehicle.garage.provider';
import { VehicleLockProvider } from './vehicle.lock.provider';
import { VehicleMenuProvider } from './vehicle.menu.provider';
import { VehicleSeatbeltProvider } from './vehicle.seatbelt.provider';
import { VehicleSpawnProvider } from './vehicle.spawn.provider';

@Module({
    providers: [
        VehicleAirProvider,
        VehicleCarWashProvider,
        VehicleConditionProvider,
        VehicleCustomProvider,
        VehicleFuelProvider,
        VehicleGarageProvider,
        VehicleLockProvider,
        VehicleMenuProvider,
        VehicleSeatbeltProvider,
        VehicleSpawnProvider,
    ],
})
export class VehicleModule {}
