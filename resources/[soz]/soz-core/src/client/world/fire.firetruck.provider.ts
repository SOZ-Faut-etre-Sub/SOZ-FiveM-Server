import { Inject } from '@public/core/decorators/injectable';
import { Tick, TickInterval } from '@public/core/decorators/tick';
import { ClientEvent } from '@public/shared/event';
import { Control } from '@public/shared/input';

import { Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { PlayerUpdate } from '../../core/decorators/player';
import { Provider } from '../../core/decorators/provider';
import { emitRpc } from '../../core/rpc';
import { wait } from '../../core/utils';
import { ServerEvent } from '../../shared/event/server';
import { joaat } from '../../shared/joaat';
import { PlayerData } from '../../shared/player';
import { getDistance, Vector3 } from '../../shared/polyzone/vector';
import { RpcServerEvent } from '../../shared/rpc';
import { Notifier } from '../notifier';
import { PlayerService } from '../player/player.service';
import { ResourceLoader } from '../repository/resource.loader';
import { SoundService } from '../sound.service';
import { TargetFactory } from '../target/target.factory';
import { WeaponService } from '../weapon/weapon.service';

const ROPE_LENGTH = 50.0;

@Provider()
export class FireFiretruckProvider {
    @Inject(PlayerService)
    private readonly playerService: PlayerService;

    @Inject(TargetFactory)
    private readonly targetFactory: TargetFactory;

    @Inject(Notifier)
    private readonly notifier: Notifier;

    @Inject(ResourceLoader)
    private readonly resourceLoader: ResourceLoader;

    @Inject(WeaponService)
    private weaponService: WeaponService;

    @Inject(SoundService)
    private soundService: SoundService;

    public currentFiretruckAttached: number | null = null;
    private isFiring = false;

    private playerVehicle = new Map<
        number,
        { firetruckNetId: number; vehicle?: number; ped?: number; rope?: number }
    >();
    private activeSpray = new Set<number>();

    @Once(OnceStep.Start)
    public async onStart() {
        const players = await emitRpc<Array<[number, number]>>(RpcServerEvent.FIRE_GET_LOCKED_FIRETRUCK);
        for (const [player, firetruckNetId] of players) {
            await this.onFireHoseAttachment(player, firetruckNetId);
        }
    }

    @Once(OnceStep.PlayerLoaded)
    public setupFireTruckInteractions() {
        this.targetFactory.createForModel(
            ['firetruk'],
            [
                {
                    label: 'Prendre la lance',
                    icon: 'fire/pipe',
                    category: 'society',
                    canInteract: () => !this.currentFiretruckAttached,
                    action: this.connectFiretruck.bind(this),
                },
                {
                    label: 'Remettre la lance',
                    icon: 'fire/pipe',
                    category: 'society',
                    canInteract: () => {
                        const player = this.playerService.getPlayer();

                        if (!player) {
                            return false;
                        }

                        return this.currentFiretruckAttached !== null;
                    },
                    action: this.disconnectFiretruck.bind(this),
                },
            ],
            4.0
        );
    }

    @PlayerUpdate()
    private async onPlayerUpdate(player: PlayerData) {
        if (player.metadata.isdead || player.metadata.ishandcuffed) {
            await this.disconnectFiretruck();
        }
    }

    @OnEvent(ClientEvent.BASE_ENTERED_VEHICLE)
    private async onPlayerEnteredVehicle() {
        await this.disconnectFiretruck(true);
    }

    public async connectFiretruck(vehicle: number) {
        if (this.currentFiretruckAttached !== null) {
            return;
        }

        const vehicleNetId = NetworkGetNetworkIdFromEntity(vehicle);
        const isLocked = await emitRpc<boolean>(RpcServerEvent.FIRE_LOCK_FIRETRUCK, vehicleNetId);

        if (!isLocked) {
            this.notifier.error('Tous les tuyaux sont déjà utilisés');

            return;
        }

        TaskTurnPedToFaceEntity(PlayerPedId(), vehicle, 1000);
        await wait(500);

        this.soundService.playAround('fuel/start_fuel', 5, 0.3);
        await this.weaponService.set({
            name: 'WEAPON_HOSE',
            slot: 0,
            type: 'weapon',
            amount: 1,
            metadata: {},
        });

        this.currentFiretruckAttached = vehicle;
    }

    public async disconnectFiretruck(skipTurnFace = false) {
        if (this.currentFiretruckAttached === null) {
            return;
        }

        const vehicleNetId = NetworkGetNetworkIdFromEntity(this.currentFiretruckAttached);

        if (!skipTurnFace) {
            TaskTurnPedToFaceEntity(PlayerPedId(), this.currentFiretruckAttached, 500);
            await wait(500);
        }

        this.currentFiretruckAttached = null;

        this.soundService.playAround('fuel/end_fuel', 5, 0.3);
        this.weaponService.clear();

        emitRpc(RpcServerEvent.FIRE_UNLOCK_FIRETRUCK, vehicleNetId);
    }

    @OnEvent(ClientEvent.FIRE_HOSE_ATTACH_VEHICLE)
    async onFireHoseAttachment(netId: number, firetruckNetId: number) {
        this.playerVehicle.set(netId, { firetruckNetId });

        await this.createPlayerVehicleLocalEntities(netId, firetruckNetId);
    }

    @OnEvent(ClientEvent.FIRE_HOSE_TRIGGER_SPRAY)
    async onFireSprayChange(netId: number, active: boolean) {
        if (active) {
            this.activeSpray.add(netId);
        } else {
            this.activeSpray.delete(netId);
        }
    }

    @OnEvent(ClientEvent.FIRE_HOSE_DETACH_VEHICLE)
    async onFireHoseDetachment(netId: number) {
        this.deletePlayerVehicleLocalEntities(netId);

        this.playerVehicle.delete(netId);
        this.activeSpray.delete(netId);
    }

    @Tick(TickInterval.EVERY_SECOND * 2)
    onSync() {
        this.playerVehicle.forEach(async (playerVehicle, netId) => {
            if (!this.playerIsNear(netId)) {
                this.deletePlayerVehicleLocalEntities(netId);

                const playerVehicle = this.playerVehicle.get(netId);
                this.playerVehicle.set(netId, {
                    ...playerVehicle,
                    vehicle: undefined,
                    ped: undefined,
                    rope: undefined,
                });

                return;
            }

            await this.createPlayerVehicleLocalEntities(netId, playerVehicle.firetruckNetId);
            this.attachVehicleToWeapon(netId, playerVehicle.vehicle);
        });
    }

    private playerIsNear(netId: number): boolean {
        const player = GetPlayerFromServerId(netId);
        if (player === -1) return false;

        const playerPed = GetPlayerPed(player);
        if (!playerPed) return false;

        return true;
    }

    private async createPlayerVehicleLocalEntities(netId: number, firetruckNetId: number) {
        const playerVehicle = this.playerVehicle.get(netId);
        if (playerVehicle.vehicle && playerVehicle.ped && playerVehicle.rope) return;

        const player = GetPlayerFromServerId(netId);
        if (player === -1) return;

        const playerPed = GetPlayerPed(player);
        if (!playerPed) return;

        const firetruck = NetToVeh(firetruckNetId);
        const coords = GetEntityCoords(playerPed) as Vector3;

        await this.resourceLoader.loadModel('hosefiretruk');
        const vehicle = CreateVehicle(joaat('hosefiretruk'), coords[0], coords[1], coords[2] + 1, 0.0, false, false);
        FreezeEntityPosition(vehicle, true);
        SetEntityCollision(vehicle, false, false);
        SetEntityCompletelyDisableCollision(vehicle, true, false);
        SetEntityAlpha(vehicle, 0, false);
        SetEntityCanBeDamaged(vehicle, false);

        await this.resourceLoader.loadModel('s_m_m_armoured_01');
        const ped = CreatePed(4, joaat('s_m_m_armoured_01'), coords[0], coords[1], coords[2], 0.0, false, false);
        SetEntityAlpha(ped, 0, false);
        SetEntityVisible(ped, false, false);
        SetEntityCollision(ped, false, true);
        SetEntityInvincible(ped, true);
        SetPedCanRagdoll(ped, false);
        SetBlockingOfNonTemporaryEvents(ped, true);
        TaskWarpPedIntoVehicle(ped, vehicle, -1);

        const attachPosition = GetOffsetFromEntityInWorldCoords(firetruck, 0.0, -3.5, 0.0) as Vector3;
        const initLength = getDistance(coords, attachPosition);

        RopeLoadTextures();
        const [rope] = AddRope(
            coords[0],
            coords[1],
            coords[2],
            0.0,
            0.0,
            0.0,
            ROPE_LENGTH,
            3,
            initLength,
            0.5,
            0,
            false,
            true,
            true,
            1.0,
            false,
            0
        );
        AttachRopeToEntity(rope, firetruck, attachPosition[0], attachPosition[1], attachPosition[2], true);

        try {
            ActivatePhysics(rope);
        } catch (e) {
            console.error(e);
        }

        this.playerVehicle.set(netId, { ...playerVehicle, vehicle, ped, rope });

        this.attachVehicleToWeapon(netId, vehicle);

        this.resourceLoader.unloadModel('hosefiretruk');
        this.resourceLoader.unloadModel('s_m_m_armoured_01');
    }

    private attachVehicleToWeapon(netId: number, vehicle: number) {
        const player = GetPlayerFromServerId(netId);
        if (player === -1) return;

        const playerPed = GetPlayerPed(player);
        if (!playerPed) return;

        const objID = GetCurrentPedWeaponEntityIndex(playerPed);

        if (IsEntityAttachedToEntity(vehicle, objID)) return;

        AttachEntityToEntity(vehicle, objID, -1, -2, 0.05, -1.5, -40, 0.0, -90, false, true, false, false, 1, true);
    }

    private deletePlayerVehicleLocalEntities(netId: number) {
        const playerVehicle = this.playerVehicle.get(netId);

        if (playerVehicle?.rope) {
            DeleteRope(playerVehicle?.rope);
        }

        if (playerVehicle?.vehicle && DoesEntityExist(playerVehicle.vehicle)) {
            DeleteVehicle(playerVehicle.vehicle);
        }

        if (playerVehicle?.ped && DoesEntityExist(playerVehicle.ped)) {
            DeleteEntity(playerVehicle.ped);
        }
    }

    @Tick()
    async onParticlesTick() {
        this.playerVehicle.forEach((playerVehicle, netId) => {
            if (this.activeSpray.has(netId)) {
                SetVehicleShootAtTarget(playerVehicle.ped, -1, 0, 0, 0);
            }

            if (playerVehicle.rope) {
                const player = GetPlayerFromServerId(netId);
                if (player === -1) return;

                const playerPed = GetPlayerPed(player);
                if (!playerPed) return;

                const hoseEntity = GetCurrentPedWeaponEntityIndex(playerPed);

                if (!NetworkDoesNetworkIdExist(playerVehicle.firetruckNetId)) return;

                const firetruck = NetToVeh(playerVehicle.firetruckNetId);

                const attachPosition = GetOffsetFromEntityInWorldCoords(firetruck, 0.0, -3.5, 0.0) as Vector3;
                const hosePosition = hoseEntity
                    ? (GetOffsetFromEntityInWorldCoords(hoseEntity, -0.063433, -0.00627, -0.345872) as Vector3)
                    : (GetOffsetFromEntityInWorldCoords(firetruck, 0.0, 0.0, 0.0) as Vector3);

                AttachEntitiesToRope(
                    playerVehicle.rope,
                    firetruck,
                    playerPed,
                    attachPosition[0],
                    attachPosition[1],
                    attachPosition[2],
                    hosePosition[0],
                    hosePosition[1],
                    hosePosition[2],
                    ROPE_LENGTH,
                    true,
                    true,
                    null,
                    null
                );

                StopRopeWinding(playerVehicle.rope);
                StartRopeWinding(playerVehicle.rope);
                RopeForceLength(playerVehicle.rope, Math.max(GetRopeLength(playerVehicle.rope) + 0.3, 0.5));
            }
        });
    }

    @Tick()
    async onTriggerSprayTick() {
        if (!this.currentFiretruckAttached) return;

        const playerIsFiring = IsControlPressed(0, Control.Attack);

        if (playerIsFiring && !this.isFiring) {
            TriggerServerEvent(ServerEvent.FIRE_HOSE_TRIGGER_SPRAY, true);
            this.isFiring = true;
        }

        if (!playerIsFiring && this.isFiring) {
            TriggerServerEvent(ServerEvent.FIRE_HOSE_TRIGGER_SPRAY, false);
            this.isFiring = false;
        }
    }

    @Tick()
    async onDisableFireTruckTick() {
        const player = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(player, false);
        const model = GetEntityModel(vehicle);

        if (model !== joaat('firetruk')) return;

        DisableControlAction(0, Control.VehicleAim, true);
        DisableControlAction(0, Control.VehicleAttack, true);
        DisableControlAction(0, Control.VehicleAttack2, true);
    }
}
