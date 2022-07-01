import { Injectable } from '../core/decorators/injectable';

@Injectable()
export class QBCore {
    private QBCore;

    public constructor() {
        this.QBCore = exports['qb-core'].GetCoreObject();
    }

    public getPlayer(source: number) {
        return this.QBCore.Functions.GetPlayer(source);
    }

    public getPlayersSources(): number[] {
        const players: Record<number, number> = this.QBCore.Functions.GetPlayers();

        return Object.values(players);
    }
}
