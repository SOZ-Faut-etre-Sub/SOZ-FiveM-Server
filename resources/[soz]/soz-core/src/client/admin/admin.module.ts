import { Module } from '../../core/decorators/module';
import { AdminMenuCharacterProvider } from './admin.menu.character.provider';
import { AdminMenuDeveloperProvider } from './admin.menu.developer.provider';
import { AdminMenuEventProvider } from './admin.menu.event.provider';
import { AdminMenuGameMasterProvider } from './admin.menu.game-master.provider';
import { AdminMenuInteractiveProvider } from './admin.menu.interactive.provider';
import { AdminMenuJobProvider } from './admin.menu.job.provider';
import { AdminMenuMapperProvider } from './admin.menu.mapper.provider';
import { AdminMenuMeteorProvider } from './admin.menu.meteor.provider';
import { AdminMenuPlayerProvider } from './admin.menu.player.provider';
import { AdminMenuProvider } from './admin.menu.provider';
import { AdminMenuSkinProvider } from './admin.menu.skin.provider';
import { AdminMenuVehicleProvider } from './admin.menu.vehicle.provider';
import { AdminSpectateProvider } from './admin.spectate.provider';
import { AdminZoneProvider } from './admin.zone.provider';

@Module({
    providers: [
        AdminMenuCharacterProvider,
        AdminMenuDeveloperProvider,
        AdminMenuEventProvider,
        AdminMenuGameMasterProvider,
        AdminMenuInteractiveProvider,
        AdminMenuJobProvider,
        AdminMenuMapperProvider,
        AdminMenuPlayerProvider,
        AdminMenuProvider,
        AdminMenuSkinProvider,
        AdminMenuVehicleProvider,
        AdminSpectateProvider,
        AdminMenuMeteorProvider,
        AdminZoneProvider,
    ],
})
export class AdminModule {}
