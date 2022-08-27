import { Inject, Injectable } from '../../core/decorators/injectable';
import { Item } from '../../shared/item';
import { Qbcore } from '../qbcore';

@Injectable()
export class ItemService {
    @Inject(Qbcore)
    private qbcore: Qbcore;

    public getItem<T extends Item = Item>(id: string): T | null {
        return this.qbcore.getItem<T>(id);
    }
}
