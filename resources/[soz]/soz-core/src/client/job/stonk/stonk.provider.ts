import { Once, OnceStep } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { BlipFactory } from '../../blip';

@Provider()
export class StonkProvider {
    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Once(OnceStep.PlayerLoaded)
    public onPlayerLoaded() {
        this.blipFactory.create('societyStonkSecurity', {
            name: 'STONK Security',
            coords: { x: 6.25, y: -709.11, z: 46.22 },
            sprite: 605,
            scale: 0.9,
        });
    }
}
