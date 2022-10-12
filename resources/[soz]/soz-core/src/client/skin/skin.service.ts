import { Inject, Injectable } from '../../core/decorators/injectable';
import { ResourceLoader } from '../resources/resource.loader';

@Injectable()
export class SkinService {
    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

    public async setModel(model: string) {
        if (!IsModelInCdimage(model) || !IsModelValid(model)) {
            return;
        }
        SetEntityInvincible(PlayerPedId(), true);

        await this.resourceLoader.loadModel(model);

        SetPlayerModel(PlayerId(), model);
        SetPedDefaultComponentVariation(PlayerPedId());

        this.resourceLoader.unloadModel(model);
        SetEntityInvincible(PlayerPedId(), false);
    }
}
