import { Once } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';
import { Feature, isFeatureEnabled } from '../../../shared/features';
import { CraftProcess, craftProcesses, luxuryCraftProcesses } from '../../../shared/job/ffs';
import { InventoryManager } from '../../item/inventory.manager';
import { ItemService } from '../../item/item.service';
import { PlayerService } from '../../player/player.service';
import { TargetFactory, TargetOptions } from '../../target/target.factory';

@Provider()
export class FightForStyleCraftProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Once()
    public onStart() {
        if (!isFeatureEnabled(Feature.MyBodySummer)) {
            return;
        }

        const targets: TargetOptions[] = craftProcesses.map(this.craftProcessToTarget.bind(this));

        this.targetFactory.createForBoxZone(
            'ffs_craft_zone',
            {
                center: [713.6, -960.64, 30.4],
                length: 0.65,
                width: 0.3,
                minZ: 30.4,
                maxZ: 30.8,
                heading: 270,
                debugPoly: true,
            },
            targets
        );

        const luxuryTargets: TargetOptions[] = luxuryCraftProcesses.map(this.craftProcessToTarget.bind(this));

        this.targetFactory.createForBoxZone(
            'ffs_luxury_craft_zone',
            {
                center: [718.71, -963.14, 30.4],
                length: 0.25,
                width: 0.65,
                minZ: 30.4,
                maxZ: 30.85,
                heading: 359,
                debugPoly: true,
            },
            luxuryTargets
        );
    }

    private craftProcessToTarget(craftProcess: CraftProcess): TargetOptions {
        return {
            label: craftProcess.label,
            color: 'ffs',
            job: 'ffs',
            canInteract: () => {
                for (const input of craftProcess.inputs) {
                    if (!this.inventoryManager.hasEnoughItem(input.fabric, input.amount)) {
                        return false;
                    }
                }
                return this.playerService.isOnDuty();
            },
            action: () => {
                TriggerServerEvent(ServerEvent.FFS_CRAFT, craftProcess);
            },
        };
    }
}
