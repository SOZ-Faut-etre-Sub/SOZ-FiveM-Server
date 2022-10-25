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
import { TargetFactory, TargetOptions } from '../../target/target.factory';
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

        const bloodSplat = GetHashKey('p_bloodsplat_s');
        await this.entityFactory.createEntityWithRotation(bloodSplat, -1646.25757, -1064.36438, 2.6638186, -90, 0, 0);
        await this.entityFactory.createEntityWithRotation(bloodSplat, -1647.35852, -1063.73352, 2.64695525, -90, 0, 0);
        await this.entityFactory.createEntityWithRotation(bloodSplat, -1645.56287, -1065.12939, 2.6638186, -90, 0, 0);
        await this.entityFactory.createEntityWithRotation(bloodSplat, -1648.121, -1062.38074, 2.66395855, -90, 0, 0);
        await this.entityFactory.createEntityWithRotation(bloodSplat, -1647.05994, -1062.966, 2.67473316, -90, 0, 0);
        await this.entityFactory.createEntityWithRotation(bloodSplat, -1648.14258, -1060.35327, 2.73919225, -90, 0, 0);
        await this.entityFactory.createEntityWithRotation(bloodSplat, -1651.67261, -1052.12891, 3.274258, -90, 0, 0);
        await this.entityFactory.createEntityWithRotation(bloodSplat, -1657.9292, -1044.782, 3.634825, -90, 0, 0);
        await this.entityFactory.createEntityWithRotation(bloodSplat, -1659.82935, -1035.595, 4.06299, -90, 0, 0);
        await this.entityFactory.createEntityWithRotation(bloodSplat, -1664.64844, -1024.19043, 4.814108, -90, 0, 0);
        await this.entityFactory.createEntityWithRotation(bloodSplat, -1664.58313, -1015.53925, 5.845688, -90, 0, 0);
        await this.entityFactory.createEntityWithRotation(bloodSplat, -1669.036, -1014.68164, 6.389642, -90, 0, 0);
        await this.entityFactory.createEntityWithRotation(bloodSplat, -1674.94, -1010.77234, 6.38943672, -90, 0, 0);
        await this.entityFactory.createEntityWithRotation(bloodSplat, -1681.92737, -1005.78162, 6.38943958, -90, 0, 0);
        await this.entityFactory.createEntityWithRotation(bloodSplat, -1688.15674, -1002.40308, 6.38970375, -90, 0, 0);
        await this.entityFactory.createEntityWithRotation(bloodSplat, -1695.74109, -1004.34619, 5.947353, -90, 0, 0);
        await this.entityFactory.createEntityWithRotation(bloodSplat, -1703.8894, -1005.40729, 5.49293756, -90, 0, 0);
        await this.entityFactory.createEntityWithRotation(bloodSplat, -1706.9325, -997.9151, 5.27463055, -90, 0, 0);
        await this.entityFactory.createEntityWithRotation(bloodSplat, -1712.2428, -1007.50745, 4.825735, -90, 0, 0);
        await this.entityFactory.createEntityWithRotation(bloodSplat, -1719.37512, -1015.68396, 4.282266, -90, 0, 0);
        await this.entityFactory.createEntityWithRotation(bloodSplat, -1721.3269, -1012.11725, 4.25680876, -90, 0, 0);
        await this.entityFactory.createEntityWithRotation(bloodSplat, -1675.69714, -1006.41467, 6.389439, -90, 0, 0);
        await this.entityFactory.createEntityWithRotation(bloodSplat, -1670.80945, -1002.8764, 6.389439, -90, 0, 0);
        await this.entityFactory.createEntityWithRotation(bloodSplat, -1666.76184, -1002.06677, 6.42044, -90, 0, 0);
        await this.entityFactory.createEntityWithRotation(bloodSplat, -1670.2074, -997.432, 6.42044, -90, 0, 0);
        await this.entityFactory.createEntityWithRotation(bloodSplat, -1673.96985, -993.7691, 6.420377, -90, 0, 0);
        await this.entityFactory.createEntityWithRotation(bloodSplat, -1675.687, -989.1524, 6.42038059, -90, 0, 0);
        await this.entityFactory.createEntityWithRotation(bloodSplat, -1673.25647, -983.6904, 6.42038059, -90, 0, 0);
        await this.entityFactory.createEntityWithRotation(bloodSplat, -1668.5083, -979.465454, 6.378703, -90, 0, 0);
        await this.entityFactory.createEntityWithRotation(bloodSplat, -1671.886, -1005.33789, 6.389439, -90, 0, 0);
        await this.entityFactory.createEntityWithRotation(bloodSplat, -1670.94226, -1007.039, 7.41958427, -90, 0, 0);

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
                    canInteract: () => {
                        return (
                            this.playerService.getPlayer().metadata.halloween2022?.scenario1?.['part1'] <
                                ScenarioState.Running ||
                            this.playerService.getPlayer().metadata.halloween2022?.scenario1 === undefined
                        );
                    },
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
                    canInteract: () => {
                        return (
                            this.playerService.getPlayer().metadata.halloween2022?.scenario1?.['part2'] ===
                            ScenarioState.Running
                        );
                    },
                    action: async () => {
                        const dialog = await emitRpc<Dialog | null>(RpcEvent.STORY_HALLOWEEN_SCENARIO1, 'part2');
                        if (dialog) {
                            await this.storyService.launchDialog(dialog, true, -1646.24, -1063.64, 3.67, 143.07);
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
                    console.log(this.playerService.getPlayer().metadata.halloween2022);
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
