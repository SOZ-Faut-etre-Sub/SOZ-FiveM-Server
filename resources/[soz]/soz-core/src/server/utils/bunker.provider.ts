import { Once } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Feature } from '@public/shared/features';
import { Bunkers } from '@public/shared/utils/bunkers';

import { Provider } from '../../core/decorators/provider';
import { FeatureProvider } from '../feature/feature.provider';
import { PlayerPositionProvider } from '../player/player.position.provider';
import { PlayerService } from '../player/player.service';

@Provider()
export class BunkerProvider {
    @Inject(PlayerService)
    public playerService: PlayerService;

    @Inject(PlayerPositionProvider)
    private playerPositionProvider: PlayerPositionProvider;

    @Inject(FeatureProvider)
    private featureProvider: FeatureProvider;

    @Once()
    public onStart() {
        if (!this.featureProvider.isFeatureEnabled(Feature.Bunkers)) {
            return;
        }

        for (const bunker of Bunkers) {
            this.playerPositionProvider.registerZone(bunker.label, bunker.insideCoords);
            this.playerPositionProvider.registerZone('exit:' + bunker.label, bunker.outsideCoods);
            if (bunker.intermediate) {
                this.playerPositionProvider.registerZone('inter:' + bunker.label, bunker.intermediate);
            }
        }
    }
}
