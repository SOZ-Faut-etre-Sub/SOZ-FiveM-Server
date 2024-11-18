import { Module } from '../../core/decorators/module';
import { HudCompassProvider } from './hud.compass.provider';
import { HudGlassmorphismProvider } from './hud.glassmorphism.provider';
import { HudMinimapProvider } from './hud.minimap.provider';
import { HudNewsProvider } from './hud.news.provider';
import { HudNotificationsProvider } from './hud.notifications.provider';
import { HudStateProvider } from './hud.state.provider';
import { HudStreetNameProvider } from './hud.streetname.provider';
import { HudVehicleProvider } from './hud.vehicle.provider';
import { HudWatchProvider } from './hud.watch.provider';
import { HudWeaponProvider } from './hud.weapon.provider';
import { HudWeatherIconProvider } from './hud.weathericon.provider';

@Module({
    providers: [
        HudCompassProvider,
        HudMinimapProvider,
        HudNewsProvider,
        HudNotificationsProvider,
        HudStateProvider,
        HudStreetNameProvider,
        HudVehicleProvider,
        HudWatchProvider,
        HudWeaponProvider,
        HudWeatherIconProvider,
        HudGlassmorphismProvider,
    ],
})
export class HudModule {}
