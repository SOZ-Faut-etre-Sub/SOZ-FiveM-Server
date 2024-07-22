import { Injectable } from '../../../src/core/decorators/injectable';

@Injectable()
export class PlayerSyringeProvider {
    hasTemporaryCrimiWeight(_source: number): boolean {
        return false;
    }
}
