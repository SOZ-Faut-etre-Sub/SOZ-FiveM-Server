import { Once } from '@public/core/decorators/event';
import { InventoryFactory } from '@public/server/inventory/inventory.factory';
import { PlayerPositionProvider } from '@public/server/player/player.position.provider';

import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { Rpc } from '../../../core/decorators/rpc';
import { Feature } from '../../../shared/features';
import { ADD_ERROR_MESSAGE } from '../../../shared/inventory';
import { RpcServerEvent } from '../../../shared/rpc';
import {
    Halloween2022Scenario3,
    Halloween2022Scenario3EnterBunker,
    Halloween2022Scenario3ExitBunker,
} from '../../../shared/story/halloween-2022/scenario3';
import { Dialog, ScenarioState } from '../../../shared/story/story';
import { FeatureProvider } from '../../feature/feature.provider';
import { Notifier } from '../../notifier';
import { PlayerService } from '../../player/player.service';

const DEFAULT_PART = 'part1';

@Provider()
export class Halloween2022Scenario3Provider {
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
        this.playerPositionProvider.registerZone(Halloween2022Scenario3EnterBunker, [894.74, -3245.37, -98.26, 91.46]);
        this.playerPositionProvider.registerZone(Halloween2022Scenario3ExitBunker, [604.61, 5556.5, 716.76, 37.74]);
    }

    @Rpc(RpcServerEvent.STORY_HALLOWEEN_SCENARIO3)
    public async onScenario3(source: number): Promise<Dialog | null> {
        const inventory = await this.inventoryFactory.getPlayerInventory(source);

        if (!this.featureProvider.isFeatureEnabled(Feature.HalloweenScenario3)) {
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
                if (inventory.canCarryItem('zombie_hand', 1)) {
                    inventory.add('zombie_hand', 1);
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
                this.notifier.notify(source, ADD_ERROR_MESSAGE['not_enough_space'], 'error');
                return;
            case 'part4':
                if (inventory.remove('zombie_hand', 1, false)) {
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
                if (inventory.canCarryItem('halloween2022_story', 1)) {
                    inventory.add('halloween2022_story', 1);

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
