import { Injectable } from '@core/decorators/injectable';

@Injectable()
export class PlayerInjuriesProvider {
    public hasMaxInjuries(): boolean {
        return false;
    }
}
