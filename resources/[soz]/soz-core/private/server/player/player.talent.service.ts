import { Injectable } from '@core/decorators/injectable';
import { Talent } from '@private/shared/talent';

@Injectable()
export class PlayerTalentService {
    public hasTalent(_source: number, _talent: Talent): boolean {
        return false;
    }
}
