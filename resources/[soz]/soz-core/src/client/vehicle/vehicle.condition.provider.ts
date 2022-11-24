import { Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { StateBagHandler } from '../../core/decorators/state';
import { Tick } from '../../core/decorators/tick';
import { wait } from '../../core/utils';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { getDistance, Vector3 } from '../../shared/polyzone/vector';
import { getRandomEnumValue, getRandomInt } from '../../shared/random';
import { VehicleModType, VehicleXenonColor, VehicleXenonColorChoices } from '../../shared/vehicle/modification';
import { VehicleClass, VehicleCondition, VehicleEntityState } from '../../shared/vehicle/vehicle';
import { NuiMenu } from '../nui/nui.menu';
import { TargetFactory } from '../target/target.factory';
import { VehicleService } from './vehicle.service';

type VehicleStatus = {
    engineHealth: number;
    bodyHealth: number;
    tankHealth: number;
    vehicle: number;
};

const ENGINE_DAMAGE_MULTIPLIER = 5.0;
const BODY_DAMAGE_MULTIPLIER = 5.0;
const TANK_DAMAGE_MULTIPLIER = 5.0;

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

@Provider()
export class VehicleConditionProvider {
    @Inject(VehicleService)
    private vehicleService: VehicleService;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    private currentVehicleStatus: VehicleStatus | null = null;

    private currentVehiclePositionForMileage: CurrentVehiclePosition | null = null;

    private currentVehiclePositionForTemporaryTire: CurrentVehiclePosition | null = null;

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

    @Tick(100)
    public checkYoloMode() {
        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);

        if (!vehicle) {
            return;
        }

        if (!NetworkHasControlOfEntity(vehicle)) {
            return;
        }

        const state = this.vehicleService.getVehicleState(vehicle);

        if (!state.yoloMode) {
            return;
        }

        const color = getRandomEnumValue(VehicleXenonColor);
        const color2 = VehicleXenonColorChoices[getRandomEnumValue(VehicleXenonColor)];
        const color3 = VehicleXenonColorChoices[getRandomEnumValue(VehicleXenonColor)];
        ToggleVehicleMod(vehicle, VehicleModType.XenonHeadlights, true);
        ToggleVehicleMod(vehicle, VehicleModType.TyreSmoke, true);
        SetVehicleXenonLightsColour(vehicle, color);

        DisableVehicleNeonLights(vehicle, false);
        SetVehicleNeonLightEnabled(vehicle, 0, true);
        SetVehicleNeonLightEnabled(vehicle, 1, true);
        SetVehicleNeonLightEnabled(vehicle, 2, true);
        SetVehicleNeonLightEnabled(vehicle, 3, true);
        SetVehicleNeonLightsColour(vehicle, color2.color[0], color2.color[1], color2.color[2]);
        SetVehicleTyreSmokeColor(vehicle, color3.color[0], color3.color[1], color3.color[2]);
        // SetVehicleColours(vehicle, color4, color5);
        // SetVehicleExtraColours(vehicle, color6, color7);
    }

    @StateBagHandler('condition', null)
    private async onVehicleConditionChange(bag: string, key: string, value: VehicleCondition) {
        const split = bag.split(':');

        if (!split[1]) {
            return;
        }

        const vehicleId = parseInt(split[1]);

        if (!vehicleId) {
            return;
        }

        if (!NetworkDoesEntityExistWithNetworkId(vehicleId)) {
            return;
        }

        const vehicle = NetworkGetEntityFromNetworkId(vehicleId);

        if (!vehicle || !DoesEntityExist(vehicle)) {
            return;
        }

        if (!IsEntityAVehicle(vehicle)) {
            return;
        }

        if (!NetworkHasControlOfEntity(vehicle)) {
            return;
        }

        const previousState = this.vehicleService.getVehicleState(vehicle);
        const healthDiff =
            previousState.condition.engineHealth +
            previousState.condition.bodyHealth -
            value.engineHealth -
            value.bodyHealth;

        if (healthDiff > STOP_ENGINE_THRESHOLD) {
            const waitTime = Math.min(
                (previousState.condition.engineHealth / value.engineHealth +
                    previousState.condition.bodyHealth / value.bodyHealth) *
                    getRandomInt(1000, 2000),
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

    @OnEvent(ClientEvent.VEHICLE_SYNC_CONDITION)
    private async onVehicleSyncCondition(vehicleNetworkId: number, condition: Partial<VehicleCondition>) {
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

        const state = this.vehicleService.getVehicleState(vehicle);
        const newCondition = {
            ...state.condition,
            ...condition,
        };

        this.vehicleService.updateVehicleState(vehicle, {
            condition: newCondition,
        });

        this.vehicleService.applyVehicleCondition(vehicle, newCondition);
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
        const state = this.vehicleService.getVehicleState(vehicle);

        this.checkVehicleWater(vehicle, state);

        const newCondition = {
            ...state.condition,
            ...this.vehicleService.getVehicleCondition(vehicle),
        };

        // Check vehicle condition
        this.vehicleService.updateVehicleState(vehicle, {
            condition: newCondition,
        });
    }

    @Tick(200)
    public updateVehicleMaxSpeed(): void {
        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);

        if (!vehicle) {
            return;
        }

        const owner = NetworkGetEntityOwner(vehicle);

        if (owner !== PlayerId()) {
            return;
        }

        const state = this.vehicleService.getVehicleState(vehicle);

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

        if (engineHealthDiff > 0) {
            engineHealthDiff *= ENGINE_DAMAGE_MULTIPLIER * VEHICLE_CLASS_DAMAGE_MULTIPLIER[vehicleClass];
        }

        if (this.currentVehicleStatus.engineHealth < ENGINE_THRESHOLD_AUTO_DEGRADE) {
            engineHealthDiff += 0.2;
        }

        if (bodyHealthDiff > 0) {
            bodyHealthDiff *= BODY_DAMAGE_MULTIPLIER * VEHICLE_CLASS_DAMAGE_MULTIPLIER[vehicleClass];
        }

        if (tankHealthDiff > 0) {
            tankHealthDiff *= TANK_DAMAGE_MULTIPLIER * VEHICLE_CLASS_DAMAGE_MULTIPLIER[vehicleClass];
        }

        // set new health, only if diff is significant
        if (engineHealthDiff > 0.1) {
            this.currentVehicleStatus.engineHealth = Math.max(
                ENGINE_MIN_HEALTH,
                lastVehicleStatus.engineHealth - engineHealthDiff
            );
            SetVehicleEngineHealth(vehicle, this.currentVehicleStatus.engineHealth);
        }

        if (bodyHealthDiff > 0.1) {
            this.currentVehicleStatus.bodyHealth = lastVehicleStatus.bodyHealth - bodyHealthDiff;
            SetVehicleBodyHealth(vehicle, this.currentVehicleStatus.bodyHealth);
        }

        if (tankHealthDiff > 0.1) {
            this.currentVehicleStatus.tankHealth = lastVehicleStatus.tankHealth - tankHealthDiff;
            SetVehiclePetrolTankHealth(vehicle, this.currentVehicleStatus.tankHealth);
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

        const state = this.vehicleService.getVehicleState(vehicle);
        this.vehicleService.updateVehicleState(vehicle, {
            condition: {
                ...state.condition,
                mileage: state.condition.mileage + diffDistance,
            },
        });
    }

    @Tick(500)
    public checkVehicleTireRepair() {
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

        const state = this.vehicleService.getVehicleState(vehicle);
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
        const newCondition = {
            ...state.condition,
        };
        let applyCondition = false;

        for (const tireKey of keys) {
            const distance = newCondition.tireTemporaryRepairDistance[tireKey] + diffDistance;

            if (distance < TIRE_TEMPORARY_REPAIR_DISTANCE) {
                newCondition.tireTemporaryRepairDistance[tireKey] = distance;
            } else {
                delete newCondition.tireTemporaryRepairDistance[tireKey];
                newCondition.tireBurstCompletely[tireKey] = true;
                applyCondition = true;
            }
        }

        this.vehicleService.updateVehicleState(vehicle, {
            condition: newCondition,
        });

        if (applyCondition) {
            this.vehicleService.applyVehicleCondition(vehicle, newCondition);
        }
    }

    @StateBagHandler('indicators', null)
    @StateBagHandler('windows', null)
    private async onVehicleIndicatorChange(bag: string) {
        const split = bag.split(':');

        if (!split[1]) {
            return;
        }

        const vehicleId = parseInt(split[1]);

        if (!vehicleId) {
            return;
        }

        if (!NetworkDoesEntityExistWithNetworkId(vehicleId)) {
            return;
        }

        const vehicle = NetworkGetEntityFromNetworkId(vehicleId);

        if (!vehicle || !DoesEntityExist(vehicle)) {
            return;
        }

        if (!IsEntityAVehicle(vehicle)) {
            return;
        }

        await wait(0);

        const state = this.vehicleService.getVehicleState(vehicle);

        SetVehicleIndicatorLights(vehicle, 0, state.indicators.right);
        SetVehicleIndicatorLights(vehicle, 1, state.indicators.left);

        if (state.openWindows) {
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
            const state = this.vehicleService.getVehicleState(vehicle);

            this.vehicleService.updateVehicleState(vehicle, {
                indicators: {
                    left: toggleLeft ? !state.indicators.left : state.indicators.left,
                    right: toggleRight ? !state.indicators.right : state.indicators.right,
                },
                openWindows: toggleWindowsDown ? true : toggleWindowsUp ? false : state.openWindows,
            });
        }
    }
}
