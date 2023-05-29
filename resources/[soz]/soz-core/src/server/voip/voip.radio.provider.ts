import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { RadioChannel, RadioChannelType } from '../../shared/voip';
import { VehicleStateService } from '../vehicle/vehicle.state.service';

@Provider()
export class VoipRadioProvider {
    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    @OnEvent(ServerEvent.VOIP_RADIO_VEHICLE_ENABLE)
    public onEnableRadio(source: number, vehicleNetworkId: number, enable: boolean) {
        const entityId = NetworkGetEntityFromNetworkId(vehicleNetworkId);

        if (!entityId) {
            return;
        }

        const pilot = GetPedInVehicleSeat(entityId, -1);
        const copilot = GetPedInVehicleSeat(entityId, 0);

        const pilotServerId = NetworkGetEntityOwner(pilot);
        const copilotServerId = NetworkGetEntityOwner(copilot);

        if (pilot && pilotServerId) {
            TriggerClientEvent(ClientEvent.VOIP_RADIO_VEHICLE_ENABLE, pilotServerId, vehicleNetworkId, enable);
        }

        if (copilot && copilotServerId) {
            TriggerClientEvent(ClientEvent.VOIP_RADIO_VEHICLE_ENABLE, copilotServerId, vehicleNetworkId, enable);
        }

        this.vehicleStateService.updateVehicleVolatileState(vehicleNetworkId, { radioEnabled: enable });
    }

    @OnEvent(ServerEvent.VOIP_RADIO_VEHICLE_UPDATE)
    public onUpdateRadio(
        source: number,
        vehicleNetworkId: number,
        type: RadioChannelType,
        channel: Partial<RadioChannel>
    ) {
        const entityId = NetworkGetEntityFromNetworkId(vehicleNetworkId);

        if (!entityId) {
            return;
        }

        const pilot = GetPedInVehicleSeat(entityId, -1);
        const copilot = GetPedInVehicleSeat(entityId, 0);

        const pilotServerId = NetworkGetEntityOwner(pilot);
        const copilotServerId = NetworkGetEntityOwner(copilot);

        if (pilot && pilotServerId) {
            TriggerClientEvent(ClientEvent.VOIP_RADIO_VEHICLE_UPDATE, pilotServerId, vehicleNetworkId, type, channel);
        }

        if (copilot && copilotServerId) {
            TriggerClientEvent(ClientEvent.VOIP_RADIO_VEHICLE_UPDATE, copilotServerId, vehicleNetworkId, type, channel);
        }

        const state = this.vehicleStateService.getVehicleState(vehicleNetworkId);

        if (type === RadioChannelType.Primary) {
            this.vehicleStateService.updateVehicleVolatileState(vehicleNetworkId, {
                primaryRadio: {
                    ...state.volatile.primaryRadio,
                    ...channel,
                },
            });
        } else {
            this.vehicleStateService.updateVehicleVolatileState(vehicleNetworkId, {
                secondaryRadio: {
                    ...state.volatile.secondaryRadio,
                    ...channel,
                },
            });
        }
    }
}
