import { PoliceClueDBProvider } from '@private/server/police/police.cluedb.provider';
import { emitClientRpc } from '@public/core/rpc';
import { uuidv4 } from '@public/core/utils';
import { joaat } from '@public/shared/joaat';
import { FDO_NO_FBI } from '@public/shared/job';

import { OnEvent } from '../../core/decorators/event';
import { Exportable } from '../../core/decorators/exports';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { ServerEvent } from '../../shared/event';
import { toVector3Object, Vector4 } from '../../shared/polyzone/vector';
import { RpcClientEvent, RpcServerEvent } from '../../shared/rpc';
import { PlayerVehicleState } from '../../shared/vehicle/player.vehicle';
import { VehicleCondition, VehicleLocation, VehicleSeat, VehicleVolatileState } from '../../shared/vehicle/vehicle';
import { PrismaService } from '../database/prisma.service';
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

    @Inject(PoliceClueDBProvider)
    private policeClueDBProvider: PoliceClueDBProvider;

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

                let anotherExist = false;
                for (const others of this.vehicleStateService.getStates().values()) {
                    if (others.volatile.id == state.volatile.id) {
                        anotherExist = true;
                        break;
                    }
                }

                if (anotherExist) {
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

                this.monitor.traceEvent('vehicle_despawn', {
                    vehicle_plate: state.volatile.plate || null,
                    player_source: state.owner || null,
                    vehicle_condition: JSON.stringify(state.condition),
                    position: toVector3Object(state.position || [0, 0, 0]),
                });

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

                this.monitor.traceEvent('vehicle_condition_switch_owner', {
                    vehicle_id: state.volatile.id || null,
                    vehicle_net_id: netId,
                    vehicle_plate: state.volatile.plate,
                    player_source: owner,
                    vehicle_previous_owner_id: previousOwner?.citizenid,
                    vehicle_previous_owner_name:
                        previousOwner?.charinfo.firstname + ' ' + previousOwner?.charinfo.lastname,
                    vehicle_condition: JSON.stringify(state.condition || null),
                    position: toVector3Object(state.position || [0, 0, 0]),
                });
            }

            const attachedTo = GetEntityAttachedTo(entityId);
            if (attachedTo) {
                const attachedToNetId = NetworkGetNetworkIdFromEntity(attachedTo);
                const attachedState = this.vehicleStateService.getVehicleState(attachedToNetId);
                if (
                    attachedToNetId &&
                    attachedState.volatile.model == 'flatbed4' &&
                    !attachedState.volatile.flatbedAttachedVehicle
                ) {
                    this.vehicleStateService.updateVehicleVolatileState(attachedToNetId, {
                        flatbedAttachedVehicle: netId,
                    });
                    this.monitor.traceEvent('vehicle_fix_attached', {
                        vehicle_plate: state.volatile.plate,
                        player_source: owner,
                        vehicle_id: state.volatile.id,
                        vehicle_net_id: netId,
                        vehicle_attached_net_id: attachedToNetId,
                    });
                }
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
    public async onPlayerEnteredVehicle(source: number, vehicleNetworkId: number, seat: VehicleSeat): Promise<void> {
        this.vehicleStateService.setVehicleSeat(vehicleNetworkId, source, seat);
        const state = this.vehicleStateService.getVehicleState(vehicleNetworkId);
        if (!state.owner) {
            return;
        }
        if (seat !== VehicleSeat.Driver) {
            return;
        }
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }
        const isWearingGloves = await emitClientRpc<boolean>(RpcClientEvent.CHECK_WEARING_GLOVES, source);
        this.vehicleStateService.updateVehicleVolatileState(vehicleNetworkId, {
            fingerprint: isWearingGloves ? null : player.charinfo.firstname + ' ' + player.charinfo.lastname,
        });
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
    public async updateVehicleConditionFromOwner(
        source: number,
        vehicleNetworkId: number,
        condition: Partial<VehicleCondition>
    ): Promise<void> {
        if (condition.windowStatus && Object.values(condition.windowStatus).filter(w => w).length > 0) {
            const entityId = NetworkGetEntityFromNetworkId(vehicleNetworkId);
            const position = GetEntityCoords(entityId) as Vector4;
            position[0] += 0.6;
            const vehicleName = await emitClientRpc<string>(
                RpcClientEvent.VEHICLE_GET_NAME,
                source,
                GetEntityModel(entityId)
            );
            this.policeClueDBProvider.addClues([
                {
                    id: uuidv4(),
                    model: joaat('soz_props_glassplash'),
                    position: position,
                    noCollision: true,
                    invisible: true,
                    placeOnGround: true,
                    type: 'evidence_glass',
                    information: `Verre d'une vitre de ${vehicleName}`,
                    matrix: {
                        '0': 0.6429659724235535,
                        '1': 0,
                        '2': 0,
                        '3': 0,
                        '4': 0,
                        '5': 0.8088713884353638,
                        '6': 0,
                        '7': 0,
                        '8': 0,
                        '9': 0,
                        '10': 1.1352461576461792,
                        '11': 0,
                        '12': position[0],
                        '13': position[1],
                        '14': position[2],
                        '15': 1,
                    } as any,
                    outline: true,
                    quantity: 1,
                },
            ]);
        }
        this.vehicleStateService.updateVehicleConditionState(vehicleNetworkId, condition);
    }

    @Rpc(RpcServerEvent.VEHICLE_FDO_GET_POSTIONS)
    public getFDOVehiclePosition(): VehicleLocation[] {
        const ret: VehicleLocation[] = [];
        for (const [netId, state] of this.vehicleStateService.getStates().entries()) {
            if (!FDO_NO_FBI.includes(state.volatile.job) && !state.volatile.stolenLocator) {
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
                name: state.volatile.stolenLocator ? 'Véhicule volé' : state.volatile.label,
            });
        }

        return ret;
    }
}
