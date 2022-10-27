import { Module } from '../../core/decorators/module';
import { HuntProvider } from './halloween-2022/hunt.provider';
import { Halloween2022Scenario1Provider } from './halloween-2022/scenario1.provider';
import { Halloween2022Scenario2Provider } from './halloween-2022/scenario2.provider';
import { Halloween2022Scenario3Provider } from './halloween-2022/scenario3.provider';

@Module({
    providers: [
        HuntProvider,
        Halloween2022Scenario1Provider,
        Halloween2022Scenario2Provider,
        Halloween2022Scenario3Provider,
    ],
})
export class StoryModule {}
