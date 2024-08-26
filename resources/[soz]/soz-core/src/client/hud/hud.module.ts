import { Module } from '../../core/decorators/module';
import { HudCompassProvider } from './hud.compass.provider';
import { HudInteractionsProvider } from './hud.interactions.provider';
import { HudMinimapProvider } from './hud.minimap.provider';
import { HudNewsProvider } from './hud.news.provider';
import { HudNotificationsProvider } from './hud.notifications.provider';
import { HudStateProvider } from './hud.state.provider';
import { HudStreetNameProvider } from './hud.streetname.provider';
import { HudVehicleProvider } from './hud.vehicle.provider';
import { HudWatchProvider } from './hud.watch.provider';
import { HudWeatherIconProvider } from './hud.weathericon.provider';

@Module({
    providers: [
        HudCompassProvider,
        HudMinimapProvider,
        HudWatchProvider,
        HudNewsProvider,
        HudNotificationsProvider,
        HudStateProvider,
        HudStreetNameProvider,
        HudVehicleProvider,
        HudWeatherIconProvider,
        HudInteractionsProvider,
    ],
})
export class HudModule {}
