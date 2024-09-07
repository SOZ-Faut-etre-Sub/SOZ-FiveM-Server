import { Once, OnceStep } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';
import { JobType } from '../../../shared/job';
import { StonkBagType, StonkConfig } from '../../../shared/job/stonk';
import { TargetOption } from '../../../shared/target';
import { InventoryManager } from '../../inventory/inventory.manager';
import { ItemService } from '../../item/item.service';
import { PlayerService } from '../../player/player.service';
import { TargetFactory } from '../../target/target.factory';

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
    public setupStonkResell() {
        StonkConfig.resell.zones.forEach(zone => {
            this.targetFactory.createForBoxZone(zone.name, zone, [this.resellZoneToTarget(zone.bagAccepted)]);
        });
    }

    private resellZoneToTarget(item: StonkBagType): TargetOption {
        const acceptedItem = this.itemService.getItem(item);

        return {
            label: `Déposer ${acceptedItem.label}`,
            icon: 'c:stonk/vendre',
            color: JobType.CashTransfer,
            job: JobType.CashTransfer,
            blackoutGlobal: true,
            blackoutJob: JobType.CashTransfer,
            item: item,
            category: 'society',
            action: () => {
                TriggerServerEvent(ServerEvent.STONK_RESELL, item);
            },
        };
    }
}
