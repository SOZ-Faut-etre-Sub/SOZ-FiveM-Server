import { Module } from '../../core/decorators/module';
import { BlipStoryProvider } from './blip.story.provider';
import { DevilBaitShopProvider } from './devil.bait.shop.provider';
import { HuntProvider } from './halloween-2022/hunt.provider';
import { Halloween2022Scenario1Provider } from './halloween-2022/scenario1.provider';
import { Halloween2022Scenario2Provider } from './halloween-2022/scenario2.provider';
import { Halloween2022Scenario3Provider } from './halloween-2022/scenario3.provider';
import { Halloween2022Scenario4Provider } from './halloween-2022/scenario4.provider';
import { Halloween2023Scenario1Provider } from './halloween-2023/scenario1.provider';
import { Halloween2023Scenario2Provider } from './halloween-2023/scenario2.provider';
import { Halloween2023Scenario3Provider } from './halloween-2023/scenario3.provider';
import { Halloween2023Scenario4Provider } from './halloween-2023/scenario4.provider';
import { StoryProvider } from './story.provider';
import { ZombieProvider } from './zombie.provider';

@Module({
    providers: [
        StoryProvider,
        HuntProvider,
        ZombieProvider,
        BlipStoryProvider,
        DevilBaitShopProvider,
        Halloween2022Scenario1Provider,
        Halloween2022Scenario2Provider,
        Halloween2022Scenario3Provider,
        Halloween2022Scenario4Provider,
        Halloween2023Scenario1Provider,
        Halloween2023Scenario2Provider,
        Halloween2023Scenario3Provider,
        Halloween2023Scenario4Provider,
    ],
})
export class StoryModule {}
