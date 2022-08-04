import { Injectable } from '../../core/decorators/injectable';

@Injectable()
export class PlayerService {
    public getPlayerWeapon(source: number): any | null {
        const state = Player(source).state;

        return state.CurrentWeaponData || null;
    }
}
