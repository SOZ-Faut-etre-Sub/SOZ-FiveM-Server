import { Once, OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { InventoryManager } from '@public/server/inventory/inventory.manager';
import { Notifier } from '@public/server/notifier';
import { PlayerPositionProvider } from '@public/server/player/player.position.provider';
import { PlayerService } from '@public/server/player/player.service';
import { ServerEvent } from '@public/shared/event';
import { Feature, isFeatureEnabled } from '@public/shared/features';
import {
    Halloween2023Scenario4EnterCayo,
    Halloween2023Scenario4EnterFinal,
    Halloween2023Scenario4EnterMorgue,
    Halloween2023Scenario4ExitCayo,
    Halloween2023Scenario4ExitFinal,
    Halloween2023Scenario4ExitMorgue,
} from '@public/shared/story/halloween-2023/scenario4';
import { ScenarioState } from '@public/shared/story/story';

@Provider()
export class Halloween2023Scenario4Provider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(PlayerPositionProvider)
    private playerPositionProvider: PlayerPositionProvider;

    @Once()
    public onStart() {
        this.playerPositionProvider.registerZone(Halloween2023Scenario4EnterMorgue, [275.58, -1361.15, 24.54, 58.32]);
        this.playerPositionProvider.registerZone(Halloween2023Scenario4ExitMorgue, [240.87, -1379.35, 33.74, 133.98]);

        this.playerPositionProvider.registerZone(Halloween2023Scenario4EnterCayo, [2493.23, -238.47, -70.74, 268.47]);
        this.playerPositionProvider.registerZone(Halloween2023Scenario4ExitCayo, [5045.27, -5817.37, -11.21, 232.11]);

        this.playerPositionProvider.registerZone(Halloween2023Scenario4EnterFinal, [-1609.59, -3018.82, -79.01, 82.71]);
        this.playerPositionProvider.registerZone(Halloween2023Scenario4ExitFinal, [111.54, -1304.22, 29.05, 300.05]);
    }

    @OnEvent(ServerEvent.STORY_HALLOWEEN_2023_SCENARIO_4)
    public onScenario4(source: number, step?: number) {
        if (!isFeatureEnabled(Feature.Halloween2023Scenario4)) {
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
                    scenario4: { part1: ScenarioState.Running },
                });
                break;
            case 2:
                this.playerService.setPlayerMetadata(source, 'halloween2023', {
                    ...player.metadata.halloween2023,
                    scenario4: {
                        ...player.metadata.halloween2023.scenario4,
                        part1: ScenarioState.Finished,
                        part2: ScenarioState.Running,
                    },
                });
                break;
            case 3:
                if (!this.inventoryManager.canCarryItem(source, 'halloween_demon_analysis', 1)) {
                    this.notifier.notify(source, `Tu n'as pas assez de place dans ton inventaire.`, 'error');
                    return;
                }
                this.inventoryManager.addItemToInventory(source, 'halloween_demon_analysis', 1);
                this.notifier.notify(source, `Vous avez récupéré un document.`, 'success');

                this.playerService.setPlayerMetadata(source, 'halloween2023', {
                    ...player.metadata.halloween2023,
                    scenario4: {
                        ...player.metadata.halloween2023.scenario4,
                        part2: ScenarioState.Finished,
                        part3: ScenarioState.Running,
                    },
                });
                break;
            case 4:
                this.playerService.setPlayerMetadata(source, 'halloween2023', {
                    ...player.metadata.halloween2023,
                    scenario4: {
                        ...player.metadata.halloween2023.scenario4,
                        part3: ScenarioState.Finished,
                        part4: ScenarioState.Running,
                    },
                });
                break;
            case 5:
                this.playerService.setPlayerMetadata(source, 'halloween2023', {
                    ...player.metadata.halloween2023,
                    scenario4: {
                        ...player.metadata.halloween2023.scenario4,
                        part4: ScenarioState.Finished,
                        part5: ScenarioState.Running,
                    },
                });
                break;
            case 6:
                if (!this.inventoryManager.canCarryItem(source, 'halloween2023_story', 1)) {
                    this.notifier.notify(source, `Tu n'as pas assez de place dans ton inventaire.`, 'error');
                    return;
                }
                this.inventoryManager.addItemToInventory(source, 'halloween2023_story', 1);
                this.playerService.setPlayerMetadata(source, 'halloween2023', {
                    ...player.metadata.halloween2023,
                    scenario4: {
                        ...player.metadata.halloween2023.scenario4,
                        part5: ScenarioState.Finished,
                        part6: ScenarioState.Running,
                    },
                });
                break;
            case 7:
                this.playerService.setPlayerMetadata(source, 'halloween2023', {
                    ...player.metadata.halloween2023,
                    scenario4: {
                        ...player.metadata.halloween2023.scenario4,
                        part6: ScenarioState.Finished,
                    },
                });
                break;
        }
    }
}
