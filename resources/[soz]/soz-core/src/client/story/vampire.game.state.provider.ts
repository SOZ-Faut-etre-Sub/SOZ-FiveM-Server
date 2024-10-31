import { Provider } from '@core/decorators/provider';
import { Vector3 } from '@public/shared/polyzone/vector';

import {
    VampireGameClientState,
    VampireGameCollection,
    VampireGameEnemyRoles,
    VampireGameRole,
} from '../../shared/halloween';

@Provider()
export class VampireGameStateProvider {
    private respawning = false;
    private state: VampireGameClientState = {
        inWaitingRoom: false,
        started: false,
        role: null,
        objective: null,
    };

    public playerRespawning() {
        return this.respawning;
    }

    public setPlayerRespawning(respawning: boolean) {
        this.respawning = respawning;
    }

    public isGameRunning() {
        return this.state.started;
    }

    public isGameStarting() {
        return this.state.inWaitingRoom;
    }

    public setState(state: Partial<VampireGameClientState>) {
        this.state = { ...this.state, ...state };
    }

    public getRole() {
        return this.state.role;
    }

    public hasEnemyRole() {
        return VampireGameEnemyRoles.includes(this.state.role);
    }

    public hasRole(role: VampireGameRole) {
        return this.state.role === role;
    }

    public getObjective(): Record<VampireGameCollection, Vector3[]> {
        return this.state.objective;
    }
}
