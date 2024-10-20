import { InputService } from '@public/client/nui/input.service';
import { OnNuiEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { emitRpc } from '@public/core/rpc';
import { NuiEvent } from '@public/shared/event';
import { Err, Ok } from '@public/shared/result';
import { RpcServerEvent } from '@public/shared/rpc';
import { VehicleOrder, VehicleOrderMode } from '@public/shared/vehicle/vehicle';

@Provider()
export class VehicleOrderProvider {
    @Inject(InputService)
    private inputService: InputService;

    @OnNuiEvent(NuiEvent.VehicleCancelOrder)
    public async onCancelOrder({ uuid, mode }: { uuid: string; mode: VehicleOrderMode }) {
        const value = await this.inputService.askConfirm(
            'Voulez-vous vraiment annuler cette commande ? Pas de remboursement'
        );

        if (value) {
            return emitRpc<string>(RpcServerEvent.VEHICLE_ORDER_CANCEL, uuid, mode);
        }
        return this.onGetOrders(mode);
    }

    @OnNuiEvent(NuiEvent.VehicleGetOrders)
    public async onGetOrders(mode: VehicleOrderMode) {
        return emitRpc<VehicleOrder[]>(RpcServerEvent.VEHICLE_ORDER_GET, mode);
    }

    @OnNuiEvent(NuiEvent.VehicleOrder)
    public async onOrder({ model, mode }: { model: string; mode: VehicleOrderMode }) {
        let phone = null;
        if (mode == VehicleOrderMode.Crimi) {
            phone = await this.inputService.askInput(
                {
                    title: 'Numéro de téléphone du futur propriétaire',
                },
                (input: string) => {
                    if (input == null) {
                        return Ok(input);
                    }

                    if (input.trim() === '') {
                        return Err('Veuillez entrer une valeur');
                    }

                    if (!input.match('555-[0-9]{4}')) {
                        return Err('Numéro invalide');
                    }

                    return Ok(input);
                }
            );

            if (!phone) {
                return emitRpc<VehicleOrder[]>(RpcServerEvent.VEHICLE_ORDER_GET, mode);
            }
        }

        return emitRpc<string>(RpcServerEvent.VEHICLE_ORDER_DO, model, mode, phone);
    }
}
