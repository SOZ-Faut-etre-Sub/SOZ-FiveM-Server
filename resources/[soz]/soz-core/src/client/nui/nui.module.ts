import { Module } from '../../core/decorators/module';
import { NuiMenuProvider } from './nui.menu.provider';

@Module({
    providers: [NuiMenuProvider],
})
export class NuiModule {}
