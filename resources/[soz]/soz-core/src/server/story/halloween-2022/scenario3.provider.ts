import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { Rpc } from '../../../core/decorators/rpc';
import { Feature, isFeatureEnabled } from '../../../shared/features';
import { RpcEvent } from '../../../shared/rpc';
import { Halloween2022Scenario3 } from '../../../shared/story/halloween-2022/scenario3';
import { Dialog, ScenarioState } from '../../../shared/story/story';
import { InventoryManager } from '../../item/inventory.manager';
import { Notifier } from '../../notifier';
import { PlayerService } from '../../player/player.service';

const DEFAULT_PART = 'part1';

@Provider()
export class Halloween2022Scenario3Provider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Rpc(RpcEvent.STORY_HALLOWEEN_SCENARIO3)
    public onScenario3(source: number): Dialog | null {
        if (!isFeatureEnabled(Feature.HalloweenScenario3)) {
            return;
        }

        const player = this.playerService.getPlayer(source);

        const parts = Object.entries(player.metadata.halloween2022?.scenario3 ?? {}).find(
            scenario => scenario[1] === ScenarioState.Running
        );
        const currentPart = parts ? parts[0] : DEFAULT_PART;

        switch (currentPart) {
            case 'part1':
                this.playerService.setPlayerMetadata(source, 'halloween2022', {
                    ...player.metadata.halloween2022,
                    scenario3: { part1: ScenarioState.Finished, part2: ScenarioState.Running },
                });
                return Halloween2022Scenario3.dialog['part1'];
            case 'part2':
                this.playerService.setPlayerMetadata(source, 'halloween2022', {
                    ...player.metadata.halloween2022,
                    scenario3: {
                        ...player.metadata.halloween2022.scenario3,
                        part2: ScenarioState.Finished,
                        part3: ScenarioState.Running,
                    },
                });
                return Halloween2022Scenario3.dialog['part2'];
            case 'part3':
                if (this.inventoryManager.canCarryItem(source, 'zombie_hand', 1)) {
                    this.inventoryManager.addItemToInventory(source, 'zombie_hand', 1);
                    this.playerService.setPlayerMetadata(source, 'halloween2022', {
                        ...player.metadata.halloween2022,
                        scenario3: {
                            ...player.metadata.halloween2022.scenario3,
                            part3: ScenarioState.Finished,
                            part4: ScenarioState.Running,
                        },
                    });
                    return Halloween2022Scenario3.dialog['part3'];
                }
                this.notifier.notify(source, `Tu n’as pas assez de place dans ton inventaire.`, 'error');
                return;
            case 'part4':
                if (this.inventoryManager.getItem(source, 'zombie_hand') !== null) {
                    this.inventoryManager.removeItemFromInventory(source, 'zombie_hand', 1);
                    this.playerService.setPlayerMetadata(source, 'halloween2022', {
                        ...player.metadata.halloween2022,
                        scenario3: {
                            ...player.metadata.halloween2022.scenario3,
                            part4: ScenarioState.Finished,
                            part5: ScenarioState.Running,
                        },
                    });
                    return Halloween2022Scenario3.dialog['part4'];
                }
                return;
            case 'part5':
                if (this.inventoryManager.canCarryItem(source, 'halloween2022_story', 1)) {
                    this.inventoryManager.addItemToInventory(source, 'halloween2022_story', 1);

                    this.playerService.setPlayerMetadata(source, 'halloween2022', {
                        ...player.metadata.halloween2022,
                        scenario3: { ...player.metadata.halloween2022.scenario3, part5: ScenarioState.Finished },
                    });
                    return Halloween2022Scenario3.dialog['part5'];
                }
                return;
        }
    }
}
