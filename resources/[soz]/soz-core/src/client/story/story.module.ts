import { Module } from '../../core/decorators/module';
import { HuntProvider } from './halloween-2022/hunt.provider';
import { Halloween2022Scenario1Provider } from './halloween-2022/scenario1.provider';
import { Halloween2022Scenario2Provider } from './halloween-2022/scenario2.provider';
import { Halloween2022Scenario3Provider } from './halloween-2022/scenario3.provider';
import { Halloween2022Scenario4Provider } from './halloween-2022/scenario4.provider';
import { ZombieProvider } from './halloween-2022/zombie.provider';
import { StoryProvider } from './story.provider';

@Module({
    providers: [
        StoryProvider,
        HuntProvider,
        ZombieProvider,
        Halloween2022Scenario1Provider,
        Halloween2022Scenario2Provider,
        Halloween2022Scenario3Provider,
        Halloween2022Scenario4Provider,
    ],
})
export class StoryModule {}
