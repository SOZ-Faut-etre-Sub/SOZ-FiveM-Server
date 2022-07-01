import { Injectable } from '../core/decorators/injectable';

export enum PollutionLevel {
    Low = 1,
    Neutral = 2,
    High = 3,
}

@Injectable()
export class Pollution {
    getPollutionLevel(): PollutionLevel {
        return exports['soz-upw'].GetPollutionLevel() as PollutionLevel;
    }
}
