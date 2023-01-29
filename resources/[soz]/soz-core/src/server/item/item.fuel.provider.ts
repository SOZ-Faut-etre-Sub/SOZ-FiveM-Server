import { isVehicleModelElectric } from '@public/shared/vehicle/vehicle';

import { Once } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent } from '../../shared/event';
import { CommonItem, InventoryItem } from '../../shared/item';
import { InventoryManager } from '../inventory/inventory.manager';
import { Notifier } from '../notifier';
import { PlayerService } from '../player/player.service';
import { ProgressService } from '../player/progress.service';
import { VehicleSpawner } from '../vehicle/vehicle.spawner';
import { VehicleStateService } from '../vehicle/vehicle.state.service';
import { ItemService } from './item.service';

export const JERRYCAN_FUEL_AMOUNT = 30;
export const BATTERY_FUEL_AMOUNT = 33;

@Provider()
export class ItemFuelProvider {
    @Inject(ItemService)
    private item: ItemService;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(VehicleSpawner)
    private vehicleSpawner: VehicleSpawner;

    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    public async useEssenceJerrycan(source: number, item: CommonItem, inventoryItem: InventoryItem) {
        const closestVehicle = await this.vehicleSpawner.getClosestVehicle(source);

        if (!closestVehicle) {
            this.notifier.notify(source, 'Aucun véhicule à proximité');

            return;
        }

        const vehicleType = GetVehicleType(closestVehicle.vehicleEntityId);

        if (
            vehicleType === 'heli' ||
            vehicleType === 'plane' ||
            isVehicleModelElectric(GetEntityModel(closestVehicle.vehicleEntityId))
        ) {
            this.notifier.notify(source, 'Vous ne pouvez pas utiliser ce carburant pour ce véhicule.', 'error');

            return;
        }

        const vehicleState = this.vehicleStateService.getVehicleState(closestVehicle.vehicleEntityId);

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

        const filledFuel = Math.round(progress * JERRYCAN_FUEL_AMOUNT);
        const owner = NetworkGetEntityOwner(closestVehicle.vehicleEntityId);

        TriggerClientEvent(ClientEvent.VEHICLE_SYNC_CONDITION, owner, closestVehicle.vehicleNetworkId, {
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

        const vehicleType = GetVehicleType(closestVehicle.vehicleEntityId);

        if (vehicleType !== 'heli' && vehicleType !== 'plane') {
            this.notifier.notify(source, 'Vous ne pouvez pas utiliser ce carburant pour ce véhicule', 'error');

            return;
        }

        const vehicleState = this.vehicleStateService.getVehicleState(closestVehicle.vehicleEntityId);

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

        const filledFuel = Math.round(progress * JERRYCAN_FUEL_AMOUNT);
        const owner = NetworkGetEntityOwner(closestVehicle.vehicleEntityId);

        TriggerClientEvent(ClientEvent.VEHICLE_SYNC_CONDITION, owner, closestVehicle.vehicleNetworkId, {
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

        const vehicleState = this.vehicleStateService.getVehicleState(closestVehicle.vehicleEntityId);

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
        const owner = NetworkGetEntityOwner(closestVehicle.vehicleEntityId);

        TriggerClientEvent(ClientEvent.VEHICLE_SYNC_CONDITION, owner, closestVehicle.vehicleNetworkId, {
            oilLevel: Math.min(vehicleState.condition.oilLevel + filledOil, 100),
        });

        this.notifier.notify(source, "Vous avez ~g~utilisé~s~ un bidon d'huile.", 'success');
    }

    public async useLithiumBattery(source: number, item: CommonItem, inventoryItem: InventoryItem) {
        const closestVehicle = await this.vehicleSpawner.getClosestVehicle(source);

        if (!closestVehicle) {
            this.notifier.notify(source, 'Aucun véhicule à proximité');

            return;
        }

        if (!isVehicleModelElectric(GetEntityModel(closestVehicle.vehicleEntityId))) {
            this.notifier.notify(source, "Ce véhicule n'a pas de batterie Lithium-ion", 'error');
            return;
        }

        const { completed } = await this.progressService.progress(
            source,
            'battery_change',
            'Changement de la batterie...',
            10000,
            {
                name: 'car_bomb_mechanic',
                dictionary: 'mp_car_bomb',
                options: {
                    onlyUpperBody: true,
                    repeat: true,
                },
            },
            {
                disableMovement: true,
                disableCarMovement: true,
                disableCombat: true,
                disableMouse: false,
            }
        );

        if (!completed) {
            return;
        }

        if (!this.inventoryManager.addItemToInventory(source, 'empty_lithium_battery', 1).success) {
            this.notifier.notify(source, 'Vous êtes ~r~trop chargé~s~ pour récupérer la batterie vide.', 'error');
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

        const owner = NetworkGetEntityOwner(closestVehicle.vehicleEntityId);

        TriggerClientEvent(ClientEvent.VEHICLE_SYNC_CONDITION, owner, closestVehicle.vehicleNetworkId, {
            oilLevel: 100,
        });

        this.notifier.notify(source, 'Vous avez ~g~changé~s~ la batterie du véhicule.', 'success');
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

        const vehicleState = this.vehicleStateService.getVehicleState(closestVehicle.vehicleEntityId);

        if (vehicleState.condition.fuelLevel >= 67) {
            this.notifier.notify(
                source,
                'La batterie est ~r~trop chargée~s~ pour utiliser batterie portable.',
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
        const owner = NetworkGetEntityOwner(closestVehicle.vehicleEntityId);

        TriggerClientEvent(ClientEvent.VEHICLE_SYNC_CONDITION, owner, closestVehicle.vehicleNetworkId, {
            fuelLevel: vehicleState.condition.fuelLevel + filledFuel,
        });

        this.notifier.notify(source, 'Vous avez ~g~rechargé~s~ la batterie du véhicule.', 'success');
    }

    @Once()
    public async onStart() {
        this.item.setItemUseCallback('essence_jerrycan', this.useEssenceJerrycan.bind(this));
        this.item.setItemUseCallback('kerosene_jerrycan', this.useKeroseneJerrycan.bind(this));
        this.item.setItemUseCallback('oil_jerrycan', this.useOilJerrycan.bind(this));
        this.item.setItemUseCallback('lithium_battery', this.useLithiumBattery.bind(this));
        this.item.setItemUseCallback('car_portable_battery', this.usePortableBattery.bind(this));
    }
}
