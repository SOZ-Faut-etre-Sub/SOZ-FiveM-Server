import { Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { StateBagHandler } from '../../core/decorators/state';
import { Tick } from '../../core/decorators/tick';
import { wait } from '../../core/utils';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { getDistance, Vector3 } from '../../shared/polyzone/vector';
import { getRandomInt } from '../../shared/random';
import {
    isVehicleModelElectric,
    VehicleClass,
    VehicleCondition,
    VehicleEntityState,
} from '../../shared/vehicle/vehicle';
import { NuiMenu } from '../nui/nui.menu';
import { TargetFactory } from '../target/target.factory';
import { VehicleService } from './vehicle.service';
import { VehicleStateService } from './vehicle.state.service';

type VehicleStatus = {
    engineHealth: number;
    bodyHealth: number;
    tankHealth: number;
    vehicle: number;
};

const ENGINE_DAMAGE_MULTIPLIER = 7.75;
const BODY_DAMAGE_MULTIPLIER = 6.25;
const TANK_DAMAGE_MULTIPLIER = 2.5;

const STOP_ENGINE_THRESHOLD = 120;

const ENGINE_THRESHOLD_AUTO_DEGRADE = 250.0;
const ENGINE_MIN_HEALTH = 100.0;

const TIRE_TEMPORARY_REPAIR_DISTANCE = 10000.0;

const VEHICLE_CLASS_DAMAGE_MULTIPLIER: Record<VehicleClass, number> = {
    [VehicleClass.Compacts]: 0.8,
    [VehicleClass.Sedans]: 0.8,
    [VehicleClass.SUVs]: 0.8,
    [VehicleClass.Coupes]: 0.76,
    [VehicleClass.Muscle]: 0.8,
    [VehicleClass.SportsClassics]: 0.76,
    [VehicleClass.Sports]: 0.76,
    [VehicleClass.Super]: 0.76,
    [VehicleClass.Motorcycles]: 0.216,
    [VehicleClass.OffRoad]: 0.56,
    [VehicleClass.Industrial]: 0.2,
    [VehicleClass.Utility]: 0.28,
    [VehicleClass.Vans]: 0.68,
    [VehicleClass.Cycles]: 0.8,
    [VehicleClass.Boats]: 0.32,
    [VehicleClass.Helicopters]: 0.56,
    [VehicleClass.Planes]: 0.56,
    [VehicleClass.Service]: 0.6,
    [VehicleClass.Emergency]: 0.68,
    [VehicleClass.Military]: 0.536,
    [VehicleClass.Commercial]: 0.344,
    [VehicleClass.Trains]: 0.8,
};

type CurrentVehiclePosition = {
    vehicle: number;
    position: Vector3;
};

type PreviousVehicleHealth = {
    engineHealth: number;
    bodyHealth: number;
};

@Provider()
export class VehicleConditionProvider {
    @Inject(VehicleService)
    private vehicleService: VehicleService;

    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    private currentVehicleStatus: VehicleStatus | null = null;

    private currentVehiclePositionForMileage: CurrentVehiclePosition | null = null;

    private currentVehiclePositionForTemporaryTire: CurrentVehiclePosition | null = null;

    private adminNoStall = false;

    private previousVehicleHealth: PreviousVehicleHealth | null = null;

    public constructor() {
        this.vehicleStateService.addVehicleStateSelector(
            this.onVehicleSyncCondition.bind(this),
            (state: VehicleEntityState) => state.condition
        );

        this.vehicleStateService.addVehicleStateSelector(
            this.onVehicleIndicatorChange.bind(this),
            (state: VehicleEntityState) => state.indicators,
            (state: VehicleEntityState) => state.openWindows
        );
    }

    @Once(OnceStep.PlayerLoaded)
    public async init() {
        this.targetFactory.createForAllVehicle([
            {
                icon: 'c:mechanic/nettoyer.png',
                label: 'Laver (kit)',
                item: 'cleaningkit',
                action: entity => {
                    const networkId = NetworkGetNetworkIdFromEntity(entity);

                    TriggerServerEvent(ServerEvent.VEHICLE_USE_CLEANING_KIT, networkId);
                },
                canInteract: () => {
                    return true;
                },
            },
            {
                icon: 'c:mechanic/reparer.png',
                label: 'Réparer (kit)',
                item: 'repairkit',
                action: entity => {
                    const networkId = NetworkGetNetworkIdFromEntity(entity);

                    TriggerServerEvent(ServerEvent.VEHICLE_USE_REPAIR_KIT, networkId);
                },
                canInteract: () => {
                    return true;
                },
            },
            {
                icon: 'c:mechanic/repair_wheel.png',
                label: 'Anti crevaison (kit)',
                item: 'wheel_kit',
                action: entity => {
                    const networkId = NetworkGetNetworkIdFromEntity(entity);

                    TriggerServerEvent(ServerEvent.VEHICLE_USE_WHEEL_KIT, networkId);
                },
                canInteract: () => {
                    return true;
                },
            },
        ]);
    }

    @OnEvent(ClientEvent.BASE_LEFT_VEHICLE)
    private async onBaseLeftVehicle() {
        this.previousVehicleHealth = null;
    }

    private async onVehicleSyncCondition(vehicle: number, condition: VehicleCondition) {
        if (!vehicle || !DoesEntityExist(vehicle)) {
            return;
        }

        if (!IsEntityAVehicle(vehicle)) {
            return;
        }

        if (!NetworkHasControlOfEntity(vehicle)) {
            return;
        }

        this.vehicleService.applyVehicleCondition(vehicle, condition);
    }

    @OnEvent(ClientEvent.VEHICLE_CHECK_CONDITION)
    public async checkCondition(vehicleNetworkId: number) {
        if (!NetworkDoesEntityExistWithNetworkId(vehicleNetworkId)) {
            return;
        }

        const vehicle = NetworkGetEntityFromNetworkId(vehicleNetworkId);

        if (!vehicle || !DoesEntityExist(vehicle)) {
            return;
        }

        if (!IsEntityAVehicle(vehicle)) {
            return;
        }

        if (!NetworkHasControlOfEntity(vehicle)) {
            return;
        }

        // Check dead status
        const state = await this.vehicleStateService.getVehicleState(vehicle);

        this.checkVehicleWater(vehicle, state);

        // Check vehicle condition
        this.vehicleStateService.updateVehicleCondition(vehicle, this.vehicleService.getVehicleCondition(vehicle));
    }

    @Tick(200)
    public async updateVehicleMaxSpeed() {
        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);

        if (!vehicle) {
            return;
        }

        const owner = NetworkGetEntityOwner(vehicle);

        if (owner !== PlayerId()) {
            return;
        }

        const state = await this.vehicleStateService.getVehicleState(vehicle);

        if (state.speedLimit > 0) {
            const currentSpeed = GetEntitySpeed(vehicle) * 3.6;
            const speedLimit = Math.max(state.speedLimit, currentSpeed - 5);

            SetVehicleMaxSpeed(vehicle, speedLimit / 3.6 - 0.25);
        } else {
            const maxSpeed = GetVehicleHandlingFloat(vehicle, 'CHandlingData', 'fInitialDriveMaxFlatVel');
            SetVehicleMaxSpeed(vehicle, maxSpeed);

            const passengerCount = Math.max(0, GetVehicleNumberOfPassengers(vehicle) - 1);
            ModifyVehicleTopSpeed(vehicle, 1 - passengerCount * 0.02);
        }
    }

    private checkVehicleWater(vehicle: number, state: VehicleEntityState) {
        if (!state.isPlayerVehicle || state.dead) {
            return;
        }

        const isDead = IsEntityDead(vehicle);

        if (isDead) {
            let reason = 'unknown';

            if (IsEntityInWater(vehicle)) {
                reason = 'water';
            } else if (IsEntityOnFire(vehicle)) {
                reason = 'fire';
            }

            SetVehicleEngineOn(vehicle, false, true, false);
            SetVehicleUndriveable(vehicle, true);

            const vehicleNetworkId = NetworkGetNetworkIdFromEntity(vehicle);

            TriggerServerEvent(ServerEvent.VEHICLE_SET_DEAD, vehicleNetworkId, reason);
        }
    }

    @Tick(0)
    public async preventVehicleFlip() {
        if (!this.currentVehicleStatus) {
            return;
        }

        const roll = GetEntityRoll(this.currentVehicleStatus.vehicle);

        if ((roll > 75.0 || roll < -75.0) && GetEntitySpeed(this.currentVehicleStatus.vehicle) < 2) {
            DisableControlAction(2, 59, true);
            DisableControlAction(2, 60, true);
        }
    }

    @Tick(0)
    public async setVehiclePower() {
        if (!this.currentVehicleStatus) {
            return;
        }

        if (this.currentVehicleStatus.engineHealth < ENGINE_MIN_HEALTH + 1.0) {
            SetVehicleCheatPowerIncrease(this.currentVehicleStatus.vehicle, 0.05);
        } else if (this.currentVehicleStatus.engineHealth < 500.0) {
            const power = this.currentVehicleStatus.engineHealth / 500.0;

            SetVehicleCheatPowerIncrease(this.currentVehicleStatus.vehicle, power);
        } else {
            SetVehicleCheatPowerIncrease(this.currentVehicleStatus.vehicle, 1.0);
        }
    }

    @Tick(50)
    public updateVehicleDamage() {
        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);

        if (!vehicle) {
            this.currentVehicleStatus = null;

            return;
        }

        if (!NetworkHasControlOfEntity(vehicle)) {
            this.currentVehicleStatus = null;

            return;
        }

        const lastVehicleStatus = this.currentVehicleStatus;
        this.currentVehicleStatus = {
            engineHealth: GetVehicleEngineHealth(vehicle),
            bodyHealth: GetVehicleBodyHealth(vehicle),
            tankHealth: GetVehiclePetrolTankHealth(vehicle),
            vehicle,
        };

        if (!lastVehicleStatus || lastVehicleStatus.vehicle !== vehicle) {
            return;
        }

        let engineHealthDiff = lastVehicleStatus.engineHealth - this.currentVehicleStatus.engineHealth;
        let bodyHealthDiff = lastVehicleStatus.bodyHealth - this.currentVehicleStatus.bodyHealth;
        let tankHealthDiff = lastVehicleStatus.tankHealth - this.currentVehicleStatus.tankHealth;

        const vehicleClass = GetVehicleClass(vehicle);

        // A reparation was done, do not trigger damage diff here
        if (engineHealthDiff < 0 || bodyHealthDiff < 0 || tankHealthDiff < 0) {
            return;
        }

        if (engineHealthDiff > 0) {
            engineHealthDiff *= ENGINE_DAMAGE_MULTIPLIER * VEHICLE_CLASS_DAMAGE_MULTIPLIER[vehicleClass];
        }

        if (
            this.currentVehicleStatus.engineHealth < ENGINE_THRESHOLD_AUTO_DEGRADE &&
            this.currentVehicleStatus.engineHealth > ENGINE_MIN_HEALTH + 1.0
        ) {
            engineHealthDiff += 0.2;
        }

        if (bodyHealthDiff > 0) {
            bodyHealthDiff *= BODY_DAMAGE_MULTIPLIER * VEHICLE_CLASS_DAMAGE_MULTIPLIER[vehicleClass];
        }

        if (tankHealthDiff > 0) {
            tankHealthDiff *= TANK_DAMAGE_MULTIPLIER * VEHICLE_CLASS_DAMAGE_MULTIPLIER[vehicleClass];
        }

        const engineHealthDiffSharing = engineHealthDiff * 0.25;
        const bodyHealthDiffSharing = bodyHealthDiff * 0.25;
        const tankHealthDiffSharing = tankHealthDiff * 0.25;

        engineHealthDiff += (bodyHealthDiffSharing + tankHealthDiffSharing) * 1.25;
        bodyHealthDiff += engineHealthDiffSharing + tankHealthDiffSharing;
        tankHealthDiff += (engineHealthDiffSharing + bodyHealthDiffSharing) * 0.4;

        // set new health, only when diff is significant
        if (engineHealthDiff > 0.1) {
            this.currentVehicleStatus.engineHealth = lastVehicleStatus.engineHealth - engineHealthDiff;
            SetVehicleEngineHealth(vehicle, this.currentVehicleStatus.engineHealth);
        }

        if (bodyHealthDiff > 0.1) {
            this.currentVehicleStatus.bodyHealth = lastVehicleStatus.bodyHealth - bodyHealthDiff;
            SetVehicleBodyHealth(vehicle, this.currentVehicleStatus.bodyHealth);
        }
        if (isVehicleModelElectric(GetEntityModel(vehicle))) {
            this.currentVehicleStatus.tankHealth = 1000;
            SetVehiclePetrolTankHealth(vehicle, 1000);
        } else {
            if (tankHealthDiff > 0.1) {
                this.currentVehicleStatus.tankHealth = Math.max(lastVehicleStatus.tankHealth - tankHealthDiff, 600);
                SetVehiclePetrolTankHealth(vehicle, this.currentVehicleStatus.tankHealth);
            }
        }

        const healthDiff =
            lastVehicleStatus.engineHealth +
            lastVehicleStatus.bodyHealth -
            this.currentVehicleStatus.engineHealth -
            this.currentVehicleStatus.bodyHealth;

        if (healthDiff > STOP_ENGINE_THRESHOLD && !this.adminNoStall) {
            const waitTime = Math.min(
                (lastVehicleStatus.engineHealth / this.currentVehicleStatus.engineHealth +
                    lastVehicleStatus.bodyHealth / this.currentVehicleStatus.bodyHealth) *
                    getRandomInt(2000, 3000),
                10000
            );

            const end = GetGameTimer() + waitTime;

            setTimeout(async () => {
                SetVehicleUndriveable(vehicle, true);

                while (GetGameTimer() < end) {
                    if (IsPedInVehicle(PlayerPedId(), vehicle, false)) {
                        DisableControlAction(0, 71, true);
                        DisableControlAction(0, 72, true);
                    }

                    if (GetIsVehicleEngineRunning(vehicle)) {
                        SetVehicleEngineOn(vehicle, false, true, false);
                    }

                    await wait(0);
                }

                SetVehicleUndriveable(vehicle, false);
                SetVehicleEngineOn(vehicle, true, false, true);
            }, 0);
        }
    }

    @Tick(500)
    public async cancelElectricTankDamage() {
        const vehicles: number[] = GetGamePool('CVehicle');
        for (const vehicle of vehicles) {
            if (GetPlayerServerId(NetworkGetEntityOwner(vehicle)) !== GetPlayerServerId(PlayerId())) {
                continue;
            }
            if (isVehicleModelElectric(GetEntityModel(vehicle))) {
                SetVehiclePetrolTankHealth(vehicle, 1000);
                SetVehicleCanLeakOil(vehicle, false);
                SetVehicleCanLeakPetrol(vehicle, false);
            }
        }
    }

    @Tick(500)
    public checkVehicleMileage() {
        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);

        if (!vehicle) {
            this.currentVehiclePositionForMileage = null;

            return;
        }

        if (!NetworkHasControlOfEntity(vehicle)) {
            this.currentVehiclePositionForMileage = null;

            return;
        }

        if (this.currentVehiclePositionForMileage && this.currentVehiclePositionForMileage.vehicle !== vehicle) {
            this.currentVehiclePositionForMileage = {
                vehicle,
                position: GetEntityCoords(vehicle, true) as Vector3,
            };

            return;
        }

        const lastVehiclePosition = this.currentVehiclePositionForMileage;
        this.currentVehiclePositionForMileage = {
            vehicle,
            position: GetEntityCoords(vehicle, true) as Vector3,
        };

        if (lastVehiclePosition === null) {
            return;
        }

        const diffDistance = getDistance(lastVehiclePosition.position, this.currentVehiclePositionForMileage.position);
        const networkId = NetworkGetNetworkIdFromEntity(vehicle);

        TriggerServerEvent(ServerEvent.VEHICLE_UPDATE_MILEAGE, networkId, diffDistance);

        const [isTrailerExists, trailerEntity] = GetVehicleTrailerVehicle(vehicle);

        if (isTrailerExists) {
            const trailerNetworkId = NetworkGetNetworkIdFromEntity(trailerEntity);

            TriggerServerEvent(ServerEvent.VEHICLE_UPDATE_MILEAGE, trailerNetworkId, diffDistance);
        }
    }

    @Tick(500)
    public async checkVehicleTireRepair() {
        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);

        if (!vehicle) {
            this.currentVehiclePositionForTemporaryTire = null;

            return;
        }

        if (!NetworkHasControlOfEntity(vehicle)) {
            this.currentVehiclePositionForTemporaryTire = null;

            return;
        }

        const state = await this.vehicleStateService.getVehicleState(vehicle);
        const keys = Object.keys(state.condition.tireTemporaryRepairDistance).map(key => parseInt(key, 10));

        if (keys.length === 0) {
            this.currentVehiclePositionForTemporaryTire = null;

            return;
        }

        if (
            this.currentVehiclePositionForTemporaryTire &&
            this.currentVehiclePositionForTemporaryTire.vehicle !== vehicle
        ) {
            this.currentVehiclePositionForTemporaryTire = {
                vehicle,
                position: GetEntityCoords(vehicle, true) as Vector3,
            };

            return;
        }

        const lastVehiclePosition = this.currentVehiclePositionForTemporaryTire;
        this.currentVehiclePositionForTemporaryTire = {
            vehicle,
            position: GetEntityCoords(vehicle, true) as Vector3,
        };

        if (lastVehiclePosition === null) {
            return;
        }

        const diffDistance = getDistance(
            lastVehiclePosition.position,
            this.currentVehiclePositionForTemporaryTire.position
        );
        const newCondition: Partial<VehicleCondition> = {};
        let applyCondition = false;

        for (const tireKey of keys) {
            const distance = state.condition.tireTemporaryRepairDistance[tireKey] + diffDistance;

            if (distance < TIRE_TEMPORARY_REPAIR_DISTANCE) {
                newCondition.tireTemporaryRepairDistance[tireKey] = distance;
            } else {
                delete newCondition.tireTemporaryRepairDistance[tireKey];
                newCondition.tireBurstCompletely[tireKey] = true;
                applyCondition = true;
            }
        }

        this.vehicleStateService.updateVehicleCondition(vehicle, newCondition);

        if (applyCondition) {
            this.vehicleService.applyVehicleCondition(vehicle, {
                ...state.condition,
                ...newCondition,
            });
        }
    }

    private async onVehicleIndicatorChange(
        vehicle: number,
        indicators: VehicleEntityState['indicators'],
        openWindows: VehicleEntityState['openWindows']
    ) {
        if (!vehicle || !DoesEntityExist(vehicle)) {
            return;
        }

        if (!IsEntityAVehicle(vehicle)) {
            return;
        }

        await wait(0);

        SetVehicleIndicatorLights(vehicle, 0, indicators.right);
        SetVehicleIndicatorLights(vehicle, 1, indicators.left);

        if (openWindows) {
            RollDownWindow(vehicle, 0);
            RollDownWindow(vehicle, 1);
        } else {
            RollUpWindow(vehicle, 0);
            RollUpWindow(vehicle, 1);
        }
    }

    @Tick(0)
    public async setVehicleIndicators() {
        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);

        if (!vehicle) {
            return;
        }

        if (this.nuiMenu.getOpened() !== null) {
            return;
        }

        if (GetPedInVehicleSeat(vehicle, -1) !== ped) {
            return;
        }

        const toggleLeft = IsControlJustPressed(0, 189);
        const toggleRight = IsControlJustPressed(0, 190);
        const toggleWindowsUp = IsControlJustPressed(0, 188);
        const toggleWindowsDown = IsControlJustPressed(0, 187);

        if (toggleLeft || toggleRight || toggleWindowsUp || toggleWindowsDown) {
            const state = await this.vehicleStateService.getVehicleState(vehicle);

            this.vehicleStateService.updateVehicleState(vehicle, {
                indicators: {
                    left: toggleLeft ? !state.indicators.left : state.indicators.left,
                    right: toggleRight ? !state.indicators.right : state.indicators.right,
                },
                openWindows: toggleWindowsDown ? true : toggleWindowsUp ? false : state.openWindows,
            });
        }
    }

    public setAdminNoStall(value: boolean) {
        this.adminNoStall = value;
    }

    public getAdminNoStall(): boolean {
        return this.adminNoStall;
    }
}
