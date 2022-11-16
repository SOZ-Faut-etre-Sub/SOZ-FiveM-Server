import { Command } from '../../core/decorators/command';
import { OnEvent } from '../../core/decorators/event';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { ClientEvent } from '../../shared/event';
import { VehicleClass } from '../../shared/vehicle/vehicle';

const ALLOWED_AIR_CONTROL: VehicleClass[] = [
    VehicleClass.Helicopters,
    VehicleClass.Motorcycles,
    VehicleClass.Cycles,
    VehicleClass.Boats,
    VehicleClass.Planes,
    VehicleClass.Military,
];

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

        const isDriver = GetPedInVehicleSeat(vehicle, -1) === ped;
        const isCopilot = GetPedInVehicleSeat(vehicle, 0) === ped;

        if (DoesVehicleAllowRappel(vehicle) && !isDriver && !isCopilot) {
            TaskRappelFromHeli(ped, 0x41200000);
        }
    }

    @Tick(TickInterval.EVERY_FRAME)
    public disableVehicleAirControl(): void {
        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);
        const vehicleClass = GetVehicleClass(vehicle);

        if (!vehicle) {
            return;
        }

        if (GetPedInVehicleSeat(vehicle, -1) !== ped) {
            return;
        }

        if (ALLOWED_AIR_CONTROL.includes(vehicleClass)) {
            return;
        }

        if (IsEntityInAir(vehicle) || IsEntityUpsidedown(vehicle)) {
            DisableControlAction(2, 59, true);
            DisableControlAction(2, 60, true);
        }
    }
}
