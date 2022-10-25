import { Once } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { CommonItem, InventoryItem } from '../../shared/item';
import { Notifier } from '../notifier';
import { PlayerService } from '../player/player.service';
import { ProgressService } from '../player/progress.service';
import { VehicleSpawner } from '../vehicle/vehicle.spawner';
import { VehicleStateService } from '../vehicle/vehicle.state.service';
import { InventoryManager } from './inventory.manager';
import { ItemService } from './item.service';

export const JERRYCAN_FUEL_AMOUNT = 30;

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

        if (vehicleType === 'heli' || vehicleType === 'plane') {
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

        this.vehicleStateService.updateVehicleState(closestVehicle.vehicleEntityId, {
            condition: {
                ...vehicleState.condition,
                fuelLevel: vehicleState.condition.fuelLevel + filledFuel,
            },
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

        this.vehicleStateService.updateVehicleState(closestVehicle.vehicleEntityId, {
            condition: {
                ...vehicleState.condition,
                fuelLevel: vehicleState.condition.fuelLevel + filledFuel,
            },
        });

        this.notifier.notify(source, 'Vous avez ~g~utilisé~s~ un jerrycan de kérosène.', 'success');
    }

    public async useOilJerrycan(source: number, item: CommonItem, inventoryItem: InventoryItem) {
        const closestVehicle = await this.vehicleSpawner.getClosestVehicle(source);

        if (!closestVehicle) {
            this.notifier.notify(source, 'Aucun véhicule à proximité');

            return;
        }

        const vehicleState = this.vehicleStateService.getVehicleState(closestVehicle.vehicleEntityId);

        if (vehicleState.condition.oilLevel >= 70) {
            this.notifier.notify(source, "Vous avez ~r~trop d'huile~s~ pour utiliser un jerrycan.", 'error');

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

        const filledOil = Math.round(progress * JERRYCAN_FUEL_AMOUNT);

        this.vehicleStateService.updateVehicleState(closestVehicle.vehicleEntityId, {
            condition: {
                ...vehicleState.condition,
                oilLevel: vehicleState.condition.oilLevel + filledOil,
            },
        });

        this.notifier.notify(source, 'Vous avez ~g~utilisé~s~ un jerrycan de kérosène.', 'success');
    }

    @Once()
    public onStart() {
        this.item.setItemUseCallback('essence_jerrycan', this.useEssenceJerrycan.bind(this));
        this.item.setItemUseCallback('kerosene_jerrycan', this.useOilJerrycan.bind(this));
        this.item.setItemUseCallback('oil_jerrycan', this.useKeroseneJerrycan.bind(this));
    }
}
