import { OnEvent } from '@public/core/decorators/event';
import { InventoryFactory } from '@public/server/inventory/inventory.factory';
import { ServerEvent } from '@public/shared/event';
import { Halloween2023Scenario1Alcool } from '@public/shared/story/halloween-2023/scenario1';

import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { Feature } from '../../../shared/features';
import { ADD_ERROR_MESSAGE } from '../../../shared/inventory';
import { ScenarioState } from '../../../shared/story/story';
import { FeatureProvider } from '../../feature/feature.provider';
import { Notifier } from '../../notifier';
import { PlayerService } from '../../player/player.service';

@Provider()
export class Halloween2023Scenario1Provider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(InventoryFactory)
    private inventoryFactory: InventoryFactory;

    @Inject(FeatureProvider)
    private featureProvider: FeatureProvider;

    @OnEvent(ServerEvent.STORY_HALLOWEEN_2023_SCENARIO_1)
    public async onScenario1(source: number, step?: number) {
        const inventory = await this.inventoryFactory.getPlayerInventory(source);

        if (!this.featureProvider.isFeatureEnabled(Feature.Halloween2023Scenario1)) {
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
                if (!inventory.canCarryItem('halloween_prehistoric_blood_analysis', 1)) {
                    this.notifier.notify(source, ADD_ERROR_MESSAGE['not_enough_space'], 'error');
                    return;
                }
                inventory.add('halloween_prehistoric_blood_analysis', 1);
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
                inventory.remove('halloween_prehistoric_blood_analysis', 1, false);

                for (let i = 0; i < 20; i++) {
                    const onefish = inventory.findItem(item => item.type === 'fish');
                    inventory.removeAtSlot(source, onefish.slot);
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
                if (!inventory.canCarryItem('beer', 1)) {
                    this.notifier.notify(source, ADD_ERROR_MESSAGE['not_enough_space'], 'error');
                    return;
                }
                inventory.add('beer', 1);

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
                    const cocktail = inventory.findItem(item => Halloween2023Scenario1Alcool.includes(item.name));
                    inventory.removeAtSlot(cocktail.slot);

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
                if (!inventory.canCarryItem('halloween2023_story', 1)) {
                    this.notifier.notify(source, ADD_ERROR_MESSAGE['not_enough_space'], 'error');
                    return;
                }
                inventory.add('halloween2023_story', 1);

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
