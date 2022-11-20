import { Once, OnceStep } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';
import { InventoryItem } from '../../../shared/item';
import { BaunCraftProcess, baunCraftProcesses, baunCraftZones } from '../../../shared/job/baun';
import { InventoryManager } from '../../inventory/inventory.manager';
import { ItemService } from '../../item/item.service';
import { PlayerService } from '../../player/player.service';
import { TargetFactory, TargetOptions } from '../../target/target.factory';

@Provider()
export class BaunCraftProvider {
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
        const targets: TargetOptions[] = baunCraftProcesses.map(craftProcess => {
            return this.craftProcessToTarget(craftProcess, 'c:/baun/craft.png');
        });

        baunCraftZones.forEach(zone => {
            this.targetFactory.createForBoxZone(zone.name, zone, targets);
        });
    }

    private craftProcessToTarget(craftProcess: BaunCraftProcess, icon: string): TargetOptions {
        const outputItem = this.itemService.getItem(craftProcess.output.id);
        return {
            icon,
            label: 'Confectionner: ' + outputItem.label,
            job: 'baun',
            color: 'baun',
            blackoutGlobal: true,
            blackoutJob: 'ffs',
            canInteract: () => {
                for (const input of craftProcess.inputs) {
                    const predicate = (item: InventoryItem) => {
                        return (
                            item.name === input.id && item.amount >= input.amount && !this.itemService.isExpired(item)
                        );
                    };
                    if (!this.inventoryManager.findItem(predicate)) {
                        return false;
                    }
                }
                return this.playerService.isOnDuty();
            },
            action: () => {
                TriggerServerEvent(ServerEvent.BAUN_CRAFT, craftProcess);
            },
        };
    }
}
