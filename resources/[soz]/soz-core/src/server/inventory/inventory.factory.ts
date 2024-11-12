import { Inject, Injectable } from '@core/decorators/injectable';
import { ItemService } from '@public/server/item/item.service';
import { getRandomInt } from '@public/shared/random';
import { deepEqual } from '@public/shared/util';
import { VehicleClass, VehicleState } from '@public/shared/vehicle/vehicle';

import {
    DEFAULT_INVENTORY_CONFIGURATION,
    getItemsWeight,
    INVENTORY_CONFIGURATIONS,
    INVENTORY_DEFAULT_STATE,
    INVENTORY_ITEM_CREATORS,
    INVENTORY_STATES,
    InventoryConfiguration,
    InventoryItem,
    InventoryState,
    InventoryType,
    VEHICLE_CONFIGURATION_BY_VEHICLE_CLASS,
    VEHICLE_CONFIGURATION_BY_VEHICLE_MODEL,
} from '../../shared/inventory';
import { PrismaService } from '../database/prisma.service';
import { LockService } from '../lock.service';
import { PlayerService } from '../player/player.service';
import { Inventory } from './inventory';

type AccessChecker = {
    filter: (id: string, type: InventoryType, config: InventoryConfiguration) => boolean;
    check: (source: number, inventory: Inventory) => boolean;
};

type AccessCreator = {
    filter: (id: string, type: InventoryType, config: InventoryConfiguration) => boolean;
    accessCreator: (source: number, inventory: Inventory) => InventoryState | Promise<InventoryState>;
};

@Injectable()
export class InventoryFactory {
    @Inject(PrismaService)
    private database: PrismaService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(LockService)
    private lockService: LockService;

    @Inject(ItemService)
    private itemService: ItemService;

    private inventories: Map<string, Inventory> = new Map();

    private accessCheckers: AccessChecker[] = [];

    private stateCreators: AccessCreator[] = [];

    addAccessChecker(filter: AccessChecker['filter'], check: AccessChecker['check']) {
        this.accessCheckers.push({ filter, check });
    }

    addStateCreator(filter: AccessCreator['filter'], accessCreator: AccessCreator['accessCreator']) {
        this.stateCreators.push({ filter, accessCreator: accessCreator });
    }

    async getPlayerInventory(source: number): Promise<Inventory | null> {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return null;
        }

        const inventoryId = `player_${player.citizenid}`;

