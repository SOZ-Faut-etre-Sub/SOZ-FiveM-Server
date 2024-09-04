import { Once, OnEvent } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { AnimationService } from '@public/client/animation/animation.service';
import { Notifier } from '@public/client/notifier';
import { PlayerService } from '@public/client/player/player.service';
import { ProgressService } from '@public/client/progress.service';
import { TargetFactory } from '@public/client/target/target.factory';
import { VehicleStateService } from '@public/client/vehicle/vehicle.state.service';
import { WeaponDrawingProvider } from '@public/client/weapon/weapon.drawing.provider';
import { Tick, TickInterval } from '@public/core/decorators/tick';
import { emitRpcCache } from '@public/core/rpc';
import { wait } from '@public/core/utils';
import { Animation } from '@public/shared/animation';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { Control } from '@public/shared/input';
import { deathAnim, StretcherFoldedModel, StretcherModel } from '@public/shared/job/lsmc';
import { Vector3 } from '@public/shared/polyzone/vector';
import { RpcServerEvent } from '@public/shared/rpc';

import { PolicePlayerProvider } from '../police/police.player.provider';

const ambulance = GetHashKey('ambulance2');

const defaultAnim: Animation = {
    base: {
        dictionary: 'anim@gangops@morgue@table@',
        name: 'body_search',
        blendInSpeed: 8.0,
        blendOutSpeed: 8.0,
        options: {
            repeat: true,
        },
    },
};

@Provider()
export class LSMCStretcherProvider {
    @Inject(TargetFactory)
    public targetFactory: TargetFactory;

    @Inject(AnimationService)
    public animationService: AnimationService;

    @Inject(Notifier)
    public notifier: Notifier;

    @Inject(WeaponDrawingProvider)
    public weaponDrawingProvider: WeaponDrawingProvider;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(PolicePlayerProvider)
    private policePlayerProvider: PolicePlayerProvider;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    private pushed = 0;
    private pushedTP = 0;
    private laydown = false;

