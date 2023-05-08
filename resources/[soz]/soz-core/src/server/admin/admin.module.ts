import { Module } from '../../core/decorators/module';
import { AdminMenuGameProvider } from './admin.menu.game.provider';
import { AdminMenuInteractiveProvider } from './admin.menu.interactive.provider';
import { AdminMenuMapperProvider } from './admin.menu.mapper.provider';
import { AdminMenuPlayerProvider } from './admin.menu.player.provider';
import { AdminMenuVehicleProvider } from './admin.menu.vehicle.provider';
import { AdminProvider } from './admin.provider';

@Module({
    providers: [
        AdminMenuGameProvider,
        AdminMenuInteractiveProvider,
        AdminMenuMapperProvider,
        AdminMenuPlayerProvider,
        AdminMenuVehicleProvider,
        AdminProvider,
    ],
})
export class AdminModule {}