        return this.getOrCreate(inventoryId, InventoryType.Player, {
            owner: player.citizenid,
            persistent: true,
        });
    }

    async getVehicleInventory(
        entityNetId: number,
        vehicleClass: VehicleClass,
        vehicleState: Readonly<VehicleState>
    ): Promise<Inventory | null> {
        const vehicle = NetworkGetEntityFromNetworkId(entityNetId) as number;

        if (!vehicle) {
            return null;
        }

        const model = GetEntityModel(vehicle);
        const plate = vehicleState.volatile.plate || GetVehicleNumberPlateText(vehicle);
        const persistent = vehicleState.volatile.isPlayerVehicle;

        const configuration = {
            ...(VEHICLE_CONFIGURATION_BY_VEHICLE_CLASS[vehicleClass] || {}),
            ...(VEHICLE_CONFIGURATION_BY_VEHICLE_MODEL[model] || {}),
            persistent,
        };

        return this.getOrCreate('trunk_' + plate, InventoryType.Trunk, configuration);
    }

    async getVehicleWeight(plate: string): Promise<number> {
        const inventoryId = `trunk_${plate}`;

        if (this.inventories.has(inventoryId)) {
            const inventory = this.inventories.get(inventoryId);

            return inventory.weight();
        }

        const databaseInventory = await this.database.inventories.findUnique({
            select: {
                items: true,
            },
            where: {
                id: inventoryId,
            },
        });

        if (!databaseInventory) {
            return 0;
        }

        let items = databaseInventory.items as Record<number, InventoryItem> | InventoryItem[];

        if (Array.isArray(databaseInventory.items)) {
            items = {};

            for (const item of databaseInventory.items as InventoryItem[]) {
                items[item.slot] = item;
            }
        }

        return getItemsWeight(Object.values(items), this.itemService.getItem.bind(this.itemService));
    }

    getLoadedInventories(): Map<string, Inventory> {
        return this.inventories;
    }

    async get(
        id: string,
        fromDatabase = true,
        config: Partial<InventoryConfiguration> = {}
    ): Promise<Inventory | null> {
        return await this.lockService.lock(`get_inventory_${id}`, async () => {
            if (this.inventories.has(id)) {
                return this.inventories.get(id);
            }

            if (!fromDatabase) {
                return null;
            }

            const databaseInventory = await this.database.inventories.findUnique({
                where: {
                    id,
                },
            });

            if (!databaseInventory) {
                return null;
            }

            const configuration = {
                ...DEFAULT_INVENTORY_CONFIGURATION,
                ...(INVENTORY_CONFIGURATIONS[databaseInventory.type] || {}),
                ...config,
                ...(databaseInventory.configuration as Partial<InventoryConfiguration>),
            };

            let items = databaseInventory.items as Record<number, InventoryItem> | InventoryItem[];

            if (Array.isArray(databaseInventory.items)) {
                items = {};

                for (const item of databaseInventory.items as InventoryItem[]) {
                    items[item.slot] = item;
                }
            }

            const inventory = this.createInventory(id, databaseInventory.type as InventoryType, configuration, items);

            this.inventories.set(id, inventory);

            return inventory;
        });
    }

    async getOrCreate(
        id: string,
        type: InventoryType,
        config: Partial<InventoryConfiguration> = {},
        itemsCreator: () => Record<number, InventoryItem> = null
    ): Promise<Inventory> {
        // use lock to avoid double creation
        return await this.lockService.lock(`get_or_create_inventory_${id}`, async () => {
            const inventoryConfiguration = {
                ...DEFAULT_INVENTORY_CONFIGURATION,
                ...(INVENTORY_CONFIGURATIONS[type] || {}),
                ...config,
            } as InventoryConfiguration;

            const existingInventory = await this.get(id, inventoryConfiguration.persistent, inventoryConfiguration);

            if (existingInventory) {
                return existingInventory;
            }

            if (!itemsCreator && INVENTORY_ITEM_CREATORS[type]) {
                itemsCreator = () => {
                    const items: Record<string, InventoryItem> = {};
                    let slot = 1;

                    for (const itemName of Object.keys(INVENTORY_ITEM_CREATORS[type])) {
                        const creatorConfig = INVENTORY_ITEM_CREATORS[type][itemName];
                        const item = this.itemService.getItem(itemName);

                        if (!item) {
                            continue;
                        }

                        const shouldCreate = getRandomInt(0, 100) <= creatorConfig.chance;

                        if (!shouldCreate) {
                            continue;
                        }

                        const max = getRandomInt(creatorConfig.min, creatorConfig.max);

                        for (let amount = max; amount > 0; amount--) {
                            const newItem: InventoryItem = {
                                slot,
                                name: itemName,
                                amount,
                                type: item.type,
                                metadata: {},
                            };

                            const newItems = Object.values(items);
                            newItems.push(newItem);

                            if (
                                getItemsWeight(newItems, this.itemService.getItem.bind(this.itemService)) >
                                inventoryConfiguration.maxWeight
                            ) {
                                continue;
                            }

                            items[slot] = newItem;
                            slot++;

                            break;
                        }
                    }

                    return items;
                };
            }

            const inventory = this.createInventory(
                id,
                type,
                inventoryConfiguration,
                itemsCreator ? itemsCreator() : {}
            );

            if (inventoryConfiguration.persistent) {
                await this.database.inventories.create({
                    data: {
                        id,
                        type,
                        configuration: inventoryConfiguration,
                        items: inventory.items(),
                    },
                });
            }

            this.inventories.set(id, inventory);

            return inventory;
        });
    }

    private createInventory(
        id: string,
        type: InventoryType,
        config: InventoryConfiguration,
        items: Record<number, InventoryItem>
    ): Inventory {
        const accessChecker = this.accessCheckers.find(checker => checker.filter(id, type, config));
        const accessCheck = accessChecker ? accessChecker.check : () => true;

        const stateCreator = this.stateCreators.find(creator => creator.filter(id, type, config));
        const stateCreate = stateCreator
            ? stateCreator.accessCreator
            : (_, inventory: Inventory) => {
                  return INVENTORY_STATES[inventory.type()] || INVENTORY_DEFAULT_STATE;
              };

        const inventory = new Inventory(id, type, config, items, this.itemService, accessCheck, stateCreate);

        if (config.persistent) {
            inventory.subscribe(async (_, items, configuration) => {
                const persistedConfiguration = {};
                const baseConfiguration = {
                    ...DEFAULT_INVENTORY_CONFIGURATION,
                    ...INVENTORY_CONFIGURATIONS[type],
                };

                for (const key of Object.keys(configuration)) {
                    if (deepEqual(baseConfiguration[key], configuration[key])) {
                        continue;
                    }

                    persistedConfiguration[key] = configuration[key];
                }

                await this.database.inventories.update({
                    where: {
                        id,
                    },
                    data: {
                        configuration: persistedConfiguration,
                        items,
                    },
                });
            });
        }

        return inventory;
    }

    public async observe() {
        const promises = [];

        for (const inventory of this.inventories.values()) {
            promises.push(inventory.observe());
        }

        return await Promise.all(promises);
    }

    public async updateVehiclePlate(oldPlate: string, newPlate: string) {
        if (this.inventories.has('trunk_' + oldPlate)) {
            const inventory = this.inventories.get('trunk_' + oldPlate);

            this.inventories.delete('trunk_' + oldPlate);
            this.inventories.set('trunk_' + newPlate, inventory);

            await this.database.inventories.update({
                where: {
                    id: 'trunk_' + oldPlate,
                },
                data: {
                    id: 'trunk_' + newPlate,
                },
            });
        }
    }

    public async delete(id: string) {
        if (this.inventories.has(id)) {
            this.inventories.delete(id);
        }

        await this.database.inventories.delete({
            where: {
                id: id,
            },
        });
    }
}
