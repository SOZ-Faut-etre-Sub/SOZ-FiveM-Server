import { Module } from '../../core/decorators/module';
import { InputService } from './input.service';
import { NuiMenuProvider } from './nui.menu.provider';

@Module({
    providers: [NuiMenuProvider, InputService],
})
export class NuiModule {}
