import { Provider } from '@core/decorators/provider';
import { Vector3 } from '@public/shared/polyzone/vector';

import {
    VampireGameClientState,
    VampireGameCollection,
    VampireGameEnemyRoles,
    VampireGameObjectiveTypePart2,
    VampireGameRole,
} from '../../shared/halloween';

@Provider()
export class VampireGameStateProvider {
    private respawning = false;
    private state: VampireGameClientState = {
        inWaitingRoom: false,
        started: false,
        role: null,
        objectivePart1: null,
        objectivePart2: null,
    };

    public getCompleteState(state: Partial<VampireGameClientState> = {}) {
        return { ...this.state, ...state };
    }

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

    public getObjectivePart1(): Record<VampireGameCollection, Vector3[]> {
        return this.state.objectivePart1;
    }

    public getObjectivePart2(): Record<VampireGameObjectiveTypePart2, { playerRequired: number; finished: boolean }> {
        return this.state.objectivePart2;
    }

    public getObjectivePart2Instructions(objective: VampireGameObjectiveTypePart2): string[] {
        switch (objective) {
            case 'battery':
                return [
                    'Vous tentez de relancer les batteries d’urgences de la ville, mais il est nécessaire que',
                    `~${this.getObjectivePart2PlayerRequired(objective)} Personnes le fassent en même temps~`,
                    `pour que ça fonctionne !`,
                ];
            case 'dam':
                return [
                    'Vous tentez de relancer le barrage de la ville, mais il est nécessaire que',
                    `~${this.getObjectivePart2PlayerRequired(objective)} Personnes le fassent en même temps~`,
                    'pour que ça fonctionne !',
                ];
            case 'vampire':
                return [
                    'Vous tentez de vous renseigner sur les vampires, mais il est nécessaire que',
                    `~${this.getObjectivePart2PlayerRequired(objective)} Personnes réfléchissent en même temps~`,
                    'pour trouver la solution !',
                ];
            case 'weapon':
                return [
                    'Vous tentez de forger des armes anti-vampire, mais il est nécessaire que',
                    `~${this.getObjectivePart2PlayerRequired(objective)} Personnes fondent en même temps~`,
                    'pour avoir assez d’armes !',
                ];
        }
    }

    public getObjectivePart2PlayerRequired(objective: VampireGameObjectiveTypePart2): number {
        return this.state.objectivePart2?.[objective]?.playerRequired ?? 0;
    }

    public isObjectivePart2Finished(objective: VampireGameObjectiveTypePart2): boolean {
        return this.state.objectivePart2?.[objective]?.finished === true;
    }
}
