import { Notifier } from '@public/server/notifier';
import { SoundService } from '@public/server/sound/sound.service';

import { OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ClientEvent, ServerEvent } from '../../../shared/event';
import { VehicleStateService } from '../../vehicle/vehicle.state.service';

@Provider()
export class BennysFlatbedProvider {
    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    @Inject(SoundService)
    private soundService: SoundService;

    @Inject(Notifier)
    private notifier: Notifier;

    @OnEvent(ServerEvent.BENNYS_FLATBED_ATTACH_VEHICLE)
    public setAttachedVehicle(source: number, flatbedNetworkId: number, attachedNetworkId: number) {
        this.vehicleStateService.updateVehicleVolatileState(
            flatbedNetworkId,
            {
                flatbedAttachedVehicle: attachedNetworkId,
            },
            null,
            true
        );
    }

    @OnEvent(ServerEvent.BENNYS_FLATBED_DETACH_VEHICLE)
    public detachVehicle(source: number, flatbedNetworkId: number) {
        const flatbedState = this.vehicleStateService.getVehicleState(flatbedNetworkId);

        if (!flatbedState.volatile.flatbedAttachedVehicle) {
            return;
        }

        this.vehicleStateService.updateVehicleVolatileState(
            flatbedNetworkId,
            {
                flatbedAttachedVehicle: null,
            },
            null,
            true
        );

        this.soundService.playAround(source, 'seatbelt/unbuckle', 5, 0.2);
        this.notifier.notify(source, 'Le véhicule a été détaché du flatbed.');
    }

    @OnEvent(ServerEvent.BENNYS_FLATBED_ASK_DETACH_VEHICLE)
    public askDetachVehicle(source: number, flatbedNetworkId: number) {
        const flatbedState = this.vehicleStateService.getVehicleState(flatbedNetworkId);

        if (!flatbedState.volatile.flatbedAttachedVehicle) {
            return;
        }

        const attachedVehicle = NetworkGetEntityFromNetworkId(flatbedState.volatile.flatbedAttachedVehicle);

        if (!attachedVehicle) {
            this.vehicleStateService.updateVehicleVolatileState(
                flatbedNetworkId,
                {
                    flatbedAttachedVehicle: null,
                },
                null,
                true
            );
            return;
        }

        const owner = NetworkGetEntityOwner(attachedVehicle);

        TriggerClientEvent(
            ClientEvent.BENNYS_FLATBED_DETACH_VEHICLE,
            owner,
            flatbedNetworkId,
            flatbedState.volatile.flatbedAttachedVehicle
        );
    }
}
