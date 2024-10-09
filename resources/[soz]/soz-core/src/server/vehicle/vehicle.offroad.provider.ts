import { OnEvent } from '../../core/decorators/event';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent, ServerEvent } from '../../shared/event';

@Provider()
export class VehicleOffroadProvider {
    @OnEvent(ServerEvent.VEHICLE_RESET_SURFACE_STATE_TO_OWNER)
    public async setState(source: number, vehNetId: number): Promise<void> {
        const owner = NetworkGetEntityOwner(NetworkGetEntityFromNetworkId(vehNetId));
        TriggerClientEvent(ClientEvent.VEH_FEATURE_SURFACE_RESET, owner, vehNetId);
    }
}
