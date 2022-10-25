import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { StateBagHandler } from '../../core/decorators/state';
import { Tick } from '../../core/decorators/tick';
import { wait } from '../../core/utils';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { Vector3 } from '../../shared/polyzone/vector';
import { getRandomInt } from '../../shared/random';
import { VehicleCondition } from '../../shared/vehicle';
import { VehicleService } from './vehicle.service';

type LastVehicleStatus = {
    engineHealth: number;
    bodyHealth: number;
    tankHealth: number;
    vehicle: number;
};

@Provider()
export class VehicleConditionProvider {
    @Inject(VehicleService)
    private vehicleService: VehicleService;

    @StateBagHandler('condition', null)
    private async onVehicleConditionChange(bag: string, key: string, value: VehicleCondition) {
        const vehicle = NetworkGetEntityFromNetworkId(parseInt(bag));

        if (!vehicle) {
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

        if (healthDiff > 300) {
            let waitTime =
                (previousState.condition.engineHealth / value.engineHealth +
                    previousState.condition.bodyHealth / value.bodyHealth) *
                getRandomInt(150, 200);
            setTimeout(async () => {
                SetVehicleUndriveable(vehicle, true);

                while (waitTime > 0) {
                    DisableControlAction(0, 71, true);
                    DisableControlAction(0, 72, true);

                    if (GetIsVehicleEngineRunning(vehicle)) {
                        SetVehicleEngineOn(vehicle, false, true, false);
                    }

                    await wait(1);
                    waitTime--;
                }
                SetVehicleUndriveable(vehicle, false);
                SetVehicleEngineOn(vehicle, true, false, true);
            }, 0);
        }
    }

    @OnEvent(ClientEvent.VEHICLE_CHECK_CONDITION)
    private async checkCondition(vehicleNetworkId: number) {
        const vehicle = NetworkGetEntityFromNetworkId(vehicleNetworkId);

        if (!vehicle) {
            return;
        }

        if (!NetworkHasControlOfEntity(vehicle)) {
            return;
        }

        // Check dead status
        this.checkVehicleWater(vehicle);

        // Update vehicle damage
        this.updateVehicleDamage(vehicle);

        const state = this.vehicleService.getVehicleState(vehicle);

        // Check vehicle condition
        const newCondition = {
            ...state.condition,
            ...this.vehicleService.getVehicleCondition(vehicle),
        };

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

    private checkVehicleWater(vehicle: number) {
        const hash = GetEntityModel(vehicle);

        if (!IsThisModelABike(hash) && !IsThisModelACar(hash) && !IsThisModelAQuadbike(hash)) {
            return;
        }

        const state = this.vehicleService.getVehicleState(vehicle);

        if (state.deadInWater) {
            return;
        }

        const vehiclePosition = GetEntityCoords(vehicle, false) as Vector3;
        const [inWater, waterHeight] = GetWaterHeight(vehiclePosition[0], vehiclePosition[1], vehiclePosition[2]);

        if (inWater && waterHeight > vehiclePosition[2]) {
            this.vehicleService.updateVehicleState(vehicle, {
                deadInWater: true,
            });

            TriggerServerEvent(ServerEvent.VEHICLE_SET_DEAD, vehicle);
        }
    }

    private updateVehicleDamage(vehicle: number) {
        /**
         * [vie en cours]
         *
         * [vie delta] = [vie last frame] - [vie en cours]
         * [vie delta scaled] = [vie delta] * global factor * class factor
         *
         *
         * -> get max degats parmi les 3 possibilités
         *
         * -> scale down si trop de dégats ou si seuile critique
         *
         * [nouvelle vie] = [vie last frame] - [delta final]
         */
        return {};
    }
}
