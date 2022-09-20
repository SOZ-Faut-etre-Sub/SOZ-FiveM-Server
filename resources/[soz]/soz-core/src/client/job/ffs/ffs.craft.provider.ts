import { Once, OnceStep } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';
import { InventoryItem } from '../../../shared/item';
import {
    CraftProcess,
    craftProcesses,
    craftZones,
    luxuryCraftProcesses,
    luxuryCraftZones,
    shoesCraftProcesses,
    shoesCraftZones,
} from '../../../shared/job/ffs';
import { InventoryManager } from '../../item/inventory.manager';
import { ItemService } from '../../item/item.service';
import { PlayerService } from '../../player/player.service';
import { TargetFactory, TargetOptions } from '../../target/target.factory';

@Provider()
export class FightForStyleCraftProvider {
    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Once(OnceStep.PlayerLoaded)
    public onPlayerLoaded() {
        const targets: TargetOptions[] = craftProcesses.map(craftProcess => {
            const method: (craft: CraftProcess, icon: string) => TargetOptions = this.craftProcessToTarget.bind(this);
            return method(craftProcess, 'c:/ffs/craft.png');
        });

        craftZones.forEach(zone => {
            this.targetFactory.createForBoxZone(zone.name, zone, targets);
        });

        const luxuryTargets: TargetOptions[] = luxuryCraftProcesses.map(craftProcess => {
            const method: (craft: CraftProcess, icon: string) => TargetOptions = this.craftProcessToTarget.bind(this);
            return method(craftProcess, 'c:/ffs/craft.png');
        });

        luxuryCraftZones.forEach(zone => {
            this.targetFactory.createForBoxZone(zone.name, zone, luxuryTargets);
        });

        const shoesTargets: TargetOptions[] = shoesCraftProcesses.map(craftProcess => {
            const method: (craft: CraftProcess, icon: string) => TargetOptions = this.craftProcessToTarget.bind(this);
            return method(craftProcess, 'c:/ffs/craft_shoes.png');
        });

        shoesCraftZones.forEach(zone => {
            this.targetFactory.createForBoxZone(zone.name, zone, shoesTargets);
        });
    }

    private craftProcessToTarget(craftProcess: CraftProcess, icon: string): TargetOptions {
        return {
            label: craftProcess.label,
            icon,
            color: 'ffs',
            job: 'ffs',
            blackoutGlobal: true,
            blackoutJob: 'ffs',
            canInteract: () => {
                for (const input of craftProcess.inputs) {
                    const predicate = (item: InventoryItem) => {
                        return (
                            item.name === input.fabric &&
                            item.amount >= input.amount &&
                            this.itemService.isExpired(item)
                        );
                    };
                    if (!this.inventoryManager.findItem(predicate)) {
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
