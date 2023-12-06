import { Module } from '../../core/decorators/module';
import { BlipFactory } from '../blip';
@Module({
    providers: [BlipFactory],
})
export class WorldModule {}
