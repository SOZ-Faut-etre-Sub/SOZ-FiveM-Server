import { Once } from '@core/decorators/event';
import { Provider } from '@core/decorators/provider';
import { Inject } from '@public/core/decorators/injectable';
import { Tick, TickInterval } from '@public/core/decorators/tick';
import { uuidv4 } from '@public/core/utils';
import { ServerEvent } from '@public/shared/event';
import { getDistance, Vector3 } from '@public/shared/polyzone/vector';
import { TowRope } from '@public/shared/vehicle/tow.rope';
import { VehicleClass, VehicleSeat } from '@public/shared/vehicle/vehicle';

import { TowRopeRepository } from '../repository/tow.rope.repository';
import { RopeService } from '../rope.service';
import { TargetFactory } from '../target/target.factory';

const MAX_LENGTH_ROPE = 30;

@Provider()
export class VehicleTowProvider {
    @Inject(TargetFactory)
    public targetFactort: TargetFactory;

    @Inject(TowRopeRepository)
    public towRopeRepository: TowRopeRepository;

    @Inject(RopeService)
    public ropeService: RopeService;

    private from = 0;
    private fromOffset = 0;

    @Once()
    public onStart() {
        this.targetFactort.createForAllVehicle([
            {
                label: 'Attacher cable de remorquage',
                icon: 'c:mechanic/Attacher.png',
                canInteract: entity => entity != this.from,
                action: entity => {
                    if (!this.from) {
                        if (GetVehicleClass(entity) == VehicleClass.Helicopters) {
                            this.fromOffset = 0.0;
                        } else {
                            this.fromOffset = this.getOffset(entity);
                        }

                        const ropePosition = GetOffsetFromEntityInWorldCoords(
                            entity,
                            0.0,
                            this.fromOffset,
                            0.0
                        ) as Vector3;
                        if (
                            !this.ropeService.createNewRope(
                                ropePosition,
                                entity,
                                6,
                                MAX_LENGTH_ROPE,
                                'prop_v_hook_s',
                                'ropeFamily3'
                            )
                        ) {
                            return;
                        }
                        this.from = entity;
                    } else {
                        const towRope: TowRope = {
                            id: uuidv4(),
                            netId1: NetworkGetNetworkIdFromEntity(this.from),
                            offset1: this.fromOffset,
                            netId2: NetworkGetNetworkIdFromEntity(entity),
                            offset2: this.getOffset(entity),
                        };

                        TriggerServerEvent(ServerEvent.VEHICLE_TOW_ROPE_ADD, towRope);
                        this.ropeService.deleteRope();
                        this.from = 0;
                    }
                },
                item: 'tow_cable',
            },
            {
                label: 'Annuler le Remorquage',
                icon: 'c:mechanic/Attacher.png',
                canInteract: entity => entity == this.from,
                action: () => {
                    this.ropeService.deleteRope();
                    this.from = 0;
                },
            },
            {
                label: 'Détacher le cable de remorquage',
                icon: 'c:mechanic/Attacher.png',
                canInteract: entity => {
                    const netId = NetworkGetNetworkIdFromEntity(entity);
                    return this.towRopeRepository.get(rope => rope.netId1 == netId || rope.netId2 == netId).length > 0;
                },
                action: entity => {
                    const netId = NetworkGetNetworkIdFromEntity(entity);
                    const towRopes = this.towRopeRepository.get(rope => rope.netId1 == netId || rope.netId2 == netId);

                    for (const towRope of towRopes) {
                        TriggerServerEvent(ServerEvent.VEHICLE_TOW_ROPE_DELETE, towRope.id);
                    }
                },
            },
        ]);
    }

    private getOffset(entity: number) {
        const model = GetEntityModel(entity);
        const [min, max] = GetModelDimensions(model) as [Vector3, Vector3];

        const pedCoords = GetEntityCoords(PlayerPedId()) as Vector3;
        const frontDist = getDistance(pedCoords, GetOffsetFromEntityInWorldCoords(entity, 0, max[1], 0) as Vector3);
        const backDist = getDistance(pedCoords, GetOffsetFromEntityInWorldCoords(entity, 0, min[1], 0) as Vector3);

        if (frontDist < backDist) {
            return max[1] - 0.3;
        } else {
            return min[1] + 0.3;
        }
    }

    @Tick(TickInterval.EVERY_SECOND)
    public onTowRopeTick() {
        const ropes = this.towRopeRepository.get();
        if (!ropes) {
            return;
        }
        for (const rope of ropes) {
            if (rope.ropeClientId) {
                if (!NetworkDoesNetworkIdExist(rope.netId1) && !NetworkDoesNetworkIdExist(rope.netId2)) {
                    DeleteRope(rope.ropeClientId);
                    rope.ropeClientId = 0;
                }
                const playerPed = PlayerPedId();
                if (NetworkHasControlOfNetworkId(rope.netId1)) {
                    const veh1 = NetToVeh(rope.netId1);
                    if (GetPedInVehicleSeat(veh1, VehicleSeat.Driver) != playerPed) {
                        SetVehicleHandbrake(veh1, false);
                        SetVehicleBrake(veh1, false);
                    }
                }
                if (NetworkHasControlOfNetworkId(rope.netId2)) {
                    const veh2 = NetToVeh(rope.netId2);
                    if (GetPedInVehicleSeat(veh2, VehicleSeat.Driver) != playerPed) {
                        SetVehicleHandbrake(veh2, false);
                        SetVehicleBrake(veh2, false);
                    }
                }
            } else {
                if (!NetworkDoesNetworkIdExist(rope.netId1)) {
                    continue;
                }
                if (!NetworkDoesNetworkIdExist(rope.netId2)) {
                    continue;
                }

                const veh1 = NetToVeh(rope.netId1);

                if (!DoesEntityExist(veh1)) {
                    continue;
                }

                const veh2 = NetToVeh(rope.netId2);

                if (!DoesEntityExist(veh2)) {
                    continue;
                }

                RopeLoadTextures();

                const coords1 = GetOffsetFromEntityInWorldCoords(veh1, 0, rope.offset1, 0) as Vector3;
                const coords2 = GetOffsetFromEntityInWorldCoords(veh2, 0, rope.offset2, 0) as Vector3;
                [rope.ropeClientId] = AddRope(
                    coords1[0],
                    coords1[1],
                    coords1[2],
                    0.0,
                    0.0,
                    0.0,
                    0.0,
                    6,
                    getDistance(coords1, coords2),
                    0.5,
                    0,
                    false,
                    true,
                    true,
                    1.0,
                    false,
                    0
                );
                LoadRopeData(rope.ropeClientId, 'ropeFamily3');

                AttachEntitiesToRope(
                    rope.ropeClientId,
                    veh1,
                    veh2,
                    coords1[0],
                    coords1[1],
                    coords1[2],
                    coords2[0],
                    coords2[1],
                    coords2[2],
                    getDistance(coords1, coords2),
                    false,
                    false,
                    null,
                    null
                );
            }
        }
    }
}
