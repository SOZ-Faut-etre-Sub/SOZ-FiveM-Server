import { Injectable } from '../core/decorators/injectable';
import { Blip } from '../shared/blip';
import { Draw2dTextParameters, Draw3dTextParameters } from '../shared/draw';
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

    public createBlip(id: string, blip: Blip): void {
        this.QBCore.Functions.CreateBlip(id, blip);
    }

    public hideBlip(id: string, value: boolean): void {
        this.QBCore.Functions.HideBlip(id, value);
    }

    public removeBlip(id: string): void {
        this.QBCore.Functions.RemoveBlip(id);
    }

    public DrawText(drawRequest: Draw2dTextParameters): void {
        SetTextFont(4);
        SetTextProportional(false);
        SetTextScale(drawRequest.scale, drawRequest.scale);
        SetTextColour(drawRequest.r, drawRequest.g, drawRequest.b, drawRequest.a);
        SetTextDropshadow(0, 0, 0, 0, 255);
        SetTextEdge(2, 0, 0, 0, 255);
        SetTextDropShadow();
        SetTextOutline();
        SetTextEntry('STRING');
        AddTextComponentString(drawRequest.text);
        DrawText(drawRequest.x - drawRequest.width / 2, drawRequest.y - drawRequest.height / 2 + 0.005);
    }

    public Draw3dText(drawRequest: Draw3dTextParameters): void {
        SetTextScale(0.35, 0.35);
        SetTextFont(4);
        SetTextProportional(true);
        SetTextColour(255, 255, 255, 215);
        SetTextEntry('STRING');
        SetTextCentre(true);
        AddTextComponentString(drawRequest.text);
        SetDrawOrigin(drawRequest.x, drawRequest.y, drawRequest.z, 0);
        DrawText(0.0, 0.0);
        const factor = drawRequest.text.length / 370;
        DrawRect(0.0, 0.0125, 0.017 + factor, 0.03, 0, 0, 0, 75);
        ClearDrawOrigin();
    }
}
