import { OnEvent } from '@public/core/decorators/event';
import { ClientEvent, ServerEvent } from '@public/shared/event';

import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { Tick } from '../../core/decorators/tick';
import { uuidv4 } from '../../core/utils';
import { InventoryPosition, InventoryPositionDynamic, InventoryType } from '../../shared/inventory';
import { getDistance, Vector3 } from '../../shared/polyzone/vector';
import { RpcServerEvent } from '../../shared/rpc';
import { VehicleClass } from '../../shared/vehicle/vehicle';
import { ItemService } from '../item/item.service';
import { Monitor } from '../monitor/monitor';
import { Notifier } from '../notifier';
import { PlayerService } from '../player/player.service';
import { ProgressService } from '../player/progress.service';
import { VehicleStateService } from '../vehicle/vehicle.state.service';
import { Inventory } from './inventory';
import { InventoryFactory } from './inventory.factory';
import { InventoryPositionChecker } from './inventory.position.checker';

/**
 * Exposition of some methods from the InventoryManager to the clients
 */
@Provider()
export class InventoryOpenProvider {
    @Inject(InventoryFactory)
    private inventoryFactory: InventoryFactory;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(InventoryPositionChecker)
    private inventoryPositionChecker: InventoryPositionChecker;

    @Inject(Monitor)
    private monitor: Monitor;

    private subscriptions: Map<string, Map<number, string>> = new Map();

    @Tick()
    public async tick() {
        await this.inventoryFactory.observe();
    }

    @Rpc(RpcServerEvent.INVENTORY_SELF_FETCH)
    public async fetch(source: number) {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return [null, null];
        }

        const storageId = `player_${player.citizenid}`;
        const inventory = await this.inventoryFactory.getOrCreate(storageId, InventoryType.Player);

        if (!inventory) {
            return [null, null];
        }

        this.doSubscribe(source, inventory);

