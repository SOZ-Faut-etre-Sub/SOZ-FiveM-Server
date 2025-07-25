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
import { Vector3 } from '../../shared/polyzone/vector';
import { RpcServerEvent } from '../../shared/rpc';
import { Notifier } from '../notifier';
import { PlayerService } from '../player/player.service';
import { ResourceLoader } from '../repository/resource.loader';
import { RopeService } from '../rope.service';
import { TargetFactory } from '../target/target.factory';
import { WeaponService } from '../weapon/weapon.service';

@Provider()
export class FireFiretruckProvider {
    @Inject(PlayerService)
    private readonly playerService: PlayerService;

    @Inject(TargetFactory)
    private readonly targetFactory: TargetFactory;

    @Inject(RopeService)
    private readonly ropeService: RopeService;

    @Inject(Notifier)
    private readonly notifier: Notifier;

    @Inject(ResourceLoader)
    private readonly resourceLoader: ResourceLoader;

    @Inject(WeaponService)
    private weaponService: WeaponService;

    public currentFiretruckAttached: number | null = null;
    private isFiring = false;

    private playerVehicle = new Map<number, { vehicle: number; ped: number }>();
    private activeSpray = new Set<number>();

    @Once(OnceStep.Start)
    public async onStart() {
        const players = await emitRpc<number[]>(RpcServerEvent.FIRE_GET_LOCKED_FIRETRUCK);
        for (const player of players) {
            this.onFireHoseAttachment(player);
        }
    }

    @Once(OnceStep.PlayerLoaded)
    public setupFireTruckInteractions() {
        this.targetFactory.createForModel(
            ['firetruk'],
            [
                {
                    icon: 'fuel/pistolet',
                    label: 'Connecter le tuyau',
                    category: 'society',
                    canInteract: () => !this.currentFiretruckAttached,
                    action: this.connectFiretruck.bind(this),
                },
                {
                    icon: 'fuel/pistolet',
                    label: 'Déconnecter le tuyau',
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
    public async onPlayerUpdate(player: PlayerData) {
        if (player.metadata.isdead || player.metadata.ishandcuffed) {
            await this.disconnectFiretruck();
        }
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

        const attachPosition = GetOffsetFromEntityInWorldCoords(vehicle, 0.0, -3.5, 0.0) as Vector3;
        const nozzle = await this.ropeService.createNewRope(
            attachPosition,
            vehicle,
            3,
            25.0,
            undefined,
            undefined,
            'BONETAG_R_FINGER2'
        );
        if (!nozzle) {
            return;
        }

        await this.weaponService.set({
            name: 'WEAPON_HOSE',
            slot: 0,
            type: 'weapon',
            amount: 1,
            metadata: {},
        });

        this.currentFiretruckAttached = vehicle;
    }

    public async disconnectFiretruck() {
        if (this.currentFiretruckAttached === null) {
            return;
        }

        const vehicleNetId = NetworkGetNetworkIdFromEntity(this.currentFiretruckAttached);

        TaskTurnPedToFaceEntity(PlayerPedId(), this.currentFiretruckAttached, 500);
        await wait(500);

        this.ropeService.deleteRope();
        this.currentFiretruckAttached = null;

        this.weaponService.clear();

        emitRpc(RpcServerEvent.FIRE_UNLOCK_FIRETRUCK, vehicleNetId);
    }

    @OnEvent(ClientEvent.FIRE_HOSE_ATTACH_VEHICLE)
    async onFireHoseAttachment(netId: number) {
        const player = GetPlayerFromServerId(netId);
        if (player === -1) return;

        const playerPed = GetPlayerPed(player);
        if (!playerPed) return;

        const coords = GetEntityCoords(playerPed);

        await this.resourceLoader.loadModel('hosefiretruk');
        const vehicle = CreateVehicle(joaat('hosefiretruk'), coords[0], coords[1], coords[2] + 1, 0.0, false, false);
        FreezeEntityPosition(vehicle, true);
        SetEntityCollision(vehicle, false, false);
        SetEntityAlpha(vehicle, 0, false);

        await this.resourceLoader.loadModel('s_m_m_armoured_01');
        const ped = CreatePed(4, joaat('s_m_m_armoured_01'), coords[0], coords[1], coords[2], 0.0, false, false);
        SetEntityAlpha(ped, 0, false);
        SetEntityVisible(ped, false, false);
        SetEntityCollision(ped, false, true);
        TaskWarpPedIntoVehicle(ped, vehicle, -1);

        this.playerVehicle.set(netId, { vehicle, ped });

        this.attachVehicleToWeapon(netId, vehicle);

        this.resourceLoader.unloadModel('hosefiretruk');
        this.resourceLoader.unloadModel('s_m_m_armoured_01');
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
        this.playerVehicle.delete(netId);
        this.activeSpray.delete(netId);
    }

    @Tick(TickInterval.EVERY_SECOND * 2)
    async onSync() {
        this.playerVehicle.forEach((playerVehicle, netId) => {
            this.attachVehicleToWeapon(netId, playerVehicle.vehicle);
        });
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

    @Tick()
    async onParticlesTick() {
        this.playerVehicle.forEach((playerVehicle, netId) => {
            if (this.activeSpray.has(netId)) {
                SetVehicleShootAtTarget(playerVehicle.ped, -1, 0, 0, 0);
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
}
