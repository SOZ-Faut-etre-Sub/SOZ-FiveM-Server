import { Module } from '../../core/decorators/module';
import { AdminMenuInteractiveProvider } from './admin.menu.interactive.provider';
import { AdminMenuVehicleProvider } from './admin.menu.vehicle.provider';
import { AdminProvider } from './admin.provider';

@Module({
    providers: [AdminMenuVehicleProvider, AdminMenuInteractiveProvider, AdminProvider],
})
export class AdminModule {}
