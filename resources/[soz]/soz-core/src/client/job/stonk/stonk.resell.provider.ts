import { Once, OnceStep } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';
import { JobType } from '../../../shared/job';
import { StonkBagType, StonkConfig } from '../../../shared/job/stonk';
import { TargetOption } from '../../../shared/target';
import { ItemService } from '../../item/item.service';
import { TargetFactory } from '../../target/target.factory';

@Provider()
export class StonkResellProvider {
    @Inject(ItemService)
    private itemService: ItemService;

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
            icon: 'stonk/vendre',
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
