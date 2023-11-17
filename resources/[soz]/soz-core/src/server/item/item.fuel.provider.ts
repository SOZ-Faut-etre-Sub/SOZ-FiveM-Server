import { isVehicleModelElectric } from '@public/shared/vehicle/vehicle';

import { Once } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { CommonItem, InventoryItem } from '../../shared/item';
import { InventoryManager } from '../inventory/inventory.manager';
import { Notifier } from '../notifier';
import { ProgressService } from '../player/progress.service';
import { VehicleRepository } from '../repository/vehicle.repository';
import { VehicleSpawner } from '../vehicle/vehicle.spawner';
import { VehicleStateService } from '../vehicle/vehicle.state.service';
import { ItemService } from './item.service';

export const BATTERY_FUEL_AMOUNT = 33;

@Provider()
export class ItemFuelProvider {
    @Inject(ItemService)
    private item: ItemService;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(VehicleSpawner)
    private vehicleSpawner: VehicleSpawner;

    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    @Inject(VehicleRepository)
    private vehicleRepository: VehicleRepository;

    public async useEssenceJerrycan(source: number, item: CommonItem, inventoryItem: InventoryItem) {
        if (this.item.isItemExpired(inventoryItem)) {
            this.notifier.notify(source, "L'essence du jerrycan est périmé.", 'error');

            return;
        }

        const closestVehicle = await this.vehicleSpawner.getClosestVehicle(source);

        if (!closestVehicle) {
            this.notifier.notify(source, 'Aucun véhicule à proximité');

            return;
        }

        if (closestVehicle.isInside) {
            this.notifier.notify(source, "Vous ne pouvez pas utiliser ceci à l'intérieur d'un véhicule", 'error');

            return;
        }

        const vehicleType = GetVehicleType(closestVehicle.vehicleEntityId);

        if (
            vehicleType === 'heli' ||
            vehicleType === 'plane' ||
            vehicleType === 'boat' ||
            isVehicleModelElectric(GetEntityModel(closestVehicle.vehicleEntityId))
        ) {
            this.notifier.notify(source, 'Vous ne pouvez pas utiliser ce carburant pour ce véhicule.', 'error');

            return;
        }

        const vehModel = await this.vehicleRepository.findByHash(GetEntityModel(closestVehicle.vehicleEntityId));
        if (vehModel && vehModel.category == 'Cycles') {
            this.notifier.notify(source, 'Vous ne pouvez pas utiliser ce carburant pour ce véhicule.', 'error');

            return;
        }

        const vehicleState = this.vehicleStateService.getVehicleState(closestVehicle.vehicleNetworkId);

        if (vehicleState.condition.fuelLevel >= 70) {
            this.notifier.notify(source, "Vous avez ~r~trop d'essence~s~ pour utiliser un jerrycan.", 'error');

            return;
        }

        if (
            !this.inventoryManager.removeItemFromInventory(
                source,
                item.name,
                1,
                inventoryItem.metadata,
                inventoryItem.slot
            )
        ) {
            return;
        }

        const { progress } = await this.progressService.progress(
            source,
            'fuel_jerrycan_essence',
            'Remplissage du véhicule...',
            10000,
            {
                dictionary: 'timetable@gardener@filling_can',
                name: 'gar_ig_5_filling_can',
            },
            {
                disableMovement: true,
                disableCarMovement: true,
                disableCombat: true,
                disableMouse: false,
            }
        );

        const amount = {
            essence_jerrycan_low: 20,
            essence_jerrycan: 30,
        }[item.name];
        const filledFuel = Math.round(progress * amount);

        this.vehicleStateService.updateVehicleCondition(closestVehicle.vehicleNetworkId, {
            fuelLevel: vehicleState.condition.fuelLevel + filledFuel,
        });

        this.notifier.notify(source, "Vous avez ~g~utilisé~s~ un jerrycan d'essence.", 'success');
    }

    public async useKeroseneJerrycan(source: number, item: CommonItem, inventoryItem: InventoryItem) {
        const closestVehicle = await this.vehicleSpawner.getClosestVehicle(source);

        if (!closestVehicle) {
            this.notifier.notify(source, 'Aucun véhicule à proximité');

            return;
        }

        if (closestVehicle.isInside) {
            this.notifier.notify(source, "Vous ne pouvez pas utiliser ceci à l'intérieur d'un véhicule", 'error');

            return;
        }

        const vehicleType = GetVehicleType(closestVehicle.vehicleEntityId);

        if (vehicleType !== 'heli' && vehicleType !== 'plane' && vehicleType !== 'boat') {
            this.notifier.notify(source, 'Vous ne pouvez pas utiliser ce carburant pour ce véhicule', 'error');

            return;
        }

        const vehicleState = this.vehicleStateService.getVehicleState(closestVehicle.vehicleNetworkId);

        if (vehicleState.condition.fuelLevel >= 70) {
            this.notifier.notify(source, 'Vous avez ~r~trop de kérosène~s~ pour utiliser un jerrycan.', 'error');

            return;
        }

        if (
            !this.inventoryManager.removeItemFromInventory(
                source,
                item.name,
                1,
                inventoryItem.metadata,
                inventoryItem.slot
            )
        ) {
            return;
        }

        const { progress } = await this.progressService.progress(
            source,
            'fuel_jerrycan_kerosene',
            'Remplissage du véhicule...',
            10000,
            {
                dictionary: 'timetable@gardener@filling_can',
                name: 'gar_ig_5_filling_can',
            },
            {
                disableMovement: true,
                disableCarMovement: true,
                disableCombat: true,
                disableMouse: false,
            }
        );

        const amount = {
            kerozene_jerrycan_low: 20,
            kerosene_jerrycan: 30,
        }[item.name];
        const filledFuel = Math.round(progress * amount);

        this.vehicleStateService.updateVehicleCondition(closestVehicle.vehicleNetworkId, {
            fuelLevel: vehicleState.condition.fuelLevel + filledFuel,
        });

        this.notifier.notify(source, 'Vous avez ~g~utilisé~s~ un jerrycan de kérosène.', 'success');
    }