    @Once()
    public onStart() {
        this.targetFactory.createForModel(
            [StretcherModel, StretcherFoldedModel],
            [
                {
                    canInteract: entity =>
                        (!IsEntityAttached(entity) || GetEntityAttachedTo(entity) == 0) &&
                        NetworkGetEntityIsNetworked(entity) &&
                        this.getPlayerUsingStretcher(entity) == null,
                    label: 'Ramasser',
                    icon: 'c:baun/createCocktailBox.png',
                    category: 'citizen',
                    action: async entity => {
                        const { completed } = await this.progressService.progress(
                            'stretcher_retrieve',
                            'Vous repliez le brancard...',
                            3000,
                            {
                                dictionary: 'mp_common',
                                name: 'givetake2_a',
                                blendInSpeed: 8.0,
                                blendOutSpeed: 8.0,
                                options: {
                                    enablePlayerControl: true,
                                    onlyUpperBody: true,
                                },
                            },
                            {
                                useAnimationService: true,
                            }
                        );

                        if (!completed) {
                            return;
                        }

                        TriggerServerEvent(ServerEvent.LSMC_STRETCHER_RETRIEVE, NetworkGetNetworkIdFromEntity(entity));
                    },
                },
            ]
        );
        this.targetFactory.createForModel(StretcherModel, [
            {
                label: 'Pousser',
                icon: 'c:ems/push.png',
                category: 'citizen',
                canInteract: entity =>
                    this.pushed == 0 &&
                    (!IsEntityAttached(entity) || GetEntityAttachedTo(entity) == 0) &&
                    NetworkGetEntityIsNetworked(entity) &&
                    !this.playerService.isPushing(),
                action: async entity => {
                    for (let i = 0; i < 10; i++) {
                        if (NetworkHasControlOfEntity(entity)) {
                            break;
                        }
                        NetworkRequestControlOfEntity(entity);
                        await wait(i * 100);
                    }
                    if (!NetworkHasControlOfEntity(entity)) {
                        this.notifier.notify('Fail to control entity');
                        return;
                    }

                    this.pushStretcher(entity);
                },
            },
            {
                label: "S'allonger",
                icon: 'fas fa-bed',
                category: 'citizen',
                canInteract: entity =>
                    this.getPlayerUsingStretcher(entity) == null &&
                    NetworkGetEntityIsNetworked(entity) &&
                    !this.playerService.isPushing(),
                action: async entity => {
                    if (this.getPlayerUsingStretcher(entity) == null) {
                        this.onStretcher(entity);
                    }
                },
            },
            {
                label: 'Installer sur le brancard',
                icon: 'c:ems/stretcher.png',
                category: 'citizen',
                canInteract: entity => {
                    const state = this.playerService.getState();
                    return (
                        state.isEscorting &&
                        this.getPlayerUsingStretcher(entity) == null &&
                        NetworkGetEntityIsNetworked(entity)
                    );
                },
                action: async entity => {
                    if (this.getPlayerUsingStretcher(entity) == null) {
                        TriggerServerEvent(ServerEvent.LSMC_STRETCHER_PUT_ON, NetworkGetNetworkIdFromEntity(entity));
                    }
                },
            },
            {
                label: 'Faire descendre',
                icon: 'c:police/escorter.png',
                category: 'citizen',
                canInteract: entity =>
                    this.getPlayerUsingStretcher(entity) != null && NetworkGetEntityIsNetworked(entity),
                action: async entity => {
                    const serverPlayer = this.getPlayerUsingStretcher(entity);
                    TriggerServerEvent(ServerEvent.ESCORT_PLAYER, serverPlayer);
                },
            },
        ]);

        this.targetFactory.createForAllVehicle(
            [
                {
                    label: 'Installer le brancard',
                    icon: 'c:ems/stretcher.png',
                    category: 'citizen',
                    canInteract: async entity => {
                        if (!this.pushed) {
                            return false;
                        }

                        const model = GetEntityModel(entity);
                        if (model != ambulance) {
                            return false;
                        }

                        if (IsEntityDead(entity)) {
                            return false;
                        }

                        if (GetConvertibleRoofState(entity) != 2) {
                            return false;
                        }

                        const attached = await emitRpcCache<number>(
                            RpcServerEvent.LSMC_STRETCHER_AMBULANCE_STATUS,
                            NetworkGetNetworkIdFromEntity(entity)
                        );
                        if (attached) {
                            return false;
                        }

                        return true;
                    },
                    action: async entity => {
                        const vehState = await this.vehicleStateService.getServerVehicleState(entity);
                        if (vehState.ambulanceAttachedStretcher) {
                            return;
                        }

                        const serverPlayer = this.getPlayerUsingStretcher(this.pushed);
                        this.animationService.stop();

                        const coords = GetEntityCoords(this.pushed);

                        const id = CreateObject(
                            StretcherFoldedModel,
                            coords[0],
                            coords[1],
                            coords[2],
                            true,
                            true,
                            false
                        );
                        FreezeEntityPosition(id, true);
                        SetEntityCollision(id, false, true);
                        SetEntityCompletelyDisableCollision(id, true, true);
                        SetNetworkIdCanMigrate(ObjToNet(id), true);
                        SetEntityAsMissionEntity(id, true, false);

                        AttachEntityToEntity(
                            id,
                            entity,
                            GetEntityBoneIndexByName(entity, 'forks'),
                            0.0,
                            -1.0,
                            -0.2,
                            0.0,
                            0.0,
                            90.0,
                            false,
                            false,
                            false,
                            false,
                            0,
                            true
                        );

                        TriggerServerEvent(
                            ServerEvent.LSMC_STRETCHER_ON_AMBULANCE,
                            serverPlayer,
                            ObjToNet(this.pushed),
                            VehToNet(entity),
                            ObjToNet(id)
                        );
                    },
                },
                {
                    label: 'Récupérer le brancard',
                    icon: 'c:ems/stretcher.png',
                    category: 'citizen',
                    canInteract: async entity => {
                        if (this.pushed) {
                            return false;
                        }

                        const model = GetEntityModel(entity);
                        if (model != ambulance) {
                            return false;
                        }

                        if (this.playerService.isPushing()) {
                            return false;
                        }

                        if (GetConvertibleRoofState(entity) != 2) {
                            return false;
                        }

                        const attached = await emitRpcCache<number>(
                            RpcServerEvent.LSMC_STRETCHER_AMBULANCE_STATUS,
                            NetworkGetNetworkIdFromEntity(entity)
                        );
                        if (!attached) {
                            return false;
                        }

                        return true;
                    },
                    action: async entity => {
                        const vehState = await this.vehicleStateService.getServerVehicleState(entity);
                        if (!vehState.ambulanceAttachedStretcher) {
                            return;
                        }

                        const folded = NetToObj(vehState.ambulanceAttachedStretcher);
                        const serverPlayer = this.getPlayerUsingStretcher(folded);

                        const id = await this.onUseStretcher();
                        const vehNetId = VehToNet(entity);
                        const newStretcherNetId = ObjToNet(id);

                        TriggerServerEvent(
                            ServerEvent.LSMC_STRETCHER_RETRIEVE_AMBULANCE,
                            serverPlayer,
                            vehState.ambulanceAttachedStretcher,
                            vehNetId,
                            newStretcherNetId
                        );

                        this.pushStretcher(id);
                    },
                },
            ],
            3
        );
    }

