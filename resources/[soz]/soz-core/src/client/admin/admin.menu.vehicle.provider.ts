import { OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { emitRpc } from '../../core/rpc';
import { NuiEvent, ServerEvent } from '../../shared/event';
import { Err, Ok } from '../../shared/result';
import { RpcServerEvent } from '../../shared/rpc';
import { groupBy } from '../../shared/utils/array';
import { VehicleConfiguration, VehicleModType } from '../../shared/vehicle/modification';
import { Vehicle, VehicleCategory } from '../../shared/vehicle/vehicle';
import { InputService } from '../nui/input.service';
import { VehicleDamageProvider } from '../vehicle/vehicle.damage.provider';
import { VehicleModificationService } from '../vehicle/vehicle.modification.service';
import { VehicleStateService } from '../vehicle/vehicle.state.service';

@Provider()
export class AdminMenuVehicleProvider {
    @Inject(InputService)
    private inputService: InputService;

    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    @Inject(VehicleModificationService)
    private vehicleModificationService: VehicleModificationService;

    @Inject(VehicleDamageProvider)
    private vehicleDamageProvider: VehicleDamageProvider;

    @OnNuiEvent(NuiEvent.AdminGetVehicles)
    public async getVehicles() {
        const vehicles = await emitRpc<any[]>(RpcServerEvent.ADMIN_GET_VEHICLES);

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
            TriggerServerEvent(ServerEvent.ADMIN_VEHICLE_SPAWN, input);
        }
        return Ok(true);
    }

    @OnNuiEvent(NuiEvent.AdminMenuVehicleRepair)
    public async onAdminMenuVehicleRepair() {
        const vehicle = GetVehiclePedIsIn(PlayerPedId(), false);
        if (vehicle) {
            this.vehicleStateService.updateVehicleCondition(vehicle, {
                bodyHealth: 1000,
                engineHealth: 1000,
                tankHealth: 1000,
                windowStatus: {},
                doorStatus: {},
            });
        }
        return Ok(true);
    }

    @OnNuiEvent(NuiEvent.AdminMenuVehicleClean)
    public async onAdminMenuVehicleClean() {
        const vehicle = GetVehiclePedIsIn(PlayerPedId(), false);
        if (vehicle) {
            this.vehicleStateService.updateVehicleCondition(vehicle, {
                dirtLevel: 0.0,
            });
        }
        return Ok(true);
    }

    @OnNuiEvent(NuiEvent.AdminMenuVehicleRefill)
    public async onAdminMenuVehicleRefill() {
        const vehicle = GetVehiclePedIsIn(PlayerPedId(), false);

        if (vehicle) {
            this.vehicleStateService.updateVehicleCondition(vehicle, {
                fuelLevel: 100.0,
            });
        }
    }

    @OnNuiEvent(NuiEvent.AdminMenuVehicleSave)
    public async onAdminMenuVehicleSave() {
        const vehicle = GetVehiclePedIsIn(PlayerPedId(), false);
        const configuration = this.vehicleModificationService.getVehicleConfiguration(vehicle);
        const vehicleModel = GetEntityModel(vehicle);
        const vehicleName = GetDisplayNameFromVehicleModel(vehicleModel).toLowerCase();
        const vehicleClass = GetVehicleClass(vehicle);

        TriggerServerEvent(ServerEvent.ADMIN_ADD_VEHICLE, vehicleModel, vehicleName, vehicleClass, configuration);
        return Ok(true);
    }

    @OnNuiEvent(NuiEvent.AdminMenuVehicleSetFBIConfig)
    public async onAdminMenuVehicleSetFBIConfig() {
        const vehicle = GetVehiclePedIsIn(PlayerPedId(), false);

        if (vehicle) {
            const configuration = this.vehicleModificationService.getVehicleConfiguration(vehicle);
            const fbiConfiguration: VehicleConfiguration = {
                ...configuration,
                color: {
                    primary: 12,
                    secondary: 12,
                    pearlescent: 12,
                    rim: 12,
                },
                windowTint: 1,
                modification: {
                    turbo: true,
                    engine: GetNumVehicleMods(vehicle, VehicleModType.Engine) - 1,
                    brakes: GetNumVehicleMods(vehicle, VehicleModType.Brakes) - 1,
                    transmission: GetNumVehicleMods(vehicle, VehicleModType.Transmission) - 1,
                    suspension: GetNumVehicleMods(vehicle, VehicleModType.Suspension) - 1,
                    armor: GetNumVehicleMods(vehicle, VehicleModType.Armor) - 1,
                },
            };

            const vehicleNetworkId = NetworkGetNetworkIdFromEntity(vehicle);
            const newVehicleConfiguration = await emitRpc<VehicleConfiguration>(
                RpcServerEvent.VEHICLE_CUSTOM_SET_MODS,
                vehicleNetworkId,
                fbiConfiguration,
                configuration
            );

            this.vehicleModificationService.applyVehicleConfiguration(vehicle, newVehicleConfiguration);
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
        TriggerServerEvent(ServerEvent.ADMIN_VEHICLE_DELETE);
    }

    @OnNuiEvent(NuiEvent.AdminToggleNoStall)
    public async setNoStall(value: boolean): Promise<void> {
        this.vehicleDamageProvider.setAdminNoStall(value);
    }
}
