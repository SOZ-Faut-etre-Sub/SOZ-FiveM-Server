import { BlipFactory } from '@public/client/blip';
import { PedFactory } from '@public/client/factory/ped.factory';
import { Notifier } from '@public/client/notifier';
import { AudioService } from '@public/client/nui/audio.service';
import { ObjectProvider } from '@public/client/object/object.provider';
import { PlayerPositionProvider } from '@public/client/player/player.position.provider';
import { ProgressService } from '@public/client/progress.service';
import { TargetFactory } from '@public/client/target/target.factory';
import { Once, OnceStep } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Component, Prop } from '@public/shared/cloth';
import { VanillaComponentDrawableIndexMaxValue, VanillaPropDrawableIndexMaxValue } from '@public/shared/drawable';
import { ServerEvent } from '@public/shared/event';
import { Feature } from '@public/shared/features';
import { PlayerData, PlayerPedHash } from '@public/shared/player';
import { BoxZone } from '@public/shared/polyzone/box.zone';
import { toVector3Object, toVector4Object, Vector4 } from '@public/shared/polyzone/vector';
import {
    Halloween2023Scenario4,
    Halloween2023Scenario4EnterCayo,
    Halloween2023Scenario4EnterFinal,
    Halloween2023Scenario4EnterMorgue,
    Halloween2023Scenario4ExitCayo,
    Halloween2023Scenario4ExitFinal,
    Halloween2023Scenario4ExitMorgue,
} from '@public/shared/story/halloween-2023/scenario4';

import { FeatureProvider } from '../../feature/feature.provider';
import { StoryProvider } from '../story.provider';

