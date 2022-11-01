import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { Rpc } from '../../../core/decorators/rpc';
import { Feature, isFeatureEnabled } from '../../../shared/features';
import { RpcEvent } from '../../../shared/rpc';
import { Halloween2022Scenario4 } from '../../../shared/story/halloween-2022/scenario4';
import { Dialog, ScenarioState } from '../../../shared/story/story';
import { InventoryManager } from '../../item/inventory.manager';
import { Notifier } from '../../notifier';
import { PlayerService } from '../../player/player.service';

const DEFAULT_PART = 'part1';

@Provider()
export class Halloween2022Scenario4Provider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Rpc(RpcEvent.STORY_HALLOWEEN_SCENARIO4)
    public onScenario3(source: number): Dialog | null {
        if (!isFeatureEnabled(Feature.HalloweenScenario4)) {
            return;
        }

        const player = this.playerService.getPlayer(source);

        const parts = Object.entries(player.metadata.halloween2022?.scenario4 ?? {}).find(
            scenario => scenario[1] === ScenarioState.Running
        );
        const currentPart = parts ? parts[0] : DEFAULT_PART;

        switch (currentPart) {
            case 'part1':
                this.playerService.setPlayerMetadata(source, 'halloween2022', {
                    ...player.metadata.halloween2022,
                    scenario4: { part1: ScenarioState.Finished, part2: ScenarioState.Running },
                });
                return Halloween2022Scenario4.dialog['part1'];
            case 'part2':
                this.playerService.setPlayerMetadata(source, 'halloween2022', {
                    ...player.metadata.halloween2022,
                    scenario4: {
                        ...player.metadata.halloween2022.scenario4,
                        part2: ScenarioState.Finished,
                        part3: ScenarioState.Running,
                    },
                });
                return Halloween2022Scenario4.dialog['part2'];
            case 'part3':
                this.playerService.setPlayerMetadata(source, 'halloween2022', {
                    ...player.metadata.halloween2022,
                    scenario4: {
                        ...player.metadata.halloween2022.scenario4,
                        part3: ScenarioState.Finished,
                        part4: ScenarioState.Running,
                    },
                });
                return Halloween2022Scenario4.dialog['part3'];
            case 'part4':
                this.playerService.setPlayerMetadata(source, 'halloween2022', {
                    ...player.metadata.halloween2022,
                    scenario4: {
                        ...player.metadata.halloween2022.scenario4,
                        part4: ScenarioState.Finished,
                        part5: ScenarioState.Running,
                    },
                });
                return Halloween2022Scenario4.dialog['part4'];
            case 'part5':
                this.playerService.setPlayerMetadata(source, 'halloween2022', {
                    ...player.metadata.halloween2022,
                    scenario4: {
                        ...player.metadata.halloween2022.scenario4,
                        part5: ScenarioState.Finished,
                        part6: ScenarioState.Running,
                    },
                });
                return Halloween2022Scenario4.dialog['part5'];
            case 'part6':
                this.playerService.setPlayerMetadata(source, 'halloween2022', {
                    ...player.metadata.halloween2022,
                    scenario4: {
                        ...player.metadata.halloween2022.scenario4,
                        part6: ScenarioState.Finished,
                        part7: ScenarioState.Running,
                    },
                });
                this.notifier.notify(source, 'Vous avez récupéré un objet clé permettant d’ouvrir la porte.', 'info');
                return Halloween2022Scenario4.dialog['part6'];
            case 'part7':
                if (this.inventoryManager.canCarryItem(source, 'halloween2022_story', 1)) {
                    this.inventoryManager.addItemToInventory(source, 'halloween2022_story', 1);

                    this.playerService.setPlayerMetadata(source, 'halloween2022', {
                        ...player.metadata.halloween2022,
                        scenario4: { ...player.metadata.halloween2022.scenario4, part7: ScenarioState.Finished },
                    });
                    return Halloween2022Scenario4.dialog['part7'];
                }
                return;
        }
    }
}
