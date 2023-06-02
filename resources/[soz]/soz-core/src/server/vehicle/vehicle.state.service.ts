import { Injectable } from '@core/decorators/injectable';
import { ClientEvent } from '@public/shared/event';
import { Vector3, Vector4 } from '@public/shared/polyzone/vector';

import {
    getDefaultVehicleCondition,
    getDefaultVehicleVolatileState,
    VehicleCondition,
    VehicleSeat,
    VehicleSyncStrategy,
    VehicleVolatileState,
} from '../../shared/vehicle/vehicle';

type VehicleState = {
    volatile: VehicleVolatileState;
    condition: VehicleCondition;
    position: Vector3 | Vector4 | null;
    owner: number;
};

const VehicleConditionSyncStrategy: Record<keyof VehicleCondition, VehicleSyncStrategy> = {
    fuelLevel: VehicleSyncStrategy.Copilot,
    oilLevel: VehicleSyncStrategy.Copilot,
    engineHealth: VehicleSyncStrategy.None,
    bodyHealth: VehicleSyncStrategy.None,
    tankHealth: VehicleSyncStrategy.None,
    dirtLevel: VehicleSyncStrategy.AllServer,
    doorStatus: VehicleSyncStrategy.None,
    windowStatus: VehicleSyncStrategy.None,
    tireHealth: VehicleSyncStrategy.None,
    tireBurstState: VehicleSyncStrategy.None,
    tireBurstCompletely: VehicleSyncStrategy.None,
    tireTemporaryRepairDistance: VehicleSyncStrategy.None,
    mileage: VehicleSyncStrategy.None,
};

@Injectable()
export class VehicleStateService {
    private state: Map<number, VehicleState> = new Map<number, VehicleState>();

    private vehicleKeys: Record<string, Set<string>> = {};

    private vehicleSeats: Map<number, Map<number, VehicleSeat>> = new Map<number, Map<number, VehicleSeat>>();

    public getVehicleState(vehicleNetworkId: number): Readonly<VehicleState> {
        if (this.state.has(vehicleNetworkId)) {
            return this.state.get(vehicleNetworkId);
        }

        return {
            volatile: getDefaultVehicleVolatileState(),
            condition: getDefaultVehicleCondition(),
            owner: null,
            position: null,
        };
    }

    public setVehicleSeat(vehicleNetworkId: number, playerNetworkId: number, seat: VehicleSeat): void {
        const vehicleSeats = this.vehicleSeats.get(vehicleNetworkId) ?? new Map<number, VehicleSeat>();
        vehicleSeats.set(playerNetworkId, seat);

        this.vehicleSeats.set(vehicleNetworkId, vehicleSeats);
    }

    public removeVehicleSeat(vehicleNetworkId: number, playerNetworkId: number): void {
        const vehicleSeats = this.vehicleSeats.get(vehicleNetworkId);

        if (!vehicleSeats) {
            return;
        }

        vehicleSeats.delete(playerNetworkId);

        if (vehicleSeats.size === 0) {
            this.vehicleSeats.delete(vehicleNetworkId);
        }
    }

    public getStates(): Readonly<Map<number, VehicleState>> {
        return this.state;
    }

    public updateVehiclePosition(vehicleNetworkId: number, position: Vector3): void {
        if (!this.state.has(vehicleNetworkId)) {
            return;
        }

        const state = this.state.get(vehicleNetworkId);
        state.position = position;
    }

    public updateVehicleVolatileState(
        vehicleNetworkId: number,
        state: Partial<VehicleVolatileState>,
        excludeSource: number | null = null,
        forwardToEveryone = false
    ): void {
        const previousState = this.getVehicleState(vehicleNetworkId);

        const newState = {
            volatile: {
                ...previousState.volatile,
                ...state,
            },
            condition: previousState.condition,
            owner: previousState.owner,
            position: previousState.position,
        };

        this.state.set(vehicleNetworkId, newState);

        const entityId = NetworkGetEntityFromNetworkId(vehicleNetworkId);

        if (!entityId) {
            return;
        }

        const owner = NetworkGetEntityOwner(entityId);

        if (!owner) {
            return;
        }

        if (forwardToEveryone) {
            TriggerClientEvent(ClientEvent.VEHICLE_UPDATE_STATE, -1, vehicleNetworkId, newState.volatile, false);
        } else if (owner !== excludeSource) {
            TriggerClientEvent(ClientEvent.VEHICLE_UPDATE_STATE, owner, vehicleNetworkId, newState.volatile);
        }
    }

    // Update vehicle condition from server, propagate to owner
    public updateVehicleCondition(vehicleNetworkId: number, condition: Partial<VehicleCondition>): void {
        const entityId = NetworkGetEntityFromNetworkId(vehicleNetworkId);

        if (!entityId) {
            return;
        }

        const owner = NetworkGetEntityOwner(entityId);

        if (!owner) {
            return;
        }

        TriggerClientEvent(ClientEvent.VEHICLE_CONDITION_APPLY, owner, vehicleNetworkId, condition);

        // Also sync here as owner will not send back to server (same diff)
        this.updateVehicleConditionState(vehicleNetworkId, condition);
    }