    public async useOilJerrycan(source: number, item: CommonItem, inventoryItem: InventoryItem) {
        const closestVehicle = await this.vehicleSpawner.getClosestVehicle(source);

        if (!closestVehicle) {
            this.notifier.notify(source, 'Aucun véhicule à proximité');

            return;
        }

        if (isVehicleModelElectric(GetEntityModel(closestVehicle.vehicleEntityId))) {
            this.notifier.notify(source, "Ce véhicule n'a pas besoin d'huile, il est éléctrique !", 'error');

            return;
        }

        if (closestVehicle.isInside) {
            this.notifier.notify(source, "Vous ne pouvez pas utiliser ceci à l'intérieur d'un véhicule", 'error');

            return;
        }

        const vehicleState = this.vehicleStateService.getVehicleState(closestVehicle.vehicleNetworkId);

        if (
            !this.inventoryManager.removeItemFromInventory(
                source,
                item.name,
                1,
                inventoryItem.metadata,
                inventoryItem.slot
            )
        ) {
            return;
        }

        const { progress } = await this.progressService.progress(
            source,
            'oil_jerrycan_kerosene',
            'Remplissage du véhicule...',
            10000,
            {
                dictionary: 'timetable@gardener@filling_can',
                name: 'gar_ig_5_filling_can',
            },
            {
                disableMovement: true,
                disableCarMovement: true,
                disableCombat: true,
                disableMouse: false,
            }
        );

        const filledOil = Math.round(progress * (100 - vehicleState.condition.oilLevel));

        this.vehicleStateService.updateVehicleCondition(closestVehicle.vehicleNetworkId, {
            oilLevel: Math.min(vehicleState.condition.oilLevel + filledOil, 100),
        });

        this.notifier.notify(source, "Vous avez ~g~utilisé~s~ un bidon d'huile.", 'success');
    }

    public async usePortableBattery(source: number, item: CommonItem, inventoryItem: InventoryItem) {
        const closestVehicle = await this.vehicleSpawner.getClosestVehicle(source);

        if (!closestVehicle) {
            this.notifier.notify(source, 'Aucun véhicule à proximité');

            return;
        }

        if (!isVehicleModelElectric(GetEntityModel(closestVehicle.vehicleEntityId))) {
            this.notifier.notify(source, "Ce véhicule ne roule pas à l'éléctrique", 'error');
            return;
        }

        const vehicleState = this.vehicleStateService.getVehicleState(closestVehicle.vehicleNetworkId);

        if (vehicleState.condition.fuelLevel >= 67) {
            this.notifier.notify(
                source,
                'La batterie est ~r~trop chargée~s~ pour utiliser une batterie portable.',
                'error'
            );

            return;
        }

        if (
            !this.inventoryManager.removeItemFromInventory(
                source,
                item.name,
                1,
                inventoryItem.metadata,
                inventoryItem.slot
            )
        ) {
            return;
        }

        const { progress } = await this.progressService.progress(
            source,
            'recharger_battery',
            'Rechargement de la batterie...',
            10000,
            {
                dictionary: 'timetable@gardener@filling_can',
                name: 'gar_ig_5_filling_can',
            },
            {
                disableMovement: true,
                disableCarMovement: true,
                disableCombat: true,
                disableMouse: false,
            }
        );

        const filledFuel = Math.round(progress * BATTERY_FUEL_AMOUNT);

        this.vehicleStateService.updateVehicleCondition(closestVehicle.vehicleNetworkId, {
            fuelLevel: vehicleState.condition.fuelLevel + filledFuel,
        });

        this.notifier.notify(source, 'Vous avez ~g~rechargé~s~ la batterie du véhicule.', 'success');
    }

    @Once()
    public async onStart() {
        this.item.setItemUseCallback('essence_jerrycan', this.useEssenceJerrycan.bind(this));
        this.item.setItemUseCallback('essence_jerrycan_low', this.useEssenceJerrycan.bind(this));
        this.item.setItemUseCallback('kerosene_jerrycan', this.useKeroseneJerrycan.bind(this));
        this.item.setItemUseCallback('kerozene_jerrycan_low', this.useKeroseneJerrycan.bind(this));
        this.item.setItemUseCallback('oil_jerrycan', this.useOilJerrycan.bind(this));
        this.item.setItemUseCallback('car_portable_battery', this.usePortableBattery.bind(this));
    }
}
