import { Once, OnceStep } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';
import { FfsConfig, Process } from '../../../shared/job/ffs';
import { InventoryManager } from '../../inventory/inventory.manager';
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
        const { craftZones, luxuryCraftZones, shoesCraftZones } = FfsConfig.craft.zones;
        const { craftProcesses, luxuryCraftProcesses, shoesCraftProcesses } = FfsConfig.craft.processes;

        const targets: TargetOptions[] = craftProcesses.map(craftProcess => {
            const method: (craft: Process, icon: string) => TargetOptions = this.craftProcessToTarget.bind(this);
            return method(craftProcess, 'c:/ffs/craft.png');
        });

        craftZones.forEach(zone => {
            this.targetFactory.createForBoxZone(zone.name, zone, targets);
        });

        const luxuryTargets: TargetOptions[] = luxuryCraftProcesses.map(craftProcess => {
            const method: (craft: Process, icon: string) => TargetOptions = this.craftProcessToTarget.bind(this);
            return method(craftProcess, 'c:/ffs/craft.png');
        });

        luxuryCraftZones.forEach(zone => {
            this.targetFactory.createForBoxZone(zone.name, zone, luxuryTargets);
        });

        const shoesTargets: TargetOptions[] = shoesCraftProcesses.map(craftProcess => {
            const method: (craft: Process, icon: string) => TargetOptions = this.craftProcessToTarget.bind(this);
            return method(craftProcess, 'c:/ffs/craft_shoes.png');
        });

        shoesCraftZones.forEach(zone => {
            this.targetFactory.createForBoxZone(zone.name, zone, shoesTargets);
        });
    }

    private craftProcessToTarget(craftProcess: Process, icon: string): TargetOptions {
        return {
            label: craftProcess.label,
            icon,
            color: 'ffs',
            job: 'ffs',
            blackoutGlobal: true,
            blackoutJob: 'ffs',
            canInteract: () => {
                for (const input of craftProcess.inputs) {
                    if (!this.inventoryManager.hasEnoughItem(input.id, input.amount)) {
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
