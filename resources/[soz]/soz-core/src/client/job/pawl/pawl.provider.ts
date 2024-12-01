import { Once, OnceStep } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';

import { toVector4Object } from '../../../shared/polyzone/vector';
import { PedFactory } from '../../factory/ped.factory';

@Provider()
export class PawlProvider {
    @Inject(PedFactory)
    private pedFactory: PedFactory;

    @Once(OnceStep.PlayerLoaded)
    public async onPlayerLoaded() {
        await this.pedFactory.createPedOnGrid({
            model: 's_m_y_construct_01',
            coords: toVector4Object([-272.22, -2496.57, 6.3, 186.72]),
            freeze: true,
            invincible: true,
            blockevents: true,
            scenario: 'WORLD_HUMAN_CLIPBOARD',
        });
    }
}
