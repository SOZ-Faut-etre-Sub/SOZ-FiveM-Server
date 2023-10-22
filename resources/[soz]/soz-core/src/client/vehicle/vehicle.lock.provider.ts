import { getRandomItem } from '@public/shared/random';

import { Command } from '../../core/decorators/command';
import { Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { emitRpc } from '../../core/rpc';
import { uuidv4, wait, waitUntil } from '../../core/utils';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { PlayerData } from '../../shared/player';
import { BoxZone } from '../../shared/polyzone/box.zone';
import { getDistance, Vector3 } from '../../shared/polyzone/vector';
import { RpcServerEvent } from '../../shared/rpc';
import {
    LockPickAlertMessage,
    VehicleClass,
    VehicleLockStatus,
    VehicleSeat,
    VehicleVolatileState,
} from '../../shared/vehicle/vehicle';
import { AnimationService } from '../animation/animation.service';
import { Notifier } from '../notifier';
import { PlayerService } from '../player/player.service';
import { SoundService } from '../sound.service';
import { VehicleSeatbeltProvider } from './vehicle.seatbelt.provider';
import { VehicleService } from './vehicle.service';
import { VehicleStateService } from './vehicle.state.service';

const DOOR_INDEX_CONFIG = {
    seat_dside_f: -1,
    seat_pside_f: 0,
    seat_dside_r: 1,
    seat_pside_r: 2,
    door_dside_f: -1,
    door_pside_f: 0,
    door_dside_r: 1,
    door_pside_r: 2,
    wheel_lr: [3, 5],
    wheel_rr: [4, 6],
};

const VEHICLE_TRUNK_TYPES = {
    [GetHashKey('tanker')]: 'tanker',
    [GetHashKey('tanker2')]: 'tanker',
    [GetHashKey('trailerlogs')]: 'trailerlogs',
    [GetHashKey('brickade')]: 'brickade',
    [GetHashKey('brickade1')]: 'brickade',
    [GetHashKey('trash')]: 'trash',
    [GetHashKey('tiptruck2')]: 'tiptruck',
};

type TrunkOpened = {
    vehicle: number;
    vehicleNetworkId: number;
    zone: BoxZone;
};

@Provider()
export class VehicleLockProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(VehicleService)
    private vehicleService: VehicleService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(SoundService)
    private soundService: SoundService;

    @Inject(VehicleSeatbeltProvider)
    private seatbeltProvider: VehicleSeatbeltProvider;

    @Inject(AnimationService)
    private animationService: AnimationService;

    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    private vehicleTrunkOpened: TrunkOpened | null = null;

    private vehicleOpened: Set<number> = new Set();

    @Once(OnceStep.PlayerLoaded)
    public async setupVehicleOpened() {
        const vehicleOpened = await emitRpc<number[]>(RpcServerEvent.VEHICLE_GET_OPENED);

        this.vehicleOpened = new Set(vehicleOpened);
    }

    @Once(OnceStep.Start)
    private async initLockStateSelector() {
        this.vehicleStateService.addVehicleStateSelector(
            [state => state.open, state => state.forced],
            this.onVehicleOpenChange.bind(this)
        );
    }

    @OnEvent(ClientEvent.VEHICLE_SET_OPEN_LIST)
    private async onVehicleOpenList(vehicles: number[]) {
        this.vehicleOpened = new Set(vehicles);
    }

    @OnEvent(ClientEvent.BASE_ENTERED_VEHICLE)
    @OnEvent(ClientEvent.BASE_LEFT_VEHICLE)
    public async onEnterLeaveVehicle() {
        this.vehicleService.updateVehiculeClothConfig();
    }

    @Tick(TickInterval.EVERY_FRAME)
    private async checkVehicleLeave() {
        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);

        if (this.seatbeltProvider.isSeatbeltOnForPlayer()) {
            DisableControlAction(2, 75, true);
            return;
        }

        const wasPlayerDriving = GetPedInVehicleSeat(vehicle, VehicleSeat.Driver) === ped;

        if (!wasPlayerDriving) {
            return;
        }

        if (vehicle && IsControlPressed(2, 75) && !IsEntityDead(ped)) {
            SetVehicleEngineOn(vehicle, true, true, false);
            await wait(150);

            if (vehicle && IsControlPressed(2, 75) && !IsEntityDead(ped)) {
                SetVehicleEngineOn(vehicle, true, true, false);
                TaskLeaveVehicle(ped, vehicle, 0);
            } else {
                SetVehicleEngineOn(vehicle, false, true, false);
            }
        }
    }

    private async onVehicleOpenChange(vehicleId: number, open: boolean, forced: boolean) {
        if (open || forced) {
            SetVehicleDoorsLocked(vehicleId, VehicleLockStatus.Unlocked);
        } else {
            SetVehicleDoorsLocked(vehicleId, VehicleLockStatus.Locked);

            if (this.vehicleTrunkOpened && this.vehicleTrunkOpened.vehicle === vehicleId) {
                this.vehicleTrunkOpened = null;
                TriggerEvent('inventory:client:closeInventory');
            }
        }

        if (NetworkHasControlOfEntity(vehicleId)) {
            SetVehicleLights(vehicleId, 2);
            await wait(250);
            SetVehicleLights(vehicleId, 1);
            await wait(200);
            SetVehicleLights(vehicleId, 0);
        }
    }

    @Tick(TickInterval.EVERY_FRAME)
    private async checkPlayerCanEnterVehicle() {
        const player = this.playerService.getPlayer();

        if (!player) {
            return;
        }

        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsTryingToEnter(ped);

        if (!vehicle) {
            return;
        }

        const vehicleNetworkId = NetworkGetNetworkIdFromEntity(vehicle);

        if (!vehicleNetworkId) {
            return;
        }

        if (!player.metadata.godmode && !this.vehicleOpened.has(vehicleNetworkId)) {
            SetVehicleDoorsLocked(vehicle, VehicleLockStatus.Locked);

            const vehicleClass = GetVehicleClass(vehicle);

            if (vehicleClass === VehicleClass.Motorcycles || vehicleClass === VehicleClass.Cycles) {
                ClearPedTasksImmediately(ped);
            }

            // avoid recalling this function until the player stops trying to enter the vehicle
            await waitUntil(async () => {
                return !GetVehiclePedIsTryingToEnter(ped);
            });

            return;
        }

        const maxSeats = GetVehicleMaxNumberOfPassengers(vehicle);
        const playerPosition = GetEntityCoords(ped, false) as Vector3;
        const minDistance = 2.0;
        let closestDoor = null;

        for (const [door, seatIndex] of Object.entries(DOOR_INDEX_CONFIG)) {
            let useSeat = false;
            let availableSeatIndex = 0;

            if (typeof seatIndex === 'number') {
                availableSeatIndex = seatIndex;
                const ped = GetPedInVehicleSeat(vehicle, seatIndex);
                useSeat = ped == 0 || !IsPedAPlayer(ped);
            } else {
                availableSeatIndex = maxSeats;

                for (const seat of seatIndex) {
                    if (!useSeat && GetPedInVehicleSeat(vehicle, seat) == 0) {
                        useSeat = true;
                        availableSeatIndex = seat;
                    }
                }
            }

            if (availableSeatIndex > maxSeats - 1) {
                useSeat = false;
            }

            if (useSeat) {
                const doorPosition = GetWorldPositionOfEntityBone(
                    vehicle,
                    GetEntityBoneIndexByName(vehicle, door)
                ) as Vector3;
                const distance = getDistance(playerPosition, doorPosition);

                if (closestDoor === null) {
                    if (distance <= minDistance) {
                        closestDoor = {
                            door,
                            distance,
                            doorPosition,
                            seatIndex: availableSeatIndex,
                        };
                    }
                } else {
                    if (distance < closestDoor.distance) {
                        closestDoor = {
                            door,
                            distance,
                            doorPosition,
                            seatIndex: availableSeatIndex,
                        };
                    }
                }
            }
        }

        const start = GetGameTimer();

        if (closestDoor !== null) {
            TaskEnterVehicle(ped, vehicle, -1, closestDoor.seatIndex, 1.0, 1, 0);

            await wait(200);

            let enteringVehicle = GetVehiclePedIsEntering(ped) || GetVehiclePedIsTryingToEnter(ped);
            let time = GetGameTimer() - start;

            while (enteringVehicle !== 0 && time < 10000) {
                await wait(200);
                time = GetGameTimer() - start;

                enteringVehicle = GetVehiclePedIsEntering(ped) || GetVehiclePedIsTryingToEnter(ped);
            }

            if (enteringVehicle !== 0) {
                ClearPedTasksImmediately(ped);
            }
        }
    }

    @Command('soz_vehicle_toggle_vehicle_trunk', {
        description: 'Ouvrir le coffre du véhicule',
        keys: [
            {
                mapper: 'keyboard',
                key: 'G',
            },
        ],
    })
    async openVehicleTrunk() {
        const ped = PlayerPedId();

        const player = this.playerService.getPlayer();

        if (!player) {
            return;
        }

        if (player.metadata.isdead || player.metadata.ishandcuffed || IsPedInAnyVehicle(ped, false)) {
            return;
        }

        const vehicle = this.vehicleService.getClosestVehicle({
            maxDistance: 15.0,
        });

        if (!vehicle || !IsEntityAVehicle(vehicle)) {
            this.notifier.notify('Aucun véhicule à proximité.', 'error');

            return;
        }

        const model = GetEntityModel(vehicle);
        const [min, max] = GetModelDimensions(model) as [Vector3, Vector3];
        const position = GetEntityCoords(vehicle, false) as Vector3;

        const center = [
            position[0] + (max[0] + min[0]) / 2,
            position[1] + (max[1] + min[1]) / 2,
            position[2] + min[2],
        ] as Vector3;

        const vehicleTrunkZone = new BoxZone(center, max[1] - min[1] + 3.0, max[0] - min[0] + 3.0, {
            heading: GetEntityHeading(vehicle),
            minZ: center[2],
            maxZ: center[2] + 6.0,
        });

        const pedPosition = GetEntityCoords(ped, false) as Vector3;

        if (!vehicleTrunkZone.isPointInside(pedPosition)) {
            this.notifier.notify('Vous devez être à côté du véhicule.', 'error');

            return;
        }

        const vehicleState = await this.vehicleStateService.getServerVehicleState(vehicle);

        if (!vehicleState.forced && !player.metadata.godmode && !vehicleState.open) {
            this.notifier.notify('Véhicule verrouillé.', 'error');

            return;
        }

        if (this.playerService.getState().isInventoryBusy) {
            this.notifier.notify("Inventaire en cours d'utilisation.", 'warning');

            return;
        }

        const plate = vehicleState.plate || GetVehicleNumberPlateText(vehicle);
        const vehicleModel = GetEntityModel(vehicle);
        const vehicleClass = GetVehicleClass(vehicle);
        const trunkType = VEHICLE_TRUNK_TYPES[vehicleModel] || 'trunk';
        const vehicleNetworkId = NetworkGetNetworkIdFromEntity(vehicle);

        TriggerServerEvent('inventory:server:openInventory', trunkType, plate, {
            model: vehicleModel,
            class: vehicleClass,
            entity: vehicleNetworkId,
        });
        TriggerServerEvent(ServerEvent.VEHICLE_SET_TRUNK_STATE, vehicleNetworkId, true);

        this.vehicleTrunkOpened = {
            vehicle,
            vehicleNetworkId,
            zone: vehicleTrunkZone,
        };
    }

    @Tick(TickInterval.EVERY_SECOND)
    async checkKeepVehicleTrunkOpen() {
        if (!this.vehicleTrunkOpened) {
            return;
        }

        if (DoesEntityExist(this.vehicleTrunkOpened.vehicle)) {
            const pedPosition = GetEntityCoords(PlayerPedId(), false) as Vector3;
            const vehiclePosition = GetEntityCoords(this.vehicleTrunkOpened.vehicle, false) as Vector3;

            if (
                this.vehicleTrunkOpened.zone.isPointInside(pedPosition) &&
                this.vehicleTrunkOpened.zone.isPointInside(vehiclePosition)
            ) {
                return;
            }
        }

        this.closeVehicleTrunk();
        TriggerEvent('inventory:client:closeInventory');
        this.notifier.notify('Le coffre est trop loin.', 'warning');
    }

    @OnEvent(ClientEvent.VEHICLE_CLOSE_TRUNK)
    closeVehicleTrunk() {
        if (this.vehicleTrunkOpened) {
            TriggerServerEvent(ServerEvent.VEHICLE_SET_TRUNK_STATE, this.vehicleTrunkOpened.vehicleNetworkId, false);
        }

        this.vehicleTrunkOpened = null;
    }

    @OnEvent(ClientEvent.VEHICLE_SET_TRUNK_STATE)
    async setVehicleTrunkState(vehicleNetworkId: number, state: boolean) {
        if (!NetworkDoesNetworkIdExist(vehicleNetworkId)) {
            return;
        }

        const entityId = NetworkGetEntityFromNetworkId(vehicleNetworkId);

        if (!DoesEntityExist(entityId)) {
            return;
        }

        if (state) {
            SetVehicleDoorOpen(entityId, 5, false, false);
        } else {
            SetVehicleDoorShut(entityId, 5, false);
        }
    }

    @Command('soz_vehicle_toggle_vehicle_lock', {
        description: 'Ouvrir/Fermer le véhicule',
        keys: [
            {
                mapper: 'keyboard',
                key: 'U',
            },
        ],
    })
    async toggleVehicleLock() {
        const player = this.playerService.getPlayer();

        if (!player) {
            return;
        }

        if (exports['soz-phone'].isPhoneVisible()) {
            return;
        }

        if (player.metadata.ishandcuffed || player.metadata.isdead) {
            return;
        }
        if (this.playerService.getState().isInventoryBusy) {
            this.notifier.notify('Une action est déjà en cours !', 'warning');

            return;
        }

        const vehicle = this.vehicleService.getClosestVehicle();

        if (!vehicle) {
            this.notifier.notify('Aucun vehicule à proximité.', 'error');

            return;
        }

        if (GetEntitySpeed(vehicle) * 3.6 > 75) {
            this.notifier.notify('Vous allez trop vite pour faire ça.', 'error');

            return;
        }

        const state = await this.vehicleStateService.getVehicleState(vehicle);
        const hasVehicleKey = await this.hasVehicleKey(player, state);

        if (!hasVehicleKey) {
            this.notifier.notify("Vous n'avez pas les clés..", 'error');

            return;
        }

        const isInVehicle = GetVehiclePedIsIn(PlayerPedId(), false) === vehicle;

        if (!isInVehicle) {
            await this.animationService.playAnimation(
                {
                    base: {
                        dictionary: 'anim@mp_player_intmenu@key_fob@',
                        name: 'fob_click',
                        blendInSpeed: 3.0,
                        blendOutSpeed: 3.0,
                        duration: 750,
                        options: {
                            repeat: true,
                            onlyUpperBody: true,
                            enablePlayerControl: true,
                        },
                    },
                },
                {
                    resetWeapon: false,
                }
            );
        }

        const vehicleNetworkId = NetworkGetNetworkIdFromEntity(vehicle);

        if (state.open) {
            this.soundService.playAround('vehicle/lock', 5, 0.1);
            TriggerServerEvent(ServerEvent.VEHICLE_SET_OPEN, vehicleNetworkId, false);
            SetVehicleDoorsLocked(vehicle, VehicleLockStatus.Locked);
        } else {
            this.soundService.playAround('vehicle/unlock', 5, 0.1);
            TriggerServerEvent(ServerEvent.VEHICLE_SET_OPEN, vehicleNetworkId, true);
            SetVehicleDoorsLocked(vehicle, VehicleLockStatus.Unlocked);
        }
    }

    private async hasVehicleKey(player: PlayerData, state: VehicleVolatileState) {
        // Case for temporary care, only owner can unlock / lock vehicle
        if (state.id === null) {
            return state.owner === player.citizenid;
        }

        if (state.owner === player.citizenid) {
            return true;
        }

        return await emitRpc<boolean>(RpcServerEvent.VEHICLE_HAS_KEY, state.plate);
    }

    @OnEvent(ClientEvent.VEHICLE_LOCKPICK)
    public onLockpick(type: string) {
        const coords = GetEntityCoords(PlayerPedId());
        const zoneID = GetNameOfZone(coords[0], coords[1], coords[2]);
        if (zoneID == 'ISHEIST') {
            return;
        }
        const zone = GetLabelText(zoneID);

        const messages = [...LockPickAlertMessage.all, ...LockPickAlertMessage[type]];

        const message = getRandomItem(messages);

        TriggerServerEvent('phone:sendSocietyMessage', 'phone:sendSocietyMessage:' + uuidv4(), {
            anonymous: true,
            number: '555-POLICE',
            message: message.replace('${0}', zone),
            htmlMessage: message.replace('${0}', `<span {class}>${zone}</span>`),
            position: true,
            info: { type: 'auto-theft' },
            overrideIdentifier: 'System',
        });
    }
}
