import { Module } from '../../core/decorators/module';
import { AdminMenuDeveloperProvider } from './admin.menu.developer.provider';
import { AdminMenuGameMasterProvider } from './admin.menu.game-master.provider';
import { AdminMenuProvider } from './admin.menu.provider';

@Module({
    providers: [AdminMenuGameMasterProvider, AdminMenuDeveloperProvider, AdminMenuProvider],
})
export class AdminModule {}
