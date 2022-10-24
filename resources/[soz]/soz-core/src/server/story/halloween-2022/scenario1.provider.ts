import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { Rpc } from '../../../core/decorators/rpc';
import { Feature, isFeatureEnabled } from '../../../shared/features';
import { RpcEvent } from '../../../shared/rpc';
import { Halloween2022Scenario1 } from '../../../shared/story/halloween-2022/scenario1';
import { Dialog, ScenarioState } from '../../../shared/story/story';
import { InventoryManager } from '../../item/inventory.manager';
import { Notifier } from '../../notifier';
import { PlayerService } from '../../player/player.service';

const DEFAULT_PART = 'init';

@Provider()
export class Halloween2022Scenario1Provider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Rpc(RpcEvent.STORY_HALLOWEEN_SCENARIO1)
    public onScenario1(source: number, zoneName?: string): Dialog | null {
        if (!isFeatureEnabled(Feature.Halloween2022)) {
            return;
        }

        const player = this.playerService.getPlayer(source);

        const parts = Object.entries(player.metadata.halloween2022?.scenario1 ?? {}).find(
            scenario => scenario[1] === ScenarioState.Running
        );
        const currentPart = parts ? parts[0] : DEFAULT_PART;

        switch (currentPart) {
            case 'init':
                this.playerService.setPlayerMetadata(source, 'halloween2022', {
                    scenario1: { part1: ScenarioState.Running },
                });
                return Halloween2022Scenario1.dialog['part1'];
            case 'part1':
                if (zoneName === 'trash3') {
                    if (this.inventoryManager.canCarryItem(source, 'bloody_knife', 1)) {
                        this.inventoryManager.addItemToInventory(source, 'bloody_knife', 1);
                        this.notifier.notify(
                            source,
                            `Du sang frais recouvre cette poubelle… Oh, un couteau ensanglanté. Cela doit être l’arme du crime. Retournons voir la dame.`,
                            'success'
                        );
                        this.playerService.setPlayerMetadata(source, 'halloween2022', {
                            ...(player.metadata.halloween2022 ?? {}),
                            scenario1: {
                                ...player.metadata.halloween2022.scenario1,
                                part1: ScenarioState.Finished,
                                part2: ScenarioState.Running,
                            },
                        });
                    } else {
                        this.notifier.notify(source, `Tu n’as pas assez de place dans ton inventaire.`, 'error');
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
                    ...(player.metadata.halloween2022 ?? {}),
                    scenario1: {
                        ...player.metadata.halloween2022.scenario1,
                        part2: ScenarioState.Finished,
                        part3: ScenarioState.Running,
                    },
                });
                return Halloween2022Scenario1.dialog['part2'];
            case 'part3':
                if (this.inventoryManager.removeItemFromInventory(source, 'bloody_knife', 1)) {
                    this.playerService.setPlayerMetadata(source, 'halloween2022', {
                        ...(player.metadata.halloween2022 ?? {}),
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
                if (this.inventoryManager.removeItemFromInventory(source, 'small_coffin', 1)) {
                    this.playerService.setPlayerMetadata(source, 'halloween2022', {
                        ...(player.metadata.halloween2022 ?? {}),
                        scenario1: {
                            ...(player.metadata.halloween2022.scenario1 ?? {}),
                            part4: ScenarioState.Finished,
                            part5: ScenarioState.Running,
                        },
                    });
                    return Halloween2022Scenario1.dialog['part4'];
                }
                return;
            case 'part5':
                if (zoneName === 'doghouse') {
                    if (this.inventoryManager.canCarryItem(source, 'bag_kibble', 1)) {
                        this.inventoryManager.addItemToInventory(source, 'bag_kibble', 1);
                        this.notifier.notify(
                            source,
                            `Oh bordel… C’est niche est dégueulasse ! Pourquoi il a déposé son sac à croquette directement dans la niche ?!`,
                            'success'
                        );
                        this.playerService.setPlayerMetadata(source, 'halloween2022', {
                            ...(player.metadata.halloween2022 ?? {}),
                            scenario1: {
                                ...(player.metadata.halloween2022.scenario1 ?? {}),
                                part5: ScenarioState.Finished,
                                part6: ScenarioState.Running,
                            },
                        });
                        return;
                    } else {
                        this.notifier.notify(source, `Tu n’as pas assez de place dans ton inventaire.`, 'error');
                        return;
                    }
                    // } else {
                    //     this.notifier.notify(source, `???`, 'info');
                    //     return;
                }
                return Halloween2022Scenario1.dialog['part5'];
            case 'part6':
                if (this.inventoryManager.removeItemFromInventory(source, 'bag_kibble', 1)) {
                    this.playerService.setPlayerMetadata(source, 'halloween2022', {
                        ...(player.metadata.halloween2022 ?? {}),
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
                if (this.inventoryManager.canSwapItem(source, 'pumpkin_soup', 1, 'halloween2022_story', 1)) {
                    this.inventoryManager.removeItemFromInventory(source, 'pumpkin_soup', 1);
                    this.inventoryManager.addItemToInventory(source, 'halloween2022_story', 1);

                    this.playerService.setPlayerMetadata(source, 'halloween2022', {
                        ...(player.metadata.halloween2022 ?? {}),
                        scenario1: { ...player.metadata.halloween2022.scenario1, part7: ScenarioState.Finished },
                    });
                    return;
                }
                return Halloween2022Scenario1.dialog['part7'];
        }
    }
}
