import { Rpc } from '@public/core/decorators/rpc';
import { ServerEvent } from '@public/shared/event/server';
import { Feature } from '@public/shared/features';
import { Item } from '@public/shared/item';

import { DealershipType } from '../../config/dealership';
import { Command } from '../../core/decorators/command';
import { On, Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { emitClientRpc } from '../../core/rpc';
import { uuidv4, wait } from '../../core/utils';
import { ClientEvent } from '../../shared/event/client';
import { DEFAULT_INVENTORY_CONFIGURATION, getItemsWeight, InventoryItem, InventoryType } from '../../shared/inventory';
import { joaat } from '../../shared/joaat';
import { getLocationHash } from '../../shared/locationhash';
import { getDistance, Point3D, Vector3, Vector4 } from '../../shared/polyzone/vector';
import { getRandomInt } from '../../shared/random';
import { RpcClientEvent, RpcServerEvent } from '../../shared/rpc';
import { Vehicle } from '../../shared/vehicle/vehicle';
import {
    WhatIf2DefaultItems,
    WhatIf2HammerZoneConfig,
    WhatIf2LootInventoryContent,
    WhatIf2LootInventoryType,
    WhatIf2LootType,
    WhatIf2RespawnPoints,
    WhatIf2ShopVehicleList,
    WhatIfSafeZones,
} from '../../shared/whatif';
import { PrismaService } from '../database/prisma.service';
import { FeatureProvider } from '../feature/feature.provider';
import { Inventory } from '../inventory/inventory';
import { InventoryFactory } from '../inventory/inventory.factory';
import { ItemService } from '../item/item.service';
import { Notifier } from '../notifier';
import { ObjectProvider } from '../object/object.provider';
import { PlayerPositionProvider } from '../player/player.position.provider';
import { PlayerService } from '../player/player.service';
import { ProgressService } from '../player/progress.service';
import { QBCore } from '../qbcore';
import { ClothingProvider } from '../shop/clothing.provider';

const Animals = [
    joaat('A_C_Boar'),
    joaat('A_C_Boar_02'),
    joaat('A_C_Cat_01'),
    joaat('A_C_Chickenhawk'),
    joaat('A_C_Chimp'),
    joaat('A_C_Chimp_02'),
    joaat('A_C_Chop'),
    joaat('A_C_Chop_02'),
    joaat('A_C_cormorant'),
    joaat('A_C_Cow'),
    joaat('A_C_Coyote'),
    joaat('A_C_Coyote_02'),
    joaat('A_C_Crow'),
    joaat('A_C_Deer'),
    joaat('A_C_Deer_02'),
    joaat('A_C_Dolphin'),
    joaat('A_C_Fish'),
    joaat('A_C_Hen'),
    joaat('A_C_HumpBack'),
    joaat('A_C_Husky'),
    joaat('A_C_KillerWhale'),
    joaat('A_C_MtLion'),
    joaat('A_C_MtLion_02'),
    joaat('A_C_Panther'),
    joaat('A_C_Pig'),
    joaat('A_C_Pigeon'),
    joaat('A_C_Poodle'),
    joaat('A_C_Pug'),
    joaat('A_C_Pug_02'),
    joaat('A_C_Rabbit_01'),
    joaat('A_C_Rabbit_02'),
    joaat('A_C_Rat'),
    joaat('A_C_Retriever'),
    joaat('A_C_Rhesus'),
    joaat('A_C_Rottweiler'),
    joaat('A_C_Seagull'),
    joaat('A_C_SharkHammer'),
    joaat('A_C_SharkTiger'),
    joaat('A_C_shepherd'),
    joaat('A_C_Stingray'),
    joaat('A_C_Westy'),
];

const MAX_ZOMBIE_AT_DAY = 200;
const MAX_ZOMBIE_AT_NIGHT = MAX_ZOMBIE_AT_DAY * 3;
const EXPECTED_PLAYER_COUNT = 70;

@Provider()
export class WhatIfProvider {
    @Inject(QBCore)
    private readonly qbCore: QBCore;

    @Inject(FeatureProvider)
    private readonly featureProvider: FeatureProvider;

    @Inject(ItemService)
    private readonly itemService: ItemService;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(InventoryFactory)
    private inventoryFactory: InventoryFactory;

    @Inject(PlayerPositionProvider)
    private playerPositionProvider: PlayerPositionProvider;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(ObjectProvider)
    private objectProvider: ObjectProvider;

    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(ClothingProvider)
    private clothingProvider: ClothingProvider;

    private spawnedZombies: number[] = [];

    @Once()
    init() {
        this.itemService.setItemUseCallback('zombie_serum', this.useZombieSerum.bind(this));
        this.itemService.setItemUseCallback('whatif_hammer', this.useHammer.bind(this));
        this.itemService.setItemUseCallback('hazmat_outfit', this.useOutfit.bind(this));

        Object.entries(WhatIf2RespawnPoints).forEach(([key, positions]) => {
            positions.forEach((value, index) => {
                this.playerPositionProvider.registerZone(`UHU_WHAT_IF_REPAWN_${key}_${index}`, value);
            });
        });
    }

    @Once(OnceStep.RepositoriesLoaded)
    public async onRepoLoaded() {
        const data = await this.prismaService.whatif_props.findMany();
        for (const propDB of data) {
            this.objectProvider.createObject({
                id: propDB.id,
                model: GetHashKey(propDB.model),
                position: JSON.parse(propDB.position),
                matrix: JSON.parse(propDB.matrix),
                noCollision: propDB.noCollision,
                placeOnGround: true,
            });
        }
    }

    private async useOutfit(source: number, it: Item, item: InventoryItem, inventory: Inventory) {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        if (!inventory.removeAtSlot(item.slot, 1)) {
            return;
        }

        TriggerClientEvent(ClientEvent.WHAT_IF_USE_HAZMAT, source);
    }

    private async useZombieSerum(source: number) {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        const { completed } = await this.progressService.progress(source, 'serum', '', 3000, {
            name: 'base',
            dictionary: 'amb@prop_human_bum_bin@base',
            flags: 1,
        });

        if (!completed) {
            return;
        }

        const inventory = await this.inventoryFactory.getPlayerInventory(source);

        if (inventory.remove('zombie_serum', 1, false)) {
            TriggerClientEvent(ClientEvent.WHAT_IF_USE_ZOMBIE_SERUM, source);
        } else {
            this.notifier.notify(source, "Vous n'avez plus de sérum...");
        }
    }

    private async useHammer(source: number) {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        TriggerClientEvent(ClientEvent.WHAT_IF_OPEN_HAMMER, source);
    }

    @Command('spawn-zombie', {
        description: 'Spawn des zombies',
        arguments: [{ name: 'count', help: 'amount of zombies to spawn' }],
        role: ['admin'],
    })
    async spawnZombie(source: number, count: number = 10) {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        const ped = GetPlayerPed(source);
        const playerCoords = GetEntityCoords(ped) as Vector3;

        const handles = await emitClientRpc<number[]>(RpcClientEvent.WHAT_IF_SPAWN_PEDS, source, count, playerCoords);
        if (!handles) {
            return;
        }
        this.spawnedZombies.push(...handles);
    }

    @On(ServerEvent.WHAT_IF_GIVE_DEFAULT_ITEMS)
    async giveDefaultItems(source: number) {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        const inventory = await this.inventoryFactory.getPlayerInventory(source);
        if (!inventory) return;

        inventory.clear();

        WhatIf2DefaultItems.forEach(item => {
            inventory.add(item.name, item.quantity);
        });
    }

    @On(ServerEvent.WHAT_IF_RESET_INFECTION)
    async resetInfection(source: number) {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        TriggerClientEvent(ClientEvent.WHAT_IF_USE_ZOMBIE_SERUM, source);
    }

    @Rpc(RpcServerEvent.WHAT_IF_PLAYER_GET_CITIZEN_ID)
    async getCitizenId(source: number, target: number): Promise<string> {
        const player = this.playerService.getPlayer(target);
        if (!player) {
            return '';
        }

        return player.citizenid;
    }

    @Rpc(RpcServerEvent.WHAT_IF_LOOT_INVENTORY)
    async lootInventory(source: number, id: string, type: WhatIf2LootType, isZombie = false) {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        const inventory = await this.inventoryFactory.getOrCreate(
            id,
            WhatIf2LootInventoryType[type] as InventoryType,
            undefined,
            () => {
                const items: Record<string, InventoryItem> = {};
                let slot = 1;

                for (const [itemName, config] of Object.entries(WhatIf2LootInventoryContent[type])) {
                    const item = this.itemService.getItem(itemName);
                    if (!item) {
                        continue;
                    }

                    if (isZombie && !config.zombie) {
                        continue;
                    }

                    const shouldCreate = getRandomInt(0, 100) <= config.chance;
                    if (!shouldCreate) {
                        continue;
                    }

                    const max = getRandomInt(1, config.max);

                    for (let amount = max; amount > 0; amount--) {
                        const newItem: InventoryItem = {
                            slot,
                            name: itemName,
                            amount,
                            type: item.type,
                            metadata: {},
                        };

                        if (config.withAmmo) {
                            newItem.metadata.ammo = 1;
                        }

                        const newItems = Object.values(items);
                        newItems.push(newItem);

                        if (
                            getItemsWeight(newItems, this.itemService.getItem.bind(this.itemService)) >
                            DEFAULT_INVENTORY_CONFIGURATION.maxWeight
                        ) {
                            continue;
                        }

                        items[slot] = newItem;
                        slot++;

                        break;
                    }
                }

                return items;
            }
        );
        if (!inventory) return;

        return true;
    }

    @Rpc(RpcServerEvent.WHAT_IF_VEHICLE_DEALERSHIP_GET_LIST)
    public async getDealershipListJob(): Promise<Vehicle[]> {
        const vehicles = await this.prismaService.vehicle.findMany({
            where: {
                model: {
                    in: Object.keys(WhatIf2ShopVehicleList),
                },
            },
        });

        return Object.entries(WhatIf2ShopVehicleList).map(([model, price]) => {
            const vehicle = vehicles.find(vehicle => vehicle.model === model);

            if (!vehicle) {
                return {
                    model: model,
                    hash: joaat(model),
                    name: model,
                    price: price,
                    category: 'Utility',
                    dealershipId: DealershipType.WhatIf,
                    requiredLicence: null,
                    size: 1,
                    jobName: null,
                    stock: 1000,
                    radio: false,
                    maxStock: 1000,
                    handling: null,
                    transferable: true,
                };
            }

            return {
                ...vehicle,
                stock: 1000,
                price: price,
                jobName: JSON.parse(vehicle.jobName),
                handling: vehicle.handling ? JSON.parse(vehicle.handling) : null,
            };
        });
    }

    @Rpc(RpcServerEvent.WHAT_IF_GET_HAMMER_PROPS)
    async getHammerProps(source: number): Promise<{ id: string; model: string }[]> {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return [];
        }

        const player = this.playerService.getPlayer(source);
        if (!player) {
            return [];
        }

        const props = await this.prismaService.whatif_props.findMany({
            where: {
                citizenid: player.citizenid,
            },
        });

        return props.map(prop => ({ id: prop.id, model: prop.model }));
    }

    @Rpc(RpcServerEvent.WHAT_IF_HAMMER_CREATE)
    public async propCreate(source: number, model: string, position: Vector4, matrix: number[], noCollision: boolean) {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        if (Object.values(WhatIfSafeZones).some(zone => zone.isPointInside(position.slice(0, 3) as Point3D))) {
            this.notifier.error(source, `Vous ne pouvez pas poser un objet ici.`);
            return;
        }

        const inventory = await this.inventoryFactory.getPlayerInventory(source);
        if (!inventory) return;

        if (!inventory.remove(WhatIf2HammerZoneConfig.item, WhatIf2HammerZoneConfig.price)) {
            this.notifier.error(source, `Vous n'avez plus assez de ressources.`);
            return;
        }

        const id = WhatIf2HammerZoneConfig.prefix + uuidv4();

        await this.prismaService.whatif_props.create({
            data: {
                id,
                citizenid: player.citizenid,
                position: JSON.stringify(position),
                model,
                noCollision,
                matrix: JSON.stringify(matrix),
            },
        });

        this.objectProvider.createObject({
            id,
            model: GetHashKey(model),
            position: position,
        });

        this.notifier.notify(source, `Vous avez posé un objet.`, 'success');
    }

    @Rpc(RpcServerEvent.WHAT_IF_HAMMER_UPDATE)
    public async propUpdate(source: number, id: string, position: Vector4, matrix: number[], noCollision: boolean) {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        const existing = await this.prismaService.whatif_props.findFirst({ where: { id } });
        if (!existing) {
            return;
        }

        await this.prismaService.whatif_props.update({
            where: { id },
            data: {
                position: JSON.stringify(position),
                model: existing.model,
                noCollision: noCollision,
                matrix: JSON.stringify(matrix),
            },
        });

        this.objectProvider.updateObject({
            id,
            model: GetHashKey(existing.model),
            position,
            matrix,
            noCollision,
        });

        this.notifier.notify(source, `Vous avez déplacé un objet.`, 'success');
    }

    @Rpc(RpcServerEvent.WHAT_IF_HAMMER_DELETE)
    public async propDelete(source: number, id: string) {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        await this.prismaService.whatif_props.delete({ where: { id } });

        this.objectProvider.deleteObject(id);

        this.notifier.notify(source, `Vous avez supprimé un objet.`, 'success');
    }

    @On('entityCreating', false)
    public onEntityCreating(handle: number) {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        const model = GetEntityModel(handle);

        if (GetEntityType(handle) === 1 && Animals.includes(model)) {
            CancelEvent();
        }

        const position = GetEntityCoords(handle, false) as Vector3;
        if (GetEntityType(handle) !== 2 && Object.values(WhatIfSafeZones).some(zone => zone.isPointInside(position))) {
            CancelEvent();
        }
    }

    private async getGameTime() {
        const players = this.qbCore.getPlayersSources();
        if (!players || !players.length) return null;

        return emitClientRpc<number>(RpcClientEvent.GET_CLOCK_HOURS, players[0]);
    }

    @Tick(TickInterval.EVERY_MINUTE * 20)
    public async whatIfLootLowRegen() {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        let currentInv = 0;

        for (const [, inventory] of this.inventoryFactory.getLoadedInventories().entries()) {
            if (inventory.type() !== InventoryType.WhatIfLootLow) {
                if (currentInv > 100) {
                    await wait(0);
                    currentInv = 0;
                }

                currentInv++;
                continue;
            }

            try {
                await this.inventoryFactory.delete(inventory.id);
            } catch (e) {
                // ignore
            }
        }
    }

    @Tick(TickInterval.EVERY_MINUTE * 30)
    public async whatIfLootMediumRegen() {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        let currentInv = 0;

        for (const [, inventory] of this.inventoryFactory.getLoadedInventories().entries()) {
            if (inventory.type() !== InventoryType.WhatIfLootMedium) {
                if (currentInv > 100) {
                    await wait(0);
                    currentInv = 0;
                }

                currentInv++;
                continue;
            }

            try {
                await this.inventoryFactory.delete(inventory.id);
            } catch (e) {
                // ignore
            }
        }
    }

    @Tick(TickInterval.EVERY_MINUTE * 45)
    public async whatIfLootHighRegen() {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        let currentInv = 0;

        for (const [, inventory] of this.inventoryFactory.getLoadedInventories().entries()) {
            if (inventory.type() !== InventoryType.WhatIfLootHigh) {
                if (currentInv > 100) {
                    await wait(0);
                    currentInv = 0;
                }

                currentInv++;
                continue;
            }

            try {
                await this.inventoryFactory.delete(inventory.id);
            } catch (e) {
                // ignore
            }
        }
    }

    @Tick(TickInterval.EVERY_HOUR)
    public async whatIfLootMilitaryRegen() {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        let currentInv = 0;

        for (const [, inventory] of this.inventoryFactory.getLoadedInventories().entries()) {
            if (inventory.type() !== InventoryType.WhatIfLootMilitary) {
                if (currentInv > 100) {
                    await wait(0);
                    currentInv = 0;
                }

                currentInv++;
                continue;
            }

            try {
                await this.inventoryFactory.delete(inventory.id);
            } catch (e) {
                // ignore
            }
        }
    }

    @Tick(TickInterval.EVERY_MINUTE)
    async onZombieSpawnTick() {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        const deleteZombie = async (id: number, pedCoords?: Vector3) => {
            this.spawnedZombies = this.spawnedZombies.filter(zombieId => zombieId !== id);

            if (!pedCoords) return;

            const coordsHash = getLocationHash(pedCoords);

            try {
                await this.inventoryFactory.delete('zombie_' + coordsHash);
            } catch (e) {
                // ignore
            }
        };

        this.spawnedZombies.forEach(id => {
            const ped = NetworkGetEntityFromNetworkId(id);
            if (!ped) {
                deleteZombie(id);
                return;
            }

            const pedCoords = GetEntityCoords(ped, false) as Vector3;
            if (!this.hasClosestPlayer(pedCoords)) {
                deleteZombie(id, pedCoords);
                DeleteEntity(ped);
                return;
            }

            if (GetEntityHealth(ped) === 0) {
                setTimeout(
                    () => {
                        if (!ped || !DoesEntityExist(ped)) return;
                        const pedCoords = GetEntityCoords(ped, false) as Vector3;

                        deleteZombie(id, pedCoords);
                        DeleteEntity(ped);
                    },
                    5 * 60 * 1000
                );
            }
        });

        const hour = await this.getGameTime();
        if (!hour) {
            return;
        }

        const isDay = hour >= 6 && hour < 21;
        const maxZombies = isDay ? MAX_ZOMBIE_AT_DAY : MAX_ZOMBIE_AT_NIGHT;

        if (this.spawnedZombies.length >= maxZombies) {
            return;
        }

        const players = this.qbCore.getPlayersSources();
        if (!players || !players.length) return;

        const targetZombieAmount = this.lerp(20, maxZombies, Math.min(players.length, 20) / EXPECTED_PLAYER_COUNT);
        const zombieToSpawn = Math.floor(targetZombieAmount - this.spawnedZombies.length);

        const eligiblePlayers = players
            .filter(player => {
                const playerPosition = this.playerPositionProvider.getPlayerPosition(player);
                if (!playerPosition) return false;
                return Object.values(WhatIfSafeZones).every(zone => !zone.isPointInside(playerPosition));
            })
            .sort(() => Math.random() - 0.5);

        if (!eligiblePlayers.length) return;

        const perPlayer = Math.floor(zombieToSpawn / eligiblePlayers.length);

        for (let i = 0; i < eligiblePlayers.length; i++) {
            const handles = await emitClientRpc<number[]>(
                RpcClientEvent.WHAT_IF_SPAWN_PEDS,
                eligiblePlayers[i],
                perPlayer
            );
            if (!handles) {
                continue;
            }
            this.spawnedZombies.push(...handles);
        }
    }

    private hasClosestPlayer(position: Vector3) {
        for (const player of this.qbCore.getPlayersSources()) {
            const playerPosition = this.playerPositionProvider.getPlayerPosition(player);
            if (!playerPosition) continue;

            if (getDistance(position, playerPosition) > 100) continue;

            return true;
        }
        return false;
    }

    private lerp(min: number, max: number, percentage: number): number {
        return min * (1 - percentage) + max * percentage;
    }
}
