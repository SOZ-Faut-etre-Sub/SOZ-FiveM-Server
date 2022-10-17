import { On, Once, OnceStep } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ClientEvent, ServerEvent } from '../../../shared/event';
import { JobType } from '../../../shared/job';
import { StonkConfig } from '../../../shared/job/stonk';
import { NamedZone } from '../../../shared/polyzone/box.zone';
import { InventoryManager } from '../../item/inventory.manager';
import { ItemService } from '../../item/item.service';
import { Notifier } from '../../notifier';
import { PlayerService } from '../../player/player.service';
import { TargetFactory, TargetOptions } from '../../target/target.factory';

@Provider()
export class StonkDeliveryProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(Notifier)
    private notifier: Notifier;

    private currentDeliverLocation: NamedZone | null = null;

    @Once(OnceStep.PlayerLoaded)
    onPlayerLoaded() {
        this.targetFactory.createForPed({
            model: 'mp_m_securoguard_01',
            coords: { w: 126.97, x: 914.39, y: -1269.36, z: 24.57 },
            invincible: true,
            freeze: true,
            spawnNow: true,
            blockevents: true,
            scenario: 'WORLD_HUMAN_CLIPBOARD_FACILITY',
            flag: 49,
            target: {
                distance: 2.5,
                options: [
                    {
                        label: 'Récupérer un conteneur sécurisé',
                        job: JobType.CashTransfer,
                        color: JobType.CashTransfer,
                        blackoutGlobal: true,
                        blackoutJob: JobType.CashTransfer,
                        canInteract: () => {
                            const player = this.playerService.getPlayer();
                            if (!player) {
                                return false;
                            }

                            return player.job.onduty;
                        },
                        action: () => {
                            TriggerServerEvent(ServerEvent.STONK_DELIVERY_TAKE);
                        },
                    },
                ],
            },
        });
    }

    @On(ClientEvent.STONK_DELIVER_LOCATION)
    async onLocation(location: NamedZone) {
        this.currentDeliverLocation = location;
        this.targetFactory.createForBoxZone(location.name, location, [this.deliverAction()]);
        SetNewWaypoint(location.center[0], location.center[1]);
        this.notifier.notify('Les coordonnées de la livraison ont été ajoutées sur votre GPS');
    }

    private deliverAction(): TargetOptions {
        const acceptedItem = this.itemService.getItem(StonkConfig.delivery.item);

        return {
            label: `Déposer ${acceptedItem.label}`,
            icon: 'c:stonk/vendre.png',
            color: JobType.CashTransfer,
            job: JobType.CashTransfer,
            blackoutGlobal: true,
            blackoutJob: JobType.CashTransfer,
            canInteract: () => {
                return (
                    this.playerService.isOnDuty() && this.inventoryManager.hasEnoughItem(StonkConfig.delivery.item, 1)
                );
            },
            action: () => {
                TriggerServerEvent(ServerEvent.STONK_DELIVERY_END, this.currentDeliverLocation);
                this.targetFactory.removeBoxZone(this.currentDeliverLocation.name);
                this.currentDeliverLocation = null;
            },
        };
    }
}
