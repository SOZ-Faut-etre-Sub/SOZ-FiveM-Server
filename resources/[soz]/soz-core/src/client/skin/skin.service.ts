import { Injectable } from '../../core/decorators/injectable';
import { wait } from '../../core/utils';

@Injectable()
export class SkinService {
    public async setModel(model: string) {
        if (!IsModelInCdimage(model) || !IsModelValid(model)) {
            return;
        }
        SetEntityInvincible(PlayerPedId(), true);

        RequestModel(model);
        while (!HasModelLoaded(model)) {
            await wait(1);
        }
        SetPlayerModel(PlayerId(), model);
        SetPedDefaultComponentVariation(PlayerPedId());

        SetModelAsNoLongerNeeded(model);
        SetEntityInvincible(PlayerPedId(), false);
    }
}
