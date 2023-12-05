import { Module } from '../../core/decorators/module';
import { HudCompassProvider } from './hud.compass.provider';
import { HudMinimapProvider } from './hud.minimap.provider';
import { HudNewsProvider } from './hud.news.provider';
import { HudNotificationsProvider } from './hud.notifications.provider';
import { HudStateProvider } from './hud.state.provider';
import { HudStreetNameProvider } from './hud.streetname.provider';
import { HudVehicleProvider } from './hud.vehicle.provider';
import { HudVoipProvider } from './hud.voip.provider';

@Module({
    providers: [
        HudCompassProvider,
        HudMinimapProvider,
        HudNewsProvider,
        HudNotificationsProvider,
        HudStateProvider,
        HudStreetNameProvider,
        HudVehicleProvider,
        HudVoipProvider,
    ],
})
export class HudModule {}
