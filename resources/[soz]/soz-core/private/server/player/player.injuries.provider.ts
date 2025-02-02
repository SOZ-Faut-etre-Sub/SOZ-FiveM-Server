/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@core/decorators/injectable';

@Injectable()
export class PlayerInjuryProvider {
    public async handleInjuryRevive(source: number, targetid: number) {
        return false;
    }
}
