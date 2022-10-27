import { Once, OnceStep } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { emitRpc } from '../../../core/rpc';
import { Feature, isFeatureEnabled } from '../../../shared/features';
import { RpcEvent } from '../../../shared/rpc';
import { Halloween2022Scenario1 } from '../../../shared/story/halloween-2022/scenario1';
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
export class Halloween2022Scenario1Provider {
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
        if (!isFeatureEnabled(Feature.HalloweenScenario1)) {
            return;
        }

        this.blipFactory.create('halloween_scenario1', {
            name: 'Activité suspecte',
            coords: { x: -1647.19, y: -1064.16, z: 2.61 },
            sprite: 484,
            scale: 0.5,
            color: 44,
        });

        await this.createDeadPed();
        await this.createMainPed();
        await this.createDeadPed();
        await this.createGangPed();
        await this.createPolicePed();

        await this.createActionZones();
        await this.spawnProps();
    }

    // Dead ped
    private async createDeadPed() {
        const deadMen = await this.pedFactory.createPed({
            model: 'a_m_y_beach_03',
            coords: { x: -1647.19, y: -1064.16, z: 2.61, w: 236.37 },
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'dead',
            anim: 'dead_a',
            flag: 1,
        });
        ApplyPedDamagePack(deadMen, 'BigHitByVehicle', 3.0, 3.0);
        SetPedSuffersCriticalHits(deadMen, true);
        StopPedSpeaking(deadMen, true);
    }

    private async createMainPed(): Promise<void> {
        await this.pedFactory.createPed({
            model: 'a_f_y_beach_01',
            coords: { x: -1647.89, y: -1064.41, z: 2.58, w: 296.46 },
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'amb@medic@standing@kneel@idle_a',
            anim: 'idle_a',
            flag: 1,
        });

        this.targetFactory.createForBoxZone(
            'halloween2022:part1',
            {
                center: [-1647.89, -1064.41, 2.58],
                length: 1.5,
                width: 1.5,
                heading: 296,
                minZ: 2,
                maxZ: 4,
            },
            [
                {
                    label: 'Parler',
                    icon: 'fas fa-comment',
                    canInteract: () => this.storyService.canInteractForPart('halloween2022', 'scenario1', 1),
                    action: async () => {
                        const dialog = await emitRpc<Dialog | null>(RpcEvent.STORY_HALLOWEEN_SCENARIO1, 'diag1');
                        if (dialog) {
                            await this.storyService.launchDialog(dialog, true, -1646.24, -1063.64, 3.67, 143.07);
                        }
                    },
                },
                {
                    label: 'Parler',
                    icon: 'fas fa-comment',
                    canInteract: () => this.storyService.canInteractForPart('halloween2022', 'scenario1', 2),
                    action: async () => {
                        const dialog = await emitRpc<Dialog | null>(RpcEvent.STORY_HALLOWEEN_SCENARIO1, 'part2');
                        if (dialog) {
                            await this.storyService.launchDialog(dialog, true, -1646.24, -1063.64, 3.67, 143.07);
                        }
                    },
                },
                this.storyService.replayTarget(Halloween2022Scenario1, 1),
                this.storyService.replayTarget(Halloween2022Scenario1, 2),
            ]
        );
    }

    // Gang
    private async createGangPed(): Promise<void> {
        await this.pedFactory.createPed({
            model: 'mp_m_freemode_01',
            coords: { x: -1021.85, y: -1020.17, z: 1.15, w: 32.55 },
            components: {
                // 0: [29, 44, 0],
                // 1: [46, 0, 0],
                2: [9, 17, 4],
                3: [12, 0, 0],
                4: [26, 11, 0],
                5: [0, 0, 0],
                6: [21, 4, 0],
                7: [0, 0, 0],
                8: [33, 3, 0],
                9: [0, 0, 0],
                10: [0, 0, 0],
                11: [292, 6, 0],
                // "13":5,
                // "12":26,
                // "22":33,
                // "32":92,
                // "210":0,
                // "310":5,
            },
            invincible: true,
            freeze: true,
            blockevents: true,
            // animDict: 'amb@medic@standing@kneel@idle_a',
            // anim: 'idle_a',
            flag: 1,
        });

        this.targetFactory.createForBoxZone(
            'halloween2022:part3',
            {
                center: [-1021.85, -1020.17, 1.15],
                length: 1.5,
                width: 1.5,
                heading: 129,
                minZ: 1,
                maxZ: 3,
            },
            [
                this.interactionPedGang(3),
                this.interactionPedGang(4),
                this.storyService.replayTarget(Halloween2022Scenario1, 3),
                this.storyService.replayTarget(Halloween2022Scenario1, 4),
            ]
        );
    }

    private interactionPedGang(part: number): TargetOptions {
        return {
            label: 'Parler',
            icon: 'fas fa-comment',
            canInteract: () => this.storyService.canInteractForPart('halloween2022', 'scenario1', part),
            action: async () => {
                const dialog = await emitRpc<Dialog | null>(RpcEvent.STORY_HALLOWEEN_SCENARIO1, `part${part}`);
                if (dialog) {
                    await this.storyService.launchDialog(dialog, true, -1022.92, -1018.88, 2.15, 210.29);
                }
            },
        };
    }

    // Police
    private async createPolicePed(): Promise<void> {
        await this.pedFactory.createPed({
            model: 'mp_m_freemode_01',
            coords: { x: -1108.03, y: -844.75, z: 18.32, w: 129.27 },
            components: {
                // 0: [43, 26, 0],
                // 1: [121, 0, 0],
                2: [43, 64, 0],
                3: [22, 0, 0],
                4: [35, 0, 0],
                5: [0, 0, 0],
                6: [24, 0, 0],
                7: [0, 0, 0],
                8: [42, 0, 0],
                9: [0, 0, 0],
                10: [0, 0, 0],
                11: [118, 0, 0],
                // "13":1,
                // "12":19,
                // "22":29,
                // "32":99,
            },
            invincible: true,
            freeze: true,
            blockevents: true,
            // animDict: 'amb@medic@standing@kneel@idle_a',
            // anim: 'idle_a',
            flag: 1,
        });

        this.targetFactory.createForBoxZone(
            'halloween2022:part5',
            {
                center: [-1108.03, -844.75, 18.32],
                length: 1.5,
                width: 1.5,
                heading: 129,
                minZ: 18,
                maxZ: 21,
            },
            [
                this.interactionPedPolice(5),
                this.interactionPedPolice(6),
                this.interactionPedPolice(7),
                this.storyService.replayTarget(Halloween2022Scenario1, 5),
                this.storyService.replayTarget(Halloween2022Scenario1, 6),
                this.storyService.replayTarget(Halloween2022Scenario1, 7),
            ]
        );
    }

    private interactionPedPolice(part: number): TargetOptions {
        return {
            label: 'Parler',
            icon: 'fas fa-comment',
            canInteract: () => this.storyService.canInteractForPart('halloween2022', 'scenario1', part),
            action: async () => {
                const dialog = await emitRpc<Dialog | null>(RpcEvent.STORY_HALLOWEEN_SCENARIO1, `part${part}`);
                if (dialog) {
                    await this.storyService.launchDialog(dialog, true, -1109.27, -845.9, 19.32, 307.13);
                }
            },
        };
    }

    private async spawnProps() {
        for (const prop of Halloween2022Scenario1.props) {
            await this.entityFactory.createEntityWithRotation(GetHashKey(prop.model), ...prop.coords, ...prop.rotation);
        }
    }

    private async createActionZones() {
        Halloween2022Scenario1.zones.forEach(zone => {
            this.targetFactory.createForBoxZone(zone.name, zone, [
                {
                    label: zone.label,
                    icon: zone.icon,
                    canInteract: () => this.storyService.canInteractForPart('halloween2022', 'scenario1', zone.part),
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

                        if (completed) {
                            const dialog = await emitRpc<Dialog | null>(RpcEvent.STORY_HALLOWEEN_SCENARIO1, zone.name);
                            if (dialog) {
                                await this.storyService.launchDialog(dialog);
                            }
                        }

                        this.animationService.stop();

                        await animationPromise;
                    },
                },
            ]);
        });
    }
}
