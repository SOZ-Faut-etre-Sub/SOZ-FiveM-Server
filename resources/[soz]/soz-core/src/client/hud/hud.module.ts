import { Module } from '../../core/decorators/module';
import { HudProvider } from './hud.provider';
import { HudVehicleProvider } from './hud.vehicle.provider';

@Module({
    providers: [HudProvider, HudVehicleProvider],
})
export class HudModule {}
