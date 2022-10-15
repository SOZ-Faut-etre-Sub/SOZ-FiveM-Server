import { Once, OnceStep, OnNuiEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { emitRpc } from '../../../core/rpc';
import { NuiEvent } from '../../../shared/event';
import { JobPermission } from '../../../shared/job';
import { BennysConfig, BennysOrder } from '../../../shared/job/bennys';
import { MenuType } from '../../../shared/nui/menu';
import { Err, Ok } from '../../../shared/result';
import { RpcEvent } from '../../../shared/rpc';
import { InputService } from '../../nui/input.service';
import { NuiDispatch } from '../../nui/nui.dispatch';
import { NuiMenu } from '../../nui/nui.menu';
import { PlayerService } from '../../player/player.service';
import { Qbcore } from '../../qbcore';
import { TargetFactory } from '../../target/target.factory';

@Provider()
export class BennysOrderProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(Qbcore)
    private QBCore: Qbcore;

    @Inject(InputService)
    private inputService: InputService;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    @OnNuiEvent(NuiEvent.BennysOrder)
    public async onOrder() {
        const model = await this.inputService.askInput(
            {
                title: 'Modèle du véhicule à commander:',
                defaultValue: '',
                maxCharacters: 32,
            },
            value => {
                if (!value || IsModelInCdimage(value) || IsModelValid(value)) {
                    return Ok(true);
                }
                return Err('Le modèle du véhicule est invalide.');
            }
        );
        if (!model) {
            return;
        }

        await emitRpc<string>(RpcEvent.BENNYS_ORDER_VEHICLE, model);
        await this.onGetOrders();
    }

    @OnNuiEvent(NuiEvent.BennysGetOrders)
    public async onGetOrders() {
        const orders = await emitRpc<BennysOrder[]>(RpcEvent.BENNYS_GET_ORDERS);
        this.nuiDispatch.dispatch('bennys_order_menu', 'SetOrders', orders);
    }

    @OnNuiEvent(NuiEvent.BennysCancelOrder)
    public async onCancelOrder(uuid: string) {
        const value = await this.inputService.askInput(
            {
                title: 'Voulez-vous vraiment annuler cette commande ? (Tapez "oui" pour confirmer)',
                defaultValue: '',
                maxCharacters: 3,
            },
            () => {
                return Ok(true);
            }
        );

        if (value && value.toLowerCase() === 'oui') {
            await emitRpc<string>(RpcEvent.BENNYS_CANCEL_ORDER, uuid);
            await this.onGetOrders();
        }
    }

    @Once(OnceStep.Start)
    public async onStart() {
        const orderZone = BennysConfig.Order.zone;
        this.targetFactory.createForBoxZone(orderZone.name, orderZone, [
            {
                label: 'Commander une voiture',
                icon: 'c:/mechanic/order.png',
                color: 'bennys',
                job: 'bennys',
                blackoutJob: 'bennys',
                blackoutGlobal: true,
                canInteract: () => {
                    return (
                        this.playerService.isOnDuty() &&
                        this.QBCore.hasJobPermission('bennys', JobPermission.Bennys_Order)
                    );
                },
                action: async () => {
                    this.nuiMenu.openMenu(MenuType.BennysOrderMenu);
                },
            },
        ]);
    }
}
