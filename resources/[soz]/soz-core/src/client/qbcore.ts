import { Injectable } from '../core/decorators/injectable';
import { Blip } from '../shared/blip';
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

    public getItems(): Item[] {
        return Object.values(this.QBCore.Shared.Items);
    }

    public getItem<T extends Item = Item>(name: string): T | null {
        return (this.QBCore.Shared.Items[name] as T) || null;
    }

    public createBlip(id: string, blip: Blip): number {
        return this.QBCore.Functions.CreateBlip(id, blip);
    }

    public hideBlip(id: string, value: boolean): void {
        this.QBCore.Functions.HideBlip(id, value);
    }

    public removeBlip(id: string): void {
        this.QBCore.Functions.RemoveBlip(id);
    }

    public hasBlip(id: string): boolean {
        return !!this.QBCore.Functions.GetBlip(id);
    }
}
