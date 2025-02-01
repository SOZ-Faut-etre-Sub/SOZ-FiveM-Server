import { Feature } from '@public/shared/features';
import { Command } from '@core/decorators/command';
import { Once, OnceStep, OnEvent } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { Tick, TickInterval } from '@core/decorators/tick';
import { emitRpc } from '@core/rpc';
import { wait, waitUntil } from '@core/utils';
import { PhoneAppSocietyProvider } from '@public/client/phone/apps/phone.app.society.provider';
import { PhoneService } from '@public/client/phone/phone.service';
import { getRandomItem } from '@public/shared/random';

import { ClientEvent, ServerEvent } from '../../shared/event';
import { DEFAULT_MAX_INVENTORY_DISTANCE, getPositionZone } from '../../shared/inventory';
import { PlayerData } from '../../shared/player';
import { getDistance, Vector3 } from '../../shared/polyzone/vector';
import { RpcServerEvent } from '../../shared/rpc';
import {
    DoorType,
    LockPickAlertMessage,
    SEATS_CONFIG,
    VehicleClass,
    VehicleLockStatus,
    VehicleSeat,
    VehicleVolatileState,
} from '../../shared/vehicle/vehicle';
import { AnimationService } from '../animation/animation.service';
import { FeatureProvider } from '../feature/feature.provider';
import { InventoryManager } from '../inventory/inventory.manager';
import { Notifier } from '../notifier';
import { NuiDispatch } from '../nui/nui.dispatch';
import { PlayerService } from '../player/player.service';
import { VehicleRepository } from '../repository/vehicle.repository';
import { SoundService } from '../sound.service';
import { VehicleSeatbeltProvider } from './vehicle.seatbelt.provider';
import { VehicleService } from './vehicle.service';
import { VehicleStateService } from './vehicle.state.service';

// A list of vehicles using exlusively seat bones, as the native GetEntryPositionOfDoor has a bad behavior with them. Fill in more vehicles if needed.
const VEHICLE_FORCE_USE_BONES = {
    [GetHashKey('bus')]: 'bus',
    [GetHashKey('cargobob')]: 'cargobob',
};

type TrunkOpened = {
    vehicle: number;
    vehicleNetworkId: number;
    min: Vector3;
    max: Vector3;
};

