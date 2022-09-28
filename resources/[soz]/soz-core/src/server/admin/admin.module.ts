import { Module } from '../../core/decorators/module';
import { AdminMenuInteractiveProvider } from './admin.menu.interactive.provider';
import { AdminMenuVehicleProvider } from './admin.menu.vehicle.provider';

@Module({
    providers: [AdminMenuVehicleProvider, AdminMenuInteractiveProvider],
})
export class AdminModule {}
