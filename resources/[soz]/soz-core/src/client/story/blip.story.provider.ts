import { OnEvent } from '@public/core/decorators/event';
import { ClientEvent } from '@public/shared/event/client';

import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Halloween2022Scenario1Provider } from './halloween-2022/scenario1.provider';
import { Halloween2022Scenario2Provider } from './halloween-2022/scenario2.provider';
import { Halloween2022Scenario3Provider } from './halloween-2022/scenario3.provider';
import { Halloween2022Scenario4Provider } from './halloween-2022/scenario4.provider';
import { Halloween2023Scenario1Provider } from './halloween-2023/scenario1.provider';

@Provider()
export class BlipStoryProvider {
    @Inject(Halloween2022Scenario1Provider)
    private halloween2022Scenario1Provider: Halloween2022Scenario1Provider;

    @Inject(Halloween2022Scenario2Provider)
    private halloween2022Scenario2Provider: Halloween2022Scenario2Provider;

    @Inject(Halloween2022Scenario3Provider)
    private halloween2022Scenario3Provider: Halloween2022Scenario3Provider;

    @Inject(Halloween2022Scenario4Provider)
    private halloween2022Scenario4Provider: Halloween2022Scenario4Provider;

    @Inject(Halloween2023Scenario1Provider)
    private halloween2023Scenario1Provider: Halloween2023Scenario1Provider;

    @OnEvent(ClientEvent.PLAYER_UPDATE)
    public onPlayerUpdate() {
        this.halloween2022Scenario1Provider.createBlip();
        this.halloween2022Scenario2Provider.createBlip();
        this.halloween2022Scenario3Provider.createBlip();
        this.halloween2022Scenario4Provider.createBlip();
        this.halloween2023Scenario1Provider.createBlip();
    }
}
