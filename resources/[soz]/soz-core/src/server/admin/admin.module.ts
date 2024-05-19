import { Module } from '../../core/decorators/module';
import { AdminMenuCharacterProvider } from './admin.menu.character.provider';
import { AdminMenuEventProvider } from './admin.menu.event.provider';
import { AdminMenuGameProvider } from './admin.menu.game.provider';
import { AdminMenuInteractiveProvider } from './admin.menu.interactive.provider';
import { AdminMenuMapperProvider } from './admin.menu.mapper.provider';
import { AdminMenuPlayerProvider } from './admin.menu.player.provider';
import { AdminMenuVehicleProvider } from './admin.menu.vehicle.provider';
import { AdminProvider } from './admin.provider';

@Module({
    providers: [
        AdminMenuCharacterProvider,
        AdminMenuEventProvider,
        AdminMenuGameProvider,
        AdminMenuInteractiveProvider,
        AdminMenuMapperProvider,
        AdminMenuPlayerProvider,
        AdminMenuVehicleProvider,
        AdminProvider,
    ],
})
export class AdminModule {}
