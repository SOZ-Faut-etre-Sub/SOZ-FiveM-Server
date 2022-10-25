import { Once, OnceStep } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { emitRpc } from '../../../core/rpc';
import { Feature, isFeatureEnabled } from '../../../shared/features';
import { RpcEvent } from '../../../shared/rpc';
import { Halloween2022Scenario1 } from '../../../shared/story/halloween-2022/scenario1';
import { Halloween2022Scenario2 } from '../../../shared/story/halloween-2022/scenario2';
import { Dialog, ScenarioState } from '../../../shared/story/story';
import { AnimationService } from '../../animation/animation.service';
import { EntityFactory } from '../../factory/entity.factory';
import { PedFactory } from '../../factory/ped.factory';
import { PlayerService } from '../../player/player.service';
import { ProgressService } from '../../progress.service';
import { TargetFactory, TargetOptions } from '../../target/target.factory';
import { StoryService } from '../story.service';

@Provider()
export class Halloween2022Scenario2Provider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(PedFactory)
    private pedFactory: PedFactory;

    @Inject(EntityFactory)
    private entityFactory: EntityFactory;

    @Inject(StoryService)
    private storyService: StoryService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(AnimationService)
    private animationService: AnimationService;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Once(OnceStep.PlayerLoaded)
    public async onPlayerLoaded() {
        if (!isFeatureEnabled(Feature.Halloween2022)) {
            return;
        }

        // povers
        await this.pedFactory.createPed({
            model: 'ig_old_man2',
            coords: { x: 3314.16, y: 5179.72, z: 18.68, w: 240.04 },
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'switch@michael@sitting',
            anim: 'idle',
            flag: 1,
        });

        this.targetFactory.createForBoxZone(
            'halloween2022:scenario2:part1',
            {
                center: [3314.16, 5179.72, 18.68],
                length: 1.5,
                width: 1.5,
                heading: 240,
                minZ: 18,
                maxZ: 21,
            },
            [
                {
                    label: 'Parler',
                    icon: 'fas fa-comment',
                    canInteract: () => {
                        return (
                            this.playerService.getPlayer().metadata.halloween2022?.scenario2?.['part1'] <
                                ScenarioState.Running ||
                            this.playerService.getPlayer().metadata.halloween2022?.scenario2 === undefined
                        );
                    },
                    action: async () => {
                        const dialog = await emitRpc<Dialog | null>(RpcEvent.STORY_HALLOWEEN_SCENARIO2, 'diag1');
                        if (dialog) {
                            await this.storyService.launchDialog(dialog, true, 3315.31, 5179.02, 19.61, 56.34);
                        }
                    },
                },
                {
                    label: 'Parler',
                    icon: 'fas fa-comment',
                    canInteract: () => {
                        return (
                            this.playerService.getPlayer().metadata.halloween2022?.scenario2?.['part6'] ===
                            ScenarioState.Running
                        );
                    },
                    action: async () => {
                        const dialog = await emitRpc<Dialog | null>(RpcEvent.STORY_HALLOWEEN_SCENARIO2, 'part6');
                        if (dialog) {
                            await this.storyService.launchDialog(dialog, true, 3315.31, 5179.02, 19.61, 56.34);
                        }
                    },
                },
            ]
        );

        await this.entityFactory.createEntity(GetHashKey('prop_hand_toilet'), 3739.34, 4903.36, 17.49);
        await this.entityFactory.createEntityWithRotation(
            GetHashKey('prop_water_corpse_01'),
            2782.97,
            -1532.91,
            0.84,
            -90,
            -70,
            0
        );
        await this.entityFactory.createEntity(GetHashKey('prop_idol_case'), -2166.61, 5197.96, 15.88);

        const dialogInteraction = (part: string): TargetOptions => {
            return {
                label: 'Inspecter',
                icon: 'fas fa-search',
                canInteract: () => {
                    return (
                        this.playerService.getPlayer().metadata.halloween2022?.scenario2?.[part] ===
                        ScenarioState.Running
                    );
                },
                action: async () => {
                    const dialog = await emitRpc<Dialog | null>(RpcEvent.STORY_HALLOWEEN_SCENARIO2, part);
                    if (dialog) {
                        await this.storyService.launchDialog(dialog);
                    }
                },
            };
        };
        this.targetFactory.createForBoxZone(
            'halloween2022:scenario2:part2',
            {
                center: [3739.34, 4903.36, 17.49],
                length: 1,
                width: 1,
                heading: 0,
                minZ: 17,
                maxZ: 18,
            },
            [dialogInteraction('part2'), dialogInteraction('part3')]
        );

        this.targetFactory.createForBoxZone(
            'halloween2022:scenario2:part4',
            {
                center: [2782.97, -1532.91, 0.84],
                length: 2.5,
                width: 1.5,
                heading: 70,
                minZ: 0,
                maxZ: 1.5,
            },
            [
                {
                    label: 'Inspecter',
                    icon: 'fas fa-comment',
                    canInteract: () => {
                        return (
                            this.playerService.getPlayer().metadata.halloween2022?.scenario2?.['part4'] ===
                            ScenarioState.Running
                        );
                    },
                    action: async () => {
                        const dialog = await emitRpc<Dialog | null>(RpcEvent.STORY_HALLOWEEN_SCENARIO2, 'part4');
                        if (dialog) {
                            await this.storyService.launchDialog(dialog, true, 2782.43, -1534.0, 1.59, 339.11);
                        }
                    },
                },
            ]
        );

        Halloween2022Scenario2.zones.forEach(zone => {
            this.targetFactory.createForBoxZone(zone.name, zone, [
                {
                    label: zone.label,
                    icon: zone.icon,
                    canInteract: () => {
                        return (
                            this.playerService.getPlayer().metadata.halloween2022?.scenario2?.[zone.part] ===
                            ScenarioState.Running
                        );
                    },
                    action: async () => {
                        const animationPromise = this.animationService.playAnimation({
                            base: {
                                dictionary: 'missfbi4prepp1',
                                name: '_bag_pickup_garbage_man',
                                options: {
                                    enablePlayerControl: false,
                                    repeat: true,
                                },
                            },
                        });

                        const { completed } = await this.progressService.progress(
                            'Recherche',
                            'Vous recherchez...',
                            5000
                        );

                        this.animationService.stop();
                        await animationPromise;

                        if (completed) {
                            const dialog = await emitRpc<Dialog | null>(RpcEvent.STORY_HALLOWEEN_SCENARIO2, zone.name);
                            if (dialog) {
                                await this.storyService.launchDialog(dialog);
                            }
                        }
                    },
                },
            ]);
        });
    }
}
