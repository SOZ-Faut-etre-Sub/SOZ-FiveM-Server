import { Once, OnceStep, OnEvent } from '@core/decorators/event';
import { emitRpc } from '@core/rpc';
import { ResourceLoader } from '@public/client/repository/resource.loader';
import { TargetFactory } from '@public/client/target/target.factory';
import { VehicleStateService } from '@public/client/vehicle/vehicle.state.service';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Tick, TickInterval } from '@public/core/decorators/tick';
import { wait, waitUntil } from '@public/core/utils';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { Control } from '@public/shared/input';
import { getDistance, Vector3 } from '@public/shared/polyzone/vector';
import { RpcServerEvent } from '@public/shared/rpc';
import { PushableVehicleClass } from '@public/shared/vehicle/vehicle';

@Provider()
export class VehiclePushProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

    private animDict = 'missfinale_c2ig_11';
    private boneToAnimation = {
        bonnet: {
            getPos: (min: Vector3) => {
                return [0.0, -min[1] + 0.4, min[2] + 1.05, 180];
            },
            anim: 'pushcar_offcliff_m',
            speed: -1.1,
        },
        door: {
            getPos: (min: Vector3, attachedVeh: number) => {
                const bonePos = GetEntityBonePosition_2(
                    attachedVeh,
                    GetEntityBoneIndexByName(attachedVeh, 'door_dside_f')
                );
                const doorOffset = GetOffsetFromEntityGivenWorldCoords(attachedVeh, bonePos[0], bonePos[1], bonePos[2]);
                return [min[0] - 0.3, doorOffset[1] - 1.1, min[2] + 1.05, 0];
            },
            anim: 'pushcar_offcliff_t',
        },
        trunk: {
            getPos: (min: Vector3) => {
                return [0.0, min[1] - 0.6, min[2] + 1.05, 0];
            },
            anim: 'pushcar_offcliff_m',
            speed: 1.1,
        },
    };

    private isWalking: boolean;
    private positionType = ['bonnet', 'door', 'trunk'];
    private attachedVeh: number;
    private attachedPosition: string;
    private isAttaching: boolean;
    private remotePush: {
        veh: number;
        pushingPed: number;
        directionPed: number;
        position: string;
        direction: number;
    } = {
        veh: null,
        pushingPed: null,
        directionPed: null,
        position: null,
        direction: 0,
    };

    @Once(OnceStep.PlayerLoaded)
    public onPlayerLoaded() {
        this.targetFactory.createForAllVehicle(
            [
                {
                    label: 'Pousser le véhicule',
                    icon: 'vehicle/car',
                    category: 'citizen',
                    canInteract: async (vehicle: number) => {
                        return !(await this.isVehicleNotPushable(vehicle));
                    },
                    action: async vehicle => {
                        if (!DoesEntityExist(vehicle)) {
                            return;
                        }

                        const ped = PlayerPedId();

                        const [min, max] = GetModelDimensions(GetEntityModel(vehicle)) as [Vector3, Vector3];
                        const position = this.getClosestPedCarPosition(ped, vehicle, min, max);

                        this.isAttaching = true;
                        this.attachedVeh = vehicle;
                        this.attachedPosition = position;
                        await wait(1);

                        const attached = await this.attachPedToVehicle(vehicle, position);
                        if (!attached || !position) {
                            this.isAttaching = false;
                            this.attachedVeh = null;
                            this.attachedPosition = null;
                            return;
                        }

                        const [x, y, z, rotZ] = this.boneToAnimation[position].getPos(min, vehicle);

                        ClearPedTasksImmediately(ped);
                        await wait(0);
                        AttachEntityToEntity(
                            ped,
                            vehicle,
                            null,
                            x,
                            y,
                            z,
                            0.0,
                            0.0,
                            rotZ,
                            false,
                            false,
                            true,
                            true,
                            0,
                            true
                        );

                        this.isWalking = false;
                        await this.runHoldAnimation(ped);
                        this.isAttaching = false;
                    },
                },
            ],
            1.5
        );
    }

    @Tick(TickInterval.EVERY_FRAME)
    public async handleTriggerVehicleActions() {
        if (!this.attachedVeh && !this.attachedPosition && !this.isAttaching) {
            return;
        }

        DisableAllControlActions(0);
        EnableControlAction(0, Control.NextCamera, true);
        EnableControlAction(0, Control.LookLeftRight, true);
        EnableControlAction(0, Control.LookUpDown, true);
        EnableControlAction(0, Control.LookUpOnly, true);
        EnableControlAction(0, Control.LookDownOnly, true);
        EnableControlAction(0, Control.LookLeftOnly, true);
        EnableControlAction(0, Control.LookRightOnly, true);

        if (this.isAttaching) {
            return;
        }

        const ped = PlayerPedId();

        if (
            IsPedDeadOrDying(ped, true) ||
            !this.attachedVeh ||
            !this.attachedPosition ||
            IsDisabledControlJustPressed(0, Control.FrontendRRight) ||
            this.isVehicleCurrentlyNotPushable(this.attachedVeh) ||
            this.attachedVeh !== GetEntityAttachedTo(ped) ||
            !this.isPlayingAnim(ped)
        ) {
            this.detachedPedAndResetAnimation(ped);
            return;
        }

        if (['bonnet', 'trunk'].includes(this.attachedPosition)) {
            if (IsDisabledControlJustPressed(0, Control.MoveUpOnly)) {
                TriggerServerEvent(
                    ServerEvent.VEHICLE_START_PUSHING,
                    NetworkGetNetworkIdFromEntity(this.attachedVeh),
                    this.attachedPosition
                );
            }

            if (IsDisabledControlJustReleased(0, Control.MoveUpOnly)) {
                TriggerServerEvent(ServerEvent.VEHICLE_STOP_PUSHING, NetworkGetNetworkIdFromEntity(this.attachedVeh));
            }
        }

        if (this.attachedPosition === 'door') {
            if (
                IsDisabledControlJustReleased(0, Control.MoveRightOnly) ||
                IsDisabledControlJustReleased(0, Control.MoveLeftOnly)
            ) {
                TriggerServerEvent(
                    ServerEvent.VEHICLE_CHANGE_DIRECTION,
                    NetworkGetNetworkIdFromEntity(this.attachedVeh),
                    0
                );
            }

            if (IsDisabledControlJustPressed(0, Control.MoveRightOnly)) {
                TriggerServerEvent(
                    ServerEvent.VEHICLE_CHANGE_DIRECTION,
                    NetworkGetNetworkIdFromEntity(this.attachedVeh),
                    -1
                );
            } else if (IsDisabledControlJustPressed(0, Control.MoveLeftOnly)) {
                TriggerServerEvent(
                    ServerEvent.VEHICLE_CHANGE_DIRECTION,
                    NetworkGetNetworkIdFromEntity(this.attachedVeh),
                    1
                );
            }
        }

        if (this.attachedPosition) {
            if (GetEntitySpeed(this.attachedVeh) && !this.isWalking) {
                this.isWalking = true;
                if (this.attachedPosition === 'door') {
                    const speedVector = GetEntitySpeedVector(this.attachedVeh, true);
                    if (speedVector[1] < 0) {
                        this.detachedPedAndResetAnimation(ped);
                    }
                }

                await this.runPushAnimation(ped);
            } else if (!GetEntitySpeed(this.attachedVeh) && this.isWalking) {
                this.isWalking = false;
                await this.runHoldAnimation(ped);
            }
        }
    }

    @Tick(TickInterval.EVERY_FRAME)
    public async handleVehicleActions() {
        if (!this.remotePush.veh) {
            return;
        }

        const ped = PlayerId();
        if (GetPlayerServerId(NetworkGetEntityOwner(this.remotePush.veh)) !== GetPlayerServerId(ped)) {
            this.resetRemotePush();
            TriggerServerEvent(
                ServerEvent.VEHICLE_UPDATE_PUSHING_OWNER,
                NetworkGetNetworkIdFromEntity(this.remotePush.veh)
            );
            return;
        }

        if (this.isVehicleCurrentlyNotPushable(this.remotePush.veh)) {
            this.resetRemotePush();
            return;
        }

        if (!IsEntityAttachedToAnyVehicle(this.remotePush.pushingPed)) {
            this.remotePush.pushingPed = null;
            this.remotePush.position = null;
        }

        if (!IsEntityAttachedToAnyVehicle(this.remotePush.directionPed)) {
            this.remotePush.directionPed = null;
            this.remotePush.direction = 0;
        }

        if (this.remotePush.position) {
            SetVehicleEngineOn(this.remotePush.veh, false, true, true);
            SetVehicleBrake(this.remotePush.veh, false);
            SetVehicleForwardSpeed(this.remotePush.veh, this.boneToAnimation[this.remotePush.position].speed);
        } else {
            SetVehicleForwardSpeed(this.remotePush.veh, 0);
        }

        SetVehicleSteeringAngle(this.remotePush.veh, 45 * this.remotePush.direction);

        if (!this.remotePush.pushingPed && !this.remotePush.directionPed) {
            this.resetRemotePush();
        }
    }

    @OnEvent(ClientEvent.VEHICLE_SYNC_PUSHING_STATE)
    public async onSyncPushingState(
        vehNetId: number,
        vehPushingState: Partial<{
            pushingPed: number;
            position: string;
            directionPed: number;
            direction: number;
        }>
    ) {
        this.remotePush.veh = NetworkGetEntityFromNetworkId(vehNetId);
        this.remotePush.pushingPed = vehPushingState.pushingPed
            ? NetworkGetEntityFromNetworkId(vehPushingState.pushingPed)
            : null;
        this.remotePush.position = vehPushingState.position || null;
        this.remotePush.directionPed = vehPushingState.directionPed
            ? NetworkGetEntityFromNetworkId(vehPushingState.directionPed)
            : null;
        this.remotePush.direction = vehPushingState.direction || null;
    }

    private async attachPedToVehicle(vehicle: number | null, position: string) {
        if (position === 'door') {
            const result = await emitRpc<boolean>(
                RpcServerEvent.VEHICLE_GRAB_STEERING_WHEEL,
                vehicle ? NetworkGetNetworkIdFromEntity(vehicle) : null
            );

            if (result) {
                this.vehicleStateService.updateVehicleState(
                    vehicle,
                    {
                        openWindows: true,
                    },
                    true,
                    true
                );
            }

            return result;
        } else {
            return await emitRpc<boolean>(
                RpcServerEvent.VEHICLE_GRAB_CAR,
                vehicle ? NetworkGetNetworkIdFromEntity(vehicle) : null
            );
        }
    }

    private resetRemotePush() {
        this.remotePush = {
            veh: null,
            pushingPed: null,
            directionPed: null,
            position: null,
            direction: 0,
        };
    }

    private async isVehicleNotPushable(vehicle: number): Promise<boolean> {
        if (!PushableVehicleClass[GetVehicleClass(vehicle)]) {
            return true;
        }

        const model = GetEntityModel(vehicle);
        if (IsThisModelAQuadbike(model)) {
            return true;
        }

        const vehicleState = await this.vehicleStateService.getServerVehicleState(vehicle);
        return this.isVehicleCurrentlyNotPushable(vehicle) || !(vehicleState.open || vehicleState.forced);
    }

    private isVehicleCurrentlyNotPushable(vehicle: number): boolean {
        return (
            IsEntityInAir(vehicle) || IsEntityUpsidedown(vehicle) || !this.isVehEmpty(vehicle) || IsEntityDead(vehicle)
        );
    }

    private isVehEmpty(vehicle: number) {
        const maxSeats = GetVehicleMaxNumberOfPassengers(vehicle);
        for (let i = maxSeats - 1; i >= -1; i--) {
            if (!IsVehicleSeatFree(vehicle, i)) {
                return false;
            }
        }

        return true;
    }

    private detachedPedAndResetAnimation(ped: number) {
        DetachEntity(ped, false, false);
        FreezeEntityPosition(ped, true);

        const position = GetEntityCoords(ped);
        const [, initZ] = GetGroundZFor_3dCoord_2(position[0], position[1], position[2], false);
        if (initZ === 0) {
            const [, currentZ] = GetGroundZFor_3dCoord_2(position[0], position[1], position[2] + 2, false);
            if (position[2] < currentZ + 1) {
                SetEntityCoords(ped, position[0], position[1], currentZ + 1, false, false, false, false);
                PlaceObjectOnGroundProperly(ped);
            }
        }
        FreezeEntityPosition(ped, false);

        ClearPedTasks(ped);
        RemoveAnimDict(this.animDict);
        EnableAllControlActions(0);
        this.attachedPosition = null;
        this.attachedVeh = null;
    }

    private async runHoldAnimation(ped: number) {
        if (!this.attachedPosition) return;

        ClearPedTasks(ped);
        await this.resourceLoader.loadAnimationDictionary(this.animDict);
        TaskPlayAnimAdvanced(
            ped,
            this.animDict,
            this.boneToAnimation[this.attachedPosition].anim,
            0,
            0,
            0,
            0,
            0,
            0,
            1.5,
            1.5,
            -1,
            2,
            1,
            0,
            0
        );
        await waitUntil(async () => this.isPlayingAnim(ped));
    }

    private async runPushAnimation(ped: number) {
        if (!this.attachedPosition) return;

        ClearPedTasks(ped);
        await this.resourceLoader.loadAnimationDictionary(this.animDict);
        TaskPlayAnim(
            ped,
            this.animDict,
            this.boneToAnimation[this.attachedPosition].anim,
            1.5,
            1.5,
            -1,
            35,
            0,
            false,
            false,
            false
        );
        await waitUntil(async () => this.isPlayingAnim(ped));
    }

    private isPlayingAnim(ped: number): boolean {
        if (!this.attachedPosition) return false;

        return IsEntityPlayingAnim(ped, this.animDict, this.boneToAnimation[this.attachedPosition].anim, 3);
    }

    private getClosestPedCarPosition(ped: number, vehicle: number, min: Vector3, max: Vector3) {
        const pedCoords = GetEntityCoords(ped) as Vector3;

        const size = max[1] - min[1];
        const distances = [
            getDistance(
                [pedCoords[0], pedCoords[1]],
                GetOffsetFromEntityInWorldCoords(vehicle, 0.0, size / 2, 0.0) as Vector3
            ),
            getDistance(
                [pedCoords[0], pedCoords[1]],
                GetEntityBonePosition_2(vehicle, GetEntityBoneIndexByName(vehicle, 'door_dside_f')) as Vector3
            ),
            getDistance(
                [pedCoords[0], pedCoords[1]],
                GetOffsetFromEntityInWorldCoords(vehicle, 0.0, -(size / 2), 0.0) as Vector3
            ),
        ];
        return this.positionType[distances.indexOf(Math.min(...distances))];
    }
}
