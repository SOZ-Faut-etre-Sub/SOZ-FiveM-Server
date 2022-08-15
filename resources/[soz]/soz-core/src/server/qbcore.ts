import { Injectable } from '../core/decorators/injectable';
import { SozRole } from '../core/permissions';
import { Item, ItemType } from '../shared/item';
import { QBCorePlayer } from '../shared/player';

@Injectable()
export class QBCore {
    private QBCore;

    public constructor() {
        this.QBCore = exports['qb-core'].GetCoreObject();
    }

    public createUseableItem(name, action: (player: number, item: any) => void) {
        this.QBCore.Functions.CreateUseableItem(name, action);
    }

    public getItem<T extends Item = Item>(name: string): T | null {
        return (this.QBCore.Shared.Items[name] as T) || null;
    }

    public getItems<T extends Item = Item>(type?: ItemType): Record<string, T> {
        const items = this.QBCore.Shared.Items as Record<string, T>;

        if (!type) {
            return items;
        }

        const filteredItems = {};

        for (const key of Object.keys(items)) {
            if (items[key].type === type) {
                filteredItems[key] = items[key];
            }
        }

        return filteredItems;
    }

    public getPlayer(source: number): QBCorePlayer {
        return this.QBCore.Functions.GetPlayer(source);
    }

    public getPlayersSources(): number[] {
        const players: Record<number, number> = this.QBCore.Functions.GetPlayers();

        return Object.values(players);
    }

    public hasPermission(source: number, permission: SozRole): boolean {
        return this.QBCore.Functions.HasPermission(source, permission);
    }
}
