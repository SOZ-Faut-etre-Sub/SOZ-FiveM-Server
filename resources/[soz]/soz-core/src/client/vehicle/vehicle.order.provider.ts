import { InputService } from '@public/client/nui/input.service';
import { OnNuiEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { emitRpc } from '@public/core/rpc';
import { NuiEvent } from '@public/shared/event';
import { RpcServerEvent } from '@public/shared/rpc';
import { VehicleOrder } from '@public/shared/vehicle/vehicle';

@Provider()
export class VehicleOrderProvider {
    @Inject(InputService)
    private inputService: InputService;

    @OnNuiEvent(NuiEvent.VehicleCancelOrder)
    public async onCancelOrder(uuid: string) {
        const value = await this.inputService.askConfirm('Voulez-vous vraiment annuler cette commande ?');

        if (value) {
            return emitRpc<string>(RpcServerEvent.VEHICLE_ORDER_CANCEL, uuid);
        }
        return this.onGetOrders();
    }

    @OnNuiEvent(NuiEvent.VehicleGetOrders)
    public async onGetOrders() {
        return emitRpc<VehicleOrder[]>(RpcServerEvent.VEHICLE_ORDER_GET);
    }

    @OnNuiEvent(NuiEvent.VehicleOrder)
    public async onOrder(model: string) {
        return emitRpc<string>(RpcServerEvent.VEHICLE_ORDER_DO, model);
    }
}
