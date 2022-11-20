import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { getDistance, Vector3 } from '../../shared/polyzone/vector';

type BarrierConfig = {
    register: number;
    distance: number;
};

const BARRIER_MODELS: Record<number, BarrierConfig> = {
    [GetHashKey('prop_sec_barrier_ld_01a')]: {
        register: 40.0,
        distance: 20.0,
    },
    [GetHashKey('prop_sec_barrier_ld_02a')]: {
        register: 40.0,
        distance: 20.0,
    },
};

@Provider()
export class VehicleBarrierProvider {
    @Tick(TickInterval.EVERY_SECOND)
    private tickCheckBarrier() {
        const ped = PlayerPedId();
        const position = GetEntityCoords(ped, false) as Vector3;
        const objects = GetGamePool('CObject');

        for (const object of objects) {
            const model = GetEntityModel(object);
            const config = BARRIER_MODELS[model];

            if (!config) {
                continue;
            }

            const objectPosition = GetEntityCoords(object, false) as Vector3;
            const distance = getDistance(position, objectPosition);
            const doorIdentifier = `door_${objectPosition[0]}_${objectPosition[1]}_${objectPosition[2]}`;

            if (distance < config.register && !IsDoorRegisteredWithSystem(doorIdentifier)) {
                AddDoorToSystem(
                    doorIdentifier,
                    model,
                    objectPosition[0],
                    objectPosition[1],
                    objectPosition[2],
                    true,
                    true,
                    false
                );
                DoorSystemSetAutomaticDistance(doorIdentifier, config.distance, true, true);
            } else if (distance > config.register && IsDoorRegisteredWithSystem(doorIdentifier)) {
                RemoveDoorFromSystem(doorIdentifier);
            }

            if (distance < config.distance) {
                DoorSystemSetOpenRatio(doorIdentifier, 1.0, false, true);
            } else {
                DoorSystemSetOpenRatio(doorIdentifier, -1.0, false, true);
            }
        }
    }
}
