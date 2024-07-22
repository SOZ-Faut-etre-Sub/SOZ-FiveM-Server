import { Inject, Injectable } from '@core/decorators/injectable';
import { InventoryItem, isInventoryItemExpired } from '@public/shared/inventory';

import { Item } from '../../shared/item';
import { Qbcore } from '../qbcore';

@Injectable()
export class ItemService {
    @Inject(Qbcore)
    private QBCore: Qbcore;

    public getItems(): Item[] {
        return this.QBCore.getItems();
    }

    public getItem<T extends Item = Item>(id: string): T | null {
        return this.QBCore.getItem<T>(id);
    }

    public isExpired(item: InventoryItem): boolean {
        return isInventoryItemExpired(item);
    }
}
