import { OnEvent } from '@public/core/decorators/event';
import { InventoryFactory } from '@public/server/inventory/inventory.factory';
import { ServerEvent } from '@public/shared/event';

import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { Feature } from '../../../shared/features';
import { ADD_ERROR_MESSAGE } from '../../../shared/inventory';
import { ScenarioState } from '../../../shared/story/story';
import { FeatureProvider } from '../../feature/feature.provider';
import { Notifier } from '../../notifier';
import { PlayerService } from '../../player/player.service';

@Provider()
export class Halloween2023Scenario2Provider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(InventoryFactory)
    private inventoryFactory: InventoryFactory;

    @Inject(FeatureProvider)
    private featureProvider: FeatureProvider;

    @OnEvent(ServerEvent.STORY_HALLOWEEN_2023_SCENARIO_2)
    public async onScenario2(source: number, step?: number) {
        const inventory = await this.inventoryFactory.getPlayerInventory(source);

        if (!this.featureProvider.isFeatureEnabled(Feature.Halloween2023Scenario2)) {
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
                inventory.remove('halloween_damned_wine', 1, false);
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
                if (!inventory.canCarryItem('halloween_alien_artifact', 1)) {
                    this.notifier.notify(source, ADD_ERROR_MESSAGE['not_enough_space'], 'error');
                    return;
                }
                inventory.add('halloween_alien_artifact', 1);
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
                if (!inventory.canCarryItem('halloween2023_story', 1)) {
                    this.notifier.notify(source, ADD_ERROR_MESSAGE['not_enough_space'], 'error');
                    return;
                }
                inventory.add('halloween2023_story', 1);
                inventory.remove('halloween_alien_artifact', 1, false);

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
