import { Inject, Injectable } from '../../core/decorators/injectable';
import { InventoryItem, Item } from '../../shared/item';
import { Qbcore } from '../qbcore';

@Injectable()
export class ItemService {
    @Inject(Qbcore)
    private QBCore: Qbcore;

    public getItem<T extends Item = Item>(id: string): T | null {
        return this.QBCore.getItem<T>(id);
    }

    public isExpired(item: InventoryItem): boolean {
        if (item && item.metadata && item.metadata.expiration) {
            return new Date().getTime() > new Date(item.metadata.expiration).getTime();
        }
        return false;
    }
}
