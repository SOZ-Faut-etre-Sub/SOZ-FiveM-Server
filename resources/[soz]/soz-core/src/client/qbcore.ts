import { Injectable } from '../core/decorators/injectable';
import { Item } from '../shared/item';
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

    public getClosestPlayer(): [number, number] {
        return this.QBCore.Functions.GetClosestPlayer();
    }

    public getItem<T extends Item = Item>(name: string): T | null {
        return (this.QBCore.Shared.Items[name] as T) || null;
    }
}
