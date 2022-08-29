import { Injectable } from '../../core/decorators/injectable';

@Injectable()
export class JobCore {
    private JobCore;

    public constructor() {
        this.JobCore = exports['soz-jobs'].GetCoreObject();
    }
}