        return [inventory.configuration(), inventory.items()];
    }

    @OnEvent(ServerEvent.INVENTORY_OPEN)
    public async onOpen(source: number, type: InventoryType, id: string, position?: Vector3) {
        const inventory = await this.inventoryFactory.getOrCreate(id, type);

        if (!inventory) {
            return;
        }

        this.doSubscribe(source, inventory);

        const inventoryPosition: InventoryPosition = position
            ? {
                  type: 'fixed',
                  position,
              }
            : null;

        if (position) {
            this.inventoryPositionChecker.openInventory(inventory.id, inventoryPosition);
        }

        TriggerClientEvent(
            ClientEvent.INVENTORY_OPEN,
            source,
            inventory.id,
            inventory.type(),
            inventory.configuration(),
            inventory.items(),
            inventoryPosition
        );
    }

    @OnEvent(ServerEvent.INVENTORY_OPEN_TARGET)
    public async onOpenTarget(source: number, target: number, lockTarget: boolean = false) {
        const sourcePlayer = this.playerService.getPlayer(source);
        const targetPlayer = this.playerService.getPlayer(target);

        if (!sourcePlayer || !targetPlayer) {
            return;
        }

        this.notifier.notify(target, "Quelqu'un fouille vos poches...");

        const { completed } = await this.progressService.progress(
            source,
            'police-search',
            'Fouille en cours...',
            Math.floor(Math.random() * (7000 - 5000 + 1) + 5000),
            {
                dictionary: 'anim@gangops@morgue@table@',
                name: 'player_search',
                options: { repeat: true },
            },
            {
                disableMovement: true,
                disableCarMovement: true,
                disableMouse: false,
                disableCombat: true,
            }
        );

        if (!completed) {
            return;
        }

        const playerPosition = GetEntityCoords(GetPlayerPed(source)) as Vector3;
        const targetPosition = GetEntityCoords(GetPlayerPed(target)) as Vector3;

        if (getDistance(playerPosition, targetPosition) > 3) {
            this.notifier.error(source, 'La cible est trop loin.');

            return;
        }

        const inventory = await this.inventoryFactory.getPlayerInventory(target);

        if (!inventory) {
            return;
        }

        this.doSubscribe(source, inventory);

        const inventoryPosition: InventoryPosition = {
            type: 'dynamic',
            entity: NetworkGetNetworkIdFromEntity(GetPlayerPed(target)),
        };

        this.inventoryPositionChecker.openInventory(inventory.id, inventoryPosition);

        if (lockTarget) {
            TriggerClientEvent(ClientEvent.INVENTORY_LOCK, target, true);
        }

        TriggerClientEvent(
            ClientEvent.INVENTORY_OPEN,
            source,
            inventory.id,
            inventory.type(),
            inventory.configuration(),
            inventory.items(),
            inventoryPosition
        );

        this.monitor.traceEvent('job_police_search_player', {
            player_source: source,
            target_source: target,
        });
    }

    @OnEvent(ServerEvent.INVENTORY_OPEN_TRUNK)
    public async onOpenTrunk(
        source: number,
        vehicleNetworkId: number,
        vehicleClass: VehicleClass,
        dimension: { min: Vector3; max: Vector3 }
    ) {
        const vehicleState = this.vehicleStateService.getVehicleState(vehicleNetworkId);
        const inventory = await this.inventoryFactory.getVehicleInventory(vehicleNetworkId, vehicleClass, vehicleState);

        if (!inventory) {
            return;
        }

        this.doSubscribe(source, inventory);

        const inventoryPosition: InventoryPosition = {
            type: 'dynamic',
            entity: vehicleNetworkId,
            dimension,
        };

        this.inventoryPositionChecker.openInventory(inventory.id, inventoryPosition as InventoryPositionDynamic);
        this.inventoryPositionChecker.openTrunk(source, inventory.id, vehicleNetworkId);

        TriggerClientEvent(
            ClientEvent.INVENTORY_OPEN,
            source,
            inventory.id,
            inventory.type(),
            inventory.configuration(),
            inventory.items(),
            inventoryPosition
        );
    }

    @OnEvent(ServerEvent.INVENTORY_OPEN_SUB_INVENTORY)
    public async onOpenSubInventory(source: number, inventoryId: string, slot: number) {
        const inventory = await this.inventoryFactory.get(inventoryId);

        if (!inventory) {
            return;
        }

        const inventoryItem = inventory.getItemAtSlot(slot);

        if (!inventoryItem) {
            return;
        }

        const item = this.itemService.getItem(inventoryItem.name);

        if (!item || !item.storageItemType) {
            return;
        }

        if (item.name === 'detective_board' && !inventoryItem.metadata?.originalDetectiveBoard) {
            return;
        }

        if (!inventoryItem.metadata?.id) {
            inventory.updateMetadataAtSlot(slot, { id: uuidv4() });
        }

        if (!inventoryItem.metadata?.storageElements) {
            inventory.updateMetadataAtSlot(slot, { storageElements: {} });
        }

        // Migrate old storage elements to new format
        if (Array.isArray(inventoryItem.metadata.storageElements)) {
            const newItems = {};

            for (const item of inventoryItem.metadata.storageElements) {
                newItems[item.slot] = item;
            }

            inventory.updateMetadataAtSlot(slot, { storageElements: newItems });
        }

        const id = inventoryItem.metadata.id;
        const subInventory = await this.inventoryFactory.getOrCreate(
            id,
            InventoryType.EvidenceStorage,
            {
                allowedItemTypes: [item.storageItemType],
                notAllowedItems: ['detective_board'],
                persistent: false,
            },
            () => inventoryItem.metadata.storageElements
        );

        await subInventory.observe();
        await inventory.observe();

        this.doSubscribe(source, subInventory);

        TriggerClientEvent(
            ClientEvent.INVENTORY_OPEN,
            source,
            subInventory.id,
            subInventory.type(),
            subInventory.configuration(),
            subInventory.items(),
            null
        );
    }

    @OnEvent(ServerEvent.INVENTORY_UNSUBSCRIBE)
    public async onUnsubscribe(source: number, storageId: string) {
        if (!this.subscriptions.has(storageId)) {
            return;
        }

        if (!this.subscriptions.get(storageId).has(source)) {
            return;
        }

        const inventory = await this.inventoryFactory.get(storageId);

        if (!inventory) {
            return;
        }

        inventory.unsubscribe(this.subscriptions.get(storageId).get(source));

        this.subscriptions.get(storageId).delete(source);
        this.inventoryPositionChecker.closeInventory(source, storageId);

        if (inventory.type() === InventoryType.Player && this.subscriptions.get(storageId).size <= 1) {
            const citizenId = inventory.id.replace('player_', '');
            const player = this.playerService.getPlayerByCitizenId(citizenId);

            if (player && this.subscriptions.get(storageId).has(player.source)) {
                // unlock player inventory
                TriggerClientEvent(ClientEvent.INVENTORY_LOCK, player.source, false);
            }
        }
    }

    public closeInventory(storageId: string) {
        const sources = [];

        if (!this.subscriptions.has(storageId)) {
            return;
        }

        for (const [source] of this.subscriptions.get(storageId)) {
            sources.push(source);
        }

        for (const source of sources) {
            TriggerClientEvent(ClientEvent.INVENTORY_CLOSE, source, storageId);
        }
    }

    public hasSubscription(storageId: string) {
        return this.subscriptions.has(storageId);
    }

    private doSubscribe(source: number, inventory: Inventory) {
        if (!this.subscriptions.has(inventory.id)) {
            this.subscriptions.set(inventory.id, new Map());
        }

        if (this.subscriptions.get(inventory.id).has(source)) {
            return;
        }

        const id = inventory.subscribe((changes, _, configuration) => {
            TriggerClientEvent(ClientEvent.INVENTORY_UPDATE, source, inventory.id, changes, configuration);
        });

        this.subscriptions.get(inventory.id).set(source, id);
    }
}