    private async pushStretcher(entity: number) {
        const playerPed = PlayerPedId();

        FreezeEntityPosition(entity, false);
        PlaceObjectOnGroundProperly(entity);
        SetEntityHeading(entity, GetEntityHeading(playerPed) + 90);
        await wait(100);
        SetEntityCollision(entity, false, true);
        SetEntityCompletelyDisableCollision(entity, true, true);
        AttachEntityToEntity(
            entity,
            playerPed,
            GetPedBoneIndex(playerPed, 17916),
            0.0,
            1.5,
            -1.0,
            0.0,
            0.0,
            90.0,
            false,
            false,
            false,
            false,
            0,
            true
        );

        this.pushed = entity;
        this.playerService.setPushing(true);

        await this.animationService.playAnimation({
            base: {
                dictionary: 'anim@heists@box_carry@',
                name: 'idle',
                options: {
                    repeat: true,
                    onlyUpperBody: true,
                    enablePlayerControl: true,
                },
            },
        });

        this.pushed = 0;
        this.playerService.setPushing(false);

        for (let i = 0; i < 10; i++) {
            if (NetworkHasControlOfEntity(entity)) {
                break;
            }
            NetworkRequestControlOfEntity(entity);
            await wait(i * 100);
        }

        DetachEntity(entity, false, false);
        FreezeEntityPosition(entity, true);
        SetEntityCompletelyDisableCollision(entity, false, true);
        SetEntityCollision(entity, true, true);
        PlaceObjectOnGroundProperly(entity);
    }

    private getPlayerUsingStretcher(entity: number) {
        const playerPedId = PlayerPedId();
        const coords = GetEntityCoords(playerPedId) as Vector3;
        const playersInrange = this.playerService.getPlayersAround(coords, 4.0, true, player => {
            const ped = GetPlayerPed(player);
            return IsEntityAttached(ped) && GetEntityAttachedTo(ped) == entity;
        });

        return playersInrange.length > 0 ? playersInrange[0] : null;
    }

    @OnEvent(ClientEvent.LSMC_STRETCHER_USE)
    public async onUseStretcher() {
        const playerPed = PlayerPedId();
        const coords = GetOffsetFromEntityInWorldCoords(playerPed, 0.0, 1.5, 0.0);
        const id = CreateObject(StretcherModel, coords[0], coords[1], coords[2], true, true, false);
        SetEntityHeading(id, GetEntityHeading(playerPed) + 90.0);
        PlaceObjectOnGroundProperly(id);
        SetNetworkIdCanMigrate(ObjToNet(id), true);
        SetEntityAsMissionEntity(id, true, false);
        await wait(100);
        FreezeEntityPosition(id, true);

        return id;
    }

    @OnEvent(ClientEvent.LSMC_STRETCHER_PUT_ON)
    public async onPutOnStretcher(netId: number) {
        await this.policePlayerProvider.removeEscorted();

        for (let i = 0; i < 10; i++) {
            if (NetworkDoesNetworkIdExist(netId)) {
                break;
            }
            await wait(i * 100);
        }
        const entity = NetworkGetEntityFromNetworkId(netId);

        this.onStretcher(entity);
    }

