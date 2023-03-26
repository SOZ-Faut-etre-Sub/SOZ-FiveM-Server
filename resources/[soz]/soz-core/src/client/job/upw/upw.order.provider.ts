import { InputService } from '@public/client/nui/input.service';
import { NuiDispatch } from '@public/client/nui/nui.dispatch';
import { NuiMenu } from '@public/client/nui/nui.menu';
import { PlayerService } from '@public/client/player/player.service';
import { Qbcore } from '@public/client/qbcore';
import { TargetFactory } from '@public/client/target/target.factory';
import { Once, OnceStep, OnNuiEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { emitRpc } from '@public/core/rpc';
import { NuiEvent } from '@public/shared/event';
import { JobPermission } from '@public/shared/job';
import { UpwConfig, UpwOrder } from '@public/shared/job/upw';
import { MenuType } from '@public/shared/nui/menu';
import { Ok } from '@public/shared/result';
import { RpcEvent } from '@public/shared/rpc';
import { Vehicle } from '@public/shared/vehicle/vehicle';

@Provider()
export class UpwOrderProvider {
    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    @Inject(InputService)
    private inputService: InputService;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Qbcore)
    private QBcore: Qbcore;

    @OnNuiEvent(NuiEvent.UpwCancelOrder)
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
            await emitRpc<string>(RpcEvent.UPW_CANCEL_ORDER, uuid);
            await this.onGetOrders();
        }
    }

    @OnNuiEvent(NuiEvent.UpwGetOrders)
    public async onGetOrders() {
        const orders = await emitRpc<UpwOrder[]>(RpcEvent.UPW_GET_ORDERS);
        console.log(orders);
        this.nuiDispatch.dispatch('upw_order_menu', 'SetOrders', orders);
    }

    public async openOrderMenu() {
        const vehicles = await emitRpc<Vehicle[]>(RpcEvent.UPW_GET_CATALOG);
        console.log(vehicles);
        this.nuiMenu.openMenu(MenuType.UpwOrderMenu, { catalog: vehicles });
    }

    @OnNuiEvent(NuiEvent.UpwOrder)
    public async onOrder(model: string) {
        await emitRpc<string>(RpcEvent.UPW_ORDER_VEHICLE, model);
        await this.onGetOrders();
    }

    @Once(OnceStep.Start)
    public async onStart() {
        const orderZone = UpwConfig.Order.zone;
        this.targetFactory.createForBoxZone(orderZone.name, orderZone, [
            {
                label: 'Commander une voiture éléctrique',
                icon: 'c:/mechanic/order.png',
                color: 'upw',
                job: 'upw',
                blackoutJob: 'upw',
                blackoutGlobal: true,
                canInteract: () => {
                    return this.playerService.isOnDuty() && this.QBcore.hasJobPermission('upw', JobPermission.UpwOrder);
                },
                action: this.openOrderMenu.bind(this),
            },
        ]);
    }
}
