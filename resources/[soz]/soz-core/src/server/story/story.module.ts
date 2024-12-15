import { Module } from '../../core/decorators/module';
import { BloodProvider } from './blood.provider';
import { EasterHuntProvider } from './easter.hunt.provider';
import { Election2024CeremonyProvider } from './election-2024/ceremony.provider';
import { HuntProvider } from './halloween-2022/hunt.provider';
import { Halloween2022Scenario1Provider } from './halloween-2022/scenario1.provider';
import { Halloween2022Scenario2Provider } from './halloween-2022/scenario2.provider';
import { Halloween2022Scenario3Provider } from './halloween-2022/scenario3.provider';
import { Halloween2022Scenario4Provider } from './halloween-2022/scenario4.provider';
import { Halloween2023Scenario1Provider } from './halloween-2023/scenario1.provider';
import { Halloween2023Scenario2Provider } from './halloween-2023/scenario2.provider';
import { Halloween2023Scenario3Provider } from './halloween-2023/scenario3.provider';
import { Halloween2023Scenario4Provider } from './halloween-2023/scenario4.provider';
import { ParadeProvider } from './parade.provider';
import { QueenHarvestProvider } from './queen.harvest.provider';
import { VampireGameProvider } from './vampire.game.provider';
import { XmasProvider } from './xmas.provider';

@Module({
    providers: [
        HuntProvider,
        Halloween2022Scenario1Provider,
        Halloween2022Scenario2Provider,
        Halloween2022Scenario3Provider,
        Halloween2022Scenario4Provider,
        Halloween2023Scenario1Provider,
        Halloween2023Scenario2Provider,
        Halloween2023Scenario3Provider,
        Halloween2023Scenario4Provider,
        EasterHuntProvider,
        BloodProvider,
        QueenHarvestProvider,
        VampireGameProvider,
        Election2024CeremonyProvider,
        ParadeProvider,
        XmasProvider,
    ],
})
export class StoryModule {}
