import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import { wait } from '../../core/utils';
import { getDistance, Vector3 } from '../../shared/polyzone/vector';
import { getRandomInt } from '../../shared/random';
import { isVehicleModelElectric, VehicleClass } from '../../shared/vehicle/vehicle';
import { VehicleConditionProvider } from './vehicle.condition.provider';
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

@Provider()
export class VehicleDamageProvider {
    @Inject(VehicleConditionProvider)
    private vehicleConditionProvider: VehicleConditionProvider;

    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    private currentVehicleStatus: VehicleStatus | null = null;

    private currentVehiclePositionForTemporaryTire: CurrentVehiclePosition | null = null;

    private adminNoStall = false;

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

        if (this.vehicleConditionProvider.getAdminNoStall()) {
            return;
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

        const tireBurstCompletely = { ...state.condition.tireBurstCompletely };
        const tireTemporaryRepairDistance = { ...state.condition.tireTemporaryRepairDistance };

        let applyCondition = false;

        for (const tireKey of keys) {
            const distance = tireTemporaryRepairDistance[tireKey] + diffDistance;

            if (distance < TIRE_TEMPORARY_REPAIR_DISTANCE) {
                tireTemporaryRepairDistance[tireKey] = distance;
            } else {
                delete tireTemporaryRepairDistance[tireKey];
                tireBurstCompletely[tireKey] = true;
                applyCondition = true;
            }
        }

        this.vehicleStateService.updateVehicleCondition(vehicle, {
            tireBurstCompletely,
            tireTemporaryRepairDistance,
        });

        if (applyCondition) {
            this.vehicleConditionProvider.applyVehicleTire(
                vehicle,
                state.condition.tireHealth,
                tireBurstCompletely,
                state.condition.tireBurstState
            );
        }
    }
}
