import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { Rpc } from '../../../core/decorators/rpc';
import { Feature, isFeatureEnabled } from '../../../shared/features';
import { RpcEvent } from '../../../shared/rpc';
import { Halloween2022Scenario1 } from '../../../shared/story/halloween-2022/scenario1';
import { Halloween2022Scenario2 } from '../../../shared/story/halloween-2022/scenario2';
import { Dialog, ScenarioState } from '../../../shared/story/story';
import { InventoryManager } from '../../item/inventory.manager';
import { Notifier } from '../../notifier';
import { PlayerService } from '../../player/player.service';

const DEFAULT_PART = 'part1';

@Provider()
export class Halloween2022Scenario2Provider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Rpc(RpcEvent.STORY_HALLOWEEN_SCENARIO2)
    public onScenario2(source: number, zoneName?: string): Dialog | null {
        if (!isFeatureEnabled(Feature.Halloween2022)) {
            return;
        }

        const player = this.playerService.getPlayer(source);

        const parts = Object.entries(player.metadata.halloween2022?.scenario2 ?? {}).find(
            scenario => scenario[1] === ScenarioState.Running
        );
        const currentPart = parts ? parts[0] : DEFAULT_PART;

        switch (currentPart) {
            case 'part1':
                this.playerService.setPlayerMetadata(source, 'halloween2022', {
                    scenario1: player.metadata.halloween2022.scenario1,
                    scenario2: { part1: ScenarioState.Running },
                });
                return Halloween2022Scenario2.dialog['part1'];
            case 'part2':
                if (zoneName === 'hand') {
                    this.playerService.setPlayerMetadata(source, 'halloween2022', {
                        ...(player.metadata.halloween2022 ?? {}),
                        scenario1: player.metadata.halloween2022.scenario1,
                        scenario2: {
                            ...player.metadata.halloween2022.scenario2,
                            part1: ScenarioState.Finished,
                            part2: ScenarioState.Running,
                        },
                    });
                    return Halloween2022Scenario2.dialog['part2'];
                }
                return;
            case 'part3':
                return Halloween2022Scenario2.dialog['part3'];
            case 'part4':
                return Halloween2022Scenario2.dialog['part4'];
            case 'part5':
                return Halloween2022Scenario2.dialog['part5'];
            case 'part6':
                return Halloween2022Scenario2.dialog['part6'];
        }
    }
}
