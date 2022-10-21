import { Provider } from '../../../core/decorators/provider';
import { Rpc } from '../../../core/decorators/rpc';
import { RpcEvent } from '../../../shared/rpc';

const Scenario1Audio = {
    2: 'SOZ_Halloween2022_Scenario1_2',
};

@Provider()
export class Halloween2022Scenario1Provider {
    @Rpc(RpcEvent.STORY_HALLOWEEN_SCENARIO1)
    public onScenario1(): string {
        return Scenario1Audio[2];
    }
}
