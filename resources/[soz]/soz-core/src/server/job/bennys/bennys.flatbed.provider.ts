import { OnEvent } from '../../../core/decorators/event';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';

@Provider()
export class BennysFlatbedProvider {
    @OnEvent(ServerEvent.BENNYS_FLATBED_ATTACH_VEHICLE)
    public setAttachedVehicle(source: number, flatbedNetworkId: number, attachedNetworkId: number) {
        const flatbedEntity = NetworkGetEntityFromNetworkId(flatbedNetworkId);

        Entity(flatbedEntity).state.set('flatbedAttachedVehicle', attachedNetworkId, true);
    }
}
