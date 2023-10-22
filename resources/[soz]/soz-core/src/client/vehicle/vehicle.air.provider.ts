import { Command } from '../../core/decorators/command';
import { OnEvent } from '../../core/decorators/event';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { ClientEvent } from '../../shared/event';
import { VehicleClass, VehicleSeat } from '../../shared/vehicle/vehicle';

const ALLOWED_AIR_CONTROL: Partial<Record<VehicleClass, true>> = {
    [VehicleClass.Helicopters]: true,
    [VehicleClass.Motorcycles]: true,
    [VehicleClass.Cycles]: true,
    [VehicleClass.Boats]: true,
    [VehicleClass.Planes]: true,
    [VehicleClass.Military]: true,
};

@Provider()
export class VehicleAirProvider {
    @OnEvent(ClientEvent.BASE_ENTERED_VEHICLE)
    private async onBaseEnteredVehicle(vehicle) {
        const model = GetEntityModel(vehicle);

        if (IsThisModelAHeli(model)) {
            SetHeliTurbulenceScalar(vehicle, 0.0);
        }

        if (IsThisModelAPlane(model)) {
            SetPlaneTurbulenceMultiplier(vehicle, 0.0);
        }
    }

    @Command('soz_vehicle_toggle_vehicle_rappel', {
        description: 'Descendre en rappel',
        keys: [
            {
                mapper: 'keyboard',
                key: 'E',
            },
        ],
    })
    async rappelling() {
        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);

        if (!vehicle) {
            return;
        }

        const isDriver = GetPedInVehicleSeat(vehicle, VehicleSeat.Driver) === ped;
        const isCopilot = GetPedInVehicleSeat(vehicle, VehicleSeat.Copilot) === ped;

        if (DoesVehicleAllowRappel(vehicle) && !isDriver && !isCopilot) {
            TaskRappelFromHeli(ped, 0x41200000);
        }
    }

    @Tick(TickInterval.EVERY_FRAME)
    public disableVehicleAirControl(): void {
        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);

        if (!vehicle) {
            return;
        }

        if (GetPedInVehicleSeat(vehicle, VehicleSeat.Driver) !== ped) {
            return;
        }

        const vehicleClass = GetVehicleClass(vehicle);

        if (ALLOWED_AIR_CONTROL[vehicleClass]) {
            return;
        }

        const vehicleModel = GetEntityModel(vehicle);

        if (vehicleModel === GetHashKey('deluxo')) {
            return;
        }

        if (IsEntityInAir(vehicle) || IsEntityUpsidedown(vehicle)) {
            DisableControlAction(2, 59, true);
            DisableControlAction(2, 60, true);
        }
    }
}
