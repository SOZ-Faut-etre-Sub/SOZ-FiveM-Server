import { PlayerData } from '@public/shared/player';

import { Once, OnceStep } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { emitRpc } from '../../../core/rpc';
import { Feature, isFeatureEnabled } from '../../../shared/features';
import { RpcServerEvent } from '../../../shared/rpc';
import { Halloween2022Scenario1 } from '../../../shared/story/halloween-2022/scenario1';
import { Dialog } from '../../../shared/story/story';
import { AnimationService } from '../../animation/animation.service';
import { BlipFactory } from '../../blip';
import { EntityFactory } from '../../factory/entity.factory';
import { PedFactory } from '../../factory/ped.factory';
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

        await this.createDeadPed();
        await this.createMainPed();
        await this.createDeadPed();
        await this.createGangPed();
        await this.createPolicePed();

        await this.createActionZones();
        await this.spawnProps();
    }

    public createBlip(player: PlayerData) {
        if (!isFeatureEnabled(Feature.HalloweenScenario1)) {
            return;
        }

        const startedOrFinish = !!player?.metadata?.halloween2022?.scenario1;
        if (!startedOrFinish && !this.storyService.canInteractForPart('halloween2022', 'scenario1', 0)) {
            return;
        }

        const blipId = 'halloween2022_scenario1';
        if (this.blipFactory.exist(blipId)) {
            return;
        }

        this.blipFactory.create(blipId, {
            name: 'Horror Story I : Le mystérieux meurtre. (P1)',
            coords: { x: -1647.19, y: -1064.16, z: 2.61 },
            sprite: 484,
            scale: 0.99,
            color: 44,
        });
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
        await this.pedFactory.createPedOnGrid({
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
                    canInteract: () => this.storyService.canInteractForPart('halloween2022', 'scenario1', 0),
                    action: async () => {
                        const dialog = await emitRpc<Dialog | null>(RpcServerEvent.STORY_HALLOWEEN_SCENARIO1, 'diag1');
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
                        const dialog = await emitRpc<Dialog | null>(RpcServerEvent.STORY_HALLOWEEN_SCENARIO1, 'part2');
                        if (dialog) {
                            await this.storyService.launchDialog(dialog, true, -1646.24, -1063.64, 3.67, 143.07);
                        }
                    },
                },
                this.storyService.replayTarget(Halloween2022Scenario1, 'scenario1', 1),
                this.storyService.replayTarget(Halloween2022Scenario1, 'scenario1', 2),
            ]
        );
    }

    // Gang
    private async createGangPed(): Promise<void> {
        await this.pedFactory.createPedOnGrid({
            model: 'mp_m_freemode_01',
            modelCustomization: {
                ShapeMix: 0.8,
                SkinMix: 0.4,
                Hash: 1885233650,
                Father: 44,
                Mother: 21,
            },
            coords: { x: -1021.85, y: -1020.17, z: 1.15, w: 32.55 },
            invincible: true,
            freeze: true,
            blockevents: true,
            flag: 1,
            makeup: {
                LipstickColor: 0,
                FullMakeupDefaultColor: 1,
                FullMakeupOpacity: 1.0,
                FullMakeupType: -1,
                LipstickOpacity: 1.0,
                LipstickType: -1,
                BlushColor: 0,
                FullMakeupPrimaryColor: 0,
                BlushOpacity: 1.0,
                FullMakeupSecondaryColor: 0,
                BlushType: -1,
            },
            components: {
                9: [0, 0, 0],
                7: [0, 0, 0],
                8: [15, 0, 0],
                6: [99, 3, 0],
                3: [15, 0, 0],
                4: [4, 4, 0],
                11: [205, 4, 0],
            },
            props: {
                0: [7, 2, 0],
                1: [7, 0, 0],
            },
            face: {
                NosePeakLower: 0.0,
                EyebrowHigh: 0.0,
                LipsThickness: 0.3,
                AddBodyBlemish: -1,
                JawBoneBackLength: 0.0,
                CheeksBoneWidth: 0.0,
                EyeColor: -1,
                Ageing: 11,
                Moles: -1,
                Blemish: -1,
                NeckThickness: 0.0,
                EyesOpening: 0.9,
                ChimpHole: 0.0,
                CheeksBoneHigh: 0.3,
                NoseBoneTwist: 0.0,
                Complexion: -1,
                NosePeakHeight: 0.0,
                NoseWidth: 0.0,
                BodyBlemish: -1,
                NosePeakLength: 0.4,
                ChimpBoneLength: 0.0,
                JawBoneWidth: 0.0,
                ChimpBoneWidth: 0.0,
                NoseBoneHigh: -0.2,
                CheeksWidth: 0.0,
                EyebrowForward: -0.3,
                ChimpBoneLower: 0.0,
            },
            tattoos: [
                {
                    overlay: -969415240,
                    collection: -1016521996,
                },
                {
                    overlay: -1912858770,
                    collection: 598190139,
                },
                {
                    overlay: -394853815,
                    collection: -240234547,
                },
                {
                    overlay: 2088037441,
                    collection: 1529191571,
                },
                {
                    overlay: 1942093304,
                    collection: -1016521996,
                },
                {
                    overlay: -1365916084,
                    collection: 1616273011,
                },
                {
                    overlay: -221624488,
                    collection: -1719270477,
                },
            ],
            hair: {
                EyebrowOpacity: 1.0,
                BeardColor: 17,
                BeardType: 26,
                ChestHairOpacity: 1.0,
                HairSecondaryColor: 2,
                HairColor: 4,
                BeardOpacity: 1.0,
                ChestHairType: -1,
                EyebrowType: 5,
                HairType: 9,
                ChestHairColor: 0,
                EyebrowColor: 27,
            },
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
                this.storyService.replayTarget(Halloween2022Scenario1, 'scenario1', 3),
                this.storyService.replayTarget(Halloween2022Scenario1, 'scenario1', 4),
            ]
        );
    }

    private interactionPedGang(part: number): TargetOptions {
        return {
            label: 'Parler',
            icon: 'fas fa-comment',
            canInteract: () => this.storyService.canInteractForPart('halloween2022', 'scenario1', part),
            action: async () => {
                const dialog = await emitRpc<Dialog | null>(RpcServerEvent.STORY_HALLOWEEN_SCENARIO1, `part${part}`);
                if (dialog) {
                    await this.storyService.launchDialog(dialog, true, -1022.92, -1018.88, 2.15, 210.29);
                }
            },
        };
    }

    // Police
    private async createPolicePed(): Promise<void> {
        await this.pedFactory.createPedOnGrid({
            model: 's_m_y_cop_01',
            coords: { x: -1108.03, y: -844.75, z: 18.32, w: 129.27 },
            invincible: true,
            freeze: true,
            blockevents: true,
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
                this.storyService.replayTarget(Halloween2022Scenario1, 'scenario1', 5),
                this.storyService.replayTarget(Halloween2022Scenario1, 'scenario1', 6),
                this.storyService.replayTarget(Halloween2022Scenario1, 'scenario1', 7),
            ]
        );
    }

    private interactionPedPolice(part: number): TargetOptions {
        return {
            label: 'Parler',
            icon: 'fas fa-comment',
            canInteract: () => this.storyService.canInteractForPart('halloween2022', 'scenario1', part),
            action: async () => {
                const dialog = await emitRpc<Dialog | null>(RpcServerEvent.STORY_HALLOWEEN_SCENARIO1, `part${part}`);
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
                            const dialog = await emitRpc<Dialog | null>(
                                RpcServerEvent.STORY_HALLOWEEN_SCENARIO1,
                                zone.name
                            );
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
