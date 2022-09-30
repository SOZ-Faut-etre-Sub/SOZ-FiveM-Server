import { Module } from '../../core/decorators/module';
import { InputService } from './input.service';
import { NuiMenuProvider } from './nui.menu.provider';
import { NuiProvider } from './nui.provider';

@Module({
    providers: [NuiMenuProvider, NuiProvider, InputService],
})
export class NuiModule {}
