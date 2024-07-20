import { Once } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Feature, isFeatureEnabled } from '@public/shared/features';
import { toVector3Object } from '@public/shared/polyzone/vector';
import { Bunkers } from '@public/shared/utils/bunkers';

import { Provider } from '../../core/decorators/provider';
import { BlipFactory } from '../blip';
import { PlayerPositionProvider } from '../player/player.position.provider';
import { PlayerService } from '../player/player.service';
import { TargetFactory } from '../target/target.factory';

@Provider()
export class BunkerProvider {
    @Inject(PlayerService)
    public playerService: PlayerService;

    @Inject(TargetFactory)
    public targetFactory: TargetFactory;

    @Inject(BlipFactory)
    public blipFactory: BlipFactory;

    @Inject(PlayerPositionProvider)
    private playerPositionProvider: PlayerPositionProvider;

    @Once()
    public onStart() {
        if (!isFeatureEnabled(Feature.Bunkers)) {
            return;
        }

        for (const bunker of Bunkers) {
            this.targetFactory.createForModel(bunker.model, [
                {
                    label: bunker.label,
                    icon: 'c:elevators/descendre.png',
                    action: () => {
                        this.playerPositionProvider.teleportPlayerToPosition(
                            bunker.intermediate ? 'inter:' + bunker.label : bunker.label,
                            async () => {
                                if (bunker.intermediate) {
                                    await this.playerPositionProvider.teleportPlayerToPosition(bunker.label);
                                }
                            }
                        );
                    },
                },
            ]);

            this.targetFactory.createForBoxZone('bunker:exit:' + bunker.label, bunker.exitInteractionZone, [
                {
                    label: 'Sortir',
                    icon: 'c:elevators/monter.png',
                    action: () => {
                        this.playerPositionProvider.teleportPlayerToPosition('exit:' + bunker.label);
                    },
                },
            ]);

            this.blipFactory.create(bunker.label, {
                name: bunker.label,
                coords: toVector3Object(bunker.outsideCoods),
                sprite: 565,
            });
        }
    }
}
