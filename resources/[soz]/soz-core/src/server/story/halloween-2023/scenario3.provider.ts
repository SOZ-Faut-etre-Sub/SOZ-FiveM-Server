import { OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { InventoryManager } from '@public/server/inventory/inventory.manager';
import { Notifier } from '@public/server/notifier';
import { PlayerService } from '@public/server/player/player.service';
import { ServerEvent } from '@public/shared/event';
import { Feature, isFeatureEnabled } from '@public/shared/features';
import { ScenarioState } from '@public/shared/story/story';

@Provider()
export class Halloween2023Scenario3Provider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @OnEvent(ServerEvent.STORY_HALLOWEEN_2023_SCENARIO_3)
    public onScenario3(source: number, step?: number) {
        if (!isFeatureEnabled(Feature.Halloween2023Scenario3)) {
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
                this.inventoryManager.removeItemFromInventory(source, 'halloween_beef_with_bone');
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
                this.inventoryManager.removeItemFromInventory(source, 'halloween_beef_with_bone');
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
                if (!this.inventoryManager.canCarryItem(source, 'halloween_document_z', 1)) {
                    this.notifier.notify(source, `Tu n'as pas assez de place dans ton inventaire.`, 'error');
                    return;
                }
                this.inventoryManager.addItemToInventory(source, 'halloween_document_z', 1);
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
                this.inventoryManager.addItemToInventory(source, 'halloween2023_story', 1);
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
