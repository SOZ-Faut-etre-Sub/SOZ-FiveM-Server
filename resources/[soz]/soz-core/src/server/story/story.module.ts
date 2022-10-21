import { Module } from '../../core/decorators/module';
import { Halloween2022Scenario1Provider } from './halloween-2022/scenario1.provider';

@Module({
    providers: [Halloween2022Scenario1Provider],
})
export class StoryModule {}
