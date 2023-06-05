import { Injectable } from '@core/decorators/injectable';

@Injectable()
export class PlayerInjuriesProvider {
    public hasMaxInjuries(target: number): boolean {
        return false;
    }
}
