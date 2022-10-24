import { Once, OnceStep } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { emitRpc } from '../../../core/rpc';
import { Feature, isFeatureEnabled } from '../../../shared/features';
import { RpcEvent } from '../../../shared/rpc';
import { Halloween2022Scenario1 } from '../../../shared/story/halloween-2022/scenario1';
import { Dialog, ScenarioState } from '../../../shared/story/story';
import { AnimationService } from '../../animation/animation.service';
import { EntityFactory } from '../../factory/entity.factory';
import { PedFactory } from '../../factory/ped.factory';
import { PlayerService } from '../../player/player.service';
import { ProgressService } from '../../progress.service';
import { TargetFactory, TargetOptions, ZoneOptions } from '../../target/target.factory';
import { StoryService } from '../story.service';

@Provider()
export class Halloween2022Scenario1Provider {
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

        // Dead ped
        const deadMen = await this.pedFactory.createPed({
            model: 'a_m_y_beach_03',
            coords: { x: -1716.98, y: -1041.03, z: 1.65, w: 283.16 },
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

        const bloodSplat = GetHashKey('p_bloodsplat_s');
        await this.entityFactory.createEntityWithRotation(bloodSplat, -1719.62488, -1034.48584, 2.23335576, -90, 0, 0);
        await this.entityFactory.createEntityWithRotation(bloodSplat, -1717.69128, -1035.88, 2.062668, -90, 0, 0);
        await this.entityFactory.createEntityWithRotation(bloodSplat, -1714.09424, -1038.44836, 1.95063758, -90, 0, 0);
        await this.entityFactory.createEntityWithRotation(bloodSplat, -1719.10022, -1016.77509, 4.26320028, -90, 0, 0);
        await this.entityFactory.createEntityWithRotation(bloodSplat, -1721.7, -1029.92712, 2.78294444, -90, 0, 0);
        await this.entityFactory.createEntityWithRotation(bloodSplat, -1721.63391, -1019.234, 3.66569352, -90, 0, 0);
        await this.entityFactory.createEntityWithRotation(bloodSplat, -1715.86377, -1011.25995, 4.540203, -90, 0, 0);
        await this.entityFactory.createEntityWithRotation(bloodSplat, -1710.52051, -1005.37756, 5.11429453, -90, 0, 0);
        await this.entityFactory.createEntityWithRotation(bloodSplat, -1694.07471, -1003.33044, 6.02541971, -90, 0, 0);
        await this.entityFactory.createEntityWithRotation(bloodSplat, -1679.32959, -1003.33044, 6.40163374, -90, 0, 0);
        await this.entityFactory.createEntityWithRotation(bloodSplat, -1674.80273, -997.8394, 6.4378376, -90, 0, 0);
        await this.entityFactory.createEntityWithRotation(bloodSplat, -1669.81653, -1000.61646, 7.586046, -90, 0, 0);
        await this.entityFactory.createEntityWithRotation(bloodSplat, -1676.42847, -1009.72607, 6.378428, -90, 0, 0);
        await this.entityFactory.createEntityWithRotation(bloodSplat, -1674.731, -1004.18481, 6.37831354, -90, 0, 0);
        await this.entityFactory.createEntityWithRotation(bloodSplat, -1680.83826, -1006.7431, 6.409776, -90, 0, 0);
        await this.entityFactory.createEntityWithRotation(bloodSplat, -1683.85754, -1004.70605, 6.41418552, -90, 0, 0);
        await this.entityFactory.createEntityWithRotation(bloodSplat, -1681.60046, -997.1614, 6.411218, -90, 0, 0);
        await this.entityFactory.createEntityWithRotation(bloodSplat, -1681.60046, -996.0692, 6.39597273, -90, 0, 0);
        await this.entityFactory.createEntityWithRotation(bloodSplat, -1677.32019, -991.263367, 6.4082365, -90, 0, 0);
        await this.entityFactory.createEntityWithRotation(bloodSplat, -1670.02234, -997.4489, 6.411445, -90, 0, 0);

        await this.pedFactory.createPed({
            model: 'a_f_y_beach_01',
            coords: { x: -1716.52, y: -1040.02, z: 1.62, w: 180.66 },
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
                center: [-1716.52, -1040.02, 1.62],
                length: 1.5,
                width: 1.5,
                heading: 180,
                minZ: 0,
                maxZ: 3,
            },
            [
                {
                    label: 'Parler',
                    icon: 'fas fa-comment',
                    canInteract: () => {
                        console.log(this.playerService.getPlayer().metadata.halloween2022);
                        return (
                            this.playerService.getPlayer().metadata.halloween2022?.scenario1?.['part1'] <
                                ScenarioState.Running ||
                            this.playerService.getPlayer().metadata.halloween2022?.scenario1 === undefined
                        );
                    },
                    action: async () => {
                        const dialog = await emitRpc<Dialog | null>(RpcEvent.STORY_HALLOWEEN_SCENARIO1, 'diag1');
                        if (dialog) {
                            await this.storyService.launchDialog(dialog, true, -1716.69, -1041.68, 2.68, 356.2);
                        }
                    },
                },
                {
                    label: 'Parler',
                    icon: 'fas fa-comment',
                    canInteract: () => {
                        return (
                            this.playerService.getPlayer().metadata.halloween2022?.scenario1?.['part2'] ===
                            ScenarioState.Running
                        );
                    },
                    action: async () => {
                        const dialog = await emitRpc<Dialog | null>(RpcEvent.STORY_HALLOWEEN_SCENARIO1, 'part2');
                        if (dialog) {
                            await this.storyService.launchDialog(dialog, true, -1716.69, -1041.68, 2.68, 356.2);
                        }
                    },
                },
            ]
        );

        // gang
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

        const gangPedInteraction = (part: string): TargetOptions => {
            return {
                label: 'Parler',
                icon: 'fas fa-comment',
                canInteract: () => {
                    return (
                        this.playerService.getPlayer().metadata.halloween2022?.scenario1?.[part] ===
                        ScenarioState.Running
                    );
                },
                action: async () => {
                    const dialog = await emitRpc<Dialog | null>(RpcEvent.STORY_HALLOWEEN_SCENARIO1, part);
                    if (dialog) {
                        await this.storyService.launchDialog(dialog, true, -1022.92, -1018.88, 2.15, 210.29);
                    }
                },
            };
        };
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
            [gangPedInteraction('part3'), gangPedInteraction('part4')]
        );

        // police
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

        const policePedInteraction = (part: string): TargetOptions => {
            return {
                label: 'Parler',
                icon: 'fas fa-comment',
                canInteract: () => {
                    return (
                        this.playerService.getPlayer().metadata.halloween2022?.scenario1?.[part] ===
                        ScenarioState.Running
                    );
                },
                action: async () => {
                    const dialog = await emitRpc<Dialog | null>(RpcEvent.STORY_HALLOWEEN_SCENARIO1, part);
                    if (dialog) {
                        await this.storyService.launchDialog(dialog, true, -1109.27, -845.9, 19.32, 307.13);
                    }
                },
            };
        };
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
            [policePedInteraction('part5'), policePedInteraction('part6'), policePedInteraction('part7')]
        );

        Halloween2022Scenario1.zones.forEach(zone => {
            this.targetFactory.createForBoxZone(zone.name, zone, [
                {
                    label: zone.label,
                    icon: zone.icon,
                    canInteract: () => {
                        return (
                            this.playerService.getPlayer().metadata.halloween2022?.scenario1?.[zone.part] ===
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
