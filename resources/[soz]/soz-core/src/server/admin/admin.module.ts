import { Module } from '../../core/decorators/module';
import { AdminMenuInteractiveProvider } from './admin.menu.interactive.provider';

@Module({
    providers: [AdminMenuInteractiveProvider],
})
export class AdminModule {}
