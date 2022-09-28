import { Module } from '../../core/decorators/module';
import { AdminMenuDeveloperProvider } from './admin.menu.developer.provider';
import { AdminMenuGameMasterProvider } from './admin.menu.game-master.provider';
import { AdminMenuInteractiveProvider } from './admin.menu.interactive.provider';
import { AdminMenuJobProvider } from './admin.menu.job.provider';
import { AdminMenuPlayerProvider } from './admin.menu.player.provider';
import { AdminMenuProvider } from './admin.menu.provider';

@Module({
    providers: [
        AdminMenuGameMasterProvider,
        AdminMenuInteractiveProvider,
        AdminMenuJobProvider,
        AdminMenuPlayerProvider,
        AdminMenuDeveloperProvider,
        AdminMenuProvider,
    ],
})
export class AdminModule {}
