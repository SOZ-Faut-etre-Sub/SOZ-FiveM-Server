import { FDO_NO_FBI } from '@public/shared/job';

import { OnEvent } from '../../core/decorators/event';
import { Exportable } from '../../core/decorators/exports';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { ServerEvent } from '../../shared/event';
import { toVector3Object, Vector4 } from '../../shared/polyzone/vector';
import { RpcServerEvent } from '../../shared/rpc';
import { PlayerVehicleState } from '../../shared/vehicle/player.vehicle';
import { VehicleCondition, VehicleLocation, VehicleSeat, VehicleVolatileState } from '../../shared/vehicle/vehicle';
import { PrismaService } from '../database/prisma.service';
import { JobService } from '../job.service';
import { Monitor } from '../monitor/monitor';
import { PlayerService } from '../player/player.service';
import { VehicleStateService } from './vehicle.state.service';

@Provider()
export class VehicleStateProvider {
    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(Monitor)
    private monitor: Monitor;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(JobService)
    private jobService: JobService;

    @Tick(TickInterval.EVERY_SECOND, 'vehicle:state:check')
    public async checkVehicleState() {
        // Basically we keep tracks of all vehicles spawned and ask the current owner to update the condition of the vehicle
        const states = this.vehicleStateService.getStates().keys();

        for (const netId of states) {
            const state = this.vehicleStateService.getVehicleState(netId);
            const entityId = NetworkGetEntityFromNetworkId(netId);

            // entity has despawn
            if (!entityId || !DoesEntityExist(entityId)) {
                this.vehicleStateService.unregister(netId);

                if (!state.volatile.isPlayerVehicle || !state.volatile.id) {
                    continue;
                }

                await this.prismaService.playerVehicle.updateMany({
                    where: {
                        id: state.volatile.id,
                        state: PlayerVehicleState.Out,
                    },
                    data: {
                        state: PlayerVehicleState.InSoftPound,
                        garage: 'pound',
                        parkingtime: Math.round(Date.now() / 1000),
                    },
                });

                this.monitor.publish(
                    'vehicle_despawn',
                    {
                        vehicle_id: state.volatile.id || null,
                        vehicle_net_id: netId,
                        vehicle_plate: state.volatile.plate || null,
                    },
                    {
                        owner: state.owner || null,
                        condition: state.condition || null,
                        position: toVector3Object(state.position || [0, 0, 0]),
                    }
                );

                continue;
            }

            // check if the vehicle is owned by the same player
            const owner = NetworkGetEntityOwner(entityId);
            this.vehicleStateService.updateVehiclePosition(netId, [
                ...GetEntityCoords(entityId),
                GetEntityHeading(entityId),
            ] as Vector4);

            if (owner !== state.owner) {
                this.vehicleStateService.switchOwner(netId, owner);
                const previousOwner = this.playerService.getPlayer(state.owner);

                this.monitor.publish(
                    'vehicle_condition_switch_owner',
                    {
                        vehicle_id: state.volatile.id || null,
                        vehicle_net_id: netId,
                        vehicle_plate: state.volatile.plate,
                        player_source: owner,
                    },
                    {
                        previous_owner: previousOwner?.citizenid,
                        previous_owner_name: previousOwner?.charinfo.firstname + ' ' + previousOwner?.charinfo.lastname,
                        previous_owner_source: state.owner,
                        owner: state.owner || null,
                        condition: state.condition || null,
                        position: toVector3Object(state.position || [0, 0, 0]),
                    }
                );
            }
        }
    }

    @Exportable('GetVehicleState')
    @Rpc(RpcServerEvent.VEHICLE_GET_STATE)
    public getVehicleState(source: number, vehicleNetworkId: number): VehicleVolatileState {
        return this.vehicleStateService.getVehicleState(vehicleNetworkId).volatile;
    }

    @Rpc(RpcServerEvent.VEHICLE_GET_CONDITION)
    public getVehicleCondition(source: number, vehicleNetworkId: number): VehicleCondition {
        return this.vehicleStateService.getVehicleState(vehicleNetworkId).condition;
    }

    @OnEvent(ServerEvent.BASE_ENTERED_VEHICLE)
    @OnEvent(ServerEvent.BASE_CHANGE_VEHICLE_SEAT)
    public onPlayerEnteredVehicle(source: number, vehicleNetworkId: number, seat: VehicleSeat): void {
        this.vehicleStateService.setVehicleSeat(vehicleNetworkId, source, seat);
    }

    @OnEvent(ServerEvent.BASE_LEFT_VEHICLE)
    public onPlayerLeftVehicle(source: number, vehicleNetworkId: number): void {
        this.vehicleStateService.removeVehicleSeat(vehicleNetworkId, source);
    }

    @OnEvent(ServerEvent.VEHICLE_UPDATE_STATE)
    public updateVehicleState(
        source: number,
        vehicleNetworkId: number,
        state: Partial<VehicleVolatileState>,
        disableSync = true,
        forwardToEveryone = false
    ): void {
        this.vehicleStateService.updateVehicleVolatileState(
            vehicleNetworkId,
            state,
            disableSync ? source : null,
            forwardToEveryone
        );
    }

    @OnEvent(ServerEvent.VEHICLE_UPDATE_CONDITION)
    public updateVehicleCondition(
        source: number,
        vehicleNetworkId: number,
        condition: Partial<VehicleCondition>
    ): void {
        this.vehicleStateService.updateVehicleCondition(vehicleNetworkId, condition);
    }

    @OnEvent(ServerEvent.VEHICLE_UPDATE_CONDITION_FROM_OWNER)
    public updateVehicleConditionFromOwner(
        source: number,
        vehicleNetworkId: number,
        condition: Partial<VehicleCondition>
    ): void {
        this.vehicleStateService.updateVehicleConditionState(vehicleNetworkId, condition);
    }

    @Rpc(RpcServerEvent.VEHICLE_FDO_GET_POSTIONS)
    public getFDOVehiclePosition(): VehicleLocation[] {
        const ret: VehicleLocation[] = [];
        for (const [netId, state] of this.vehicleStateService.getStates().entries()) {
            if (!FDO_NO_FBI.includes(state.volatile.job)) {
                continue;
            }

            if (state.volatile.locatorEndJam > Date.now()) {
                continue;
            }

            ret.push({
                netId: netId,
                job: state.volatile.job,
                plate: state.volatile.plate,
                model: state.volatile.model,
                position: [state.position[0], state.position[1], state.position[2]],
                name: state.volatile.label,
            });
        }

        return ret;
    }
}
