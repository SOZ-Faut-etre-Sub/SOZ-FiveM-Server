import { OnEvent } from '@public/core/decorators/event';
import { ServerEvent } from '@public/shared/event';

import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { Feature, isFeatureEnabled } from '../../../shared/features';
import { ScenarioState } from '../../../shared/story/story';
import { InventoryManager } from '../../inventory/inventory.manager';
import { Notifier } from '../../notifier';
import { PlayerService } from '../../player/player.service';

@Provider()
export class Halloween2023Scenario2Provider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @OnEvent(ServerEvent.STORY_HALLOWEEN_2023_SCENARIO_2)
    public onScenario2(source: number, step?: number) {
        if (!isFeatureEnabled(Feature.Halloween2023Scenario2)) {
            return;
        }

        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        switch (step) {
            case 1:
                this.playerService.setPlayerMetadata(source, 'halloween2023', {
                    ...player.metadata.halloween2023,
                    scenario2: { part1: ScenarioState.Running },
                });
                break;
            case 2:
                this.playerService.setPlayerMetadata(source, 'halloween2023', {
                    ...player.metadata.halloween2023,
                    scenario2: {
                        ...player.metadata.halloween2023.scenario2,
                        part1: ScenarioState.Finished,
                        part2: ScenarioState.Running,
                    },
                });
                break;
            case 3:
                this.playerService.setPlayerMetadata(source, 'halloween2023', {
                    ...player.metadata.halloween2023,
                    scenario2: {
                        ...player.metadata.halloween2023.scenario2,
                        part2: ScenarioState.Finished,
                        part3: ScenarioState.Running,
                    },
                });
                break;
            case 4:
                this.inventoryManager.removeItemFromInventory(source, 'halloween_damned_wine');
                this.playerService.setPlayerMetadata(source, 'halloween2023', {
                    ...player.metadata.halloween2023,
                    scenario2: {
                        ...player.metadata.halloween2023.scenario2,
                        part3: ScenarioState.Finished,
                        part4: ScenarioState.Running,
                    },
                });
                break;
            case 5:
                this.playerService.setPlayerMetadata(source, 'halloween2023', {
                    ...player.metadata.halloween2023,
                    scenario2: {
                        ...player.metadata.halloween2023.scenario2,
                        part4: ScenarioState.Finished,
                        part5: ScenarioState.Running,
                    },
                });
                break;
            case 6:
                if (!this.inventoryManager.canCarryItem(source, 'halloween_alien_artifact', 1)) {
                    this.notifier.notify(source, `Tu n'as pas assez de place dans ton inventaire.`, 'error');
                    return;
                }
                this.inventoryManager.addItemToInventory(source, 'halloween_alien_artifact', 1);
                this.notifier.notify(source, `Vous avez récupéré un étrange artéfact.`, 'success');

                this.playerService.setPlayerMetadata(source, 'halloween2023', {
                    ...player.metadata.halloween2023,
                    scenario2: {
                        ...player.metadata.halloween2023.scenario2,
                        part5: ScenarioState.Finished,
                        part6: ScenarioState.Running,
                    },
                });
                break;
            case 7:
                if (!this.inventoryManager.canCarryItem(source, 'halloween2023_story', 1)) {
                    this.notifier.notify(source, `Tu n'as pas assez de place dans ton inventaire.`, 'error');
                    return;
                }
                this.inventoryManager.addItemToInventory(source, 'halloween2023_story', 1);
                this.inventoryManager.removeItemFromInventory(source, 'halloween_alien_artifact');

                this.playerService.setPlayerMetadata(source, 'halloween2023', {
                    ...player.metadata.halloween2023,
                    scenario2: {
                        ...player.metadata.halloween2023.scenario2,
                        part6: ScenarioState.Finished,
                    },
                });
                break;
        }
    }
}
