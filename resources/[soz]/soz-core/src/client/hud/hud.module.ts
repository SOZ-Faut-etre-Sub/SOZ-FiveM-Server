import { Module } from '../../core/decorators/module';
import { HudProvider } from './hud.provider';

@Module({
    providers: [HudProvider],
})
export class HudModule {}