@Provider()
export class VehicleLockProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(VehicleService)
    private vehicleService: VehicleService;

    @Inject(VehicleRepository)
    private vehicleRepository: VehicleRepository;

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

    @Inject(InventoryManager)
    public inventoryManager: InventoryManager;

    @Inject(NuiDispatch)
    public nuiDispatch: NuiDispatch;

    @Inject(FeatureProvider)
    public featureProvider: FeatureProvider;

    @Inject(PhoneService)
    private phoneService: PhoneService;

    @Inject(PhoneAppSocietyProvider)
    private readonly phoneSocialProvider: PhoneAppSocietyProvider;

    private vehicleOpened: Set<number> = new Set();

    private lockTempDisabled = false;

    @Once(OnceStep.PlayerLoaded)
    public async setupVehicleOpened() {
        const vehicleOpened = await emitRpc<number[]>(RpcServerEvent.VEHICLE_GET_OPENED);

        this.vehicleOpened = new Set(vehicleOpened);
    }

    public isVehOpen(entity: number) {
        return this.vehicleOpened.has(VehToNet(entity));
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
        }

        if (GetPedInVehicleSeat(vehicleId, VehicleSeat.Driver) === PlayerPedId()) return;

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

        if (this.lockTempDisabled) {
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

        const closestSeat = this.getClosestSeat(ped, vehicle);

        const start = GetGameTimer();

        if (closestSeat !== null) {
            TaskEnterVehicle(ped, vehicle, -1, closestSeat, 1.0, 1, 0);

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

    public getClosestSeat(ped: number, vehicle: number): number | null {
        const maxSeats = GetVehicleMaxNumberOfPassengers(vehicle);
        const playerPosition = GetEntityCoords(ped, false) as Vector3;
        const minDistance = 2.0;
        let closestDoor = null;

        for (const seatName of Object.keys(SEATS_CONFIG)) {
            const seat = SEATS_CONFIG[seatName];
            const availableSeatIndex = seat.seatIndex;
            const ped = GetPedInVehicleSeat(vehicle, availableSeatIndex);
            let useSeat = ped == 0 || !IsPedAPlayer(ped);

            if (availableSeatIndex > maxSeats - 1) {
                useSeat = false;
            }

            if (useSeat) {
                let entryPosition: Vector3;
                if (
                    seat.type === DoorType.Door &&
                    !VEHICLE_FORCE_USE_BONES[GetEntityModel(vehicle)] &&
                    !IsThisModelABoat(GetEntityModel(vehicle))
                ) {
                    entryPosition = GetEntryPositionOfDoor(vehicle, seat.doorIndex) as Vector3;
                } else {
                    const bone = seat.seatBone;
                    entryPosition = GetWorldPositionOfEntityBone(
                        vehicle,
                        GetEntityBoneIndexByName(vehicle, bone)
                    ) as Vector3;
                }

                const distance = getDistance(playerPosition, entryPosition);

                if (closestDoor === null) {
                    if (distance <= minDistance) {
                        closestDoor = {
                            distance,
                            entryPosition,
                            seatIndex: availableSeatIndex,
                        };
                    }
                } else {
                    if (distance < closestDoor.distance) {
                        closestDoor = {
                            distance,
                            entryPosition,
                            seatIndex: availableSeatIndex,
                        };
                    }
                }
            }
        }

        // Special workaround for Motorcycles, we never want the player to enter the passenger seat if the driver seat is available
        if (
            closestDoor &&
            GetVehicleClass(vehicle) === VehicleClass.Motorcycles &&
            closestDoor.seatIndex === VehicleSeat.Copilot
        ) {
            const ped = GetPedInVehicleSeat(vehicle, VehicleSeat.Driver);

            if (ped === 0 || !IsPedAPlayer(ped)) {
                closestDoor.seatIndex = VehicleSeat.Driver;
            }
        }

        return closestDoor ? closestDoor.seatIndex : null;
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
    public async openVehicle(definedVehicle?: number, checkOpen = true) {
        const ped = PlayerPedId();

        const player = this.playerService.getPlayer();

        if (!player) {
            return;
        }

        if (player.metadata.isdead || player.metadata.ishandcuffed || IsPedInAnyVehicle(ped, false)) {
            return;
        }

        const vehicle = definedVehicle
            ? definedVehicle
            : this.vehicleService.getClosestVehicle({
                  maxDistance: 15.0,
              });

        if (!vehicle || !IsEntityAVehicle(vehicle)) {
            this.notifier.notify('Aucun véhicule à proximité.', 'error');

            return;
        }

        const vehicleNetworkId = NetworkGetNetworkIdFromEntity(vehicle);
        const model = GetEntityModel(vehicle);
        const [min, max] = GetModelDimensions(model) as [Vector3, Vector3];
        const opened: TrunkOpened = {
            vehicle,
            vehicleNetworkId,
            min: min,
            max: max,
        };

        if (!this.isInTrunkZone(opened)) {
            this.notifier.notify('Vous devez être à côté du véhicule.', 'error');

            return;
        }

        const vehicleState = await this.vehicleStateService.getServerVehicleState(vehicle);

        if (!vehicleState.forced && !player.metadata.godmode && checkOpen && !vehicleState.open) {
            this.notifier.notify('Véhicule verrouillé.', 'error');

            return;
        }

        if (this.playerService.getState().isInventoryBusy) {
            this.notifier.notify("Inventaire en cours d'utilisation.", 'warning');

            return;
        }

        this.inventoryManager.openVehicleInventory(vehicle);
    }

    private isInTrunkZone(opened: TrunkOpened) {
        const position = GetEntityCoords(opened.vehicle, false) as Vector3;
        const vehicleTrunkZone = getPositionZone(
            position,
            GetEntityHeading(opened.vehicle),
            opened,
            DEFAULT_MAX_INVENTORY_DISTANCE
        );
        const pedPosition = GetEntityCoords(PlayerPedId(), false) as Vector3;

        return vehicleTrunkZone.isPointInside(pedPosition);
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

        if (this.phoneService.isPhoneVisible()) {
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
        if (state.id === null && state.rentOwner === null) {
            return state.owner === player.citizenid;
        }

        if (state.owner === player.citizenid) {
            return true;
        }

        return await emitRpc<boolean>(RpcServerEvent.VEHICLE_HAS_KEY, state.plate);
    }

    @OnEvent(ClientEvent.VEHICLE_LOCKPICK)
    public onLockpick(type: string, model: number) {
        if (!this.featureProvider.isFeatureEnabled(Feature.PoliceAlert)) {
            return;
        }

        const coords = GetEntityCoords(PlayerPedId());
        const zoneID = GetNameOfZone(coords[0], coords[1], coords[2]);
        if (zoneID == 'ISHEIST') {
            return;
        }
        const zone = GetLabelText(zoneID);
        const modelInfo = this.vehicleRepository.getByModelHash(model);

        const messages = [...LockPickAlertMessage.all, ...LockPickAlertMessage[type]];

        const message = getRandomItem(messages);
        const modelName = modelInfo ? modelInfo.name : GetDisplayNameFromVehicleModel(model);

        this.phoneSocialProvider.sendMessage({
            anonymous: true,
            number: '555-POLICE',
            message: message.replace('${0}', zone).replace('${1}', modelName),
            htmlMessage: message
                .replace('${0}', `<span {class}>${zone}</span>`)
                .replace('${1}', `<span {class}>${modelName}</span>`),
            position: true,
            type: 'auto-theft',
            overrideIdentifier: 'System',
        });
    }

    public setLockTempDisabled(value: boolean) {
        this.lockTempDisabled = value;
    }
}
