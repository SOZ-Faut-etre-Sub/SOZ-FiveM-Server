import { Module } from '../../core/decorators/module';
import { AdminMenuInteractiveProvider } from './admin.menu.interactive.provider';
import { AdminMenuPlayerProvider } from './admin.menu.player.provider';
import { AdminMenuVehicleProvider } from './admin.menu.vehicle.provider';
import { AdminProvider } from './admin.provider';

@Module({
    providers: [AdminMenuInteractiveProvider, AdminMenuPlayerProvider, AdminMenuVehicleProvider, AdminProvider],
})
export class AdminModule {}
