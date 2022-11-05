import { OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { emitRpc } from '../../core/rpc';
import { NuiEvent, ServerEvent } from '../../shared/event';
import { Err, Ok } from '../../shared/result';
import { RpcEvent } from '../../shared/rpc';
import { groupBy } from '../../shared/utils/array';
import { Vehicle, VehicleCategory } from '../../shared/vehicle/vehicle';
import { InputService } from '../nui/input.service';
import { NuiDispatch } from '../nui/nui.dispatch';
import { VehicleModificationService } from '../vehicle/vehicle.modification.service';
import { VehicleService } from '../vehicle/vehicle.service';

@Provider()
export class AdminMenuVehicleProvider {
    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    @Inject(InputService)
    private inputService: InputService;

    @Inject(VehicleService)
    private vehicleService: VehicleService;

    @Inject(VehicleModificationService)
    private vehicleModificationService: VehicleModificationService;

    @OnNuiEvent(NuiEvent.AdminGetVehicles)
    public async getVehicles() {
        const vehicles = await emitRpc<any[]>(RpcEvent.ADMIN_GET_VEHICLES);

        let catalog: Record<keyof VehicleCategory, Vehicle[]> = groupBy(vehicles, v => v.category);

        catalog = Object.entries(catalog)
            .sort(([a], [b]) => a.localeCompare(b))
            .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}) as Record<keyof VehicleCategory, Vehicle[]>;

        return Ok({ catalog, vehicles });
    }

    @OnNuiEvent(NuiEvent.AdminMenuVehicleSpawn)
    public async onAdminMenuVehicleSpawn(model?: string) {
        const input =
            model ||
            (await this.inputService.askInput(
                {
                    title: 'Modèle du véhicule',
                    maxCharacters: 32,
                    defaultValue: '',
                },
                model => {
                    if (!model || IsModelInCdimage(model) || IsModelValid(model)) {
                        return Ok(true);
                    }
                    return Err('Le modèle du véhicule est invalide');
                }
            ));
        if (input !== null) {
            TriggerServerEvent(ServerEvent.QBCORE_CALL_COMMAND, 'car', [input]);
        }
        return Ok(true);
    }

    @OnNuiEvent(NuiEvent.AdminMenuVehicleRepair)
    public async onAdminMenuVehicleRepair() {
        const vehicle = GetVehiclePedIsIn(PlayerPedId(), false);
        if (vehicle) {
            SetVehicleFixed(vehicle);
            SetVehicleBodyHealth(vehicle, 1000);
            SetVehicleEngineHealth(vehicle, 1000);
            SetVehicleDeformationFixed(vehicle);
        }
        return Ok(true);
    }

    @OnNuiEvent(NuiEvent.AdminMenuVehicleClean)
    public async onAdminMenuVehicleClean() {
        const vehicle = GetVehiclePedIsIn(PlayerPedId(), false);
        if (vehicle) {
            SetVehicleDirtLevel(vehicle, 0.1);
            WashDecalsFromVehicle(vehicle, 1.0);
        }
        return Ok(true);
    }

    @OnNuiEvent(NuiEvent.AdminMenuVehicleRefill)
    public async onAdminMenuVehicleRefill() {
        const vehicle = GetVehiclePedIsIn(PlayerPedId(), false);

        if (vehicle) {
            const state = this.vehicleService.getVehicleState(vehicle);

            this.vehicleService.updateVehicleState(vehicle, {
                condition: {
                    ...state.condition,
                    fuelLevel: 100.0,
                },
            });
        }
    }

    @OnNuiEvent(NuiEvent.AdminMenuVehicleSave)
    public async onAdminMenuVehicleSave() {
        const vehicle = GetVehiclePedIsIn(PlayerPedId(), false);
        const configuration = this.vehicleModificationService.getVehicleConfiguration(vehicle);
        const vehicleModel = GetEntityModel(vehicle);
        const vehicleName = GetDisplayNameFromVehicleModel(vehicleModel);

        TriggerServerEvent(ServerEvent.ADMIN_ADD_VEHICLE, vehicleModel, vehicleName, configuration);
        return Ok(true);
    }

    @OnNuiEvent(NuiEvent.AdminMenuVehicleSetFBIConfig)
    public async onAdminMenuVehicleSetFBIConfig() {
        const vehicle = GetVehiclePedIsIn(PlayerPedId(), false);
        if (vehicle) {
            SetVehicleModKit(vehicle, 0);

            [11, 12, 13, 15, 16].forEach(modCategory => {
                SetVehicleMod(vehicle, modCategory, GetNumVehicleMods(vehicle, modCategory) - 1, false);
            });

            ToggleVehicleMod(vehicle, 18, true);
            SetVehicleColours(vehicle, 12, 12);
            SetVehicleExtraColours(vehicle, 12, 12);
            SetVehicleWindowTint(vehicle, 1);
        }
        return Ok(true);
    }

    @OnNuiEvent(NuiEvent.AdminMenuVehicleSeeCarPrice)
    public async onAdminMenuVehicleSeeCarPrice(vehicleModel: string) {
        TriggerServerEvent(ServerEvent.ADMIN_VEHICLE_SEE_CAR_PRICE, vehicleModel);
        return Ok(true);
    }

    @OnNuiEvent(NuiEvent.AdminMenuVehicleChangeCarPrice)
    public async onAdminMenuVehicleChangeCarPrice(vehicleModel: string) {
        const newPrice = await this.inputService.askInput(
            {
                title: 'Nouveau prix',
                maxCharacters: 10,
                defaultValue: '',
            },
            value => {
                const number = Number(value);
                if (isNaN(number)) {
                    return Err('Valeur incorrecte');
                }
                return Ok(true);
            }
        );
        if (newPrice !== null) {
            TriggerServerEvent(ServerEvent.ADMIN_VEHICLE_CHANGE_CAR_PRICE, vehicleModel, Number(newPrice));
        }
        return Ok(true);
    }

    @OnNuiEvent(NuiEvent.AdminMenuVehicleDelete)
    public async onAdminMenuVehicleDelete() {
        TriggerServerEvent(ServerEvent.QBCORE_CALL_COMMAND, 'dv');
    }
}
