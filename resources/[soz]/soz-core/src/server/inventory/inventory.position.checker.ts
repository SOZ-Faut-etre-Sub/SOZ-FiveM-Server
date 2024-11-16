import { Inject, Injectable } from '@core/decorators/injectable';
import { PlayerService } from '@public/server/player/player.service';

import { ClientEvent } from '../../shared/event/client';
import { DEFAULT_MAX_INVENTORY_DISTANCE, getPositionZone, InventoryPosition } from '../../shared/inventory';
import { getDistance, Vector3 } from '../../shared/polyzone/vector';

@Injectable()
export class InventoryPositionChecker {
    @Inject(PlayerService)
    private playerService: PlayerService;

    private trunkOpened: Record<string, { networkId: number; players: Set<number> }> = {};

    private inventoriesPositions: Map<string, Map<number, InventoryPosition>> = new Map();

    public openTrunk(playerId: number, inventoryId: string, vehicleNetworkId: number): void {
        if (!this.trunkOpened[inventoryId]) {
            this.trunkOpened[inventoryId] = { networkId: vehicleNetworkId, players: new Set() };
        }

        this.trunkOpened[inventoryId].players.add(playerId);

        const entityId = NetworkGetEntityFromNetworkId(vehicleNetworkId);

        if (!entityId) {
            return;
        }

        const owner = NetworkGetEntityOwner(entityId);

        if (owner) {
            TriggerClientEvent(ClientEvent.VEHICLE_SET_TRUNK_STATE, owner, vehicleNetworkId, true);
        }
    }

    public openInventory(source: number, inventoryId: string, position: InventoryPosition): void {
        if (!this.inventoriesPositions[inventoryId]) {
            this.inventoriesPositions[inventoryId] = new Map();
        }

        this.inventoriesPositions[inventoryId].set(source, position);
    }

    public closeInventory(playerId: number, inventoryId: string): void {
        if (!this.trunkOpened[inventoryId]) {
            return;
        }

        this.trunkOpened[inventoryId].players.delete(playerId);

        if (this.trunkOpened[inventoryId].players.size > 0) {
            return;
        }

        const entityId = NetworkGetEntityFromNetworkId(this.trunkOpened[inventoryId].networkId);

        if (!entityId) {
            return;
        }
        const owner = NetworkGetEntityOwner(entityId);

        if (!owner) {
            TriggerClientEvent(
                ClientEvent.VEHICLE_SET_TRUNK_STATE,
                playerId,
                this.trunkOpened[inventoryId].networkId,
                false
            );

            return;
        }

        if (this.inventoriesPositions[inventoryId]) {
            this.inventoriesPositions[inventoryId].delete(playerId);
        }

        TriggerClientEvent(ClientEvent.VEHICLE_SET_TRUNK_STATE, owner, this.trunkOpened[inventoryId].networkId, false);
    }

    public checkPlayerDistance(source: number, inventoryId: string): boolean {
        const playerPosition = GetEntityCoords(GetPlayerPed(source), true) as Vector3;
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return true;
        }

        const playerInventoryId = `player_${player.citizenid}`;

        if (playerInventoryId === inventoryId) {
            return true;
        }

        return this.checkDistance(source, playerPosition, inventoryId);
    }

    public checkDistance(source: number, position: Vector3, inventoryId: string): boolean {
        if (!this.inventoriesPositions[inventoryId]) {
            // Some inventories don't have a position, like the player inventory
            return true;
        }

        if (!this.inventoriesPositions[inventoryId].has(source)) {
            // Some inventories don't have a position, like the player inventory
            return true;
        }

        const inventoryPosition = this.inventoriesPositions[inventoryId].get(source);
        const maxDistance = inventoryPosition.maxDistance || DEFAULT_MAX_INVENTORY_DISTANCE;

        if (inventoryPosition.type === 'fixed' && getDistance(position, inventoryPosition.position) <= maxDistance) {
            return true;
        }

        if (inventoryPosition.type === 'dynamic') {
            const entity = NetworkGetEntityFromNetworkId(inventoryPosition.entity);
            const entityPosition = GetEntityCoords(entity, true) as Vector3;

            if (inventoryPosition.dimension) {
                const heading = GetEntityHeading(entity);
                const zone = getPositionZone(entityPosition, heading, inventoryPosition.dimension, maxDistance);

                if (zone.isPointInside(position)) {
                    return true;
                }
            }

            if (getDistance(position, entityPosition) <= maxDistance) {
                return true;
            }
        }

        return false;
    }
}
