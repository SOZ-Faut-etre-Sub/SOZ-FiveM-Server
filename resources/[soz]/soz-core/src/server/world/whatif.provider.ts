import { Rpc } from '@public/core/decorators/rpc';
import { ServerEvent } from '@public/shared/event/server';
import { Feature } from '@public/shared/features';
import { Item } from '@public/shared/item';
import { PlayerData } from '@public/shared/player';
import { Gauge } from 'prom-client';

import { DealershipType } from '../../config/dealership';
import { Command } from '../../core/decorators/command';
import { On, Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { emitClientRpc } from '../../core/rpc';
import { uuidv4, wait } from '../../core/utils';
import { ClientEvent } from '../../shared/event/client';
import { DEFAULT_INVENTORY_CONFIGURATION, getItemsWeight, InventoryItem, InventoryType } from '../../shared/inventory';
import { joaat } from '../../shared/joaat';
import { getDistance, Point3D, Vector3, Vector4 } from '../../shared/polyzone/vector';
import { getRandomInt, getRandomKeyWeighted } from '../../shared/random';
import { RpcClientEvent, RpcServerEvent } from '../../shared/rpc';
import { Vehicle } from '../../shared/vehicle/vehicle';
import {
    WHAT_IF_LARGE_WEIGHT,
    WHAT_IF_MEDIUM_WEIGHT,
    WHAT_IF_PROP_SPECIAL_COST,
    WHAT_IF_SMALL_WEIGHT,
    WhatIf2Bags,
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
import { Monitor } from '../monitor/monitor';
import { Notifier } from '../notifier';
import { ObjectProvider } from '../object/object.provider';
import { PermissionService } from '../permission.service';
import { PlayerPositionProvider } from '../player/player.position.provider';
import { PlayerService } from '../player/player.service';
import { ProgressService } from '../player/progress.service';
import { QBCore } from '../qbcore';
import { SoundService } from '../sound/sound.service';
import { WeatherProvider } from '../weather/weather.provider';

const MAX_ZOMBIE_AT_DAY = 300;
const MAX_ZOMBIE_AT_NIGHT = 600;
const EXPECTED_PLAYER_COUNT = 150;

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

    @Inject(WeatherProvider)
    private weatherProvider: WeatherProvider;

    @Inject(ObjectProvider)
    private objectProvider: ObjectProvider;

    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(PermissionService)
    private permissionService: PermissionService;

    @Inject(SoundService)
    private soundService: SoundService;

    @Inject(Monitor)
    private monitor: Monitor;

    private spawnedZombiesGauge = new Gauge({
        name: 'soz_whatif_zombie',
        help: 'Number of spawned zombies',
    });
    private targetZombiesGauge = new Gauge({
        name: 'soz_whatif_zombie_target',
        help: 'Target number of zombies',
    });

    private cinematic = false;
    private spawnedZombies: number[] = [];

    @Once()
    init() {
        this.itemService.setItemUseCallback('zombie_serum', this.useZombieSerum.bind(this));
        this.itemService.setItemUseCallback('whatif_hammer', this.useHammer.bind(this));
        this.itemService.setItemUseCallback('hazmat_outfit', this.useOutfit.bind(this));
        this.itemService.setItemUseCallback('whatif_bag_small', this.useBag.bind(this));
        this.itemService.setItemUseCallback('whatif_bag_medium', this.useBag.bind(this));
        this.itemService.setItemUseCallback('whatif_bag_huge', this.useBag.bind(this));
        this.itemService.setItemUseCallback('whatif_bandage', this.useHeal.bind(this));
        this.itemService.setItemUseCallback('whatif_surgical_kit', this.useHeal.bind(this));
        this.itemService.setItemUseCallback('whatif_tactical_heal_kit', this.useHeal.bind(this));

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
                placeOnGround: false,
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

        this.playerService.setPlayerMetadata(source, 'hazmat_protection', 100);
    }

    @Command('hazmat', {
        role: ['admin', 'staff'],
    })
    async hazmat(source: number, value: number = 100) {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        this.playerService.setPlayerMetadata(source, 'hazmat_protection', Number(value));
    }

    private async useBag(source: number, it: Item, item: InventoryItem, inventory: Inventory) {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        const bagId = Number(
            Object.entries(WhatIf2Bags[player.skin.Model.Hash]).find(([, weigth]) => {
                if (it.name === 'whatif_bag_small') {
                    return weigth === WHAT_IF_SMALL_WEIGHT;
                }
                if (it.name === 'whatif_bag_medium') {
                    return weigth === WHAT_IF_MEDIUM_WEIGHT;
                }
                if (it.name === 'whatif_bag_huge') {
                    return weigth === WHAT_IF_LARGE_WEIGHT;
                }

                return false;
            })[0]
        );

        if (bagId === 0 || isNaN(bagId)) {
            return;
        }

        const { completed } = await this.progressService.progress(source, 'wear_bag', '', 5000, {
            dictionary: 'anim@mp_yacht@shower@male@',
            name: 'male_shower_towel_dry_to_get_dressed',
            flags: 15,
        });

        if (!completed) {
            return;
        }

        if (!inventory.removeAtSlot(item.slot, 1)) {
            return;
        }

        TriggerClientEvent(ClientEvent.WHAT_IF_USE_BAG, source, bagId);
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
        role: ['admin', 'staff'],
    })
    async spawnZombieCmd(source: number, count: number = 10) {
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

    @Command('delete-zombie', {
        description: 'Delete des zombies dans une zone',
        arguments: [{ name: 'radius', help: 'radius of the zone' }],
        role: ['admin', 'staff'],
    })
    async deleteZombieCmd(source: number, radius: number = 10) {
        const ped = GetPlayerPed(source);
        const playerCoords = GetEntityCoords(ped) as Vector3;

        for (const handle of this.spawnedZombies) {
            const ped = NetworkGetEntityFromNetworkId(handle);
            if (!ped || !DoesEntityExist(ped)) continue;

            const pedCoords = GetEntityCoords(ped, false) as Vector3;
            if (getDistance(playerCoords, pedCoords) > radius) {
                continue;
            }

            await this.deleteZombie(handle);
            DeleteEntity(ped);
        }
    }

    @OnEvent(ServerEvent.WHAT_IF_GIVE_DEFAULT_ITEMS)
    async giveDefaultItems(source: number, retrival: boolean) {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        const inventory = await this.inventoryFactory.getPlayerInventory(source);
        if (!inventory) return;

        inventory.clear();

        WhatIf2DefaultItems.forEach(item => {
            if (retrival && item.skipRetrieval) {
                return;
            }
            inventory.add(item.name, item.quantity);
        });

        await inventory.observe();
    }

    @OnEvent(ServerEvent.WHAT_IF_RESET_INFECTION)
    async resetInfection(source: number, target: number) {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        TriggerClientEvent(ClientEvent.WHAT_IF_USE_ZOMBIE_SERUM, target);
        this.notifier.notify(source, 'Infection réinitialisée', 'success');
    }

    @OnEvent(ServerEvent.WHAT_IF_TELEPORT_PVE)
    async teleportToPve(source: number) {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        this.playerPositionProvider.teleportToCoords(source, [1465.35, 6554.38, 14.03, 89.22]);
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

                    const probability = Array.from({ length: config.max }).reduce<Record<number, number>>(
                        (acc, _, index) => ({
                            ...acc,
                            [index + 1]: Math.ceil(1000 / (index + 1)),
                        }),
                        {}
                    );

                    const max = Number(getRandomKeyWeighted(probability, '1'));

                    if (item.type === 'weapon') {
                        for (let amount = 0; amount < max; amount++) {
                            const newItem: InventoryItem = {
                                slot,
                                name: itemName,
                                amount: 1,
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
                        }
                    } else {
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

        return await this.getHammerPlayerProps(player);
    }

    private async getHammerPlayerProps(player: PlayerData) {
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

        const cost = WHAT_IF_PROP_SPECIAL_COST[model] ?? WhatIf2HammerZoneConfig.price;

        if (!inventory.remove(WhatIf2HammerZoneConfig.item, cost)) {
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
        return await this.getHammerPlayerProps(player);
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

        const existing = await this.prismaService.whatif_props.findFirst({ where: { id } });

        if (existing) {
            const playerCoords = this.playerPositionProvider.getPlayerPosition(source);
            const position = JSON.parse(existing.position);
            if (getDistance(playerCoords, position) >= 100) {
                this.notifier.error(source, '~r~Le modèle est trop loin !');
                return;
            }
        }

        await this.prismaService.whatif_props.delete({ where: { id } });

        this.objectProvider.deleteObject(id);

        this.notifier.notify(source, `Vous avez supprimé un objet.`, 'success');
        return await this.getHammerPlayerProps(player);
    }

    @On('entityCreating', false)
    public onEntityCreating(handle: number) {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        const objType = GetEntityType(handle);

        if (GetEntityPopulationType(handle) !== 7 && objType != 3) {
            CancelEvent();
        }
    }

    @Tick(TickInterval.EVERY_MINUTE * 20)
    public async whatIfLootLowRegen() {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        let currentInv = 0;

        for (const [, inventory] of this.inventoryFactory.getLoadedInventories().entries()) {
            if (inventory.id.startsWith('zombie_') || inventory.type() !== InventoryType.WhatIfLootLow) {
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
            if (inventory.id.startsWith('zombie_') || inventory.type() !== InventoryType.WhatIfLootMedium) {
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
            if (inventory.id.startsWith('zombie_') || inventory.type() !== InventoryType.WhatIfLootHigh) {
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
            if (inventory.id.startsWith('zombie_') || inventory.type() !== InventoryType.WhatIfLootMilitary) {
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

    private async deleteZombie(id: number) {
        this.spawnedZombies = this.spawnedZombies.filter(zombieId => zombieId !== id);

        try {
            await this.inventoryFactory.delete('zombie_' + id);
        } catch (e) {
            // ignore
        }
    }

    @Tick(TickInterval.EVERY_MINUTE)
    async onZombieSpawnTick() {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        this.spawnedZombies.forEach(id => {
            const ped = NetworkGetEntityFromNetworkId(id);
            if (!ped) {
                this.deleteZombie(id);
                return;
            }

            const pedCoords = GetEntityCoords(ped, false) as Vector3;
            if (
                this.cinematic ||
                !this.hasClosestPlayer(pedCoords) ||
                Object.values(WhatIfSafeZones).some(zone => zone.isPointInside(pedCoords))
            ) {
                this.deleteZombie(id);
                DeleteEntity(ped);
                return;
            }

            if (GetEntityHealth(ped) === 0) {
                setTimeout(
                    () => {
                        if (!ped || !DoesEntityExist(ped)) return;

                        this.deleteZombie(id);
                        DeleteEntity(ped);
                    },
                    5 * 60 * 1000
                );
            }
        });

        if (this.cinematic) return;

        const hour = this.weatherProvider.getTime().hour;
        if (!hour) {
            return;
        }

        const isDay = hour >= 6 && hour < 21;
        const maxZombies = isDay ? MAX_ZOMBIE_AT_DAY : MAX_ZOMBIE_AT_NIGHT;

        this.spawnedZombiesGauge.set(this.spawnedZombies.length);

        if (this.spawnedZombies.length >= maxZombies) {
            return;
        }

        const players = this.qbCore.getPlayersSources();
        if (!players || !players.length) return;

        const targetZombieAmount = this.lerp(20, maxZombies, Math.max(players.length, 20) / EXPECTED_PLAYER_COUNT);
        this.targetZombiesGauge.set(targetZombieAmount);
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

    private async useHeal(source: number, it: Item, item: InventoryItem, inventory: Inventory) {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        const { completed } = await this.progressService.progress(source, 'wear_bag', 'Vou vous soignez', 10_000, {
            name: 'miranda_shooting_up',
            dictionary: 'rcmpaparazzo1ig_4',
            options: {
                onlyUpperBody: true,
            },
            playbackRate: 0.4,
            props: [
                {
                    model: 'prop_syringe_01',
                    bone: 28422,
                    position: [0, 0, -0.045],
                    rotation: [0, 0, 0],
                },
            ],
        });

        if (!completed) {
            return;
        }

        if (!inventory.removeAtSlot(item.slot, 1)) {
            return;
        }

        const healPerItem = {
            whatif_bandage: 20,
            whatif_surgical_kit: 50,
            whatif_tactical_heal_kit: 100,
        };

        this.monitor.traceEvent('whatif_heal', {
            player_source: source,
            item_id: item.name,
            position: GetEntityCoords(GetPlayerPed(player.source)) as Vector3,
        });

        TriggerClientEvent(ClientEvent.LSMC_HEAL, player.source, healPerItem[item.name]);
    }

    @OnEvent(ServerEvent.WHAT_IF_SALVAGE)
    public async onSalvage(source: number, item: InventoryItem) {
        const inv = await this.inventoryFactory.getPlayerInventory(source);
        const itemDef = this.itemService.getItem(item.name);

        if (
            [
                'whatif_parts',
                'whatif_hammer',
                'weapon_snowball',
                'sandwich',
                'zombie_serum',
                'water_bottle',
                'snikkel_candy',
            ].includes(item.name)
        ) {
            this.notifier.notify(source, `~r~Impossible~s~ de recycler cet objet`);
            return;
        }

        const { completed } = await this.progressService.progress(
            source,
            'whatif_salvage',
            `Recyclage de "${itemDef.label}"`,
            5_000,
            {
                dictionary: 'mp_fm_intro_cut',
                name: 'fixing_a_ped',
                options: {
                    repeat: true,
                },
            }
        );

        if (!completed) {
            return;
        }

        if (!inv.removeAtSlot(item.slot, item.amount)) {
            return;
        }

        const rewardItem = 'whatif_parts';
        const rewardItemDef = this.itemService.getItem(rewardItem);
        inv.add(rewardItem, item.amount);

        this.notifier.notify(
            source,
            `Le recyclage vous a permis de récupérer ~g~${item.amount}~s~ ~b~${rewardItemDef.label}~s~`
        );
    }

    @OnEvent(ServerEvent.WHAT_IF_CINEMATIC)
    public async onCinematic(source: number) {
        if (!this.permissionService.isStaff(source)) {
            return;
        }

        this.cinematic = true;

        this.soundService.play(-1, 'https://cfx-nui-soz-sounds/whatif/obsession.mp3', 5 / 20);
        TriggerClientEvent(ClientEvent.WHAT_IF_CINEMATIC, -1);
    }
}
