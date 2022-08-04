import { Injectable } from '../core/decorators/injectable';

@Injectable()
export class Qbcore {
    private QBCore;

    public constructor() {
        this.QBCore = exports['qb-core'].GetCoreObject();

        console.log(this.QBCore);
    }
}
