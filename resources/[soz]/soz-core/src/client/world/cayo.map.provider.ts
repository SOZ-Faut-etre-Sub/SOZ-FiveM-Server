import { Provider } from '@core/decorators/provider';
import { Once, OnceStep } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Tick, TickInterval } from '@public/core/decorators/tick';
import { wait } from '@public/core/utils';

import { BlipFactory } from '../blip';

@Provider()
export class CayoMapProvider {
    @Inject(BlipFactory)
    public blipFactory: BlipFactory;

    private isCloseToCayo = false;
    private isCayoMinimapLoaded = false;

    @Once(OnceStep.Start)
    public init() {
        //dummy blip to able to move radar to the bottom right of cayo
        const blipid = 'cayo_fake_blip';
        if (this.blipFactory.exist(blipid)) {
            return;
        }

        this.blipFactory.create(blipid, {
            coords: { x: 5942.1, y: -6271.1 },
            name: 'Cayo Perico',
            sprite: 575,
            display: 4,
            scale: 0.000001,
            color: 0,
            range: true,
        });
    }

    @Tick(TickInterval.EVERY_FRAME)
    public async displayLoop() {
        if (IsPauseMenuActive() && !IsMinimapInInterior()) {
            SetRadarAsExteriorThisFrame();
            SetRadarAsInteriorThisFrame(GetHashKey('h4_fake_islandx'), 4700.0, -5145.0, 0, 0);
        } else {
            await wait(500);
        }
    }
}
