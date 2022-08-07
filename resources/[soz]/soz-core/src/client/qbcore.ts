import { Injectable } from '../core/decorators/injectable';
import { PlayerData } from '../shared/player';

@Injectable()
export class Qbcore {
    private QBCore;

    public constructor() {
        this.QBCore = exports['qb-core'].GetCoreObject();
    }

    public getPlayer(): PlayerData {
        return this.QBCore.Functions.GetPlayerData();
    }
}
