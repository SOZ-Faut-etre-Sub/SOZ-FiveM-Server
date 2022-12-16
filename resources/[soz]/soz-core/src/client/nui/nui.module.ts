import { Module } from '../../core/decorators/module';
import { InputService } from './input.service';
import { NuiMenu } from './nui.menu';
import { NuiMenuProvider } from './nui.menu.provider';
import { NuiPanelProvider } from './nui.panel.provider';
import { NuiProvider } from './nui.provider';

@Module({
    providers: [NuiMenuProvider, NuiProvider, InputService, NuiMenu, NuiPanelProvider],
})
export class NuiModule {}
