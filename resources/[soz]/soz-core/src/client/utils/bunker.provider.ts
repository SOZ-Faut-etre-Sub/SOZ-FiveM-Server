import { Once, OnceStep } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { wait } from '@public/core/utils';
import { Feature, isFeatureEnabled } from '@public/shared/features';
import { toVector3Object, Vector4 } from '@public/shared/polyzone/vector';
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
                    icon: 'c:elevators/descendre',
                    category: 'citizen',
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
                    icon: 'c:elevators/monter',
                    category: 'citizen',
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

    @Once(OnceStep.PlayerLoaded)
    public async onloaded() {
        if (!isFeatureEnabled(Feature.Bunkers)) {
            return;
        }

        while (IsScreenFadedOut() || IsScreenFadedIn()) {
            await wait(10);
        }

        const bunker = Bunkers.find(b => b.interiorId == 268289);
        const playerPedId = PlayerPedId();
        const coords = [...GetEntityCoords(PlayerPedId()), GetEntityHeading(playerPedId)] as Vector4;
        if (coords[2] > -150 || coords[1] < 3000) {
            return;
        }

        const playerPed = PlayerPedId();
        SetEntityVisible(playerPed, false, false);

        await this.playerPositionProvider.teleportPlayerToPosition('inter:' + bunker.label, async () => {
            await this.playerPositionProvider.teleportPlayerToPosition(bunker.label, async () => {
                await this.playerPositionProvider.teleportAdminToPosition(coords);
            });
        });
        SetEntityVisible(playerPed, true, false);
    }
}
