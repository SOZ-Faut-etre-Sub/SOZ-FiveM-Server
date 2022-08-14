import { Inject, Injectable } from '../../core/decorators/injectable';
import { Qbcore } from '../qbcore';

@Injectable()
export class ItemService {
    @Inject(Qbcore)
    private qbcore: Qbcore;
}