@Provider()
export class Halloween2023Scenario4Provider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(PedFactory)
    private pedFactory: PedFactory;

    @Inject(StoryProvider)
    private storyService: StoryProvider;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Inject(PlayerPositionProvider)
    private playerPositionProvider: PlayerPositionProvider;

    @Inject(ObjectProvider)
    private objectProvider: ObjectProvider;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(AudioService)
    private audioService: AudioService;

    @Inject(FeatureProvider)
    private featureProvider: FeatureProvider;

    private audioId: string;

    @Once(OnceStep.PlayerLoaded)
    public async onPlayerLoaded() {
        if (!this.featureProvider.isFeatureEnabled(Feature.Halloween2023Scenario4)) {
            return;
        }

        await this.createEyePeds();
        await this.createMorguePed();

        await this.createActionZones();
        await this.createTPTarget();
        await this.spawnProps();

        await this.createNariielDevil();
        await this.createKneel([-1598.55, -3002.52, -76.81, 332.29]);
        await this.createKneel([-1595.85, -3002.5, -76.81, 33.34]);

        await this.createPedZerator();

        // Caméo de la mort
        await this.createPedNariieL();
        await this.createPedDraglock();
        await this.createPedOjymas();

        await this.createPedPoulpito();
        await this.createPedSniteur();
        await this.createPedOneiluj();
        await this.createPedLasbou();
        await this.createPedMarverikG();
        await this.createPedDaelbhas();

        await this.createPedTone(); //TODO Text
        await this.createPedTriplaxion(); //TODO Text
        await this.createPedXerackk(); //TODO Text
        await this.createPedBerlu(); //TODO Text
        await this.createPedYob(); //TODO Text

        await this.createPedBrouznouf();
        await this.createPedLaikker();
        await this.createPedMoustache();
        await this.createPedSilverlord();
        await this.createPedGuegette();
        await this.createPedAurelien();

        await this.createPedRigonkmalk();
        await this.createPedAurukh();

        await this.createPedDarabesque();
        await this.createPedPoulpitor();
        await this.createPedBalrock();
        await this.createPedTluap();
        await this.createPedDream();
        await this.createPedKaemy();
    }

    public createBlip(player: PlayerData) {
        if (!this.featureProvider.isFeatureEnabled(Feature.Halloween2023Scenario4)) {
            return;
        }

        const startedOrFinish = !!player?.metadata?.halloween2023?.scenario4;
        if (!startedOrFinish && !this.storyService.canInteractForPart('halloween2023', 'scenario4', 0)) {
            return;
        }

        const blipId = 'halloween2023_scenario4';
        if (this.blipFactory.exist(blipId)) {
            return;
        }

        this.blipFactory.create(blipId, {
            name: "Horror Story II : L'oeil du diable. (P4)",
            coords: toVector3Object([-270.1, -1904.03, 26.76]),
            sprite: 484,
            scale: 0.99,
            color: 44,
        });
    }

    private async createEyePeds() {
        this.targetFactory.createForPed({
            model: 'CS_Priest',
            coords: toVector4Object([-270.0, -1904.03, 26.76, 317.42]),
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'missfbi3_party_d',
            anim: 'stand_talk_loop_b_male3',
            flag: 49,
            target: {
                options: [
                    {
                        label: 'Parler',
                        icon: 'global/comment',
                        category: 'citizen',
                        canInteract: () => this.storyService.canInteractForPart('halloween2023', 'scenario4', 0),
                        action: async entity => {
                            TriggerServerEvent(ServerEvent.STORY_HALLOWEEN_2023_SCENARIO_4, 1);
                            await this.storyService.launchDialog(
                                Halloween2023Scenario4.dialog['part1'],
                                true,
                                -269.27,
                                -1903.03,
                                27.76,
                                151.3,
                                entity
                            );
                        },
                    },
                    this.storyService.replayYearTarget(
                        Halloween2023Scenario4,
                        'halloween2023',
                        'scenario4',
                        0,
                        'part1',
                        [-269.27, -1903.03, 27.76, 151.3]
                    ),
                ],
                distance: 1.5,
            },
        });

        const crowd = [
            [-266.55, -1902.54, 27.76, 137.95],
            [-268.0, -1901.39, 27.76, 148.81],
            [-269.84, -1899.9, 27.76, 138.54],
            [-265.34, -1901.2, 27.76, 142.7],
            [-266.82, -1899.72, 27.76, 140.19],
            [-268.33, -1898.67, 27.76, 142.16],
            [-264.22, -1899.53, 27.76, 141.63],
            [-265.8, -1898.33, 27.76, 157.24],
            [-267.13, -1897.26, 27.76, 144.79],
            [-262.91, -1898.21, 27.76, 144.64],
            [-264.74, -1896.98, 27.76, 125.12],
            [-265.96, -1895.64, 27.76, 147.98],
            [-261.98, -1896.95, 27.76, 144.22],
            [-263.48, -1895.88, 27.76, 143.36],
            [-264.97, -1894.46, 27.76, 138.46],
            [-260.71, -1895.41, 27.76, 142.93],
            [-262.26, -1894.33, 27.76, 132.74],
            [-264.06, -1893.25, 27.76, 144.35],
        ];

        const model = [
            'a_f_m_prolhost_01',
            'a_m_m_socenlat_01',
            'a_f_m_skidrow_01',
            'a_f_y_eastsa_03',
            'a_m_m_beach_01',
            'a_m_m_farmer_01',
            'a_f_m_tramp_01',
            'a_m_y_beach_01',
        ];

        let index = 0;
        for (const position of crowd) {
            await this.pedFactory.createPedOnGrid({
                model: model[index++ % model.length],
                coords: { x: position[0], y: position[1], z: position[2] - 1, w: position[3] },
                invincible: true,
                freeze: true,
                blockevents: true,
                animDict: 'random@rescue_hostage',
                anim: 'girl_helping_girl_loop',
                flag: 1,
            });
        }
    }

    private async createMorguePed() {
        this.targetFactory.createForPed({
            model: 'mp_m_freemode_01',
            coords: toVector4Object([291.4, -1346.1, 24.57, 326.32]),
            components: {
                1: [63, 0, 0],
                3: [15, 0, 0],
                4: [25, 0, 0],
                6: [15, 4, 0],
                7: [0, 0, 0],
                8: [15, 0, 0],
                11: [15, 0, 0],
            },
            props: {
                0: [VanillaPropDrawableIndexMaxValue[PlayerPedHash.Male][Prop.Hat] + 9, 0, 0],
            },
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'anim@gangops@morgue@table@',
            anim: 'body_search',
            flag: 1,
            target: {
                options: [
                    {
                        label: 'Inspecter',
                        icon: 'global/search',
                        category: 'citizen',
                        canInteract: () => this.storyService.canInteractForPart('halloween2023', 'scenario4', 1),
                        action: () => {
                            TriggerServerEvent(ServerEvent.STORY_HALLOWEEN_2023_SCENARIO_4, 2);
                            this.notifier.notify(
                                'Le corps n’est pas frais, il a déjà été analysé… Peut-être que des documents à l’étage m’en diront plus…'
                            );
                        },
                    },
                    {
                        label: 'Re-Inspecter',
                        icon: 'global/comment-dots',
                        category: 'citizen',
                        canInteract: () => this.storyService.canInteractForPart('halloween2023', 'scenario4', 2),
                        action: () => {
                            this.notifier.notify(
                                'Le corps n’est pas frais, il a déjà été analysé… Peut-être que des documents à l’étage m’en diront plus…'
                            );
                        },
                    },
                ],
                distance: 1.5,
            },
        });
    }

    private async createTPTarget(): Promise<void> {
        this.targetFactory.createForBoxZone(
            'halloween2023:scenario4:TPMorgue',
            {
                ...new BoxZone([241.46, -1378.5, 33.74], 1.0, 2.0, {
                    heading: 141.07,
                    minZ: 32.74,
                    maxZ: 34.74,
                }),
            },
            [
                {
                    label: 'Entrer',
                    icon: 'housing/enter',
                    category: 'citizen',
                    canInteract: () => this.storyService.canInteractForPart('halloween2023', 'scenario4', 1),
                    action: async () => {
                        this.playerPositionProvider.teleportPlayerToPosition(Halloween2023Scenario4EnterMorgue);
                    },
                },
            ]
        );

        this.targetFactory.createForBoxZone(
            'halloween2023:scenario4:TPMorgueback',
            {
                ...new BoxZone([276.08, -1361.78, 24.54], 0.6, 2.0, {
                    heading: 49.53,
                    minZ: 23.54,
                    maxZ: 25.54,
                }),
            },
            [
                {
                    label: 'Sortir',
                    icon: 'housing/enter',
                    category: 'citizen',
                    canInteract: () => this.storyService.canInteractForPart('halloween2023', 'scenario4', 3),
                    action: async () => {
                        this.playerPositionProvider.teleportPlayerToPosition(Halloween2023Scenario4ExitMorgue);
                    },
                },
            ]
        );

        this.targetFactory.createForBoxZone(
            'halloween2023:scenario4:TPCayo',
            {
                ...new BoxZone([5042.96, -5814.14, -10.94], 1.0, 2.2, {
                    heading: 215.51,
                    minZ: -12.34,
                    maxZ: -9.74,
                }),
            },
            [
                {
                    label: 'Entrer',
                    icon: 'housing/enter',
                    category: 'citizen',
                    canInteract: () => this.storyService.canInteractForPart('halloween2023', 'scenario4', 3),
                    action: async () => {
                        this.playerPositionProvider.teleportPlayerToPosition(Halloween2023Scenario4EnterCayo);
                    },
                },
            ]
        );

        this.targetFactory.createForBoxZone(
            'halloween2023:scenario4:TPCayoBack',
            {
                ...new BoxZone([2492.23, -238.51, -70.74], 0.6, 2.2, {
                    heading: 269.38,
                    minZ: -71.74,
                    maxZ: -69.74,
                }),
            },
            [
                {
                    label: 'Sortir',
                    icon: 'housing/enter',
                    category: 'citizen',
                    canInteract: () => this.storyService.canInteractForPart('halloween2023', 'scenario4', 4),
                    action: async () => {
                        this.playerPositionProvider.teleportPlayerToPosition(Halloween2023Scenario4ExitCayo);
                    },
                },
            ]
        );

        this.targetFactory.createForBoxZone(
            'halloween2023:scenario4:ExitFinal',
            {
                ...new BoxZone([-1569.47, -3018.16, -74.41], 1.0, 1.0, {
                    heading: 358.75,
                    minZ: -75.41,
                    maxZ: -73.41,
                }),
            },
            [
                {
                    label: 'Sortir',
                    icon: 'housing/enter',
                    category: 'citizen',
                    canInteract: () => this.storyService.canInteractForPart('halloween2023', 'scenario4', 6),
                    action: async () => {
                        this.playerPositionProvider.teleportPlayerToPosition(Halloween2023Scenario4ExitFinal);
                        TriggerServerEvent(ServerEvent.STORY_HALLOWEEN_2023_SCENARIO_4, 7);
                        this.audioService.stopAudio(this.audioId);
                    },
                },
            ]
        );
    }

    private async spawnProps() {
        await this.objectProvider.createObject({
            id: 'halloween2023_scenario4_skull',
            model: GetHashKey('xs_prop_arena_trophy_single_01b'),
            position: [2521.215576171875, -238.52008056640625, -70.83728790283203, 271.0108947753906],
            noCollision: true,
            matrix: {
                '0': 0.07817913591861725,
                '1': -4.431218147277832,
                '2': 0,
                '3': 0,
                '4': 4.431405544281006,
                '5': 0.07819020748138428,
                '6': 0,
                '7': 0,
                '8': 0,
                '9': 0,
                '10': 4.432156562805176,
                '11': 0,
                '12': 2521.215576171875,
                '13': -238.52008056640625,
                '14': -70.83728790283203,
                '15': 1,
            } as any,
        });
    }

    private async createActionZones() {
        Halloween2023Scenario4.zones.forEach(zone => {
            this.targetFactory.createForBoxZone(zone.name, zone, [
                {
                    label: zone.label,
                    icon: zone.icon,
                    category: 'citizen',
                    canInteract: () => this.storyService.canInteractForPart('halloween2023', 'scenario4', zone.part),
                    action: async () => {
                        const { completed } = await this.progressService.progress(
                            'Recherche',
                            'Vous recherchez...',
                            5000,
                            {
                                dictionary: 'missfbi4prepp1',
                                name: '_bag_pickup_garbage_man',
                                options: {
                                    enablePlayerControl: false,
                                    repeat: true,
                                },
                            },
                            {}
                        );

                        if (completed) {
                            TriggerServerEvent(ServerEvent.STORY_HALLOWEEN_2023_SCENARIO_4, zone.part + 1);
                        }
                    },
                },
            ]);
        });

        this.targetFactory.createForBoxZone(
            'halloween2023_scenario4_skull',
            {
                ...new BoxZone([2521.03, -238.52, -70.14], 1.4, 1.4, {
                    heading: 48.17,
                    minZ: -71.14,
                    maxZ: -69.14,
                }),
            },
            [
                {
                    label: 'Toucher',
                    icon: 'global/search',
                    category: 'citizen',
                    canInteract: () =>
                        this.storyService.canInteractForPart('halloween2023', 'scenario4', 3) ||
                        this.storyService.canInteractForPart('halloween2023', 'scenario4', 4),
                    action: async () => {
                        this.notifier.notify(
                            "En touchant la statuette, une révélation vous apparaît. Afin de rejoindre les enfers, il suffirait de vendre son âme à un diable ou une diablesse, devenant ainsi son chien pour l'éternité."
                        );
                        TriggerServerEvent(ServerEvent.STORY_HALLOWEEN_2023_SCENARIO_4, 4);
                    },
                },
            ]
        );
    }

    private async createPedZerator() {
        await this.pedFactory.createPedOnGrid({
            model: 'mp_m_freemode_01',
            coords: toVector4Object([-1602.96, -3012.42, -78.8, 267.56]),
            components: {
                2: [4, 0, 0],
                3: [0, 0, 0],
                4: [10, 0, 0],
                5: [VanillaComponentDrawableIndexMaxValue[PlayerPedHash.Male][Component.Bag] + 3, 0, 0],
                6: [32, 0, 0],
                8: [15, 0, 0],
                10: [VanillaComponentDrawableIndexMaxValue[PlayerPedHash.Male][Component.Decals] + 14, 0, 0],
                11: [44, 1, 0],
            },
            props: {
                0: [VanillaPropDrawableIndexMaxValue[PlayerPedHash.Male][Prop.Hat] + 9, 0, 0],
                1: [23, 0, 0],
            },
            skin: {
                Model: {
                    ShapeMix: 0.5,
                    Mother: 23,
                    SkinMix: 0.5,
                    Father: 44,
                    Hash: 1885233650,
                },
                FaceTrait: {
                    ChimpBoneLower: 0,
                    Ageing: -1,
                    NeckThickness: 0,
                    Moles: -1,
                    NosePeakHeight: 0,
                    NosePeakLength: 0,
                    CheeksWidth: 0.8,
                    LipsThickness: 0,
                    AddBodyBlemish: -1,
                    CheeksBoneHigh: 0,
                    ChimpBoneWidth: 0.1,
                    JawBoneBackLength: 0,
                    NoseBoneTwist: 0,
                    EyesOpening: 0,
                    NoseWidth: 0,
                    JawBoneWidth: 0,
                    ChimpHole: 0,
                    EyeColor: 1,
                    Complexion: -1,
                    EyebrowForward: 0,
                    NoseBoneHigh: 0,
                    CheeksBoneWidth: -0.7,
                    BodyBlemish: -1,
                    ChimpBoneLength: 0,
                    NosePeakLower: 0,
                    Blemish: -1,
                    EyebrowHigh: 0,
                },
                Hair: {
                    HairType: 4,
                    HairColor: 58,
                    HairSecondaryColor: 4,
                    BeardOpacity: 0.85,
                    ChestHairOpacity: 1,
                    EyebrowOpacity: 1,
                    ChestHairColor: 0,
                    EyebrowColor: 0,
                    BeardColor: 5,
                    EyebrowType: 0,
                    BeardType: 0,
                    ChestHairType: -1,
                },
                Makeup: {
                    FullMakeupOpacity: 1,
                    BlushOpacity: 1,
                    BlushColor: 0,
                    FullMakeupSecondaryColor: 0,
                    LipstickOpacity: 1,
                    LipstickType: -1,
                    FullMakeupPrimaryColor: 0,
                    BlushType: -1,
                    LipstickColor: 0,
                    FullMakeupType: -1,
                    FullMakeupDefaultColor: true,
                },
                Tattoos: [],
            },
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'anim@amb@nightclub@djs@tale_of_us@',
            anim: 'new_tou_sync_a_cc',
            flag: 1,
        });

        this.targetFactory.createForBoxZone(
            'halloween2023_scenario4_Zerator',
            {
                ...new BoxZone([-1603.39, -3012.49, -77.8], 1.6, 1.6, {
                    heading: 91.68,
                    minZ: -78.8,
                    maxZ: -76.8,
                }),
            },
            [
                {
                    label: 'Parler',
                    icon: 'global/comment',
                    category: 'citizen',
                    canInteract: () => {
                        return this.storyService.canInteractForPart('halloween2023', 'scenario4', 5);
                    },
                    action: () => {
                        TriggerServerEvent(ServerEvent.STORY_HALLOWEEN_2023_SCENARIO_4, 6);
                        this.notifier.notify(
                            "Félicitation pour tes enquêtes ! On te doit une fière chandelle ! Allez prend place  ce soir en enfer c'est 900K !"
                        );
                    },
                },
            ]
        );
    }

    private async createNariielDevil() {
        await this.targetFactory.createForPed({
            model: 'mp_f_freemode_01',
            coords: toVector4Object([-1597.73, -2999.13, -77.41, 179.54]),
            components: {
                3: [16, 1, 0],
                4: [63, 2, 0],
                5: [0, 0, 0],
                6: [41, 2, 0],
                7: [0, 0, 0],
                8: [2, 0, 0],
                10: [0, 0, 0],
                11: [415, 8, 0],
            },
            props: {
                0: [VanillaPropDrawableIndexMaxValue[PlayerPedHash.Female][Prop.Hat] + 9, 0, 0],
                2: [7, 0, 0],
                6: [1, 0, 0],
            },
            skin: {
                Model: {
                    SkinMix: 0.4,
                    Hash: -1667301416,
                    ShapeMix: 0.9,
                    Mother: 21,
                    Father: 6,
                },
                FaceTrait: {
                    CheeksBoneWidth: 0,
                    JawBoneWidth: 0,
                    JawBoneBackLength: 0,
                    EyebrowForward: 0,
                    BodyBlemish: -1,
                    ChimpBoneWidth: 0,
                    NoseWidth: 0,
                    NosePeakLength: 0,
                    NoseBoneHigh: 0,
                    ChimpBoneLower: 0,
                    Complexion: -1,
                    NeckThickness: 0,
                    CheeksWidth: 0,
                    NosePeakHeight: 0,
                    NosePeakLower: 0,
                    NoseBoneTwist: 0,
                    CheeksBoneHigh: 0,
                    Ageing: -1,
                    AddBodyBlemish: -1,
                    EyesOpening: 0,
                    ChimpHole: 0,
                    ChimpBoneLength: 0,
                    Moles: -1,
                    LipsThickness: -0.3,
                    EyebrowHigh: 0,
                    EyeColor: 17,
                    Blemish: -1,
                },
                Hair: {
                    BeardOpacity: 1,
                    EyebrowOpacity: 1,
                    BeardType: -1,
                    ChestHairType: -1,
                    BeardColor: 0,
                    EyebrowColor: 8,
                    HairColor: 61,
                    ChestHairColor: 0,
                    HairType: VanillaComponentDrawableIndexMaxValue[PlayerPedHash.Female][Component.Hair] + 20,
                    EyebrowType: 1,
                    ChestHairOpacity: 1,
                    HairSecondaryColor: 54,
                },
                Makeup: {
                    LipstickOpacity: 0.7,
                    BlushOpacity: 0.4,
                    FullMakeupType: 1,
                    FullMakeupDefaultColor: true,
                    FullMakeupOpacity: 1,
                    FullMakeupPrimaryColor: 0,
                    BlushType: 0,
                    BlushColor: 6,
                    LipstickType: 0,
                    FullMakeupSecondaryColor: 0,
                    LipstickColor: 2,
                },
                Tattoos: [],
            },
            invincible: true,
            freeze: true,
            blockevents: true,
            scenario: 'PROP_HUMAN_SEAT_DECKCHAIR',
            target: {
                options: [
                    {
                        label: 'Parler',
                        icon: 'global/comment',
                        category: 'citizen',
                        action: () => {
                            this.notifier.notify('Ooh, notre nouveau chien ! Bonsoir');
                        },
                    },
                ],
                distance: 1.5,
            },
        });
    }

    private async createKneel(coords: Vector4) {
        await this.targetFactory.createForPed({
            model: 'mp_m_freemode_01',
            coords: toVector4Object(coords),
            components: {
                1: [63, 0, 0],
                3: [24, 0, 0],
                4: [25, 0, 0],
                6: [15, 4, 0],
                7: [26, 5, 0],
                8: [33, 0, 0],
                11: [29, 0, 0],
            },
            props: {
                0: [VanillaPropDrawableIndexMaxValue[PlayerPedHash.Male][Prop.Hat] + 9, 0, 0],
            },
            skin: {
                Model: {
                    Father: 0,
                    Hash: 1885233650,
                    ShapeMix: 0.75,
                    Mother: 31,
                    SkinMix: 0.7,
                },
                FaceTrait: {
                    NosePeakLength: 0.0,
                    ChimpBoneWidth: 0.0,
                    EyebrowHigh: 0.0,
                    EyebrowForward: 0.0,
                    Complexion: -1,
                    ChimpHole: 0.0,
                    Blemish: -1,
                    EyeColor: -1,
                    JawBoneWidth: -0.5,
                    NoseBoneTwist: 0.0,
                    ChimpBoneLength: 0.0,
                    ChimpBoneLower: 0.0,
                    AddBodyBlemish: -1,
                    BodyBlemish: 0,
                    NoseWidth: 0.0,
                    Ageing: -1,
                    LipsThickness: 0.2,
                    NosePeakHeight: 0.0,
                    CheeksBoneHigh: 0.0,
                    CheeksBoneWidth: 0.0,
                    EyesOpening: 0.0,
                    NeckThickness: 0.3,
                    CheeksWidth: -0.5,
                    JawBoneBackLength: 0.7,
                    Moles: 6,
                    NoseBoneHigh: 0.0,
                    NosePeakLower: 0.0,
                },
                Hair: {
                    HairSecondaryColor: 6,
                    BeardColor: 3,
                    HairColor: 3,
                    EyebrowOpacity: 0.65,
                    HairType: 79,
                    BeardOpacity: 1.0,
                    BeardType: 9,
                    EyebrowType: 1,
                    ChestHairColor: 2,
                    EyebrowColor: 2,
                    ChestHairType: 1,
                    ChestHairOpacity: 0.8,
                },
                Makeup: {
                    LipstickOpacity: 1.0,
                    LipstickType: -1,
                    BlushColor: 0,
                    FullMakeupDefaultColor: true,
                    FullMakeupOpacity: 1.0,
                    FullMakeupType: -1,
                    FullMakeupSecondaryColor: 0,
                    FullMakeupPrimaryColor: 0,
                    BlushType: -1,
                    BlushOpacity: 1.0,
                    LipstickColor: 0,
                },
                Tattoos: [],
            },
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'random@rescue_hostage',
            anim: 'girl_helping_girl_loop',
            flag: 1,
            target: {
                options: [
                    {
                        label: 'Parler',
                        icon: 'global/comment',
                        category: 'citizen',
                        action: () => {
                            this.notifier.notify('Wouah wouaf !!');
                        },
                    },
                ],
                distance: 1.5,
            },
        });
    }

    private async createPedNariieL() {
        await this.targetFactory.createForPed({
            model: 'mp_f_freemode_01',
            coords: toVector4Object([-1598.42, -3015.66, -79.21, 316.76]),
            components: {
                3: [16, 1, 0],
                4: [63, 2, 0],
                6: [41, 2, 0],
                7: [6, 0, 0],
                8: [2, 0, 0],
                11: [415, 8, 0],
            },
            props: {
                0: [VanillaPropDrawableIndexMaxValue[PlayerPedHash.Female][Prop.Hat] + 9, 0, 0],
                2: [7, 0, 0],
            },
            skin: {
                Model: {
                    SkinMix: 0.4,
                    ShapeMix: 0.9,
                    Mother: 21,
                    Father: 6,
                    Hash: -1667301416,
                },
                FaceTrait: {
                    CheeksBoneHigh: 0,
                    NosePeakLower: 0,
                    NoseBoneTwist: 0,
                    EyeColor: 2,
                    NosePeakLength: 0,
                    JawBoneBackLength: 0,
                    NoseWidth: 0,
                    AddBodyBlemish: -1,
                    CheeksBoneWidth: 0,
                    Moles: -1,
                    EyesOpening: 0,
                    Blemish: -1,
                    ChimpBoneWidth: 0,
                    NosePeakHeight: 0,
                    BodyBlemish: -1,
                    Complexion: -1,
                    ChimpHole: 0,
                    ChimpBoneLower: 0,
                    EyebrowForward: 0,
                    EyebrowHigh: 0,
                    NoseBoneHigh: 0,
                    JawBoneWidth: 0,
                    CheeksWidth: 0,
                    LipsThickness: -0.3,
                    NeckThickness: 0,
                    Ageing: -1,
                    ChimpBoneLength: 0,
                },
                Hair: {
                    BeardOpacity: 1,
                    EyebrowOpacity: 1,
                    BeardType: -1,
                    ChestHairType: -1,
                    BeardColor: 0,
                    EyebrowColor: 8,
                    HairColor: 61,
                    ChestHairColor: 0,
                    HairType: 105,
                    EyebrowType: 1,
                    ChestHairOpacity: 1,
                    HairSecondaryColor: 54,
                },
                Makeup: {
                    FullMakeupOpacity: 1,
                    LipstickType: 0,
                    LipstickColor: 2,
                    FullMakeupSecondaryColor: 0,
                    BlushOpacity: 0.4,
                    FullMakeupPrimaryColor: 0,
                    BlushColor: 6,
                    FullMakeupDefaultColor: true,
                    LipstickOpacity: 0.7,
                    FullMakeupType: 1,
                    BlushType: 0,
                },
                Tattoos: [],
            },
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'mini@strip_club@lap_dance@ld_girl_a_song_a_p1',
            anim: 'ld_girl_a_song_a_p1_f',
            flag: 1,

            target: {
                options: [
                    {
                        label: 'NariieL',
                        icon: 'global/question',
                        category: 'citizen',
                        action: async () => {
                            this.notifier.notify('La douceur des enfers te plait?', 'info');
                        },
                    },
                ],
                distance: 1.5,
            },
        });
    }

    private async createPedKaemy() {
        await this.targetFactory.createForPed({
            model: 'mp_f_freemode_01',
            coords: toVector4Object([-1584.99, -3012.71, -77.0, 98.95]),
            components: {
                2: [13, 0, 0],
                3: [11, 0, 0],
                4: [191, 0, 0],
                6: [19, 3, 0],
                7: [38, 0, 0],
                8: [48, 1, 0],
                11: [415, 0, 0],
            },
            props: {
                0: [VanillaPropDrawableIndexMaxValue[PlayerPedHash.Female][Prop.Hat] + 9, 0, 0],
                1: [11, 1, 0],
            },
            skin: {
                Model: {
                    ShapeMix: 0.65,
                    Mother: 21,
                    SkinMix: 0.5,
                    Father: 12,
                    Hash: -1667301416,
                },
                FaceTrait: {
                    NosePeakLower: 0.3,
                    Ageing: -1,
                    NeckThickness: -1,
                    Moles: -1,
                    NosePeakHeight: -0.1,
                    ChimpBoneWidth: -0.3,
                    CheeksWidth: 0,
                    EyebrowHigh: -1,
                    AddBodyBlemish: -1,
                    CheeksBoneHigh: 0.2,
                    JawBoneBackLength: -0.3,
                    Blemish: -1,
                    NoseBoneTwist: 0,
                    ChimpBoneLower: -0.4,
                    NoseWidth: -0.9,
                    JawBoneWidth: -0.5,
                    ChimpHole: -0.6,
                    EyeColor: 2,
                    Complexion: -1,
                    EyebrowForward: -0.5,
                    NoseBoneHigh: 0.5,
                    CheeksBoneWidth: -0.3,
                    BodyBlemish: -1,
                    ChimpBoneLength: -0.3,
                    NosePeakLength: 0.3,
                    EyesOpening: 0.4,
                    LipsThickness: 0.6,
                },
                Hair: {
                    HairType: 13,
                    HairColor: 30,
                    HairSecondaryColor: 0,
                    BeardType: -1,
                    ChestHairOpacity: 1,
                    EyebrowOpacity: 1,
                    ChestHairColor: 0,
                    EyebrowColor: 0,
                    BeardColor: 0,
                    EyebrowType: 5,
                    BeardOpacity: 1,
                    ChestHairType: -1,
                },
                Makeup: {
                    FullMakeupOpacity: 0.75,
                    BlushOpacity: 1,
                    BlushColor: 60,
                    FullMakeupSecondaryColor: 0,
                    LipstickOpacity: 0.7,
                    LipstickType: 0,
                    FullMakeupPrimaryColor: 0,
                    BlushType: 1,
                    LipstickColor: 21,
                    FullMakeupType: 37,
                    FullMakeupDefaultColor: true,
                },
                Tattoos: [
                    {
                        Collection: -1016521996,
                        Overlay: -470534615,
                    },
                    {
                        Collection: -1016521996,
                        Overlay: 603013184,
                    },
                    {
                        Collection: -1016521996,
                        Overlay: 603013184,
                    },
                    {
                        Collection: -1016521996,
                        Overlay: -470534615,
                    },
                    {
                        Collection: 1026837500,
                        Overlay: 1294865118,
                    },
                    {
                        Collection: -1016521996,
                        Overlay: -288852985,
                    },
                    {
                        Collection: -240234547,
                        Overlay: 302211868,
                    },
                    {
                        Collection: -1398869298,
                        Overlay: -1451286393,
                    },
                    {
                        Collection: 601646824,
                        Overlay: -1004630114,
                    },
                ],
            },
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'missheist_agency2aig_4',
            anim: 'look_plan_b_worker2',
            flag: 1,
            target: {
                distance: 1.5,
                options: [
                    {
                        label: 'Kaemy',
                        icon: 'global/question',
                        category: 'citizen',
                        action: async () => {
                            this.notifier.notify(
                                "Hmm... Vous avez eu votre ticket d'entrée pour les enfers ? Vous avez bien lu les petites lignes ? Hmm... Votre âme ? J'ai bien peur que ce soit déjà trop tard...",
                                'info'
                            );
                        },
                    },
                ],
            },
        });
    }

    private async createPedDarabesque() {
        await this.targetFactory.createForPed({
            model: 'mp_f_freemode_01',
            coords: toVector4Object([-1590.97, -3011.66, -77.01, 101.78]),
            components: {
                2: [80, 0, 0],
                3: [39, 0, 0],
                4: [1, 15, 0],
                5: [82, 0, 0],
                6: [90, 14, 0],
                7: [6, 0, 0],
                8: [5, 7, 0],
                11: [427, 4, 0],
            },
            props: {
                0: [VanillaPropDrawableIndexMaxValue[PlayerPedHash.Female][Prop.Hat] + 9, 0, 0],
                2: [15, 0, 0],
                6: [19, 2, 0],
                7: [2, 0, 0],
            },
            skin: {
                Model: {
                    Hash: -1667301416,
                    Father: 4,
                    ShapeMix: 0.75,
                    Mother: 35,
                    SkinMix: 0.6,
                },
                FaceTrait: {
                    Moles: 0,
                    CheeksBoneHigh: 0.9,
                    NoseBoneHigh: 0.0,
                    BodyBlemish: 11,
                    AddBodyBlemish: -1,
                    EyesOpening: 0.3,
                    JawBoneWidth: 0.0,
                    CheeksBoneWidth: 0.0,
                    NosePeakLower: 0.0,
                    JawBoneBackLength: 0.2,
                    ChimpBoneLower: 0.0,
                    ChimpBoneLength: 0.0,
                    NosePeakHeight: 0.6,
                    Complexion: -1,
                    LipsThickness: 0.7,
                    Ageing: -1,
                    NoseBoneTwist: 0.0,
                    EyebrowHigh: 0.0,
                    ChimpHole: 0.0,
                    NosePeakLength: -0.6,
                    CheeksWidth: 0.0,
                    ChimpBoneWidth: 0.0,
                    NeckThickness: 0.3,
                    EyeColor: 6,
                    NoseWidth: -0.7,
                    EyebrowForward: -0.3,
                    Blemish: 3,
                },
                Hair: {
                    HairSecondaryColor: 32,
                    ChestHairType: -1,
                    EyebrowOpacity: 1.0,
                    BeardType: -1,
                    ChestHairColor: 0,
                    ChestHairOpacity: 1.0,
                    BeardColor: 0,
                    HairColor: 0,
                    HairType: 80,
                    EyebrowType: 3,
                    EyebrowColor: 0,
                    BeardOpacity: 1.0,
                },
                Makeup: {
                    BlushColor: 0,
                    FullMakeupOpacity: 1.0,
                    FullMakeupSecondaryColor: 0,
                    LipstickColor: 11,
                    LipstickType: 4,
                    FullMakeupType: 32,
                    FullMakeupPrimaryColor: 0,
                    BlushType: -1,
                    FullMakeupDefaultColor: true,
                    BlushOpacity: 1.0,
                    LipstickOpacity: 0.5,
                },
                Tattoos: [
                    {
                        Collection: -1368357453,
                        Overlay: 1600841937,
                    },
                    {
                        Collection: -1368357453,
                        Overlay: 21830981,
                    },
                    {
                        Collection: 1347816957,
                        Overlay: 1864088729,
                    },
                    {
                        Collection: 1347816957,
                        Overlay: 1424803201,
                    },
                    {
                        Collection: -1201369729,
                        Overlay: -1011813098,
                    },
                    {
                        Collection: -1368357453,
                        Overlay: 421656072,
                    },
                    {
                        Collection: 1347816957,
                        Overlay: 1928040960,
                    },
                    {
                        Collection: -1368357453,
                        Overlay: -1598237536,
                    },
                    {
                        Collection: -1201369729,
                        Overlay: -1897002095,
                    },
                    {
                        Collection: 1347816957,
                        Overlay: -978468741,
                    },
                    {
                        Collection: -1201369729,
                        Overlay: 890225886,
                    },
                    {
                        Collection: -1201369729,
                        Overlay: 1121411181,
                    },
                    {
                        Collection: -1368357453,
                        Overlay: -1458871109,
                    },
                    {
                        Collection: 1347816957,
                        Overlay: -978468741,
                    },
                    {
                        Collection: -1368357453,
                        Overlay: 21830981,
                    },
                    {
                        Collection: -1201369729,
                        Overlay: 1121411181,
                    },
                    {
                        Collection: -1368357453,
                        Overlay: 1600841937,
                    },
                    {
                        Collection: 1616273011,
                        Overlay: -1814153457,
                    },
                    {
                        Collection: -1201369729,
                        Overlay: 427888057,
                    },
                    {
                        Collection: -1201369729,
                        Overlay: -1011813098,
                    },
                    {
                        Collection: 1026837500,
                        Overlay: -1363418653,
                    },
                    {
                        Collection: 1026837500,
                        Overlay: -1363418653,
                    },
                    {
                        Collection: -1368357453,
                        Overlay: 89152577,
                    },
                    {
                        Collection: 1026837500,
                        Overlay: 1654019571,
                    },
                    {
                        Collection: -1201369729,
                        Overlay: -2092436411,
                    },
                    {
                        Collection: -1368357453,
                        Overlay: -1598237536,
                    },
                    {
                        Collection: 1026837500,
                        Overlay: 415527077,
                    },
                    {
                        Collection: 1347816957,
                        Overlay: 98665018,
                    },
                ],
            },
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'missheist_agency2aig_4',
            anim: 'look_plan_b_worker2',
            flag: 1,
            target: {
                distance: 1.5,
                options: [
                    {
                        label: 'DaraBesque',
                        icon: 'global/question',
                        category: 'citizen',
                        action: async () => {
                            this.notifier.notify(
                                'Par cette incantation je te maudis : tu as désormais des miettes dans ton lit !',
                                'info'
                            );
                        },
                    },
                ],
            },
        });
    }

    private async createPedTluap() {
        await this.targetFactory.createForPed({
            model: 'mp_m_freemode_01',
            coords: toVector4Object([-1591.06, -3010.38, -77.01, 104.94]),
            components: {
                3: [24, 0, 0],
                4: [73, 0, 0],
                6: [24, 0, 0],
                7: [112, 2, 0],
                8: [1, 12, 0],
                11: [151, 3, 0],
            },
            props: {
                0: [VanillaPropDrawableIndexMaxValue[PlayerPedHash.Male][Prop.Hat] + 9, 0, 0],
            },
            skin: {
                Model: {
                    Father: 13,
                    Mother: 41,
                    ShapeMix: 0.3,
                    SkinMix: 0.8,
                    Hash: 1885233650,
                },
                FaceTrait: {
                    NosePeakLength: 0.0,
                    NoseWidth: 0.0,
                    ChimpBoneLower: 0.0,
                    NeckThickness: 0.0,
                    ChimpBoneLength: 0.0,
                    LipsThickness: 0.0,
                    Complexion: -1,
                    EyesOpening: 0.0,
                    JawBoneWidth: 0.0,
                    ChimpBoneWidth: 0.0,
                    EyebrowForward: 0.0,
                    BodyBlemish: -1,
                    NosePeakHeight: 0.0,
                    CheeksBoneHigh: 0.0,
                    NosePeakLower: 0.0,
                    ChimpHole: 0.0,
                    NoseBoneTwist: 0.0,
                    CheeksWidth: 0.0,
                    JawBoneBackLength: 0.0,
                    Moles: -1,
                    EyeColor: 7,
                    NoseBoneHigh: 0.0,
                    Blemish: -1,
                    EyebrowHigh: 0.0,
                    CheeksBoneWidth: 0.0,
                    Ageing: 8,
                    AddBodyBlemish: -1,
                },
                Hair: {
                    HairColor: 29,
                    BeardType: 18,
                    BeardOpacity: 1.0,
                    ChestHairType: 0,
                    EyebrowColor: 29,
                    ChestHairOpacity: 1.0,
                    ChestHairColor: 29,
                    BeardColor: 29,
                    HairType: 0,
                    HairSecondaryColor: 29,
                    EyebrowType: 17,
                    EyebrowOpacity: 1.0,
                },
                Makeup: {
                    FullMakeupDefaultColor: true,
                    BlushColor: 0,
                    LipstickOpacity: 1.0,
                    FullMakeupType: -1,
                    BlushType: -1,
                    FullMakeupPrimaryColor: 0,
                    FullMakeupOpacity: 1.0,
                    FullMakeupSecondaryColor: 0,
                    BlushOpacity: 1.0,
                    LipstickType: -1,
                    LipstickColor: 0,
                },
                Tattoos: [
                    {
                        Collection: -1719270477,
                        Overlay: 472458130,
                    },
                    {
                        Collection: -240234547,
                        Overlay: -964908188,
                    },
                    {
                        Collection: -240234547,
                        Overlay: 682382693,
                    },
                    {
                        Collection: -363871405,
                        Overlay: -1677889748,
                    },
                ],
            },
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'missfbi3_party_d',
            anim: 'stand_talk_loop_a_male3',
            flag: 1,
            target: {
                distance: 1.5,
                options: [
                    {
                        label: 'Tluap',
                        icon: 'global/question',
                        category: 'citizen',
                        action: async () => {
                            this.notifier.notify("Vous cherchez quelqu'un en particulier ? Personne est ici.", 'info');
                        },
                    },
                ],
            },
        });
    }

    private async createPedDraglock() {
        await this.targetFactory.createForPed({
            model: 'mp_m_freemode_01',
            coords: toVector4Object([-1593.05, -3011.84, -80.01, 104.93]),
            components: {
                0: [0, 0, 0],
                1: [0, 0, 0],
                2: [21, 0, 0],
                3: [12, 0, 0],
                4: [24, 0, 0],
                6: [20, 0, 0],
                7: [0, 0, 0],
                8: [150, 0, 0],
                9: [54, 0, 0],
                10: [0, 0, 0],
                11: [31, 0, 0],
            },
            props: {
                0: [VanillaPropDrawableIndexMaxValue[PlayerPedHash.Male][Prop.Hat] + 9, 0, 0],
                1: [5, 5, 0],
                2: [25, 3, 0],
                6: [37, 1, 0],
                7: [2, 0, 0],
            },
            skin: {
                Model: {
                    Father: 42,
                    ShapeMix: 0.5,
                    SkinMix: 0.5,
                    Mother: 45,
                    Hash: 1885233650,
                },
                FaceTrait: {
                    CheeksBoneHigh: 0.0,
                    NosePeakLength: 0.0,
                    ChimpBoneWidth: 0.0,
                    NoseWidth: 0.0,
                    ChimpBoneLength: 0.0,
                    ChimpHole: 0.0,
                    JawBoneWidth: 0.0,
                    Ageing: -1,
                    EyebrowHigh: 0.0,
                    NeckThickness: 0.0,
                    NoseBoneHigh: 0.0,
                    ChimpBoneLower: 0.0,
                    Moles: -1,
                    BodyBlemish: -1,
                    NoseBoneTwist: 0.0,
                    CheeksBoneWidth: 0.0,
                    JawBoneBackLength: 0.0,
                    CheeksWidth: 0.0,
                    Complexion: -1,
                    EyeColor: -1,
                    Blemish: -1,
                    NosePeakLower: 0.0,
                    EyebrowForward: 0.1,
                    AddBodyBlemish: -1,
                    EyesOpening: 0.0,
                    NosePeakHeight: 0.0,
                    LipsThickness: 0.0,
                },
                Hair: {
                    BeardType: 18,
                    HairColor: 26,
                    EyebrowColor: 55,
                    ChestHairType: -1,
                    BeardOpacity: 1.0,
                    HairSecondaryColor: 27,
                    ChestHairOpacity: 1.0,
                    ChestHairColor: 0,
                    BeardColor: 0,
                    EyebrowType: 30,
                    EyebrowOpacity: 1.0,
                    HairType: 21,
                },
                Makeup: {
                    FullMakeupType: -1,
                    LipstickOpacity: 1.0,
                    BlushOpacity: 1.0,
                    FullMakeupOpacity: 1.0,
                    LipstickType: -1,
                    LipstickColor: 0,
                    FullMakeupPrimaryColor: 0,
                    FullMakeupSecondaryColor: 0,
                    BlushType: -1,
                    BlushColor: 0,
                },
                Tattoos: [
                    { Collection: 598190139, Overlay: 301211484 },
                    { Collection: 598190139, Overlay: -820013196 },
                    { Collection: -240234547, Overlay: 1200380295 },
                    { Collection: -240234547, Overlay: 1200380295 },
                    { Collection: 1347816957, Overlay: -1926213636 },
                    { Collection: -1056335443, Overlay: 1027059614 },
                    { Collection: -1056335443, Overlay: 1027059614 },
                    { Collection: -1056335443, Overlay: 1027059614 },
                    { Collection: 598190139, Overlay: -820013196 },
                    { Collection: 598190139, Overlay: -820013196 },
                    { Collection: 598190139, Overlay: -401355876 },
                    { Collection: 598190139, Overlay: -401355876 },
                    { Collection: 598190139, Overlay: -401355876 },
                    { Collection: 484754152, Overlay: -1008363280 },
                    { Collection: 1926256505, Overlay: 257911811 },
                    { Collection: 598190139, Overlay: -221326558 },
                    { Collection: 598190139, Overlay: -221326558 },
                    { Collection: 598190139, Overlay: -221326558 },
                    { Collection: 1026837500, Overlay: 1091795205 },
                    { Collection: 1026837500, Overlay: 1091795205 },
                    { Collection: 601646824, Overlay: -738078859 },
                    { Collection: 598190139, Overlay: 301211484 },
                    { Collection: 598190139, Overlay: 301211484 },
                    { Collection: 598190139, Overlay: 301211484 },
                    { Collection: 484754152, Overlay: -1008363280 },
                    { Collection: 484754152, Overlay: -1008363280 },
                    { Collection: -1201369729, Overlay: 555692245 },
                    { Collection: -1201369729, Overlay: 555692245 },
                    { Collection: -1201369729, Overlay: 555692245 },
                    { Collection: -1201369729, Overlay: 555692245 },
                    { Collection: -1201369729, Overlay: 555692245 },
                    { Collection: -1201369729, Overlay: 555692245 },
                    { Collection: -1201369729, Overlay: 555692245 },
                    { Collection: -1201369729, Overlay: 555692245 },
                    { Collection: -1201369729, Overlay: 555692245 },
                    { Collection: -1201369729, Overlay: 555692245 },
                    { Collection: -1016521996, Overlay: 654127400 },
                    { Collection: -1016521996, Overlay: 654127400 },
                    { Collection: 1529191571, Overlay: 2088037441 },
                    { Collection: 1926256505, Overlay: 257911811 },
                    { Collection: 1926256505, Overlay: 257911811 },
                    { Collection: 1926256505, Overlay: 257911811 },
                ],
            },
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'anim@amb@nightclub@mini@dance@dance_solo@female@var_a@',
            anim: 'low_center_down',
            flag: 1,
            target: {
                options: [
                    {
                        label: 'Draglock',
                        icon: 'global/question',
                        category: 'citizen',
                        action: async () => {
                            this.notifier.notify('Huuuuuuum', 'info');
                        },
                    },
                ],
                distance: 1.5,
            },
        });
    }

    private async createPedPoulpito() {
        await this.targetFactory.createForPed({
            model: 'mp_m_freemode_01',
            coords: toVector4Object([-1594.58, -3013.37, -80.01, 91.19]),
            components: {
                3: [4, 0, 0],
                4: [10, 0, 0],
                5: [114, 0, 0],
                6: [10, 0, 0],
                8: [15, 0, 0],
                10: [VanillaComponentDrawableIndexMaxValue[PlayerPedHash.Male][Component.Decals] + 14, 0, 0],
                11: [349, 3, 0],
            },
            props: {
                0: [VanillaPropDrawableIndexMaxValue[PlayerPedHash.Male][Prop.Hat] + 9, 0, 0],
                1: [8, 3, 0],
                6: [2, 0, 0],
            },
            skin: {
                Model: {
                    Father: 44,
                    ShapeMix: 0.4,
                    SkinMix: 0.45,
                    Mother: 31,
                    Hash: 1885233650,
                },
                FaceTrait: {
                    CheeksBoneHigh: 0.0,
                    NosePeakLength: 0.0,
                    ChimpBoneWidth: 0.0,
                    NoseWidth: 0.0,
                    ChimpBoneLength: 0.0,
                    ChimpHole: 0.0,
                    JawBoneWidth: 0.0,
                    Ageing: 1,
                    EyebrowHigh: 0.0,
                    NeckThickness: 0.0,
                    NoseBoneHigh: 0.0,
                    NosePeakHeight: 0.0,
                    Moles: -1,
                    ChimpBoneLower: 0.0,
                    EyeColor: -1,
                    Blemish: -1,
                    JawBoneBackLength: 0.0,
                    CheeksWidth: 0.0,
                    Complexion: -1,
                    BodyBlemish: -1,
                    CheeksBoneWidth: 0.0,
                    NoseBoneTwist: 0.0,
                    EyebrowForward: -1.0,
                    AddBodyBlemish: -1,
                    EyesOpening: 0.0,
                    NosePeakLower: 0.0,
                    LipsThickness: 0.0,
                },
                Hair: {
                    BeardType: 10,
                    BeardColor: 2,
                    EyebrowColor: 56,
                    HairColor: 61,
                    BeardOpacity: 1.0,
                    HairSecondaryColor: 2,
                    ChestHairOpacity: 1.0,
                    ChestHairColor: 0,
                    ChestHairType: 0,
                    EyebrowType: 1,
                    EyebrowOpacity: 0.6,
                    HairType: 10,
                },
                Makeup: {
                    FullMakeupType: -1,
                    LipstickOpacity: 1.0,
                    BlushOpacity: 1.0,
                    FullMakeupSecondaryColor: 0,
                    FullMakeupPrimaryColor: 0,
                    LipstickColor: 0,
                    LipstickType: -1,
                    FullMakeupOpacity: 1.0,
                    BlushType: -1,
                    BlushColor: 0,
                },
                Tattoos: [
                    { Collection: -1016521996, Overlay: 1942093304 },
                    { Collection: -1056335443, Overlay: 1617489838 },
                    { Collection: -1016521996, Overlay: -131581709 },
                    { Collection: -1056335443, Overlay: 1027059614 },
                    { Collection: -1398869298, Overlay: -270395278 },
                    { Collection: -240234547, Overlay: 1246243345 },
                    { Collection: 1926256505, Overlay: -1531355431 },
                    { Collection: 598190139, Overlay: -1822846187 },
                    { Collection: -240234547, Overlay: -1937668252 },
                    { Collection: -1398869298, Overlay: -87213624 },
                    { Collection: 1185637852, Overlay: -1820938681 },
                    { Collection: -1719270477, Overlay: 459313194 },
                    { Collection: -240234547, Overlay: -1145896773 },
                    { Collection: -240234547, Overlay: -927135334 },
                    { Collection: -240234547, Overlay: -589592162 },
                    { Collection: -240234547, Overlay: -883161109 },
                    { Collection: -240234547, Overlay: -394853815 },
                    { Collection: -240234547, Overlay: 1670479428 },
                    { Collection: -2086773, Overlay: 709663738 },
                    { Collection: 1926256505, Overlay: 2121965551 },
                    { Collection: 1926256505, Overlay: 257911811 },
                    { Collection: -1201369729, Overlay: -1820191335 },
                    { Collection: -1201369729, Overlay: 1124688073 },
                    { Collection: 1616273011, Overlay: 1832021545 },
                    { Collection: 1616273011, Overlay: -648193607 },
                    { Collection: 1616273011, Overlay: 2025651359 },
                    { Collection: -1398869298, Overlay: 505181414 },
                    { Collection: -1398869298, Overlay: 1252285617 },
                    { Collection: -975527441, Overlay: 962023066 },
                    { Collection: 1529191571, Overlay: 1045897298 },
                    { Collection: 1529191571, Overlay: 2088037441 },
                    { Collection: 62137527, Overlay: -481389646 },
                    { Collection: 484754152, Overlay: 1775476370 },
                    { Collection: -1016521996, Overlay: 654127400 },
                    { Collection: 598190139, Overlay: -150640257 },
                    { Collection: 598190139, Overlay: -150640257 },
                    { Collection: -1719270477, Overlay: 459313194 },
                ],
            },
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'mini@strip_club@private_dance@part2',
            anim: 'priv_dance_p2',
            flag: 1,
            target: {
                distance: 1.5,
                options: [
                    {
                        label: 'Poulpito',
                        icon: 'global/question',
                        category: 'citizen',
                        action: async () => {
                            this.notifier.notify(
                                "L'enfer des uns est le paradis des autres. Joins-toi à moi dans les limbes pour l'éternité !",
                                'info'
                            );
                        },
                    },
                ],
            },
        });
    }

    private async createPedSniteur() {
        await this.targetFactory.createForPed({
            model: 'mp_m_freemode_01',
            coords: toVector4Object([-1594.88, -3011.5, -80.01, 94.83]),
            components: {
                2: [21, 0, 0],
                3: [20, 0, 0],
                4: [28, 8, 0],
                5: [114, 0, 0],
                6: [20, 3, 0],
                7: [0, 0, 0],
                8: [150, 10, 0],
                11: [294, 4, 0],
            },
            props: {
                0: [VanillaPropDrawableIndexMaxValue[PlayerPedHash.Male][Prop.Hat] + 9, 0, 0],
                1: [5, 5, 0],
                2: [31, 1, 0],
                6: [36, 0, 0],
            },
            skin: {
                Model: {
                    Father: 4,
                    ShapeMix: 0.5,
                    SkinMix: 0.45,
                    Mother: 31,
                    Hash: 1885233650,
                },
                FaceTrait: {
                    CheeksBoneHigh: 0.0,
                    NosePeakLength: 0.0,
                    ChimpBoneWidth: 0.0,
                    NoseWidth: 0.0,
                    ChimpBoneLength: 0.0,
                    ChimpHole: 0.0,
                    JawBoneWidth: 0.0,
                    Ageing: -1,
                    EyebrowHigh: 0.0,
                    NeckThickness: 0.0,
                    NoseBoneHigh: 0.0,
                    NosePeakHeight: 0.0,
                    Moles: -1,
                    ChimpBoneLower: 0.0,
                    NosePeakLower: 0.0,
                    EyeColor: 8,
                    JawBoneBackLength: 0.0,
                    CheeksWidth: 0.0,
                    Complexion: -1,
                    Blemish: -1,
                    CheeksBoneWidth: 0.0,
                    NoseBoneTwist: 0.0,
                    EyebrowForward: 0.0,
                    AddBodyBlemish: -1,
                    EyesOpening: 0.0,
                    BodyBlemish: -1,
                    LipsThickness: 0.0,
                },
                Hair: {
                    BeardType: 10,
                    HairColor: 27,
                    EyebrowColor: 60,
                    BeardColor: 0,
                    BeardOpacity: 1.0,
                    HairSecondaryColor: 29,
                    ChestHairOpacity: 1.0,
                    ChestHairColor: 0,
                    EyebrowType: 1,
                    ChestHairType: -1,
                    EyebrowOpacity: 1.0,
                    HairType: 21,
                },
                Makeup: {
                    FullMakeupType: -1,
                    LipstickOpacity: 1.0,
                    BlushOpacity: 1.0,
                    FullMakeupSecondaryColor: 0,
                    FullMakeupPrimaryColor: 0,
                    LipstickColor: 0,
                    LipstickType: -1,
                    FullMakeupOpacity: 1.0,
                    BlushType: -1,
                    BlushColor: 0,
                },
                Tattoos: [
                    { Collection: -2086773, Overlay: 1860213958 },
                    { Collection: -240234547, Overlay: 2088424900 },
                    { Collection: 598190139, Overlay: 1180435659 },
                    { Collection: 1926256505, Overlay: 1745422723 },
                    { Collection: 1347816957, Overlay: 1126903931 },
                    { Collection: 1026837500, Overlay: 220143168 },
                    { Collection: 62137527, Overlay: -1213131712 },
                    { Collection: 1529191571, Overlay: -1528465573 },
                    { Collection: 598190139, Overlay: -221326558 },
                    { Collection: -240234547, Overlay: -2015343582 },
                    { Collection: 1616273011, Overlay: -303409019 },
                    { Collection: 1026837500, Overlay: 1091795205 },
                ],
            },
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'mini@strip_club@private_dance@part1',
            anim: 'priv_dance_p1',
            flag: 1,
            target: {
                distance: 1.5,
                options: [
                    {
                        label: 'Sniteur ',
                        icon: 'global/question',
                        category: 'citizen',
                        action: async () => {
                            this.notifier.notify(
                                'Hmm. Tu es en vie... Bravo. Reste à savoir pendant combien de temps, si tu continues à me faire perdre du temps.',
                                'info'
                            );
                        },
                    },
                ],
            },
        });
    }

    private async createPedBrouznouf() {
        await this.targetFactory.createForPed({
            model: 'mp_m_freemode_01',
            coords: toVector4Object([-1622.07, -3011.59, -76.21, 271.19]),
            components: {
                9: [0, 0, 0],
                6: [6, 0, 0],
                8: [15, 0, 0],
                7: [0, 0, 0],
                1: [0, 0, 0],
                4: [52, 0, 0],
                3: [4, 0, 0],
                10: [0, 0, 0],
                11: [384, 0, 0],
            },
            props: {
                0: [VanillaPropDrawableIndexMaxValue[PlayerPedHash.Male][Prop.Hat] + 9, 0, 0],
                1: [10, 10, 0],
            },
            skin: {
                Model: {
                    Mother: 38,
                    Father: 13,
                    ShapeMix: 0.15,
                    SkinMix: 0.6,
                    Hash: 1885233650,
                },
                FaceTrait: {
                    LipsThickness: 0.8,
                    EyebrowForward: -0.7,
                    EyesOpening: -1.0,
                    ChimpBoneLower: 0.4,
                    AddBodyBlemish: -1,
                    ChimpHole: 0.0,
                    ChimpBoneWidth: 0.5,
                    EyeColor: 5,
                    Complexion: 1,
                    NeckThickness: -1.0,
                    Moles: 4,
                    CheeksBoneWidth: 0.4,
                    EyebrowHigh: 0.0,
                    NoseBoneHigh: 0.4,
                    NosePeakLength: 0.6,
                    CheeksBoneHigh: 0.4,
                    ChimpBoneLength: 0.4,
                    NosePeakHeight: 0.4,
                    Ageing: 5,
                    NoseBoneTwist: 0.3,
                    BodyBlemish: -1,
                    NoseWidth: 0.5,
                    NosePeakLower: 0.3,
                    Blemish: 0,
                    JawBoneWidth: -1.0,
                    CheeksWidth: 0.3,
                    JawBoneBackLength: -1.0,
                },
                Hair: {
                    HairType: 18,
                    HairColor: 26,
                    ChestHairColor: 0,
                    HairSecondaryColor: 27,
                    BeardColor: 26,
                    EyebrowType: 24,
                    EyebrowOpacity: 1.0,
                    ChestHairOpacity: 1.0,
                    EyebrowColor: 1,
                    BeardType: 2,
                    BeardOpacity: 1.0,
                    ChestHairType: 0,
                },
                Makeup: {
                    BlushColor: 0,
                    FullMakeupOpacity: 1.0,
                    FullMakeupSecondaryColor: 0,
                    FullMakeupPrimaryColor: 0,
                    BlushType: -1,
                    LipstickType: -1,
                    BlushOpacity: 1.0,
                    LipstickOpacity: 1.0,
                    FullMakeupType: -1,
                    LipstickColor: 0,
                },
                Tattoos: [],
            },
            invincible: true,
            freeze: true,
            blockevents: true,
            scenario: 'WORLD_HUMAN_COP_IDLES',
            flag: 1,
            target: {
                distance: 1.5,
                options: [
                    {
                        label: 'Brouznouf',
                        icon: 'global/question',
                        category: 'citizen',
                        action: async () => {
                            this.notifier.notify(
                                "Il paraît qu'il y a un fantôme qui sort son téléphone au BCSO ?",
                                'info'
                            );
                        },
                    },
                ],
            },
        });
    }

    private async createPedLaikker() {
        await this.targetFactory.createForPed({
            model: 'mp_m_freemode_01',
            coords: toVector4Object([-1618.5, -3018.12, -76.21, 12.42]),
            components: {
                4: [103, 0, 0],
                3: [0, 0, 0],
                6: [1, 2, 0],
                1: [0, 0, 0],
                7: [0, 0, 0],
                8: [15, 0, 0],
                10: [0, 0, 0],
                11: [354, 0, 0],
                9: [0, 0, 0],
            },
            props: {
                0: [VanillaPropDrawableIndexMaxValue[PlayerPedHash.Male][Prop.Hat] + 9, 0, 0],
            },
            skin: {
                Model: { SkinMix: 0.75, Hash: 1885233650, Father: 5, ShapeMix: 0.15, Mother: 29 },
                FaceTrait: {
                    ChimpBoneLower: 0.0,
                    BodyBlemish: -1,
                    Complexion: -1,
                    NeckThickness: 0.0,
                    EyebrowForward: 0.4,
                    LipsThickness: 0.0,
                    EyeColor: -1,
                    CheeksBoneWidth: 0.0,
                    EyebrowHigh: 0.0,
                    NosePeakLength: 0.0,
                    NoseBoneHigh: 0.0,
                    CheeksBoneHigh: 0.0,
                    ChimpBoneLength: 0.0,
                    Blemish: -1,
                    AddBodyBlemish: -1,
                    Ageing: -1,
                    CheeksWidth: 0.0,
                    NosePeakLower: 0.0,
                    ChimpHole: 0.0,
                    ChimpBoneWidth: 0.0,
                    Moles: -1,
                    NoseBoneTwist: 0.0,
                    EyesOpening: 0.0,
                    JawBoneWidth: 0.0,
                    JawBoneBackLength: 0.0,
                    NosePeakHeight: 0.0,
                    NoseWidth: 0.0,
                },
                Hair: {
                    HairType: 10,
                    ChestHairType: 0,
                    HairColor: 4,
                    ChestHairOpacity: 1.0,
                    EyebrowType: 12,
                    BeardOpacity: 1.0,
                    BeardType: -1,
                    BeardColor: 0,
                    ChestHairColor: 1,
                    HairSecondaryColor: 60,
                    EyebrowColor: 3,
                    EyebrowOpacity: 1.0,
                },
                Makeup: {
                    FullMakeupOpacity: 1.0,
                    BlushOpacity: 1.0,
                    FullMakeupType: -1,
                    LipstickColor: 0,
                    FullMakeupPrimaryColor: 0,
                    BlushType: -1,
                    LipstickType: -1,
                    LipstickOpacity: 1.0,
                    FullMakeupSecondaryColor: 0,
                    FullMakeupDefaultColor: true,
                    BlushColor: 0,
                },
                Tattoos: [],
            },
            invincible: true,
            freeze: true,
            blockevents: true,
            scenario: 'WORLD_HUMAN_BINOCULARS',
            flag: 1,
            target: {
                distance: 1.5,
                options: [
                    {
                        label: 'Laikker',
                        icon: 'global/question',
                        category: 'citizen',
                        action: async () => {
                            this.notifier.notify("C'est bon, c'est fini ? je peux aller dormir ?", 'info');
                        },
                    },
                ],
            },
        });
    }

    private async createPedMoustache() {
        await this.targetFactory.createForPed({
            model: 'mp_m_freemode_01',
            coords: toVector4Object([-1619.85, -3010.83, -76.21, 39.81]),
            components: {
                9: [0, 0, 0],
                7: [0, 0, 0],
                8: [15, 0, 0],
                6: [12, 3, 0],
                3: [14, 0, 0],
                4: [4, 0, 0],
                1: [0, 0, 0],
                10: [0, 0, 0],
                11: [6, 6, 0],
            },
            props: {
                0: [VanillaPropDrawableIndexMaxValue[PlayerPedHash.Male][Prop.Hat] + 9, 0, 0],
                1: [7, 0, 0],
                7: [5, 0, 0],
            },
            skin: {
                Model: { Mother: 31, ShapeMix: 0.55, Hash: 1885233650, SkinMix: 1, Father: 4 },
                FaceTrait: {
                    LipsThickness: 0.5,
                    NosePeakLength: 0,
                    ChimpBoneWidth: 0,
                    NosePeakHeight: -0.5,
                    NoseWidth: -0.4,
                    Moles: -1,
                    ChimpHole: 0,
                    EyebrowHigh: 0,
                    EyeColor: 0,
                    Complexion: -1,
                    Blemish: -1,
                    CheeksBoneHigh: 0.3,
                    NosePeakLower: 0,
                    EyesOpening: 0.2,
                    CheeksBoneWidth: -0.4,
                    BodyBlemish: -1,
                    NoseBoneTwist: 0,
                    CheeksWidth: 0.3,
                    AddBodyBlemish: -1,
                    NeckThickness: 0,
                    ChimpBoneLower: 0,
                    Ageing: -1,
                    EyebrowForward: -0.4,
                    NoseBoneHigh: 0,
                    ChimpBoneLength: 0,
                    JawBoneBackLength: -0.1,
                    JawBoneWidth: 0.4,
                },
                Hair: {
                    ChestHairColor: 0,
                    BeardType: 11,
                    EyebrowColor: 0,
                    ChestHairType: 0,
                    HairSecondaryColor: 4,
                    EyebrowType: 30,
                    EyebrowOpacity: 1,
                    BeardColor: 2,
                    HairType: 80,
                    HairColor: 61,
                    BeardOpacity: 0.95,
                    ChestHairOpacity: 1,
                },
                Makeup: {
                    FullMakeupSecondaryColor: 0,
                    LipstickColor: 0,
                    FullMakeupDefaultColor: true,
                    FullMakeupPrimaryColor: 0,
                    FullMakeupType: -1,
                    LipstickType: -1,
                    BlushType: -1,
                    BlushOpacity: 1,
                    FullMakeupOpacity: 1,
                    BlushColor: 0,
                    LipstickOpacity: 1,
                },
                Tattoos: [
                    {
                        Collection: 1926256505,
                        Overlay: 662247816,
                    },
                    {
                        Collection: 1926256505,
                        Overlay: 1031130678,
                    },
                    {
                        Collection: 1347816957,
                        Overlay: 1505585597,
                    },
                    {
                        Collection: 62137527,
                        Overlay: -2088194624,
                    },
                    {
                        Collection: 601646824,
                        Overlay: -738078859,
                    },
                    {
                        Collection: 1926256505,
                        Overlay: 1745422723,
                    },
                    {
                        Collection: 1529191571,
                        Overlay: 2088037441,
                    },
                ],
            },
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'mp_fib_grab',
            anim: 'loop',
            flag: 1,
            target: {
                distance: 1.5,
                options: [
                    {
                        label: 'Moustash',
                        icon: 'global/question',
                        category: 'citizen',
                        action: async () => {
                            this.notifier.notify(
                                'Vous avez aussi survécu à ça ? Vous êtes de vrais cafards ma parole.',
                                'info'
                            );
                        },
                    },
                ],
            },
        });
    }

    private async createPedAurukh() {
        await this.targetFactory.createForPed({
            model: 'mp_m_freemode_01',
            coords: toVector4Object([-1608.7, -3017.68, -76.21, 90.36]),
            components: {
                11: [61, 2, 0],
                10: [0, 0, 0],
                1: [0, 0, 0],
                3: [1, 0, 0],
                4: [128, 18, 0],
                6: [99, 6, 0],
                7: [0, 0, 0],
                8: [15, 0, 0],
                9: [0, 0, 0],
            },
            props: {
                0: [13, 7, 0],
                1: [23, 9, 0],
                6: [1, 0, 0],
            },
            skin: {
                Model: { Mother: 31, ShapeMix: 0.5, Hash: 1885233650, SkinMix: 0.5, Father: 4 },
                FaceTrait: {
                    LipsThickness: 0.1,
                    NosePeakLength: 0,
                    ChimpBoneWidth: 0,
                    Moles: -1,
                    NoseWidth: -0.2,
                    EyebrowHigh: 0,
                    ChimpHole: 0,
                    JawBoneBackLength: -0.1,
                    EyeColor: 3,
                    CheeksBoneWidth: -0.2,
                    Blemish: 0,
                    CheeksBoneHigh: 0,
                    NosePeakLower: 0,
                    NosePeakHeight: 0,
                    NoseBoneHigh: 0,
                    NoseBoneTwist: 0,
                    EyesOpening: 0,
                    CheeksWidth: -0.8,
                    AddBodyBlemish: -1,
                    NeckThickness: 0.1,
                    ChimpBoneLower: 0,
                    Ageing: 0,
                    EyebrowForward: 0,
                    Complexion: -1,
                    ChimpBoneLength: 0,
                    BodyBlemish: 0,
                    JawBoneWidth: 0.2,
                },
                Hair: {
                    HairSecondaryColor: 5,
                    BeardType: 14,
                    EyebrowColor: 61,
                    HairColor: 5,
                    ChestHairColor: 0,
                    BeardOpacity: 0.95,
                    EyebrowOpacity: 0.65,
                    ChestHairType: -1,
                    HairType: 2,
                    BeardColor: 4,
                    EyebrowType: 0,
                    ChestHairOpacity: 0.2,
                },
                Makeup: {
                    FullMakeupSecondaryColor: 0,
                    LipstickColor: 0,
                    FullMakeupDefaultColor: true,
                    FullMakeupPrimaryColor: 0,
                    LipstickOpacity: 1,
                    FullMakeupType: -1,
                    BlushType: -1,
                    BlushOpacity: 1,
                    FullMakeupOpacity: 1,
                    BlushColor: 0,
                    LipstickType: -1,
                },
                Tattoos: [],
            },
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'anim@heists@heist_corona@single_team',
            anim: 'single_team_loop_boss',
            flag: 1,
            target: {
                distance: 1.5,
                options: [
                    {
                        label: 'Aurukh',
                        icon: 'global/question',
                        category: 'citizen',
                        action: async () => {
                            this.notifier.notify(
                                ' Je vois des citrouilles partout ... Je crois même en avoir vu certaines marcher ...',
                                'info'
                            );
                        },
                    },
                ],
            },
        });
    }

    private async createPedRigonkmalk() {
        await this.targetFactory.createForPed({
            model: 'mp_m_freemode_01',
            coords: toVector4Object([-1608.18, -3014.72, -76.21, 243.54]),
            components: {
                2: [10, 0, 0],
                3: [4, 0, 0],
                4: [141, 3, 0],
                5: [114, 0, 0],
                6: [15, 4, 0],
                8: [15, 0, 0],
                10: [VanillaComponentDrawableIndexMaxValue[PlayerPedHash.Male][Component.Decals] + 14, 0, 0],
                11: [349, 3, 0],
            },
            props: {
                0: [VanillaPropDrawableIndexMaxValue[PlayerPedHash.Male][Prop.Hat] + 9, 0, 0],
                1: [5, 9, 0],
                2: [32, 1, 0],
                6: [18, 0, 0],
            },
            skin: {
                Model: { SkinMix: 0.1, Father: 43, Mother: 31, ShapeMix: 0.7, Hash: 1885233650 },
                FaceTrait: {
                    NeckThickness: 0.0,
                    Complexion: -1,
                    CheeksWidth: 0.0,
                    AddBodyBlemish: -1,
                    ChimpBoneLower: 0.0,
                    CheeksBoneHigh: 0.0,
                    EyeColor: 5,
                    ChimpBoneWidth: 0.0,
                    EyebrowHigh: 0.0,
                    LipsThickness: 0.0,
                    NoseWidth: 0.0,
                    Moles: -1,
                    NosePeakLength: 0.0,
                    NoseBoneHigh: 0.0,
                    ChimpBoneLength: 0.0,
                    ChimpHole: 0.0,
                    Ageing: -1,
                    EyesOpening: -0.5,
                    NosePeakLower: 0.0,
                    JawBoneBackLength: 0.0,
                    NosePeakHeight: 0.0,
                    CheeksBoneWidth: 0.0,
                    NoseBoneTwist: 0.0,
                    JawBoneWidth: 0.0,
                    EyebrowForward: 0.3,
                    Blemish: -1,
                    BodyBlemish: -1,
                },
                Hair: {
                    ChestHairColor: 0,
                    ChestHairType: -1,
                    HairColor: 6,
                    HairType: 18,
                    HairSecondaryColor: 26,
                    BeardType: 19,
                    EyebrowType: 28,
                    EyebrowOpacity: 1.0,
                    ChestHairOpacity: 1.0,
                    BeardColor: 0,
                    BeardOpacity: 1.0,
                    EyebrowColor: 0,
                },
                Makeup: {
                    BlushType: -1,
                    LipstickOpacity: 1.0,
                    LipstickColor: 0,
                    FullMakeupPrimaryColor: 0,
                    FullMakeupOpacity: 1.0,
                    LipstickType: -1,
                    BlushOpacity: 1.0,
                    FullMakeupType: -1,
                    BlushColor: 0,
                    FullMakeupSecondaryColor: 0,
                },
                Tattoos: [],
            },
            invincible: true,
            freeze: true,
            blockevents: true,
            scenario: 'world_human_hammering',
            flag: 1,
            target: {
                distance: 1.5,
                options: [
                    {
                        label: 'Rigonkmalk',
                        icon: 'global/question',
                        category: 'citizen',
                        action: async () => {
                            this.notifier.notify('Des travaux, encore des travaux... Un travail démoniaque...', 'info');
                        },
                    },
                ],
            },
        });
    }

    private async createPedOneiluj() {
        await this.targetFactory.createForPed({
            model: 'mp_m_freemode_01',
            coords: toVector4Object([-1597.12, -3010.6, -80.01, 103.11]),
            components: {
                3: [22, 0, 0],
                4: [VanillaComponentDrawableIndexMaxValue[PlayerPedHash.Male][Component.Legs] + 1, 2, 0],
                5: [VanillaComponentDrawableIndexMaxValue[PlayerPedHash.Male][Component.Bag] + 2, 1, 0],
                6: [51, 0, 0],
                7: [VanillaComponentDrawableIndexMaxValue[PlayerPedHash.Male][Component.Accessories] + 4, 0, 0],
                8: [VanillaComponentDrawableIndexMaxValue[PlayerPedHash.Male][Component.Undershirt] + 4, 0, 0],
                9: [VanillaComponentDrawableIndexMaxValue[PlayerPedHash.Male][Component.BodyArmor] + 8, 0, 0],
                11: [VanillaComponentDrawableIndexMaxValue[PlayerPedHash.Male][Component.Tops] + 2, 2, 0],
            },
            props: {
                0: [VanillaPropDrawableIndexMaxValue[PlayerPedHash.Male][Prop.Hat] + 6, 0, 0],
            },
            skin: {
                Model: { Father: 43, ShapeMix: 0.5, SkinMix: 0.6, Mother: 30, Hash: 1885233650 },
                FaceTrait: {
                    CheeksBoneHigh: 0.0,
                    NosePeakLength: 0.0,
                    ChimpBoneWidth: -0.6,
                    NoseWidth: 0.8,
                    ChimpBoneLength: 0.0,
                    ChimpHole: 0.0,
                    JawBoneWidth: 0.0,
                    Ageing: 3,
                    EyebrowHigh: 0.0,
                    NeckThickness: 0.0,
                    NoseBoneHigh: 0.0,
                    CheeksBoneWidth: 0.0,
                    Moles: 8,
                    ChimpBoneLower: 0.0,
                    EyeColor: 3,
                    BodyBlemish: 0,
                    JawBoneBackLength: 0.0,
                    CheeksWidth: 0.0,
                    Complexion: 0,
                    Blemish: -1,
                    NosePeakLower: 0.0,
                    NoseBoneTwist: 0.0,
                    EyebrowForward: 1.0,
                    AddBodyBlemish: -1,
                    EyesOpening: 0.0,
                    NosePeakHeight: 0.0,
                    LipsThickness: 0.0,
                },
                Hair: {
                    BeardType: 11,
                    BeardColor: 0,
                    EyebrowColor: 0,
                    ChestHairType: 0,
                    BeardOpacity: 1.0,
                    HairSecondaryColor: 0,
                    ChestHairOpacity: 1.0,
                    ChestHairColor: 0,
                    HairColor: 0,
                    EyebrowType: 9,
                    EyebrowOpacity: 1.0,
                    HairType: 0,
                },
                Makeup: {
                    FullMakeupType: -1,
                    LipstickOpacity: 1.0,
                    BlushOpacity: 1.0,
                    FullMakeupOpacity: 1.0,
                    LipstickType: -1,
                    LipstickColor: 0,
                    FullMakeupPrimaryColor: 0,
                    FullMakeupSecondaryColor: 0,
                    BlushType: -1,
                    BlushColor: 0,
                },
                Tattoos: [],
            },
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'mini@strip_club@lap_dance@ld_girl_a_song_a_p1',
            anim: 'ld_girl_a_song_a_p1_f',
            flag: 1,
            target: {
                distance: 1.5,
                options: [
                    {
                        label: 'Oneiluj',
                        icon: 'global/question',
                        category: 'citizen',
                        action: async () => {
                            this.notifier.notify(
                                "Il est vrai j'ai beaucoup d'adversaires. Et sur le côté quelques ennemis refoulés.",
                                'info'
                            );
                        },
                    },
                ],
            },
        });
    }

    private async createPedLasbou() {
        await this.targetFactory.createForPed({
            model: 'mp_m_freemode_01',
            coords: toVector4Object([-1597.46, -3012.67, -80.01, 86.66]),
            components: {
                3: [22, 0, 0],
                4: [VanillaComponentDrawableIndexMaxValue[PlayerPedHash.Male][Component.Legs] + 8, 0, 0],
                5: [VanillaComponentDrawableIndexMaxValue[PlayerPedHash.Male][Component.Bag] + 2, 1, 0],
                6: [51, 0, 0],
                7: [VanillaComponentDrawableIndexMaxValue[PlayerPedHash.Male][Component.Accessories] + 4, 0, 0],
                8: [VanillaComponentDrawableIndexMaxValue[PlayerPedHash.Male][Component.Undershirt] + 4, 0, 0],
                9: [VanillaComponentDrawableIndexMaxValue[PlayerPedHash.Male][Component.BodyArmor] + 8, 0, 0],
                11: [VanillaComponentDrawableIndexMaxValue[PlayerPedHash.Male][Component.Tops] + 2, 3, 0],
            },
            props: {
                0: [VanillaPropDrawableIndexMaxValue[PlayerPedHash.Male][Prop.Hat] + 7, 0, 0],
                1: [3, 0, 0],
            },
            skin: {
                Model: { SkinMix: 0.5, ShapeMix: 0.5, Mother: 26, Father: 43, Hash: 1885233650 },
                FaceTrait: {
                    CheeksBoneHigh: 0.0,
                    NosePeakLength: 0.0,
                    Blemish: -1,
                    NoseWidth: 0.0,
                    ChimpBoneLength: 0.0,
                    ChimpHole: 0.0,
                    JawBoneWidth: 0.0,
                    Ageing: 0,
                    EyebrowHigh: 0.0,
                    NeckThickness: 0.0,
                    NoseBoneHigh: 0.0,
                    NosePeakHeight: 0.0,
                    Moles: -1,
                    BodyBlemish: 0,
                    EyeColor: 0,
                    NosePeakLower: 0.0,
                    JawBoneBackLength: 0.0,
                    CheeksWidth: 0.0,
                    Complexion: -1,
                    ChimpBoneWidth: 0.0,
                    AddBodyBlemish: -1,
                    NoseBoneTwist: 0.0,
                    EyebrowForward: 0.0,
                    CheeksBoneWidth: 0.0,
                    EyesOpening: 0.0,
                    ChimpBoneLower: 0.0,
                    LipsThickness: 0.0,
                },
                Hair: {
                    BeardType: 10,
                    HairColor: 0,
                    EyebrowColor: 0,
                    EyebrowOpacity: 1.0,
                    BeardOpacity: 1.0,
                    HairSecondaryColor: 0,
                    ChestHairOpacity: 1.0,
                    ChestHairColor: 0,
                    EyebrowType: 0,
                    BeardColor: 0,
                    ChestHairType: 3,
                    HairType: 18,
                },
                Makeup: {
                    FullMakeupType: -1,
                    LipstickOpacity: 1.0,
                    BlushOpacity: 1.0,
                    FullMakeupOpacity: 1.0,
                    FullMakeupPrimaryColor: 0,
                    LipstickColor: 0,
                    LipstickType: -1,
                    FullMakeupSecondaryColor: 0,
                    BlushType: -1,
                    BlushColor: 0,
                },
                Tattoos: [],
            },
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'anim@amb@nightclub@mini@dance@dance_solo@female@var_a@',
            anim: 'med_center_down',
            flag: 1,
            target: {
                distance: 1.5,
                options: [
                    {
                        label: 'Lasbou',
                        icon: 'global/question',
                        category: 'citizen',
                        action: async () => {
                            this.notifier.notify(
                                "Rassurez vous tout va bien la situation est sous contrôle ... Oui Commissionner ? c'est classé secret défense ? très bien, Le Commissionner m'informe que c'est classé secret défense.  Sujet suivant s'il vous plait.",
                                'info'
                            );
                        },
                    },
                ],
            },
        });
    }

    private async createPedDaelbhas() {
        await this.targetFactory.createForPed({
            model: 'mp_m_freemode_01',
            coords: toVector4Object([-1599.01, -3010.93, -80.01, 114.82]),
            components: {
                3: [11, 0, 0],
                4: [VanillaComponentDrawableIndexMaxValue[PlayerPedHash.Male][Component.Legs] + 1, 1, 0],
                5: [VanillaComponentDrawableIndexMaxValue[PlayerPedHash.Male][Component.Bag] + 1, 0, 0],
                6: [51, 0, 0],
                8: [VanillaComponentDrawableIndexMaxValue[PlayerPedHash.Male][Component.Undershirt] + 3, 0, 0],
                11: [VanillaComponentDrawableIndexMaxValue[PlayerPedHash.Male][Component.Tops] + 4, 1, 0],
            },
            props: {
                0: [VanillaPropDrawableIndexMaxValue[PlayerPedHash.Male][Prop.Hat] + 9, 0, 0],
            },
            skin: {
                Model: { Mother: 45, ShapeMix: 0.25, Father: 42, SkinMix: 0.5, Hash: 1885233650 },
                FaceTrait: {
                    ChimpBoneWidth: 0.0,
                    BodyBlemish: -1,
                    Blemish: -1,
                    EyesOpening: 0.0,
                    AddBodyBlemish: -1,
                    EyebrowForward: 0.0,
                    JawBoneBackLength: 0.0,
                    ChimpBoneLower: 0.0,
                    LipsThickness: 0.0,
                    NoseBoneTwist: 0.0,
                    NoseWidth: 0.0,
                    Ageing: -1,
                    NeckThickness: 0.0,
                    CheeksWidth: 0.0,
                    NosePeakLength: 0.0,
                    JawBoneWidth: 0.0,
                    CheeksBoneWidth: 0.0,
                    ChimpBoneLength: 0.0,
                    Complexion: -1,
                    NoseBoneHigh: 0.0,
                    EyebrowHigh: 0.0,
                    NosePeakLower: 0.0,
                    ChimpHole: 0.0,
                    Moles: -1,
                    EyeColor: 3,
                    NosePeakHeight: 0.0,
                    CheeksBoneHigh: 0.0,
                },
                Hair: {
                    ChestHairOpacity: 1.0,
                    BeardType: 5,
                    ChestHairType: -1,
                    HairColor: 0,
                    EyebrowColor: 3,
                    EyebrowOpacity: 0.75,
                    BeardColor: 0,
                    ChestHairColor: 0,
                    BeardOpacity: 1.0,
                    HairType: 19,
                    HairSecondaryColor: 28,
                    EyebrowType: 0,
                },
                Makeup: {
                    FullMakeupOpacity: 1.0,
                    BlushOpacity: 1.0,
                    LipstickOpacity: 1.0,
                    BlushColor: 0,
                    LipstickType: -1,
                    BlushType: -1,
                    FullMakeupSecondaryColor: 0,
                    FullMakeupPrimaryColor: 0,
                    LipstickColor: 0,
                    FullMakeupType: -1,
                },
                Tattoos: [],
            },
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'anim@amb@nightclub@mini@dance@dance_solo@female@var_a@',
            anim: 'low_center_down',
            flag: 1,
            target: {
                distance: 1.5,
                options: [
                    {
                        label: 'Daelbhas',
                        icon: 'global/question',
                        category: 'citizen',
                        action: async () => {
                            this.notifier.notify("L'enfer, c'est les Autres.", 'info');
                        },
                    },
                ],
            },
        });
    }

    private async createPedOjymas() {
        await this.targetFactory.createForPed({
            model: 'mp_m_freemode_01',
            coords: toVector4Object([-1596.14, -3007.86, -79.21, 164.03]),
            components: {
                3: [2, 0, 0],
                4: [121, 0, 0],
                6: [24, 0, 0],
                8: [2, 0, 0],
                11: [327, 0, 0],
            },
            props: {
                0: [VanillaPropDrawableIndexMaxValue[PlayerPedHash.Male][Prop.Hat] + 9, 0, 0],
            },
            skin: {
                Model: { SkinMix: 1, ShapeMix: 0, Mother: 31, Father: 8, Hash: 1885233650 },
                FaceTrait: {
                    CheeksBoneHigh: 0.1,
                    EyesOpening: 0.6,
                    NoseBoneTwist: 0,
                    EyeColor: 3,
                    NosePeakLength: 1,
                    JawBoneBackLength: 0,
                    Ageing: -1,
                    AddBodyBlemish: -1,
                    NosePeakHeight: -0.4,
                    Moles: -1,
                    Complexion: -1,
                    Blemish: -1,
                    ChimpBoneWidth: -1,
                    CheeksBoneWidth: -0.9,
                    BodyBlemish: -1,
                    ChimpBoneLength: -1,
                    ChimpHole: 0,
                    NeckThickness: 0,
                    NoseWidth: -1,
                    EyebrowHigh: 0,
                    NoseBoneHigh: 1,
                    JawBoneWidth: 0.5,
                    CheeksWidth: -1,
                    LipsThickness: 1,
                    ChimpBoneLower: -1,
                    EyebrowForward: 1,
                    NosePeakLower: 0.4,
                },
                Hair: {
                    ChestHairColor: 0,
                    EyebrowColor: 58,
                    HairSecondaryColor: 29,
                    BeardType: 2,
                    EyebrowOpacity: 1,
                    HairType: 21,
                    EyebrowType: 6,
                    BeardOpacity: 0.95,
                    HairColor: 3,
                    BeardColor: 0,
                    ChestHairOpacity: 1,
                    ChestHairType: 0,
                },
                Makeup: {
                    FullMakeupOpacity: 1,
                    LipstickType: -1,
                    LipstickColor: 0,
                    FullMakeupSecondaryColor: 0,
                    BlushOpacity: 1,
                    LipstickOpacity: 1,
                    FullMakeupPrimaryColor: 0,
                    FullMakeupDefaultColor: true,
                    BlushColor: 0,
                    FullMakeupType: -1,
                    BlushType: -1,
                },
                Tattoos: [
                    {
                        Collection: 598190139,
                        Overlay: -189671992,
                    },
                    {
                        Collection: 1926256505,
                        Overlay: -2114317157,
                    },
                    {
                        Collection: -1398869298,
                        Overlay: -1092860637,
                    },
                    {
                        Collection: -1398869298,
                        Overlay: -434629734,
                    },
                    {
                        Collection: 1926256505,
                        Overlay: -862474356,
                    },
                ],
            },
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'anim@amb@nightclub@mini@dance@dance_solo@female@var_a@',
            anim: 'med_center_down',
            flag: 1,
            target: {
                distance: 1.5,
                options: [
                    {
                        label: 'Ojymas',
                        icon: 'global/question',
                        category: 'citizen',
                        action: async () => {
                            this.notifier.notify(
                                "Tu dis avoir vécu l'enfer ces derniers jours ? Arrête tes conneries avant que je ne te foudroie.",
                                'info'
                            );
                        },
                    },
                ],
            },
        });
    }

    private async createPedPoulpitor() {
        await this.targetFactory.createForPed({
            model: 'mp_m_freemode_01',
            coords: toVector4Object([-1587.23, -3012.29, -77.0, 210.38]),
            components: {
                3: [4, 0, 0],
                4: [24, 5, 0],
                6: [104, 3, 0],
                8: [146, 0, 0],
                11: [31, 5, 0],
            },
            props: {
                0: [VanillaPropDrawableIndexMaxValue[PlayerPedHash.Male][Prop.Hat] + 9, 0, 0],
                1: [8, 1, 0],
                6: [16, 1, 0],
            },
            skin: {
                Model: { Father: 1, Mother: 22, ShapeMix: 0.05, Hash: 1885233650, SkinMix: 0.35 },
                FaceTrait: {
                    NoseBoneTwist: 0.0,
                    NoseWidth: 0.2,
                    ChimpBoneLower: 0.2,
                    NeckThickness: 0.6,
                    ChimpBoneLength: -0.3,
                    LipsThickness: -0.3,
                    Complexion: -1,
                    EyesOpening: -0.3,
                    JawBoneWidth: 0.3,
                    ChimpBoneWidth: -0.4,
                    EyebrowForward: 0.6,
                    BodyBlemish: -1,
                    NosePeakHeight: -0.5,
                    CheeksBoneHigh: -0.6,
                    NosePeakLower: -0.1,
                    NoseBoneHigh: -0.3,
                    AddBodyBlemish: -1,
                    JawBoneBackLength: -0.2,
                    CheeksWidth: -0.3,
                    ChimpHole: 0.0,
                    EyeColor: -1,
                    NosePeakLength: -0.3,
                    Blemish: -1,
                    EyebrowHigh: 0.0,
                    CheeksBoneWidth: -0.4,
                    Ageing: 4,
                    Moles: -1,
                },
                Hair: {
                    EyebrowType: 6,
                    BeardType: 10,
                    BeardOpacity: 1.0,
                    ChestHairType: 0,
                    EyebrowOpacity: 1.0,
                    ChestHairOpacity: 1.0,
                    HairColor: 3,
                    BeardColor: 0,
                    HairType: 5,
                    HairSecondaryColor: 29,
                    EyebrowColor: 1,
                    ChestHairColor: 0,
                },
                Makeup: {
                    FullMakeupDefaultColor: true,
                    BlushColor: 0,
                    LipstickOpacity: 1.0,
                    FullMakeupPrimaryColor: 0,
                    BlushType: -1,
                    LipstickColor: 0,
                    FullMakeupOpacity: 1.0,
                    FullMakeupSecondaryColor: 0,
                    BlushOpacity: 1.0,
                    LipstickType: -1,
                    FullMakeupType: -1,
                },
                Tattoos: [],
            },
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'missfbi3_party_d',
            anim: 'stand_talk_loop_a_male1',
            flag: 1,
            target: {
                distance: 1.5,
                options: [
                    {
                        label: 'Poulpitor',
                        icon: 'global/question',
                        category: 'citizen',
                        action: async () => {
                            this.notifier.notify(
                                'Moi, de mon temps, pour être récompenser, fallait sauter sur des éoliennes... Tout se perd, je vous jure... Les zombies auraient dû gagner, je vous le dis moi...',
                                'info'
                            );
                        },
                    },
                ],
            },
        });
    }

    private async createPedDream() {
        await this.targetFactory.createForPed({
            model: 'mp_m_freemode_01',
            coords: toVector4Object([-1587.15, -3013.89, -77.01, 320.51]),
            components: {
                3: [14, 0, 0],
                4: [0, 14, 0],
                5: [86, 25, 0],
                6: [1, 0, 0],
                8: [0, 4, 0],
                11: [88, 11, 0],
            },
            props: {
                0: [VanillaPropDrawableIndexMaxValue[PlayerPedHash.Male][Prop.Hat] + 9, 0, 0],
            },
            skin: {
                Model: { SkinMix: 0.5, ShapeMix: 0.15, Father: 20, Mother: 32, Hash: 1885233650 },
                FaceTrait: {
                    CheeksBoneHigh: 0.0,
                    NosePeakLength: 0.1,
                    ChimpBoneWidth: -0.3,
                    NoseWidth: -0.9,
                    ChimpBoneLength: -0.1,
                    ChimpHole: 0.0,
                    JawBoneWidth: 0.0,
                    Ageing: -1,
                    EyebrowHigh: 0.0,
                    NeckThickness: 0.0,
                    NoseBoneHigh: 0.0,
                    LipsThickness: 0.0,
                    Moles: 3,
                    ChimpBoneLower: -0.3,
                    EyeColor: 11,
                    NosePeakLower: 0.0,
                    JawBoneBackLength: 0.0,
                    CheeksWidth: 0.0,
                    Complexion: -1,
                    NoseBoneTwist: 0.0,
                    CheeksBoneWidth: 0.0,
                    Blemish: -1,
                    EyebrowForward: 0.0,
                    AddBodyBlemish: -1,
                    EyesOpening: 0.2,
                    BodyBlemish: -1,
                    NosePeakHeight: 0.0,
                },
                Hair: {
                    BeardType: -1,
                    HairColor: 31,
                    EyebrowColor: 60,
                    BeardColor: 0,
                    BeardOpacity: 1.0,
                    HairSecondaryColor: 33,
                    ChestHairOpacity: 1.0,
                    ChestHairColor: 0,
                    ChestHairType: -1,
                    EyebrowOpacity: 1.0,
                    EyebrowType: 0,
                    HairType: 33,
                },
                Makeup: {
                    FullMakeupType: -1,
                    LipstickOpacity: 1.0,
                    BlushOpacity: 1.0,
                    FullMakeupSecondaryColor: 0,
                    LipstickType: -1,
                    LipstickColor: 0,
                    FullMakeupPrimaryColor: 0,
                    FullMakeupOpacity: 1.0,
                    BlushType: -1,
                    BlushColor: 0,
                },
                Tattoos: [],
            },
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'missfbi3_party_d',
            anim: 'stand_talk_loop_b_male2',
            flag: 1,
            target: {
                distance: 1.5,
                options: [
                    {
                        label: 'DreamXZE',
                        icon: 'global/question',
                        category: 'citizen',
                        action: async () => {
                            this.notifier.notify(
                                "Quoi.. Déjà fini? Tu as pourtant l'air effrayé, on aurait peut-être dû vous laisser avec les zombies..",
                                'info'
                            );
                        },
                    },
                ],
            },
        });
    }

    private async createPedBalrock() {
        await this.targetFactory.createForPed({
            model: 'mp_m_freemode_01',
            coords: toVector4Object([-1591.05, -3012.7, -77.01, 90.85]),
            components: {
                1: [0, 0, 0],
                3: [1, 0, 0],
                4: [24, 1, 0],
                7: [0, 0, 0],
                6: [10, 0, 0],
                9: [0, 0, 0],
                8: [15, 0, 0],
                11: [348, 9, 0],
                10: [0, 0, 0],
            },
            props: {
                0: [VanillaPropDrawableIndexMaxValue[PlayerPedHash.Male][Prop.Hat] + 9, 0, 0],
                1: [23, 9, 0],
                2: [32, 1, 0],
                6: [4, 1, 0],
            },
            skin: {
                Model: { SkinMix: 0.55, Mother: 26, Father: 44, ShapeMix: 0.55, Hash: 1885233650 },
                FaceTrait: {
                    JawBoneBackLength: 0.1,
                    ChimpHole: 0.0,
                    CheeksBoneWidth: 0.0,
                    EyebrowForward: 0.0,
                    CheeksWidth: 0.0,
                    CheeksBoneHigh: 0.0,
                    ChimpBoneLength: 0.0,
                    NosePeakLower: 0.0,
                    EyeColor: 2,
                    NosePeakHeight: -0.3,
                    ChimpBoneWidth: 0.0,
                    ChimpBoneLower: 0.0,
                    NoseWidth: -0.3,
                    AddBodyBlemish: -1,
                    NosePeakLength: 0.1,
                    NeckThickness: 0.1,
                    LipsThickness: -0.8,
                    JawBoneWidth: 0.2,
                    BodyBlemish: -1,
                    Ageing: -1,
                    Blemish: -1,
                    EyesOpening: -0.2,
                    NoseBoneHigh: 0.0,
                    EyebrowHigh: 0.0,
                    NoseBoneTwist: 0.0,
                    Complexion: -1,
                    Moles: -1,
                },
                Hair: {
                    ChestHairOpacity: 1.0,
                    HairColor: 60,
                    BeardColor: 0,
                    EyebrowType: 12,
                    ChestHairColor: 0,
                    BeardOpacity: 1.0,
                    EyebrowColor: 0,
                    ChestHairType: 2,
                    HairSecondaryColor: 0,
                    BeardType: 10,
                    HairType: 0,
                    EyebrowOpacity: 1.0,
                },
                Makeup: {
                    LipstickColor: 0,
                    FullMakeupSecondaryColor: 0,
                    LipstickOpacity: 1.0,
                    LipstickType: -1,
                    BlushColor: 0,
                    BlushType: -1,
                    FullMakeupPrimaryColor: 0,
                    FullMakeupDefaultColor: true,
                    FullMakeupOpacity: 1.0,
                    FullMakeupType: -1,
                    BlushOpacity: 1.0,
                },
                Tattoos: [
                    {
                        Collection: -1056335443,
                        Overlay: 1617489838,
                    },
                    {
                        Collection: 598190139,
                        Overlay: -1128139527,
                    },
                    {
                        Collection: -240234547,
                        Overlay: -1431574022,
                    },
                    {
                        Collection: 484754152,
                        Overlay: 956061600,
                    },
                    {
                        Collection: 1616273011,
                        Overlay: -54254731,
                    },
                    {
                        Collection: -2086773,
                        Overlay: 193320466,
                    },
                    {
                        Collection: -1719270477,
                        Overlay: -754981437,
                    },
                    {
                        Collection: -363871405,
                        Overlay: -1512326404,
                    },
                    {
                        Collection: -363871405,
                        Overlay: -1512326404,
                    },
                    {
                        Collection: -1719270477,
                        Overlay: -754981437,
                    },
                ],
            },
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'missfbi3_party_d',
            anim: 'stand_talk_loop_b_male2',
            flag: 1,
            target: {
                distance: 1.5,
                options: [
                    {
                        label: 'Balrock',
                        icon: 'global/question',
                        category: 'citizen',
                        action: async () => {
                            this.notifier.notify(
                                "Une histoire commence, une autre continue, puis une autre ce fini, tu es le héros de ta propre histoire, attention qu'elle ne se finisse pas rapidement pour toi, bouge de là !",
                                'info'
                            );
                        },
                    },
                ],
            },
        });
    }

    private async createPedMarverikG() {
        await this.targetFactory.createForPed({
            model: 'mp_m_freemode_01',
            coords: toVector4Object([-1577.03, -3013.47, -80.01, 44.18]),
            components: {
                3: [20, 0, 0],
                4: [24, 5, 0],
                6: [109, 3, 0],
                7: [178, 7, 0],
                8: [73, 3, 0],
                9: [0, 0, 0],
                10: [0, 0, 0],
                11: [321, 0, 0],
            },
            props: {
                0: [21, 3, 0],
                1: [3, 0, 0],
                2: [26, 2, 0],
            },
            skin: {
                Model: {
                    Father: 44,
                    Mother: 21,
                    ShapeMix: 0,
                    Hash: 1885233650,
                    SkinMix: 0.4,
                },
                FaceTrait: {
                    NoseBoneTwist: 0,
                    NoseWidth: 0,
                    ChimpBoneLower: 0,
                    NeckThickness: 0,
                    ChimpBoneLength: 0,
                    LipsThickness: 0,
                    Complexion: -1,
                    EyesOpening: 0,
                    JawBoneWidth: 0,
                    ChimpBoneWidth: -0.6,
                    EyebrowForward: 0.1,
                    BodyBlemish: 0,
                    NosePeakHeight: 0,
                    CheeksBoneHigh: 0,
                    NosePeakLower: 0,
                    NoseBoneHigh: 0,
                    NosePeakLength: 0,
                    AddBodyBlemish: -1,
                    CheeksWidth: 0,
                    ChimpHole: 0,
                    EyeColor: 2,
                    JawBoneBackLength: 0,
                    Blemish: -1,
                    EyebrowHigh: 0,
                    CheeksBoneWidth: 0,
                    Ageing: 8,
                    Moles: -1,
                },
                Hair: {
                    EyebrowType: 17,
                    BeardType: 18,
                    BeardOpacity: 1,
                    BeardColor: 29,
                    EyebrowOpacity: 1,
                    ChestHairOpacity: 1,
                    HairColor: 29,
                    ChestHairColor: 0,
                    HairType: 7,
                    HairSecondaryColor: 29,
                    EyebrowColor: 29,
                    ChestHairType: -1,
                },
                Makeup: {
                    FullMakeupDefaultColor: true,
                    BlushColor: 0,
                    LipstickOpacity: 1,
                    FullMakeupPrimaryColor: 0,
                    BlushType: -1,
                    LipstickColor: 0,
                    FullMakeupOpacity: 1,
                    FullMakeupSecondaryColor: 0,
                    BlushOpacity: 1,
                    LipstickType: -1,
                    FullMakeupType: -1,
                },
                Tattoos: [
                    {
                        Collection: -363871405,
                        Overlay: -770265298,
                    },
                    {
                        Collection: -363871405,
                        Overlay: -1170154756,
                    },
                    {
                        Collection: -363871405,
                        Overlay: -1512326404,
                    },
                    {
                        Collection: -363871405,
                        Overlay: 335386038,
                    },
                    {
                        Collection: -363871405,
                        Overlay: -1732002225,
                    },
                    {
                        Collection: -240234547,
                        Overlay: -1431574022,
                    },
                    {
                        Collection: -2086773,
                        Overlay: -1953737187,
                    },
                    {
                        Collection: 598190139,
                        Overlay: 1544332704,
                    },
                    {
                        Collection: -975527441,
                        Overlay: 34276608,
                    },
                    {
                        Collection: 1616273011,
                        Overlay: 1832021545,
                    },
                    {
                        Collection: 601646824,
                        Overlay: -1509810048,
                    },
                    {
                        Collection: 601646824,
                        Overlay: 2057657792,
                    },
                ],
            },
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'move_characters@tracey@core@',
            anim: 'idle',
            flag: 49,
            target: {
                options: [
                    {
                        label: 'MarverikG',
                        icon: 'global/question',
                        category: 'citizen',
                        action: async () => {
                            this.notifier.notify(
                                'Tu veux vraiment me chercher après avoir vécu tout ça ces derniers jours? T’es fou ou quoi?',
                                'info'
                            );
                        },
                    },
                ],
                distance: 1.5,
            },
        });
    }

    private async createPedSilverlord() {
        await this.targetFactory.createForPed({
            model: 'mp_m_freemode_01',
            coords: toVector4Object([-1617.17, -3013.36, -76.21, 228.44]),
            components: {
                11: [50, 2, 0],
                10: [0, 0, 0],
                1: [0, 0, 0],
                3: [1, 0, 0],
                4: [75, 1, 0],
                6: [1, 2, 0],
                7: [0, 0, 0],
                8: [15, 0, 0],
                9: [0, 0, 0],
            },
            props: {
                0: [58, 1, 0],
                1: [5, 1, 0],
            },
            skin: {
                Model: { Father: 20, Mother: 26, ShapeMix: 0.4, Hash: 1885233650, SkinMix: 0.45 },
                FaceTrait: {
                    NoseBoneTwist: 0,
                    NoseWidth: -0.5,
                    Ageing: -1,
                    NeckThickness: 0.1,
                    ChimpBoneLength: 0,
                    LipsThickness: 0,
                    Complexion: -1,
                    EyesOpening: 0.1,
                    JawBoneWidth: -0.2,
                    ChimpBoneWidth: 0,
                    EyebrowForward: 0,
                    BodyBlemish: 2,
                    NosePeakHeight: 0.1,
                    CheeksBoneHigh: 0,
                    NosePeakLower: 0,
                    NoseBoneHigh: 0,
                    Moles: -1,
                    ChimpHole: 0,
                    CheeksWidth: 0,
                    EyeColor: 1,
                    AddBodyBlemish: -1,
                    JawBoneBackLength: 0,
                    Blemish: -1,
                    EyebrowHigh: 0,
                    CheeksBoneWidth: 0,
                    NosePeakLength: 0,
                    ChimpBoneLower: 0.2,
                },
                Hair: {
                    EyebrowType: 23,
                    BeardType: 7,
                    BeardOpacity: 0.95,
                    ChestHairType: 0,
                    EyebrowOpacity: 1,
                    ChestHairOpacity: 1,
                    EyebrowColor: 1,
                    BeardColor: 0,
                    HairType: 4,
                    HairSecondaryColor: 0,
                    HairColor: 3,
                    ChestHairColor: 0,
                },
                Makeup: {
                    FullMakeupDefaultColor: true,
                    BlushColor: 0,
                    LipstickOpacity: 1,
                    FullMakeupType: -1,
                    BlushType: -1,
                    FullMakeupPrimaryColor: 0,
                    FullMakeupOpacity: 1,
                    BlushOpacity: 1,
                    FullMakeupSecondaryColor: 0,
                    LipstickType: -1,
                    LipstickColor: 0,
                },
                Tattoos: [],
            },
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'mp_fib_grab',
            anim: 'loop',
            flag: 1,
            target: {
                distance: 1.5,
                options: [
                    {
                        label: 'Silverlord',
                        icon: 'global/question',
                        category: 'citizen',
                        action: async () => {
                            this.notifier.notify(
                                "J'espère que t'as aimé les petites enquêtes. En espérant que la facture LSMC était pas trop salée !",
                                'info'
                            );
                        },
                    },
                ],
            },
        });
    }

    private async createPedAurelien() {
        await this.targetFactory.createForPed({
            model: 'mp_m_freemode_01',
            coords: toVector4Object([-1610.49, -3018.12, -76.2, 273.44]),
            components: {
                11: [122, 8, 0],
                10: [0, 0, 0],
                3: [1, 0, 0],
                4: [4, 0, 0],
                6: [31, 2, 0],
                7: [0, 0, 0],
                8: [65, 11, 0],
                9: [0, 0, 0],
            },
            props: {
                0: [VanillaPropDrawableIndexMaxValue[PlayerPedHash.Male][Prop.Hat] + 9, 0, 0],
            },
            skin: {
                Model: { SkinMix: 0.5, ShapeMix: 0.5, Mother: 29, Father: 4, Hash: 1885233650 },
                FaceTrait: {
                    CheeksBoneHigh: 0.0,
                    EyesOpening: 0.5,
                    NoseBoneTwist: 0.0,
                    EyeColor: 4,
                    NosePeakLength: 0.0,
                    JawBoneBackLength: 0.0,
                    NosePeakLower: 0.0,
                    ChimpBoneLower: 0.0,
                    CheeksBoneWidth: 0.0,
                    Moles: 0,
                    EyebrowForward: 0.0,
                    Blemish: -1,
                    ChimpBoneWidth: 0.4,
                    Complexion: -1,
                    ChimpBoneLength: 0.0,
                    NosePeakHeight: 0.0,
                    ChimpHole: 0.0,
                    AddBodyBlemish: -1,
                    NoseWidth: 0.0,
                    EyebrowHigh: 0.0,
                    NoseBoneHigh: 0.0,
                    JawBoneWidth: 1.0,
                    CheeksWidth: 0.0,
                    LipsThickness: 1.0,
                    NeckThickness: 0.0,
                    Ageing: -1,
                    BodyBlemish: -1,
                },
                Hair: {
                    ChestHairColor: 0,
                    EyebrowColor: 0,
                    HairSecondaryColor: 0,
                    BeardType: 0,
                    EyebrowOpacity: 1.0,
                    HairType: 12,
                    EyebrowType: 1,
                    HairColor: 58,
                    BeardOpacity: 1.0,
                    BeardColor: 0,
                    ChestHairOpacity: 1.0,
                    ChestHairType: 0,
                },
                Makeup: {
                    FullMakeupOpacity: 1.0,
                    LipstickType: -1,
                    LipstickOpacity: 1.0,
                    LipstickColor: 0,
                    BlushOpacity: 1.0,
                    BlushColor: 0,
                    FullMakeupSecondaryColor: 0,
                    FullMakeupDefaultColor: true,
                    FullMakeupPrimaryColor: 0,
                    FullMakeupType: -1,
                    BlushType: -1,
                },
                Tattoos: [],
            },
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'missheist_agency2aig_4',
            anim: 'look_plan_b_worker2',
            flag: 1,
            target: {
                distance: 1.5,
                options: [
                    {
                        label: 'Aurelien',
                        icon: 'global/question',
                        category: 'citizen',
                        action: async () => {
                            this.notifier.notify(
                                "Que les esprits d'Halloween vous accompagnent tout au long de la nuit. N'oubliez pas de rester prudents et de passer une effrayante et joyeuse soirée d'Halloween !",
                                'info'
                            );
                        },
                    },
                ],
            },
        });
    }

    private async createPedGuegette() {
        await this.targetFactory.createForPed({
            model: 'mp_f_freemode_01',
            coords: toVector4Object([-1610.35, -3016.71, -76.2, 229.07]),
            components: {
                3: [9, 0, 0],
                4: [VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Component.Legs] + 1, 0, 0],
                5: [VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Component.Bag], 0, 0],
                6: [52, 0, 0],
                7: [8, 0, 0],
                8: [
                    VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Component.Undershirt] + 4,
                    0,
                    0,
                ],
                9: [54, 9, 0],
                11: [VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Component.Tops] + 4, 0, 0],
                10: [VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Component.Decals] + 2, 4, 0],
            },
            props: {
                0: [VanillaPropDrawableIndexMaxValue[PlayerPedHash.Female][Prop.Hat] + 9, 0, 0],
                2: [7, 0, 0],
                6: [7, 1, 0],
            },
            skin: {
                Model: {
                    SkinMix: 0.5,
                    ShapeMix: 0.5,
                    Mother: 31,
                    Father: 42,
                    Hash: -1667301416,
                },
                FaceTrait: {
                    CheeksBoneHigh: 0,
                    EyesOpening: 0,
                    NoseBoneTwist: 0,
                    EyeColor: -1,
                    NosePeakLength: 0,
                    JawBoneBackLength: 0,
                    NosePeakLower: 0,
                    AddBodyBlemish: -1,
                    NosePeakHeight: 0,
                    Moles: -1,
                    CheeksBoneWidth: 0,
                    Blemish: -1,
                    ChimpBoneWidth: 0,
                    Complexion: -1,
                    BodyBlemish: -1,
                    ChimpBoneLower: 0,
                    ChimpHole: 0,
                    EyebrowForward: 0,
                    Ageing: -1,
                    EyebrowHigh: 0,
                    NoseBoneHigh: 0,
                    JawBoneWidth: 0,
                    CheeksWidth: 0,
                    LipsThickness: 0,
                    NoseWidth: -0.8,
                    NeckThickness: 0,
                    ChimpBoneLength: 0,
                },
                Hair: {
                    ChestHairColor: 0,
                    EyebrowColor: 63,
                    HairSecondaryColor: 53,
                    HairColor: 29,
                    EyebrowOpacity: 1,
                    HairType: 8,
                    EyebrowType: 0,
                    BeardOpacity: 1,
                    ChestHairOpacity: 1,
                    BeardColor: 0,
                    BeardType: -1,
                    ChestHairType: -1,
                },
                Makeup: {
                    FullMakeupOpacity: 1,
                    LipstickType: -1,
                    LipstickColor: 0,
                    FullMakeupPrimaryColor: 0,
                    BlushOpacity: 1,
                    BlushColor: 0,
                    FullMakeupSecondaryColor: 0,
                    FullMakeupDefaultColor: true,
                    LipstickOpacity: 1,
                    FullMakeupType: -1,
                    BlushType: -1,
                },
                Tattoos: [
                    {
                        Collection: 598190139,
                        Overlay: 1953024330,
                    },
                    {
                        Collection: -363871405,
                        Overlay: 1152609891,
                    },
                    {
                        Collection: -363871405,
                        Overlay: -1009472289,
                    },
                    {
                        Collection: -1201369729,
                        Overlay: 547139312,
                    },
                    {
                        Collection: -1398869298,
                        Overlay: 258827560,
                    },
                    {
                        Collection: -1398869298,
                        Overlay: -1004417654,
                    },
                    {
                        Collection: -1368357453,
                        Overlay: -741632440,
                    },
                    {
                        Collection: -240234547,
                        Overlay: -2015343582,
                    },
                    {
                        Collection: -1398869298,
                        Overlay: 1157448359,
                    },
                    {
                        Collection: -1368357453,
                        Overlay: -1621104712,
                    },
                    {
                        Collection: -363871405,
                        Overlay: -1677889748,
                    },
                    {
                        Collection: -1398869298,
                        Overlay: 552929095,
                    },
                    {
                        Collection: -1201369729,
                        Overlay: -1897002095,
                    },
                    {
                        Collection: -1398869298,
                        Overlay: -87213624,
                    },
                    {
                        Collection: -1398869298,
                        Overlay: 552929095,
                    },
                    {
                        Collection: -1398869298,
                        Overlay: 552929095,
                    },
                    {
                        Collection: -1398869298,
                        Overlay: 893595891,
                    },
                    {
                        Collection: -1398869298,
                        Overlay: -434629734,
                    },
                    {
                        Collection: -2086773,
                        Overlay: 990002533,
                    },
                    {
                        Collection: -1398869298,
                        Overlay: 43105745,
                    },
                    {
                        Collection: -1398869298,
                        Overlay: -1758069771,
                    },
                    {
                        Collection: -1398869298,
                        Overlay: -673512330,
                    },
                    {
                        Collection: -1398869298,
                        Overlay: -1445222284,
                    },
                    {
                        Collection: -363871405,
                        Overlay: -511607931,
                    },
                ],
            },
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'move_characters@tracey@core@',
            anim: 'idle',
            flag: 1,
            target: {
                distance: 1.5,
                options: [
                    {
                        label: 'Guegette',
                        icon: 'global/question',
                        category: 'citizen',
                        action: async () => {
                            this.notifier.notify('Lâchez votre arme !... Et heuuu... le cerceuil aussi.', 'info');
                        },
                    },
                ],
            },
        });
    }

    private async createPedTriplaxion() {
        await this.targetFactory.createForPed({
            model: 'mp_m_freemode_01',
            coords: toVector4Object([-1577.7, -3012.06, -80.01, 236.24]),
            components: {
                2: [19, 0, 0],
                3: [4, 0, 0],
                4: [24, 0, 0],
                6: [40, 9, 0],
                7: [178, 7, 0],
                8: [15, 0, 0],
                11: [348, 3, 0],
            },
            props: {
                0: [VanillaPropDrawableIndexMaxValue[PlayerPedHash.Male][Prop.Hat] + 9, 0, 0],
                1: [33, 2, 0],
            },
            skin: {
                Model: {
                    ShapeMix: 0,
                    Mother: 31,
                    SkinMix: 0.65,
                    Hash: 1885233650,
                    Father: 44,
                },
                FaceTrait: {
                    NoseBoneHigh: 0,
                    NoseWidth: 0,
                    BodyBlemish: -1,
                    CheeksBoneHigh: 0,
                    ChimpBoneWidth: 0,
                    ChimpBoneLower: 0,
                    EyebrowForward: 0,
                    NeckThickness: 0,
                    NosePeakLength: 0,
                    CheeksWidth: 0,
                    AddBodyBlemish: -1,
                    ChimpHole: 0,
                    JawBoneWidth: 0,
                    NosePeakHeight: 0,
                    EyeColor: 3,
                    Blemish: -1,
                    NoseBoneTwist: 0,
                    EyebrowHigh: 0,
                    CheeksBoneWidth: 0,
                    Moles: -1,
                    Ageing: 2,
                    ChimpBoneLength: 0,
                    JawBoneBackLength: 0,
                    LipsThickness: 0,
                    NosePeakLower: 0,
                    EyesOpening: -0.2,
                    Complexion: -1,
                },
                Hair: {
                    HairColor: 29,
                    BeardColor: 29,
                    BeardType: 10,
                    ChestHairColor: 0,
                    BeardOpacity: 1,
                    EyebrowColor: 27,
                    HairType: 19,
                    EyebrowOpacity: 1,
                    EyebrowType: 12,
                    HairSecondaryColor: 61,
                    ChestHairType: -1,
                    ChestHairOpacity: 1,
                },
                Makeup: {
                    LipstickOpacity: 1,
                    LipstickType: -1,
                    BlushOpacity: 1,
                    FullMakeupType: -1,
                    FullMakeupOpacity: 1,
                    FullMakeupSecondaryColor: 0,
                    FullMakeupPrimaryColor: 0,
                    BlushColor: 0,
                    BlushType: -1,
                    FullMakeupDefaultColor: true,
                    LipstickColor: 0,
                },
                Tattoos: [
                    {
                        Collection: -363871405,
                        Overlay: 335386038,
                    },
                    {
                        Collection: 62137527,
                        Overlay: -1213131712,
                    },
                    {
                        Collection: 1616273011,
                        Overlay: 1306824915,
                    },
                ],
            },
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'missfbi3_party_d',
            anim: 'stand_talk_loop_b_male3',
            flag: 49,
            target: {
                options: [
                    {
                        label: 'Triplaxion',
                        icon: 'global/question',
                        category: 'citizen',
                        action: async () => {
                            this.notifier.notify('Ici, la curiosité peut être mortelle. Garde tes distances.', 'info');
                        },
                    },
                ],
                distance: 1.5,
            },
        });
    }

    private async createPedXerackk() {
        await this.targetFactory.createForPed({
            model: 'mp_m_freemode_01',
            coords: toVector4Object([-1576.37, -3012.01, -80.01, 137.82]),
            components: {
                2: [19, 0, 0],
                3: [4, 0, 0],
                4: [24, 0, 0],
                6: [40, 9, 0],
                7: [178, 7, 0],
                8: [15, 0, 0],
                11: [348, 3, 0],
            },
            props: {
                0: [168, 1, 0],
                1: [18, 6, 0],
                2: [41, 0, 0],
                6: [2, 3, 0],
            },
            skin: {
                Model: {
                    SkinMix: 0.0,
                    Mother: 35,
                    Hash: 1885233650,
                    Father: 2,
                    ShapeMix: 0.0,
                },
                FaceTrait: {
                    NoseBoneHigh: 0.0,
                    NoseWidth: 0.0,
                    BodyBlemish: -1,
                    NoseBoneTwist: 0.0,
                    NosePeakLower: 0.0,
                    ChimpBoneLower: 0.0,
                    EyebrowForward: 0.0,
                    NeckThickness: 0.0,
                    EyeColor: 8,
                    EyesOpening: 0.0,
                    AddBodyBlemish: -1,
                    ChimpHole: 0.0,
                    CheeksBoneWidth: 0.7,
                    EyebrowHigh: 0.0,
                    NosePeakHeight: 0.0,
                    Blemish: -1,
                    CheeksWidth: 0.5,
                    CheeksBoneHigh: 0.0,
                    NosePeakLength: 0.0,
                    Moles: -1,
                    Ageing: -1,
                    ChimpBoneLength: 0.4,
                    JawBoneWidth: 0.0,
                    LipsThickness: 0.0,
                    ChimpBoneWidth: 0.0,
                    JawBoneBackLength: 0.0,
                    Complexion: -1,
                },
                Hair: {
                    HairSecondaryColor: 0,
                    BeardColor: 0,
                    BeardType: 11,
                    BeardOpacity: 1.0,
                    HairType: 3,
                    EyebrowColor: 0,
                    HairColor: 0,
                    EyebrowOpacity: 1.0,
                    EyebrowType: 17,
                    ChestHairColor: 0,
                    ChestHairType: 0,
                    ChestHairOpacity: 1.0,
                },
                Makeup: {
                    LipstickOpacity: 1.0,
                    LipstickType: -1,
                    BlushOpacity: 1.0,
                    FullMakeupType: -1,
                    FullMakeupOpacity: 1.0,
                    LipstickColor: 0,
                    FullMakeupPrimaryColor: 0,
                    BlushColor: 0,
                    BlushType: -1,
                    FullMakeupDefaultColor: true,
                    FullMakeupSecondaryColor: 0,
                },
                Tattoos: [],
            },
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'anim@heists@heist_corona@single_team',
            anim: 'single_team_loop_boss',
            flag: 49,
            target: {
                options: [
                    {
                        label: 'Xerackk',
                        icon: 'global/question',
                        category: 'citizen',
                        action: async () => {
                            this.notifier.notify(
                                'Je suis en pleine affaire, ne viens pas me causer des ennuis.',
                                'info'
                            );
                        },
                    },
                ],
                distance: 1.5,
            },
        });
    }

    private async createPedBerlu() {
        await this.targetFactory.createForPed({
            model: 'mp_m_freemode_01',
            coords: toVector4Object([-1581.17, -3013.06, -80.01, 271.71]),
            components: {
                2: [19, 0, 0],
                3: [4, 0, 0],
                4: [4, 1, 0],
                6: [106, 9, 0],
                8: [31, 5, 0],
                11: [294, 7, 0],
            },
            props: {
                1: [3, 0, 0],
                2: [13, 2, 0],
            },
            skin: {
                Model: {
                    ShapeMix: 1,
                    Mother: 22,
                    Hash: 1885233650,
                    Father: 7,
                    SkinMix: 0,
                },
                FaceTrait: {
                    NoseBoneHigh: 0,
                    NoseWidth: 0,
                    EyesOpening: 1,
                    NoseBoneTwist: 0,
                    NosePeakHeight: 0,
                    ChimpBoneWidth: 0,
                    EyebrowForward: 1,
                    ChimpBoneLower: 0,
                    CheeksBoneHigh: 0,
                    NeckThickness: 0,
                    CheeksWidth: 0,
                    ChimpHole: 0,
                    JawBoneWidth: 0,
                    EyebrowHigh: 0,
                    AddBodyBlemish: 0,
                    Blemish: 0,
                    EyeColor: 12,
                    CheeksBoneWidth: 0,
                    NosePeakLength: 0,
                    Moles: -1,
                    Ageing: 11,
                    ChimpBoneLength: 0,
                    JawBoneBackLength: 0,
                    LipsThickness: 0,
                    NosePeakLower: 0,
                    BodyBlemish: 2,
                    Complexion: 5,
                },
                Hair: {
                    HairColor: 27,
                    BeardColor: 62,
                    BeardType: 11,
                    HairSecondaryColor: 15,
                    HairType: 0,
                    EyebrowColor: 27,
                    ChestHairType: 3,
                    EyebrowOpacity: 1,
                    EyebrowType: 19,
                    ChestHairColor: 62,
                    BeardOpacity: 0.65,
                    ChestHairOpacity: 0.7,
                },
                Makeup: {
                    LipstickOpacity: 1,
                    LipstickType: -1,
                    BlushType: -1,
                    FullMakeupType: -1,
                    FullMakeupOpacity: 1,
                    LipstickColor: 0,
                    FullMakeupPrimaryColor: 0,
                    FullMakeupSecondaryColor: 0,
                    BlushOpacity: 1,
                    FullMakeupDefaultColor: true,
                    BlushColor: 0,
                },
                Tattoos: [
                    {
                        Collection: 598190139,
                        Overlay: 1546921167,
                    },
                ],
            },
            invincible: true,
            freeze: true,
            blockevents: true,
            scenario: 'WORLD_HUMAN_LEANING',
            flag: 49,
            target: {
                options: [
                    {
                        label: 'Berlu',
                        icon: 'global/question',
                        category: 'citizen',
                        action: async () => {
                            this.notifier.notify(
                                "Bien joué, t'as trouvé plein de citrouilles, j'espère que tu trouveras les chocolats de Noël dans 2 mois ma gueule .",
                                'info'
                            );
                        },
                    },
                ],
                distance: 1.5,
            },
        });
    }

    private async createPedYob() {
        await this.targetFactory.createForPed({
            model: 'mp_m_freemode_01',
            coords: toVector4Object([-1580.11, -3013.78, -80.01, 49.07]),
            components: {
                2: [21, 0, 0],
                3: [14, 0, 0],
                4: [148, 0, 0],
                6: [1, 1, 0],
                8: [15, 0, 0],
                11: [381, 10, 0],
            },
            props: {
                0: [2, 3, 0],
                1: [11, 33, 0],
                2: [33, 0, 0],
            },
            skin: {
                Model: {
                    Mother: 22,
                    ShapeMix: 0.0,
                    Father: 2,
                    Hash: 1885233650,
                    SkinMix: 0.0,
                },
                FaceTrait: {
                    NoseBoneTwist: 0.0,
                    ChimpBoneLength: -0.5,
                    JawBoneBackLength: -0.2,
                    NosePeakLength: -0.4,
                    NosePeakLower: 0.0,
                    Moles: -1,
                    LipsThickness: -0.3,
                    CheeksWidth: 0.2,
                    NoseWidth: -0.4,
                    CheeksBoneHigh: -0.2,
                    EyebrowForward: -0.6,
                    EyebrowHigh: 0.0,
                    ChimpBoneWidth: 0.1,
                    NosePeakHeight: -0.6,
                    Blemish: -1,
                    EyesOpening: -0.1,
                    NoseBoneHigh: 0.2,
                    JawBoneWidth: -0.7,
                    NeckThickness: 0.2,
                    ChimpHole: 0.0,
                    ChimpBoneLower: -0.4,
                    Complexion: -1,
                    Ageing: -1,
                    BodyBlemish: -1,
                    AddBodyBlemish: -1,
                    CheeksBoneWidth: 0.0,
                    EyeColor: 5,
                },
                Hair: {
                    HairColor: 55,
                    ChestHairType: 1,
                    ChestHairColor: 0,
                    EyebrowType: 2,
                    ChestHairOpacity: 0.45,
                    EyebrowOpacity: 1.0,
                    BeardOpacity: 0.9,
                    BeardColor: 3,
                    EyebrowColor: 1,
                    HairSecondaryColor: 60,
                    HairType: 21,
                    BeardType: 18,
                },
                Makeup: {
                    FullMakeupSecondaryColor: 0,
                    LipstickColor: 0,
                    BlushType: -1,
                    BlushColor: 0,
                    LipstickOpacity: 1.0,
                    BlushOpacity: 1.0,
                    FullMakeupType: 41,
                    FullMakeupPrimaryColor: 0,
                    FullMakeupDefaultColor: true,
                    LipstickType: -1,
                    FullMakeupOpacity: 0.0,
                },
                Tattoos: [
                    {
                        Collection: -1398869298,
                        Overlay: 524387820,
                    },
                    {
                        Collection: 484754152,
                        Overlay: -938326281,
                    },
                    {
                        Collection: -1398869298,
                        Overlay: -701762906,
                    },
                    {
                        Collection: 484754152,
                        Overlay: -1073925235,
                    },
                    {
                        Collection: 484754152,
                        Overlay: 1525596308,
                    },
                    {
                        Collection: -1398869298,
                        Overlay: -982924414,
                    },
                    {
                        Collection: -1398869298,
                        Overlay: 524387820,
                    },
                    {
                        Collection: 484754152,
                        Overlay: -1073925235,
                    },
                    {
                        Collection: 484754152,
                        Overlay: 1525596308,
                    },
                    {
                        Collection: 484754152,
                        Overlay: -1073925235,
                    },
                    {
                        Collection: -1016521996,
                        Overlay: -1757440846,
                    },
                    {
                        Collection: -1398869298,
                        Overlay: -89113946,
                    },
                ],
            },
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'anim@heists@heist_corona@single_team',
            anim: 'single_team_loop_boss',
            flag: 49,
            target: {
                options: [
                    {
                        label: 'Yob',
                        icon: 'global/question',
                        category: 'citizen',
                        action: async () => {
                            this.notifier.notify(
                                "Ma patience a des limites. Eloigne toi avant qu'elle ne se brise.",
                                'info'
                            );
                        },
                    },
                ],
                distance: 1.5,
            },
        });
    }

    private async createPedTone() {
        await this.targetFactory.createForPed({
            model: 'mp_m_freemode_01',
            coords: toVector4Object([-1577.67, -3016.56, -79.91, 357.14]),
            components: {
                2: [80, 0, 0],
                3: [0, 0, 0],
                4: [103, 3, 0],
                6: [5, 0, 0],
                7: [123, 0, 0],
                8: [15, 0, 0],
                11: [435, 0, 0],
            },
            props: {
                0: [21, 5, 0],
                1: [51, 2, 0],
                2: [3, 1, 0],
                6: [38, 1, 0],
                7: [13, 1, 0],
            },
            skin: {
                Model: {
                    Hash: 1885233650,
                    ShapeMix: 0.2,
                    Mother: 24,
                    Father: 16,
                    SkinMix: 0.4,
                },
                FaceTrait: {
                    AddBodyBlemish: -1,
                    BodyBlemish: 1,
                    NoseWidth: 0.5,
                    JawBoneBackLength: -0.5,
                    CheeksBoneHigh: 1,
                    NeckThickness: 0.7,
                    ChimpBoneWidth: 0.9,
                    Ageing: 2,
                    NoseBoneTwist: 0.2,
                    CheeksWidth: 0.2,
                    ChimpHole: 0.4,
                    NosePeakHeight: 0,
                    ChimpBoneLength: 1,
                    NosePeakLower: 0.8,
                    Blemish: 2,
                    ChimpBoneLower: 0.9,
                    Complexion: 1,
                    EyeColor: 4,
                    NoseBoneHigh: 0.4,
                    CheeksBoneWidth: 0.3,
                    EyebrowForward: -0.4,
                    JawBoneWidth: -0.2,
                    EyebrowHigh: 0.7,
                    NosePeakLength: -0.2,
                    LipsThickness: 0.7,
                    EyesOpening: -0.8,
                    Moles: -1,
                },
                Hair: {
                    ChestHairOpacity: 1,
                    BeardOpacity: 1,
                    ChestHairType: 0,
                    EyebrowColor: 0,
                    HairSecondaryColor: 29,
                    HairColor: 3,
                    BeardType: 9,
                    EyebrowOpacity: 1,
                    BeardColor: 0,
                    ChestHairColor: 0,
                    EyebrowType: 9,
                    HairType: 80,
                },
                Makeup: {
                    LipstickType: -1,
                    FullMakeupOpacity: 0.4,
                    BlushType: -1,
                    BlushOpacity: 1,
                    FullMakeupPrimaryColor: 0,
                    LipstickOpacity: 1,
                    FullMakeupSecondaryColor: 0,
                    FullMakeupType: 0,
                    BlushColor: 0,
                    FullMakeupDefaultColor: true,
                    LipstickColor: 0,
                },
                Tattoos: [
                    {
                        Collection: 601646824,
                        Overlay: -738078859,
                    },
                    {
                        Collection: 62137527,
                        Overlay: -481389646,
                    },
                    {
                        Collection: 1529191571,
                        Overlay: 2048866271,
                    },
                    {
                        Collection: 1529191571,
                        Overlay: -676067408,
                    },
                    {
                        Collection: 1529191571,
                        Overlay: 401532197,
                    },
                ],
            },
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'missheist_agency2aig_4',
            anim: 'look_plan_b_worker2',
            flag: 1,
            target: {
                options: [
                    {
                        label: 'Tone',
                        icon: 'global/question',
                        category: 'citizen',
                        action: async () => {
                            this.notifier.notify(
                                "Tout le chaos des derniers jours, et c'est maintenant que tu veux me provoquer ? T'es coriace, je l'admets.",
                                'info'
                            );
                        },
                    },
                ],
                distance: 1.5,
            },
        });
    }

    public async enterFinal() {
        TriggerServerEvent(ServerEvent.STORY_HALLOWEEN_2023_SCENARIO_4, 5);
        await this.playerPositionProvider.teleportPlayerToPosition(Halloween2023Scenario4EnterFinal);
        this.audioId = this.audioService.playAudio(`audio/album/900k_album/4.mp3`, 0.1, true);
    }
}
