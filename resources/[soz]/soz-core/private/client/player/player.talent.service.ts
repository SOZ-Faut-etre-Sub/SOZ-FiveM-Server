import { Injectable } from '@core/decorators/injectable';

@Injectable()
export class PlayerTalentService {
    public getMaxInjuries(): number {
        return 42;
    }
}
