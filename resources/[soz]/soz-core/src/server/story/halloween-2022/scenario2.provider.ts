import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { Rpc } from '../../../core/decorators/rpc';
import { Feature, isFeatureEnabled } from '../../../shared/features';
import { RpcEvent } from '../../../shared/rpc';
import { Halloween2022Scenario2 } from '../../../shared/story/halloween-2022/scenario2';
import { Dialog, ScenarioState } from '../../../shared/story/story';
import { InventoryManager } from '../../inventory/inventory.manager';
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
    public onScenario2(source: number): Dialog | null {
        if (!isFeatureEnabled(Feature.HalloweenScenario2)) {
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
                    ...player.metadata.halloween2022,
                    scenario2: { part1: ScenarioState.Finished, part2: ScenarioState.Running },
                });
                return Halloween2022Scenario2.dialog['part1'];
            case 'part2':
                this.playerService.setPlayerMetadata(source, 'halloween2022', {
                    ...player.metadata.halloween2022,
                    scenario2: {
                        ...player.metadata.halloween2022.scenario2,
                        part2: ScenarioState.Finished,
                        part3: ScenarioState.Running,
                    },
                });
                return Halloween2022Scenario2.dialog['part2'];
            case 'part3':
                if (this.inventoryManager.removeItemFromInventory(source, 'horror_cauldron', 1)) {
                    this.playerService.setPlayerMetadata(source, 'halloween2022', {
                        ...player.metadata.halloween2022,
                        scenario2: {
                            ...player.metadata.halloween2022.scenario2,
                            part3: ScenarioState.Finished,
                            part4: ScenarioState.Running,
                        },
                    });
                    return Halloween2022Scenario2.dialog['part3'];
                }
                return;
            case 'part4':
                this.playerService.setPlayerMetadata(source, 'halloween2022', {
                    ...player.metadata.halloween2022,
                    scenario2: {
                        ...player.metadata.halloween2022.scenario2,
                        part4: ScenarioState.Finished,
                        part5: ScenarioState.Running,
                    },
                });
                return Halloween2022Scenario2.dialog['part4'];
            case 'part5':
                if (this.inventoryManager.canCarryItem(source, 'old_relic', 1)) {
                    this.inventoryManager.addItemToInventory(source, 'old_relic', 1);
                    this.notifier.notify(
                        source,
                        `Une ancienne relique ? Je devrais la ramener au vieux monsieur pour lui raconter la vraie histoire !`,
                        'success'
                    );
                    this.playerService.setPlayerMetadata(source, 'halloween2022', {
                        ...player.metadata.halloween2022,
                        scenario2: {
                            ...player.metadata.halloween2022.scenario2,
                            part5: ScenarioState.Finished,
                            part6: ScenarioState.Running,
                        },
                    });
                    return;
                }
                this.notifier.notify(source, `Tu n’as pas assez de place dans ton inventaire.`, 'error');
                return;
            case 'part6':
                if (this.inventoryManager.canSwapItem(source, 'old_relic', 1, 'halloween2022_story', 1)) {
                    this.inventoryManager.removeItemFromInventory(source, 'old_relic', 1);
                    this.inventoryManager.addItemToInventory(source, 'halloween2022_story', 1);

                    this.playerService.setPlayerMetadata(source, 'halloween2022', {
                        ...player.metadata.halloween2022,
                        scenario2: { ...player.metadata.halloween2022.scenario2, part6: ScenarioState.Finished },
                    });
                    return Halloween2022Scenario2.dialog['part6'];
                }
                return;
        }
    }
}
