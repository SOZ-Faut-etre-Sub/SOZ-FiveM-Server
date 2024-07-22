import { Once, OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { InventoryFactory } from '@public/server/inventory/inventory.factory';
import { Notifier } from '@public/server/notifier';
import { PlayerPositionProvider } from '@public/server/player/player.position.provider';
import { PlayerService } from '@public/server/player/player.service';
import { ServerEvent } from '@public/shared/event';
import { Feature } from '@public/shared/features';
import {
    Halloween2023Scenario3TPAvion,
    Halloween2023Scenario3TPBack,
    Halloween2023Scenario3TPBureau,
    Halloween2023Scenario3TPFalling,
    Halloween2023Scenario3TPFBI,
    Halloween2023Scenario3TPGarage,
    Halloween2023Scenario3TPHangar,
    Halloween2023Scenario3TPSubmarine,
    Halloween2023Scenario3TPWhiteBox,
} from '@public/shared/story/halloween-2023/scenario3';
import { ScenarioState } from '@public/shared/story/story';

import { ADD_ERROR_MESSAGE } from '../../../shared/inventory';
import { FeatureProvider } from '../../feature/feature.provider';

@Provider()
export class Halloween2023Scenario3Provider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(InventoryFactory)
    private inventoryFactory: InventoryFactory;

    @Inject(PlayerPositionProvider)
    private playerPositionProvider: PlayerPositionProvider;

    @Inject(FeatureProvider)
    private featureProvider: FeatureProvider;

    @Once()
    public onStart() {
        this.playerPositionProvider.registerZone(Halloween2023Scenario3TPWhiteBox, [405.922, -954.114, -99.662, 0.1]);
        this.playerPositionProvider.registerZone(Halloween2023Scenario3TPHangar, [-1266.32, -2962.67, -48.5, 178.4]);
        this.playerPositionProvider.registerZone(Halloween2023Scenario3TPBureau, [-1005.84, -478.92, 50.02733, 0.0]);
        this.playerPositionProvider.registerZone(Halloween2023Scenario3TPFBI, [151.51, -743.58, 254.15, 0.0]);
        this.playerPositionProvider.registerZone(Halloween2023Scenario3TPAvion, [520.0, 4750.0, -70.0, 0.0]);
        this.playerPositionProvider.registerZone(Halloween2023Scenario3TPGarage, [-1520.8, -2978.92, -80.46, 271.53]);
        this.playerPositionProvider.registerZone(Halloween2023Scenario3TPFalling, [150.46, -1301.75, 1308.99, 99.83]);
        this.playerPositionProvider.registerZone(Halloween2023Scenario3TPSubmarine, [1561.55, 411.93, -49.66, 0.0]);
        this.playerPositionProvider.registerZone(Halloween2023Scenario3TPBack, [791.14, 1209.36, 339.23, 251.88]);
    }

    @OnEvent(ServerEvent.STORY_HALLOWEEN_2023_SCENARIO_3)
    public async onScenario3(source: number, step?: number) {
        const inventory = await this.inventoryFactory.getPlayerInventory(source);

        if (!this.featureProvider.isFeatureEnabled(Feature.Halloween2023Scenario3)) {
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
                    scenario3: { part1: ScenarioState.Running },
                });
                break;
            case 2:
                inventory.remove('halloween_beef_with_bone', 1, false);
                this.playerService.setPlayerMetadata(source, 'halloween2023', {
                    ...player.metadata.halloween2023,
                    scenario3: {
                        ...player.metadata.halloween2023.scenario3,
                        part1: ScenarioState.Finished,
                        part2: ScenarioState.Running,
                    },
                });
                break;
            case 3:
                this.playerService.setPlayerMetadata(source, 'halloween2023', {
                    ...player.metadata.halloween2023,
                    scenario3: {
                        ...player.metadata.halloween2023.scenario3,
                        part2: ScenarioState.Finished,
                        part3: ScenarioState.Running,
                    },
                });
                break;
            case 4:
                this.playerService.setPlayerMetadata(source, 'halloween2023', {
                    ...player.metadata.halloween2023,
                    scenario3: {
                        ...player.metadata.halloween2023.scenario3,
                        part3: ScenarioState.Finished,
                        part4: ScenarioState.Running,
                    },
                });
                break;
            case 5:
                if (!inventory.canCarryItem('halloween_document_z', 1)) {
                    this.notifier.notify(source, ADD_ERROR_MESSAGE['not_enough_space'], 'error');
                    return;
                }
                inventory.add('halloween_document_z', 1);
                this.notifier.notify(source, `Vous avez récupéré un document.`, 'success');

                this.playerService.setPlayerMetadata(source, 'halloween2023', {
                    ...player.metadata.halloween2023,
                    scenario3: {
                        ...player.metadata.halloween2023.scenario3,
                        part4: ScenarioState.Finished,
                        part5: ScenarioState.Running,
                    },
                });
                break;
            case 6:
                inventory.add('halloween2023_story', 1);
                this.playerService.setPlayerMetadata(source, 'halloween2023', {
                    ...player.metadata.halloween2023,
                    scenario3: {
                        ...player.metadata.halloween2023.scenario3,
                        part5: ScenarioState.Finished,
                    },
                });
                break;
        }
    }
}
