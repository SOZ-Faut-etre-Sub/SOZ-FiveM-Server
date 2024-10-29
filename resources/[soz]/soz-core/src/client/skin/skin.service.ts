import { Inject, Injectable } from '../../core/decorators/injectable';
import { ResourceLoader } from '../repository/resource.loader';

@Injectable()
export class SkinService {
    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

    public async setModel(model: string, randomize: boolean = false): Promise<void> {
        if (!IsModelInCdimage(model) || !IsModelValid(model)) {
            return;
        }
        SetEntityInvincible(PlayerPedId(), true);

        if (await this.resourceLoader.loadModel(model)) {
            SetPlayerModel(PlayerId(), model);

            if (randomize) {
                SetPedRandomComponentVariation(PlayerPedId(), 0);
            } else {
                SetPedDefaultComponentVariation(PlayerPedId());
            }
        }

        this.resourceLoader.unloadModel(model);
        SetEntityInvincible(PlayerPedId(), false);
    }
}
