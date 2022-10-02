import { Injectable } from '../core/decorators/injectable';
import { Blip } from '../shared/blip';
import { Item } from '../shared/item';
import { Job, JobType } from '../shared/job';
import { PlayerData } from '../shared/player';

@Injectable()
export class Qbcore {
    private QBCore;
    private SozJobCore;

    public constructor() {
        this.QBCore = exports['qb-core'].GetCoreObject();
        this.SozJobCore = exports['soz-jobs'].GetCoreObject();
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

    public createBlip(id: string, blip: Blip): void {
        this.QBCore.Functions.CreateBlip(id, blip);
    }

    public hideBlip(id: string, value: boolean): void {
        this.QBCore.Functions.HideBlip(id, value);
    }

    public removeBlip(id: string): void {
        this.QBCore.Functions.RemoveBlip(id);
    }

    public getJobs(): Job[] {
        const jobs = this.SozJobCore.Jobs as { [key in JobType]: Job };
        if (!jobs) {
            return [];
        }
        return Object.entries(jobs)
            .sort((a, b) => a[1].label.localeCompare(b[1].label))
            .map(([key, value]) => ({ ...value, id: key as JobType }));
    }

    public getProperties(vehicle: any): any[] {
        return this.QBCore.Functions.GetVehicleProperties(vehicle);
    }
}
