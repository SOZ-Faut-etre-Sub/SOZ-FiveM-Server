import { Command } from '../../core/decorators/command';
import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { emitRpc } from '../../core/rpc';
import { wait } from '../../core/utils';
import { ClientEvent } from '../../shared/event';
import { PlayerData } from '../../shared/player';
import { getDistance, Vector3 } from '../../shared/polyzone/vector';
import { RpcEvent } from '../../shared/rpc';
import { VehicleEntityState } from '../../shared/vehicle';
import { Notifier } from '../notifier';
import { PlayerService } from '../player/player.service';
import { SoundService } from '../sound.service';
import { VehicleService } from './vehicle.service';

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

    private vehicleTrunkOpened: number | null = null;

    @OnEvent(ClientEvent.BASE_ENTERED_VEHICLE)
    @OnEvent(ClientEvent.BASE_LEFT_VEHICLE)
    public onEnterLeaveVehicle() {
        const model = GetEntityModel(PlayerPedId());

        if (model === GetHashKey('mp_m_freemode_01') || model === GetHashKey('mp_f_freemode_01')) {
            TriggerEvent('soz-character:Client:ApplyCurrentClothConfig');
        }
    }

    @Tick(TickInterval.EVERY_FRAME)
    private async checkLeaveVehicleWithEngineOn() {
        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);

        if (vehicle && IsControlPressed(2, 75) && !IsEntityDead(ped)) {
            await wait(150);

            if (vehicle && IsControlPressed(2, 75) && !IsEntityDead(ped)) {
                SetVehicleEngineOn(vehicle, true, true, false);
                TaskLeaveVehicle(ped, vehicle, 0);
            }
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

        const vehicleState = this.vehicleService.getVehicleState(vehicle);

        if (vehicleState.forced || player.metadata.godmode || vehicleState.open) {
            SetVehicleDoorsLocked(vehicle, 0);
        } else {
            SetVehicleDoorsLocked(vehicle, 2);
        }

        const maxSeats = GetVehicleMaxNumberOfPassengers(vehicle);
        const playerPosition = GetEntityCoords(ped, false) as Vector3;
        const minDistance = 2.0;
        let closestDoor = null;

        for (const [door, seatIndex] of Object.entries(DOOR_INDEX_CONFIG)) {
            let useSeat = false;
            let availableSeatIndex = seatIndex;

            if (typeof seatIndex === 'number') {
                useSeat = GetPedInVehicleSeat(vehicle, seatIndex) == 0;
            } else {
                availableSeatIndex = maxSeats;

                for (let i = 0; i < maxSeats; i++) {
                    if (!useSeat && GetPedInVehicleSeat(vehicle, i) == 0) {
                        useSeat = true;
                        availableSeatIndex = i;
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

        if (closestDoor !== null) {
            TaskEnterVehicle(ped, vehicle, -1, closestDoor.seatIndex, 1.0, 1, 0);

            await wait(200);

            let enteringVehicle = GetVehiclePedIsEntering(ped) || GetVehiclePedIsTryingToEnter(ped);

            while (enteringVehicle !== 0) {
                await wait(200);

                enteringVehicle = GetVehiclePedIsEntering(ped) || GetVehiclePedIsTryingToEnter(ped);
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

        if (IsPedInAnyVehicle(ped, false)) {
            this.notifier.notify("Vous ne pouvez pas ouvrir le coffre à l'intérieur du véhicule.", 'error');

            return;
        }

        const vehicle = this.vehicleService.getClosestVehicle();

        if (!vehicle) {
            this.notifier.notify('Aucun véhicule à proximité.', 'error');

            return;
        }

        const vehicleState = this.vehicleService.getVehicleState(vehicle);

        if (!vehicleState.forced && !player.metadata.godmode && !vehicleState.open) {
            this.notifier.notify('Véhicule verrouillé.', 'error');

            return;
        }

        // Not a player vehicle
        if (!vehicleState.plate) {
            this.notifier.notify("Ce coffre n'est pas accessible.", 'error');

            return;
        }

        const vehicleModel = GetEntityModel(vehicle);
        const vehicleClass = GetVehicleClass(vehicle);
        const trunkType = VEHICLE_TRUNK_TYPES[vehicleModel] || 'trunk';

        TriggerServerEvent('inventory:server:openInventory', trunkType, vehicleState.plate, {
            model: vehicleModel,
            class: vehicleClass,
            entity: VehToNet(vehicle),
        });

        this.vehicleTrunkOpened = vehicle;
    }

    @Tick(TickInterval.EVERY_SECOND)
    async checkKeepVehicleTrunkOpen() {
        if (!this.vehicleTrunkOpened) {
            return;
        }

        if (DoesEntityExist(this.vehicleTrunkOpened)) {
            const distance = getDistance(
                GetEntityCoords(PlayerPedId(), false) as Vector3,
                GetEntityCoords(this.vehicleTrunkOpened, false) as Vector3
            );

            if (distance <= 3.0) {
                return;
            }
        }

        TriggerEvent('inventory:client:closeInventory');
        this.notifier.notify('Le coffre est trop loin.', 'warning');
    }

    @OnEvent(ClientEvent.VEHICLE_CLOSE_TRUNK)
    async closeVehicleTrunk() {
        this.vehicleTrunkOpened = null;
    }

    @Command('soz_vehicle_toggle_vehicle_lock', {
        description: 'Ouvrir/fermer le véhicule',
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

        const vehicle = this.vehicleService.getClosestVehicle();

        if (!vehicle) {
            this.notifier.notify('Aucun vehicule à proximité.', 'error');

            return;
        }

        if (GetEntitySpeed(vehicle) * 3.6 > 75) {
            this.notifier.notify('Vous allez trop vite pour faire ça.', 'error');

            return;
        }

        const state = this.vehicleService.getVehicleState(vehicle);
        const hasVehicleKey = await this.hasVehicleKey(player, state);

        if (!hasVehicleKey) {
            this.notifier.notify("Vous n'avez pas les clés..", 'error');

            return;
        }

        this.vehicleService.updateVehicleState(vehicle, {
            open: !state.open,
        });

        if (state.open) {
            this.soundService.playAround('vehicle/lock', 5, 0.1);
        } else {
            this.soundService.playAround('vehicle/unlock', 5, 0.1);
        }

        SetVehicleLights(vehicle, 2);
        await wait(250);
        SetVehicleLights(vehicle, 1);
        await wait(200);
        SetVehicleLights(vehicle, 0);
    }

    private async hasVehicleKey(player: PlayerData, state: VehicleEntityState) {
        // Case for temporary care, only owner can unlock / lock vehicle
        if (state.id === null) {
            return state.owner === player.citizenid;
        }

        if (state.owner === player.citizenid) {
            return true;
        }

        return await emitRpc<boolean>(RpcEvent.VEHICLE_HAS_KEY, state.id);
    }
}
