import { Once, OnceStep } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';
import { JobType } from '../../../shared/job';
import { StonkBagType, StonkConfig } from '../../../shared/job/stonk';
import { InventoryManager } from '../../inventory/inventory.manager';
import { ItemService } from '../../item/item.service';
import { PlayerService } from '../../player/player.service';
import { TargetFactory, TargetOptions } from '../../target/target.factory';

@Provider()
export class StonkResellProvider {
    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Once(OnceStep.PlayerLoaded)
    public onPlayerLoaded() {
        StonkConfig.resell.zones.forEach(zone => {
            this.targetFactory.createForBoxZone(zone.name, zone, [this.resellZoneToTarget(zone.bagAccepted)]);
        });
    }

    private resellZoneToTarget(item: StonkBagType): TargetOptions {
        const acceptedItem = this.itemService.getItem(item);

        return {
            label: `Déposer ${acceptedItem.label}`,
            icon: 'c:stonk/vendre.png',
            color: JobType.CashTransfer,
            job: JobType.CashTransfer,
            blackoutGlobal: true,
            blackoutJob: JobType.CashTransfer,
            canInteract: () => {
                return this.playerService.isOnDuty() && this.inventoryManager.hasEnoughItem(item, 1);
            },
            action: () => {
                TriggerServerEvent(ServerEvent.STONK_RESELL, item);
            },
        };
    }
}
