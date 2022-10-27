import { Once, OnceStep } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { emitRpc } from '../../../core/rpc';
import { Feature, isFeatureEnabled } from '../../../shared/features';
import { RpcEvent } from '../../../shared/rpc';
import { Halloween2022Scenario2 } from '../../../shared/story/halloween-2022/scenario2';
import { Dialog } from '../../../shared/story/story';
import { AnimationService } from '../../animation/animation.service';
import { BlipFactory } from '../../blip';
import { EntityFactory } from '../../factory/entity.factory';
import { PedFactory } from '../../factory/ped.factory';
import { PlayerService } from '../../player/player.service';
import { ProgressService } from '../../progress.service';
import { TargetFactory, TargetOptions } from '../../target/target.factory';
import { StoryProvider } from '../story.provider';

@Provider()
export class Halloween2022Scenario2Provider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(PedFactory)
    private pedFactory: PedFactory;

    @Inject(EntityFactory)
    private entityFactory: EntityFactory;

    @Inject(StoryProvider)
    private storyService: StoryProvider;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(AnimationService)
    private animationService: AnimationService;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Once(OnceStep.PlayerLoaded)
    public async onPlayerLoaded() {
        if (!isFeatureEnabled(Feature.HalloweenScenario2)) {
            return;
        }

        this.blipFactory.create('halloween_scenario2', {
            name: 'Activité suspecte',
            coords: { x: 3314.16, y: 5179.72, z: 18.68 },
            sprite: 484,
            scale: 0.5,
            color: 44,
        });

        await this.createOldPed();
        await this.createFeetZone();
        await this.createDeadZone();

        await this.createActionZones();
        await this.spawnProps();
    }

    private async createOldPed(): Promise<void> {
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
                    canInteract: () => this.storyService.canInteractForPart('halloween2022', 'scenario2', 1),
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
                    canInteract: () => this.storyService.canInteractForPart('halloween2022', 'scenario2', 6),
                    action: async () => {
                        const dialog = await emitRpc<Dialog | null>(RpcEvent.STORY_HALLOWEEN_SCENARIO2, 'part6');
                        if (dialog) {
                            await this.storyService.launchDialog(dialog, true, 3315.31, 5179.02, 19.61, 56.34);
                        }
                    },
                },
                this.storyService.replayTarget(Halloween2022Scenario2, 1),
                this.storyService.replayTarget(Halloween2022Scenario2, 6),
            ]
        );
    }

    private async createFeetZone(): Promise<void> {
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
            [
                this.interactionFeet(2),
                this.interactionFeet(3),
                this.storyService.replayTarget(Halloween2022Scenario2, 2),
                this.storyService.replayTarget(Halloween2022Scenario2, 3),
            ]
        );
    }
    private async createDeadZone(): Promise<void> {
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
                    canInteract: () => this.storyService.canInteractForPart('halloween2022', 'scenario2', 4),
                    action: async () => {
                        const dialog = await emitRpc<Dialog | null>(RpcEvent.STORY_HALLOWEEN_SCENARIO2, 'part4');
                        if (dialog) {
                            await this.storyService.launchDialog(dialog, true, 2782.43, -1534.0, 1.59, 339.11);
                        }
                    },
                },
                this.storyService.replayTarget(Halloween2022Scenario2, 4),
            ]
        );
    }

    private interactionFeet(part: number): TargetOptions {
        return {
            label: 'Inspecter',
            icon: 'fas fa-search',
            canInteract: () => this.storyService.canInteractForPart('halloween2022', 'scenario2', part),
            action: async () => {
                const dialog = await emitRpc<Dialog | null>(RpcEvent.STORY_HALLOWEEN_SCENARIO2, `part${part}`);
                if (dialog) {
                    await this.storyService.launchDialog(dialog);
                }
            },
        };
    }

    private async spawnProps() {
        for (const prop of Halloween2022Scenario2.props) {
            await this.entityFactory.createEntityWithRotation(GetHashKey(prop.model), ...prop.coords, ...prop.rotation);
        }
    }

    private async createActionZones() {
        Halloween2022Scenario2.zones.forEach(zone => {
            this.targetFactory.createForBoxZone(zone.name, zone, [
                {
                    label: zone.label,
                    icon: zone.icon,
                    canInteract: () => this.storyService.canInteractForPart('halloween2022', 'scenario2', zone.part),
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
