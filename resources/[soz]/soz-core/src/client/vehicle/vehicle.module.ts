import { Module } from '../../core/decorators/module';
import { VehicleAirProvider } from './vehicle.air.provider';
import { VehicleCarWashProvider } from './vehicle.carwash.provider';
import { VehicleConditionProvider } from './vehicle.condition.provider';
import { VehicleCustomProvider } from './vehicle.custom.provider';
import { VehicleDealershipProvider } from './vehicle.dealership.provider';
import { VehicleElectricProvider } from './vehicle.electric.provider';
import { VehicleFuelProvider } from './vehicle.fuel.provider';
import { VehicleGarageProvider } from './vehicle.garage.provider';
import { VehicleLockProvider } from './vehicle.lock.provider';
import { VehicleMenuProvider } from './vehicle.menu.provider';
import { VehicleRadarProvider } from './vehicle.radar.provider';
import { VehicleSeatbeltProvider } from './vehicle.seatbelt.provider';
import { VehicleSpawnProvider } from './vehicle.spawn.provider';

@Module({
    providers: [
        VehicleAirProvider,
        VehicleCarWashProvider,
        VehicleConditionProvider,
        VehicleCustomProvider,
        VehicleDealershipProvider,
        VehicleFuelProvider,
        VehicleGarageProvider,
        VehicleLockProvider,
        VehicleMenuProvider,
        VehicleSeatbeltProvider,
        VehicleSpawnProvider,
        VehicleRadarProvider,
        VehicleElectricProvider,
    ],
})
export class VehicleModule {}