    public updateVehicleConditionState(vehicleNetworkId: number, condition: Partial<VehicleCondition>): void {
        const previousState = this.getVehicleState(vehicleNetworkId);

        const newState = {
            volatile: previousState.volatile,
            condition: {
                ...previousState.condition,
                ...condition,
            },
            owner: previousState.owner,
            position: previousState.position,
        };

        this.state.set(vehicleNetworkId, newState);

        const conditionToCopilot = {};
        const conditionToAllInVehicle = {};
        const conditionToAllServer = {};

        // sync to other players if needed
        for (const key of Object.keys(condition)) {
            if (VehicleConditionSyncStrategy[key] === VehicleSyncStrategy.None) {
                continue;
            }

            if (VehicleConditionSyncStrategy[key] === VehicleSyncStrategy.Copilot) {
                conditionToCopilot[key] = condition[key];
            }

            if (VehicleConditionSyncStrategy[key] === VehicleSyncStrategy.AllInVehicle) {
                conditionToAllInVehicle[key] = condition[key];
            }

            if (VehicleConditionSyncStrategy[key] === VehicleSyncStrategy.AllServer) {
                conditionToAllServer[key] = condition[key];
            }
        }

        if (Object.keys(conditionToCopilot).length > 0) {
            // get copilot
            const copilot = this.getPlayerInVehicleSeat(vehicleNetworkId, VehicleSeat.Copilot);

            if (copilot) {
                TriggerClientEvent(ClientEvent.VEHICLE_CONDITION_SYNC, copilot, vehicleNetworkId, conditionToCopilot);
            }
        }

        if (Object.keys(conditionToAllInVehicle).length > 0) {
            // get all in vehicle
            const seats = this.vehicleSeats.get(vehicleNetworkId);

            if (seats) {
                for (const player of seats.keys()) {
                    TriggerClientEvent(
                        ClientEvent.VEHICLE_CONDITION_SYNC,
                        player,
                        vehicleNetworkId,
                        conditionToAllInVehicle
                    );
                }
            }
        }

        if (Object.keys(conditionToAllServer).length > 0) {
            TriggerClientEvent(ClientEvent.VEHICLE_CONDITION_SYNC, -1, vehicleNetworkId, conditionToAllServer);
        }
    }

    public register(
        netId: number,
        owner: number,
        position: Vector3 | Vector4,
        volatile: VehicleVolatileState,
        condition: VehicleCondition
    ) {
        this.state.set(netId, {
            volatile,
            condition,
            owner,
            position,
        });

        TriggerClientEvent(ClientEvent.VEHICLE_CONDITION_REGISTER, owner, netId, condition);
    }

    public switchOwner(netId, owner) {
        if (!this.state.has(netId)) {
            return;
        }

        const state = this.state.get(netId);

        // can be null if stolen car
        if (state.owner) {
            TriggerClientEvent(ClientEvent.VEHICLE_CONDITION_UNREGISTER, state.owner, netId);
        }

        this.state.set(netId, {
            ...state,
            owner,
        });

        TriggerClientEvent(ClientEvent.VEHICLE_CONDITION_REGISTER, owner, netId, state.condition);
    }

    public unregister(netId) {
        this.state.delete(netId);
        TriggerClientEvent(ClientEvent.VEHICLE_DELETE_STATE, -1, netId);
        TriggerClientEvent(ClientEvent.VEHICLE_CONDITION_UNREGISTER, -1, netId);
    }

    public hasVehicleKey(vehiclePlate: string, citizenId: string): boolean {
        return this.vehicleKeys[citizenId] && this.vehicleKeys[citizenId].has(vehiclePlate);
    }

    public removeVehicleKey(vehiclePlate: string, citizenId: string): void {
        if (this.vehicleKeys[citizenId]) {
            this.vehicleKeys[citizenId].delete(vehiclePlate);
        }
    }

    public addVehicleKey(vehiclePlate: string, citizenId: string): void {
        if (!this.vehicleKeys[citizenId]) {
            this.vehicleKeys[citizenId] = new Set();
        }

        this.vehicleKeys[citizenId].add(vehiclePlate);
    }

    public getVehicleKeys(citizenId: string): string[] {
        if (!this.vehicleKeys[citizenId]) {
            return [];
        }

        return Array.from(this.vehicleKeys[citizenId]);
    }

    private getPlayerInVehicleSeat(vehicleNetworkId: number, seat: VehicleSeat): number | null {
        const vehicleSeats = this.vehicleSeats.get(vehicleNetworkId);

        if (!vehicleSeats) {
            return null;
        }

        for (const [playerNetworkId, vehicleSeat] of vehicleSeats.entries()) {
            if (vehicleSeat === seat) {
                return playerNetworkId;
            }
        }

        return null;
    }
}
