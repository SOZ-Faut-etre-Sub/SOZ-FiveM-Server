import { InventoryFactory } from '@public/server/inventory/inventory.factory';

import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { Rpc } from '../../../core/decorators/rpc';
import { Feature } from '../../../shared/features';
import { ADD_ERROR_MESSAGE } from '../../../shared/inventory';
import { RpcServerEvent } from '../../../shared/rpc';
import { Halloween2022Scenario1 } from '../../../shared/story/halloween-2022/scenario1';
import { Dialog, ScenarioState } from '../../../shared/story/story';
import { FeatureProvider } from '../../feature/feature.provider';
import { Notifier } from '../../notifier';
import { PlayerService } from '../../player/player.service';

const DEFAULT_PART = 'part0';

@Provider()
export class Halloween2022Scenario1Provider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(InventoryFactory)
    private inventoryFactory: InventoryFactory;

    @Inject(FeatureProvider)
    private featureProvider: FeatureProvider;

    @Rpc(RpcServerEvent.STORY_HALLOWEEN_SCENARIO1)
    public async onScenario1(source: number, zoneName?: string): Promise<Dialog | null> {
        if (!this.featureProvider.isFeatureEnabled(Feature.HalloweenScenario1)) {
            return;
        }

        const inventory = await this.inventoryFactory.getPlayerInventory(source);
        const player = this.playerService.getPlayer(source);

        const parts = Object.entries(player.metadata.halloween2022?.scenario1 ?? {}).find(
            scenario => scenario[1] === ScenarioState.Running
        );
        const currentPart = parts ? parts[0] : DEFAULT_PART;

        switch (currentPart) {
            case 'part0':
                this.playerService.setPlayerMetadata(source, 'halloween2022', {
                    ...player.metadata.halloween2022,
                    scenario1: { part1: ScenarioState.Running },
                });
                return Halloween2022Scenario1.dialog['part1'];
            case 'part1':
                if (zoneName === 'trash3') {
                    if (inventory.canCarryItem('bloody_knife', 1)) {
                        inventory.add('bloody_knife', 1);
                        this.notifier.notify(
                            source,
                            `Du sang frais recouvre cette poubelle… Oh, un couteau ensanglanté. Cela doit être l’arme du crime. Retournons voir la dame.`,
                            'success'
                        );
                        this.playerService.setPlayerMetadata(source, 'halloween2022', {
                            ...player.metadata.halloween2022,
                            scenario1: {
                                ...player.metadata.halloween2022.scenario1,
                                part1: ScenarioState.Finished,
                                part2: ScenarioState.Running,
                            },
                        });
                    } else {
                        this.notifier.notify(source, ADD_ERROR_MESSAGE['not_enough_space'], 'error');
                    }
                } else {
                    this.notifier.notify(
                        source,
                        `Cette poubelle est encore fraîche. Son odeur indique que l’auteur du crime n’y a rien déposé…`,
                        'info'
                    );
                }
                return;
            case 'part2':
                this.playerService.setPlayerMetadata(source, 'halloween2022', {
                    ...player.metadata.halloween2022,
                    scenario1: {
                        ...player.metadata.halloween2022.scenario1,
                        part2: ScenarioState.Finished,
                        part3: ScenarioState.Running,
                    },
                });
                return Halloween2022Scenario1.dialog['part2'];
            case 'part3':
                if (inventory.remove('bloody_knife', 1, false)) {
                    this.playerService.setPlayerMetadata(source, 'halloween2022', {
                        ...player.metadata.halloween2022,
                        scenario1: {
                            ...player.metadata.halloween2022.scenario1,
                            part3: ScenarioState.Finished,
                            part4: ScenarioState.Running,
                        },
                    });
                    return Halloween2022Scenario1.dialog['part3'];
                }
                return;
            case 'part4':
                if (inventory.remove('small_coffin', 1, false)) {
                    this.playerService.setPlayerMetadata(source, 'halloween2022', {
                        ...player.metadata.halloween2022,
                        scenario1: {
                            ...player.metadata.halloween2022.scenario1,
                            part4: ScenarioState.Finished,
                            part5: ScenarioState.Running,
                        },
                    });
                    return Halloween2022Scenario1.dialog['part4'];
                }
                return;
            case 'part5':
                if (zoneName === 'doghouse') {
                    if (inventory.canCarryItem('bag_kibble', 1)) {
                        inventory.add('bag_kibble', 1);
                        this.notifier.notify(
                            source,
                            `Oh bordel... Cette niche est dégueulasse ! Pourquoi il a déposé son sac de croquettes directement dans la niche ?!`,
                            'success'
                        );
                        this.playerService.setPlayerMetadata(source, 'halloween2022', {
                            ...player.metadata.halloween2022,
                            scenario1: {
                                ...player.metadata.halloween2022.scenario1,
                                part5: ScenarioState.Finished,
                                part6: ScenarioState.Running,
                            },
                        });
                        return;
                    } else {
                        this.notifier.notify(source, ADD_ERROR_MESSAGE['not_enough_space'], 'error');
                        return;
                    }
                    return;
                }
                return Halloween2022Scenario1.dialog['part5'];
            case 'part6':
                if (inventory.remove('bag_kibble', 1, false)) {
                    this.playerService.setPlayerMetadata(source, 'halloween2022', {
                        ...player.metadata.halloween2022,
                        scenario1: {
                            ...player.metadata.halloween2022.scenario1,
                            part6: ScenarioState.Finished,
                            part7: ScenarioState.Running,
                        },
                    });
                    return Halloween2022Scenario1.dialog['part6'];
                }
                return;
            case 'part7':
                if (
                    inventory.canSwapItems(
                        [{ name: 'pumpkin_soup', amount: 1 }],
                        [{ name: 'halloween2022_story', amount: 1 }]
                    ) &&
                    inventory.remove('pumpkin_soup', 1, false)
                ) {
                    inventory.add('halloween2022_story', 1);

                    this.playerService.setPlayerMetadata(source, 'halloween2022', {
                        ...player.metadata.halloween2022,
                        scenario1: { ...player.metadata.halloween2022.scenario1, part7: ScenarioState.Finished },
                    });
                    return Halloween2022Scenario1.dialog['part7'];
                }
                return;
        }
    }
}
