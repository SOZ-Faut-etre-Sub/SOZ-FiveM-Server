import { Injectable } from '@core/decorators/injectable';

@Injectable()
export class PlayerInjuryProvider {
    public remainingForcedITT(target: number): number {
        return 0;
    }
}
