import { Module } from '../../core/decorators/module';
import { AudioService } from './audio.service';
import { InputService } from './input.service';
import { NuiMenu } from './nui.menu';
import { NuiMenuProvider } from './nui.menu.provider';
import { NuiPanelProvider } from './nui.panel.provider';
import { NuiPingProvider } from './nui.ping.provider';
import { NuiProvider } from './nui.provider';
import { NuiZoneProvider } from './nui.zone.provider';

@Module({
    providers: [
        NuiMenuProvider,
        NuiProvider,
        InputService,
        NuiMenu,
        NuiPanelProvider,
        AudioService,
        NuiPingProvider,
        NuiZoneProvider,
    ],
})
export class NuiModule {}
