import { OnEvent } from '@public/core/decorators/event';
import { ServerEvent } from '@public/shared/event';
import { Halloween2023Scenario1Alcool } from '@public/shared/story/halloween-2023/scenario1';

import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { Feature, isFeatureEnabled } from '../../../shared/features';
import { ScenarioState } from '../../../shared/story/story';
import { InventoryManager } from '../../inventory/inventory.manager';
import { Notifier } from '../../notifier';
import { PlayerService } from '../../player/player.service';

@Provider()
export class Halloween2023Scenario1Provider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @OnEvent(ServerEvent.STORY_HALLOWEEN_2023_SCENARIO_1)
    public onScenario1(source: number, step?: number) {
        if (!isFeatureEnabled(Feature.Halloween2023Scenario1)) {
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
                    scenario1: { part1: ScenarioState.Running },
                });
                break;
            case 2:
                this.playerService.setPlayerMetadata(source, 'halloween2023', {
                    ...player.metadata.halloween2023,
                    scenario1: {
                        ...player.metadata.halloween2023.scenario1,
                        part1: ScenarioState.Finished,
                        part2: ScenarioState.Running,
                    },
                });
                break;
            case 3:
                if (!this.inventoryManager.canCarryItem(source, 'halloween_prehistoric_blood_analysis', 1)) {
                    this.notifier.notify(source, `Tu n'as pas assez de place dans ton inventaire.`, 'error');
                    return;
                }
                this.inventoryManager.addItemToInventory(source, 'halloween_prehistoric_blood_analysis', 1);
                this.notifier.notify(
                    source,
                    `Cette baleine a l'air là depuis très longtemps… Cette échantillon devrait apporter des informations. Retournons voir la scientifique avec les poissons.`,
                    'success'
                );
                this.playerService.setPlayerMetadata(source, 'halloween2023', {
                    ...player.metadata.halloween2023,
                    scenario1: {
                        ...player.metadata.halloween2023.scenario1,
                        part2: ScenarioState.Finished,
                        part3: ScenarioState.Running,
                    },
                });

                break;
            case 4:
                this.inventoryManager.removeItemFromInventory(source, 'halloween_prehistoric_blood_analysis', 1);

                for (let i = 0; i < 20; i++) {
                    const onefish = this.inventoryManager.findItem(source, item => item.type === 'fish');
                    this.inventoryManager.removeInventoryItem(source, onefish);
                }

                this.playerService.setPlayerMetadata(source, 'halloween2023', {
                    ...player.metadata.halloween2023,
                    scenario1: {
                        ...player.metadata.halloween2023.scenario1,
                        part3: ScenarioState.Finished,
                        part4: ScenarioState.Running,
                    },
                });
                break;
            case 5:
                if (!this.inventoryManager.canCarryItem(source, 'beer', 1)) {
                    this.notifier.notify(source, `Tu n'as pas assez de place dans ton inventaire.`, 'error');
                    return;
                }
                this.inventoryManager.addItemToInventory(source, 'beer', 1);

                this.playerService.setPlayerMetadata(source, 'halloween2023', {
                    ...player.metadata.halloween2023,
                    scenario1: {
                        ...player.metadata.halloween2023.scenario1,
                        part4: ScenarioState.Finished,
                        part5: ScenarioState.Running,
                    },
                });
                break;
            case 6:
                this.playerService.setPlayerMetadata(source, 'halloween2023', {
                    ...player.metadata.halloween2023,
                    scenario1: {
                        ...player.metadata.halloween2023.scenario1,
                        part5: ScenarioState.Finished,
                        part6: ScenarioState.Running,
                    },
                });
                break;
            case 7:
                {
                    const cocktail = this.inventoryManager.findItem(source, item =>
                        Halloween2023Scenario1Alcool.includes(item.name)
                    );
                    this.inventoryManager.removeInventoryItem(source, cocktail);

                    this.playerService.setPlayerMetadata(source, 'halloween2023', {
                        ...player.metadata.halloween2023,
                        scenario1: {
                            ...player.metadata.halloween2023.scenario1,
                            part6: ScenarioState.Finished,
                            part7: ScenarioState.Running,
                        },
                    });
                }
                break;
            case 8:
                if (!this.inventoryManager.canCarryItem(source, 'halloween2023_story', 1)) {
                    this.notifier.notify(source, `Tu n'as pas assez de place dans ton inventaire.`, 'error');
                    return;
                }
                this.inventoryManager.addItemToInventory(source, 'halloween2023_story', 1);

                this.playerService.setPlayerMetadata(source, 'halloween2023', {
                    ...player.metadata.halloween2023,
                    scenario1: {
                        ...player.metadata.halloween2023.scenario1,
                        part7: ScenarioState.Finished,
                    },
                });
                break;
        }
    }
}