    private async onStretcher(entity: number) {
        const playerPed = PlayerPedId();
        const player = this.playerService.getPlayer();
        this.weaponDrawingProvider.undrawWeapons();
        SetEntityCompletelyDisableCollision(playerPed, true, false);

        const zoffset = GetEntityModel(entity) == StretcherModel ? 2.1 : 1.5;
        AttachEntityToEntity(
            playerPed,
            entity,
            0,
            0.2,
            0.0,
            zoffset,
            0.0,
            0.0,
            90.0,
            false,
            false,
            false,
            false,
            0,
            true
        );
        this.laydown = true;

        await this.animationService.playAnimation(player.metadata.isdead ? deathAnim : defaultAnim);

        if (IsEntityAttached(playerPed) && GetEntityAttachedTo(playerPed) == entity) {
            DetachEntity(playerPed, false, false);
        }

        SetEntityCompletelyDisableCollision(playerPed, false, true);
        SetEntityCollision(playerPed, true, true);
        this.laydown = false;
        this.weaponDrawingProvider.drawWeapons();
        ClearPedTasks(playerPed);
    }

    public async startTp() {
        if (!this.pushed) {
            return;
        }

        this.pushedTP = this.pushed;
        DetachEntity(this.pushed, false, false);
        await wait(200);
    }

    public async endTp() {
        if (!this.pushedTP) {
            return;
        }

        for (let i = 0; i < 10; i++) {
            if (NetworkHasControlOfEntity(this.pushedTP)) {
                break;
            }
            NetworkRequestControlOfEntity(this.pushedTP);
            await wait(i * 100);
        }
        if (!NetworkHasControlOfEntity(this.pushedTP)) {
            this.notifier.notify('Fail to control entity');
            return;
        }

        const playerPed = PlayerPedId();
        const coords = GetOffsetFromEntityInWorldCoords(playerPed, 0.0, 1.5, -1.0);
        SetEntityCoordsNoOffset(this.pushedTP, coords[0], coords[1], coords[2], false, false, false);
        await wait(200);

        this.pushStretcher(this.pushedTP);

        this.pushedTP = 0;
    }

    @Tick(TickInterval.EVERY_FRAME)
    async onStretcherFrame(): Promise<void> {
        const playerPed = PlayerPedId();
        if (IsControlPressed(0, 101)) {
            const veh = GetVehiclePedIsIn(playerPed, false);
            const model = GetEntityModel(veh);
            if (model == ambulance) {
                const state = GetConvertibleRoofState(veh);
                if (state == 1) {
                    SetVehicleDoorOpen(veh, 2, false, false);
                    SetVehicleDoorOpen(veh, 3, false, false);
                } else if (state == 3) {
                    if (IsVehicleDoorFullyOpen(veh, 2)) {
                        SetVehicleDoorShut(veh, 2, false);
                    }
                    if (IsVehicleDoorFullyOpen(veh, 3)) {
                        SetVehicleDoorShut(veh, 3, false);
                    }
                }
            }
        }

        if (!this.laydown) {
            return;
        }

        DisableControlAction(0, Control.Sprint, true);
        DisableControlAction(0, Control.Jump, true);
        DisableControlAction(0, Control.Attack, true);
        DisableControlAction(0, Control.Aim, true);
        DisableControlAction(2, Control.Duck, true);
        DisableControlAction(0, Control.SelectWeapon, true);
        DisableControlAction(0, Control.Cover, true);
        DisableControlAction(0, Control.Reload, true);
        DisableControlAction(0, Control.Detonate, true);
        DisableControlAction(0, Control.VehicleAccelerate, true);
        DisableControlAction(0, Control.VehicleBrake, true);
        DisableControlAction(0, Control.VehicleFlyThrottleUp, true);
        DisableControlAction(0, Control.VehicleFlyThrottleDown, true);
        DisableControlAction(0, Control.MeleeAttackLight, true);
        DisableControlAction(0, Control.MeleeAttackHeavy, true);
        DisableControlAction(0, Control.MeleeAttackAlternate, true);
        DisableControlAction(0, Control.MeleeBlock, true);
        DisableControlAction(0, Control.Attack2, true);
        DisableControlAction(0, Control.MeleeAttack1, true);
        DisableControlAction(0, Control.MeleeAttack2, true);
        DisableControlAction(0, Control.Enter, true);
    }
}
