/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@core/decorators/injectable';

@Injectable()
export class PlayerInjuryProvider {
    public remainingForcedITT(target: number): number {
        return 0;
    }

    public async handleInjuryRevive(source: number, targetid: number) {
        return false;
    }
}
