import { Injectable } from '@core/decorators/injectable';

@Injectable()
export class PlayerInjuryProvider {
    public hasMaxInjuries(target: number): boolean {
        return false;
    }
}
