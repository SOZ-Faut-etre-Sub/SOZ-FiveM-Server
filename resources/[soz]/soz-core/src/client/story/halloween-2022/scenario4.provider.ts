import { Component, Prop } from '@public/shared/cloth';
import { VanillaComponentDrawableIndexMaxValue, VanillaPropDrawableIndexMaxValue } from '@public/shared/drawable';
import { BoxZone } from '@public/shared/polyzone/box.zone';

import { Once, OnceStep } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { emitRpc } from '../../../core/rpc';
import { wait } from '../../../core/utils';
import { Feature, isFeatureEnabled } from '../../../shared/features';
import { Vector4 } from '../../../shared/polyzone/vector';
import { RpcServerEvent } from '../../../shared/rpc';
import { Halloween2022Scenario4 } from '../../../shared/story/halloween-2022/scenario4';
import { Dialog } from '../../../shared/story/story';
import { AnimationService } from '../../animation/animation.service';
import { BlipFactory } from '../../blip';
import { PedFactory } from '../../factory/ped.factory';
import { Notifier } from '../../notifier';
import { ProgressService } from '../../progress.service';
import { TargetFactory } from '../../target/target.factory';
import { StoryProvider } from '../story.provider';

@Provider()
export class Halloween2022Scenario4Provider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(PedFactory)
    private pedFactory: PedFactory;

    @Inject(StoryProvider)
    private storyService: StoryProvider;

    @Inject(AnimationService)
    private animationService: AnimationService;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Inject(Notifier)
    private notifier: Notifier;

    @Once(OnceStep.PlayerLoaded)
    public async onPlayerLoaded() {
        if (!isFeatureEnabled(Feature.HalloweenScenario4)) {
            return;
        }

        await this.createPedsFiB();
        await this.createPedDOA();
        await this.createPedSheriffNord();
        await this.createPedSheriffSud();
        await this.createPedAlien();
        await this.createPedZerator();

        await this.createTeleport();
        await this.createActionZones();

        // Caméo de la mort
        await this.createPedNariieL();
        await this.createPedDraglock();
        await this.createPedOjymas();

        await this.createPedPoulpito();
        await this.createPedSniteur();
        await this.createPedOneiluj();
        await this.createPedLasbou();
        await this.createPedMarverikG(); // TODO: text
        await this.createPedDaelbhas();

        await this.createPedBrouznouf();
        await this.createPedLaikker(); // TODO: text
        await this.createPedMoustache(); // TODO: text
        await this.createPedSilverlord(); //TODO text
        await this.createPedGuegette();
        await this.createPedAurelien();

        await this.createPedRigonkmalk();
        await this.createPedAurukh(); // TODO: text

        await this.createPedDarabesque(); //TODO text
        await this.createPedPoulpitor(); //TODO text
        await this.createPedBalrock(); //TODO text
        await this.createPedTluap(); //TODO text
        await this.createPedDream();
        await this.createPedKaemy();
    }

    public createBlip() {
        if (!isFeatureEnabled(Feature.HalloweenScenario4)) {
            return;
        }

        if (!this.storyService.canInteractForPart('halloween2022', 'scenario4', 0)) {
            return;
        }

        const blipId = 'halloween2022_scenario4';
        if (this.blipFactory.exist(blipId)) {
            return;
        }

        this.blipFactory.create(blipId, {
            name: 'Horror Story I : L’amicale créature. (P4)',
            coords: { x: -1538.24, y: 217.14, z: 59.88 },
            sprite: 484,
            scale: 0.99,
            color: 44,
        });
    }

    private async createPedsFiB() {
        const fouille: Vector4[] = [
            [-1573.73, 235.5, 57.86, 206.71],
            [-1583.82, 230.14, 57.68, 201.9],
            [-1597.93, 226.24, 58.08, 22.25],
            [-1608.43, 215.36, 58.54, 300.42],
            [-1606.05, 202.7, 58.47, 196.14],
            [-1600.59, 192.86, 58.62, 347.58],
            [-1585.05, 179.3, 57.85, 17.96],
            [-1540.47, 194.23, 56.66, 36.78],
            [-1545.4, 207.17, 57.45, 104.08],
        ];
        const note: Vector4[] = [
            [-1550.64, 223.89, 58.41, 170.91],
            [-1561.6, 242.77, 58.32, 116.78],
            [-1599.46, 173.12, 58.38, 118.45],
            [-1538.55, 207.38, 57.6, 176.55],
            [-1558.36, 185.4, 56.73, 27.86],
            [-1578.28, 179.26, 57.31, 11.41],
            [-1588.57, 172.13, 57.83, 35.92],
            [-1612.77, 201.39, 58.98, 345.66],
            [-1609.14, 226.78, 58.54, 279.46],
            [-1572.5, 252.25, 57.96, 129.37],
        ];
        const circuler: Vector4[] = [
            [-1547.12, 174.65, 56.5, 54.38],
            [-1575.72, 181.3, 57.19, 206.81],
            [-1609.79, 161.37, 59.0, 255.96],
            [-1630.16, 184.11, 59.81, 296.74],
            [-1630.81, 210.06, 59.64, 64.52],
            [-1624.34, 236.33, 58.87, 35.62],
            [-1585.21, 253.64, 57.94, 357.98],
            [-1532.5, 231.37, 60.16, 332.79],
        ];

        for (const coords of note) {
            await this.pedFactory.createPed({
                model: 'u_m_m_doa_01',
                coords: { x: coords[0], y: coords[1], z: coords[2], w: coords[3] },
                invincible: true,
                freeze: true,
                blockevents: true,
                scenario: 'WORLD_HUMAN_CLIPBOARD',
                flag: 1,
            });
        }

        for (const coords of circuler) {
            await this.pedFactory.createPed({
                model: 'u_m_m_doa_01',
                coords: { x: coords[0], y: coords[1], z: coords[2], w: coords[3] },
                invincible: true,
                freeze: true,
                blockevents: true,
                scenario: 'WORLD_HUMAN_CAR_PARK_ATTENDANT',
                flag: 1,
            });
        }

        for (const coords of fouille) {
            await this.pedFactory.createPed({
                model: 'u_m_m_doa_01',
                coords: { x: coords[0], y: coords[1], z: coords[2], w: coords[3] },
                invincible: true,
                freeze: true,
                blockevents: true,
                animDict: 'missfbi4prepp1',
                anim: '_bag_pickup_garbage_man',
                flag: 1,
            });
        }
    }

    private async createPedDOA() {
        await this.pedFactory.createPed({
            model: 'u_m_m_doa_01',
            coords: { x: -1543.12, y: 213.52, z: 58.08, w: 351.22 },
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'amb@world_human_window_shop@male@idle_a',
            anim: 'browse_a',
            flag: 1,
        });

        this.targetFactory.createForBoxZone(
            'halloween2022:scenario4:part1',
            {
                center: [-1543.12, 213.52, 58.08],
                length: 1.5,
                width: 1.5,
                heading: 351,
                minZ: 58,
                maxZ: 60,
            },
            [
                {
                    label: 'Parler',
                    icon: 'fas fa-comment',
                    canInteract: () => this.storyService.canInteractForPart('halloween2022', 'scenario4', 0),
                    action: async () => {
                        const dialog = await emitRpc<Dialog | null>(RpcServerEvent.STORY_HALLOWEEN_SCENARIO4, 'part1');
                        if (dialog) {
                            await this.storyService.launchDialog(dialog, true, -1543.21, 215.08, 59.28, 190.85);
                        }
                    },
                },
                this.storyService.replayTarget(Halloween2022Scenario4, 'scenario4', 1),
            ]
        );
    }

    private async createPedSheriffNord() {
        await this.pedFactory.createPed({
            model: 's_m_y_sheriff_01',
            coords: { x: -448.97, y: 6012.98, z: 30.72, w: 324.03 },
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'oddjobs@taxi@gyn@cc@intro',
            anim: 'f_impatient_a',
            flag: 1,
        });

        this.targetFactory.createForBoxZone(
            'halloween2022:scenario4:part2',
            {
                center: [-448.97, 6012.98, 30.72],
                length: 1.5,
                width: 1.5,
                heading: 324,
                minZ: 30,
                maxZ: 32,
            },
            [
                {
                    label: 'Parler',
                    icon: 'fas fa-comment',
                    canInteract: () => this.storyService.canInteractForPart('halloween2022', 'scenario4', 2),
                    action: async () => {
                        const dialog = await emitRpc<Dialog | null>(RpcServerEvent.STORY_HALLOWEEN_SCENARIO4, 'part2');
                        if (dialog) {
                            await this.storyService.launchDialog(dialog, true, -448.43, 6014.54, 31.72, 158.89);
                        }
                    },
                },
                this.storyService.replayTarget(Halloween2022Scenario4, 'scenario4', 2),
            ]
        );
    }

    private async createPedSheriffSud() {
        await this.pedFactory.createPed({
            model: 's_m_y_sheriff_01',
            coords: { x: -1545.06, y: 216.38, z: 58.21, w: 261.62 },
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'oddjobs@bailbond_surf_farm',
            anim: 'idle_a',
            flag: 1,
        });

        this.targetFactory.createForBoxZone(
            'halloween2022:scenario4:part3',
            {
                center: [-1545.06, 216.38, 58.21],
                length: 1.5,
                width: 1.5,
                heading: 261,
                minZ: 58,
                maxZ: 60,
            },
            [
                {
                    label: 'Parler',
                    icon: 'fas fa-comment',
                    canInteract: () => this.storyService.canInteractForPart('halloween2022', 'scenario4', 3),
                    action: async () => {
                        const dialog = await emitRpc<Dialog | null>(RpcServerEvent.STORY_HALLOWEEN_SCENARIO4, 'part3');
                        if (dialog) {
                            await this.storyService.launchDialog(dialog, true, -1543.39, 215.92, 59.38, 70.76);
                        }
                    },
                },
                this.storyService.replayTarget(Halloween2022Scenario4, 'scenario4', 3),
            ]
        );
    }

    private async createPedAlien() {
        await this.pedFactory.createPed({
            model: 's_m_m_movalien_01',
            coords: { x: -1586.04, y: 219.12, z: 67.66, w: 95.81 },
            invincible: true,
            freeze: true,
            blockevents: true,
            flag: 1,
        });

        this.targetFactory.createForBoxZone(
            'halloween2022:scenario4:part4',
            {
                center: [-1586.04, 219.12, 67.66],
                length: 1.5,
                width: 1.5,
                heading: 95,
                minZ: 67,
                maxZ: 69,
            },
            [
                {
                    label: 'Parler',
                    icon: 'fas fa-comment',
                    canInteract: () => this.storyService.canInteractForPart('halloween2022', 'scenario4', 4),
                    action: async () => {
                        const dialog = await emitRpc<Dialog | null>(RpcServerEvent.STORY_HALLOWEEN_SCENARIO4, 'part4');
                        if (dialog) {
                            await this.storyService.launchDialog(dialog, true, -1587.63, 218.92, 68.66, 275.23);
                        }
                    },
                },
                this.storyService.replayTarget(Halloween2022Scenario4, 'scenario4', 4),
            ]
        );
    }

    private async createPedZerator() {
        const MONEY_CASE_HASH = GetHashKey('WEAPON_BRIEFCASE');

        const ped = await this.pedFactory.createPed({
            model: 'ig_milton',
            coords: { x: 2067.85, y: 2993.18, z: -64.5, w: 143.49 },
            invincible: true,
            freeze: true,
            blockevents: true,
            flag: 1,
        });

        this.targetFactory.createForBoxZone(
            'halloween2022:scenario4:part7',
            {
                center: [2067.85, 2993.18, -64.5],
                length: 1.5,
                width: 1.5,
                heading: 143,
                minZ: -66,
                maxZ: -62,
            },
            [
                {
                    label: 'Parler',
                    icon: 'fas fa-comment',
                    canInteract: () => this.storyService.canInteractForPart('halloween2022', 'scenario4', 7),
                    action: async () => {
                        const dialog = await emitRpc<Dialog | null>(RpcServerEvent.STORY_HALLOWEEN_SCENARIO4, 'part7');
                        if (dialog) {
                            await this.storyService.launchDialog(dialog, true, 2067.45, 2991.25, -63.3, 345.19);
                        }
                    },
                },
                this.storyService.replayTarget(Halloween2022Scenario4, 'scenario4', 7),
            ]
        );

        GiveWeaponToPed(ped, MONEY_CASE_HASH, 1, false, true);
        SetCurrentPedWeapon(ped, MONEY_CASE_HASH, true);
    }

    private async createTeleport() {
        this.targetFactory.createForBoxZone(
            'teleport_in',
            {
                center: [-263.74, 4730.34, 138.34],
                length: 0.6,
                width: 0.2,
                heading: 318,
                minZ: 138.74,
                maxZ: 139.54,
            },
            [
                {
                    label: 'Explorer',
                    icon: 'fas fa-search',
                    canInteract: () => this.storyService.canInteractForPart('halloween2022', 'scenario4', 7),
                    action: async () => {
                        const ped = PlayerPedId();
                        DoScreenFadeOut(500);
                        await wait(500);

                        SetEntityCoords(ped, 2154.75, 2921.0, -61.9, false, false, false, false);
                        SetEntityRotation(ped, 0.0, 0.0, 88.25, 0, false);

                        DoScreenFadeIn(500);
                    },
                },
            ]
        );

        this.targetFactory.createForBoxZone(
            'teleport_out',
            {
                center: [2154.98, 2922.43, -61.9],
                length: 0.2,
                width: 0.4,
                heading: 4,
                minZ: -62.1,
                maxZ: -61.6,
            },
            [
                {
                    label: 'Sortir',
                    icon: 'c:elevators/monter.png',
                    action: async () => {
                        const ped = PlayerPedId();
                        DoScreenFadeOut(500);
                        await wait(500);

                        SetEntityCoords(ped, -262.88, 4729.65, 138.33, false, false, false, false);
                        SetEntityRotation(ped, 0.0, 0.0, 321.49, 0, false);

                        DoScreenFadeIn(500);
                    },
                },
            ]
        );
    }

    private async createActionZones() {
        Halloween2022Scenario4.zones.forEach(zone => {
            this.targetFactory.createForBoxZone(zone.name, zone, [
                {
                    label: zone.label,
                    icon: zone.icon,
                    canInteract: () => this.storyService.canInteractForPart('halloween2022', 'scenario4', zone.part),
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
                                RpcServerEvent.STORY_HALLOWEEN_SCENARIO4,
                                zone.name
                            );
                            if (dialog) {
                                this.animationService.stop();
                                await animationPromise;
                                await this.storyService.launchDialog(dialog);
                            }
                        }

                        this.animationService.stop();
                        await animationPromise;
                    },
                },
                this.storyService.replayTarget(Halloween2022Scenario4, 'scenario4', zone.part),
            ]);
        });
    }

    private async createPedNariieL() {
        await this.pedFactory.createPed({
            model: 'mp_f_freemode_01',
            coords: { x: 2059.96, y: 2985.01, z: -62.9, w: 144.8 },
            modelCustomization: {
                SkinMix: 0.4,
                ShapeMix: 0.9,
                Mother: 21,
                Father: 6,
                Hash: -1667301416,
            },
            components: {
                2: [97, 0, 0],
                3: [32, 0, 0],
                4: [201, 22, 0],
                7: [148, 0, 0],
                6: [42, 2, 0],
                9: [55, 0, 0],
                8: [160, 0, 0],
                11: [477, 3, 0],
                10: [0, 0, 0],
            },
            props: {
                2: [7, 0, 0],
                6: [7, 1, 0],
            },
            face: {
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
            hair: {
                ChestHairColor: 0,
                EyebrowColor: 8,
                HairSecondaryColor: 15,
                BeardType: -1,
                EyebrowOpacity: 1,
                HairType: 97,
                EyebrowType: 1,
                BeardOpacity: 1,
                HairColor: 16,
                BeardColor: 0,
                ChestHairOpacity: 1,
                ChestHairType: -1,
            },
            makeup: {
                FullMakeupOpacity: 1,
                LipstickType: 0,
                LipstickColor: 2,
                FullMakeupSecondaryColor: 0,
                BlushOpacity: 0.4,
                FullMakeupPrimaryColor: 0,
                BlushColor: 6,
                FullMakeupDefaultColor: 1,
                LipstickOpacity: 0.7,
                FullMakeupType: 1,
                BlushType: 0,
            },
            tattoos: [
                { overlay: 1617489838, collection: -1056335443 },
                { overlay: 1697138602, collection: -1056335443 },
                { overlay: 1697138602, collection: -1056335443 },
            ],
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'anim@amb@casino@valet_scenario@pose_d@',
            anim: 'base_a_m_y_vinewood_01',
            flag: 1,
        });

        this.targetFactory.createForBoxZone(
            'halloween2022:scenario4:createPedNariieL',
            {
                center: [2059.96, 2985.01, -62.9],
                length: 1,
                width: 1,
                heading: 144,
                minZ: -64,
                maxZ: -61,
            },
            [
                {
                    label: 'NariieL',
                    icon: 'fas fa-question',
                    action: async () => {
                        this.notifier.notify('Reste doux.', 'info');
                    },
                },
            ]
        );
    }

    private async createPedKaemy() {
        await this.pedFactory.createPed({
            model: 'mp_f_freemode_01',
            coords: { x: 2041.26, y: 2933.92, z: -62.9, w: 77.6 },
            modelCustomization: {
                Father: 12,
                ShapeMix: 0.65,
                Mother: 21,
                SkinMix: 0.6,
            },
            components: {
                1: [0, 0, 0],
                3: [3, 0, 0],
                4: [4, 9, 0],
                6: [1, 4, 0],
                7: [0, 0, 0],
                8: [2, 0, 0],
                9: [0, 0, 0],
                10: [0, 0, 0],
                11: [407, 12, 0],
            },
            props: {
                0: [12, 0, 0],
                1: [24, 0, 0],
                6: [4, 0, 0],
                7: [15, 0, 0],
            },
            face: {
                CheeksBoneHigh: 0.1,
                NosePeakLength: -0.4,
                ChimpBoneWidth: -0.6,
                NoseWidth: -0.8,
                ChimpBoneLength: -0.4,
                ChimpHole: 0.0,
                JawBoneWidth: -1.0,
                Ageing: -1,
                EyebrowHigh: 0.0,
                NeckThickness: -0.9,
                NoseBoneHigh: 0.2,
                LipsThickness: 1.0,
                Moles: -1,
                ChimpBoneLower: -0.5,
                NoseBoneTwist: 0.0,
                AddBodyBlemish: -1,
                JawBoneBackLength: -0.8,
                CheeksWidth: 0.5,
                Complexion: -1,
                EyeColor: 2,
                NosePeakLower: 0.0,
                Blemish: -1,
                EyebrowForward: 0.2,
                CheeksBoneWidth: -0.5,
                EyesOpening: -0.1,
                BodyBlemish: -1,
                NosePeakHeight: -0.4,
            },
            hair: {
                BeardType: -1,
                BeardColor: 0,
                EyebrowColor: 41,
                HairColor: 0,
                BeardOpacity: 1.0,
                HairSecondaryColor: 29,
                ChestHairOpacity: 1.0,
                ChestHairColor: 0,
                EyebrowOpacity: 1.0,
                ChestHairType: -1,
                EyebrowType: 13,
                HairType: 15,
            },
            makeup: {
                FullMakeupType: 0,
                LipstickOpacity: 0.75,
                BlushOpacity: 0.8,
                FullMakeupSecondaryColor: 31,
                LipstickType: 4,
                LipstickColor: 56,
                FullMakeupOpacity: 1.0,
                FullMakeupPrimaryColor: 56,
                BlushType: 4,
                BlushColor: 9,
            },
            tattoos: [
                { collection: -1016521996, overlay: -1545551839 },
                { collection: -1016521996, overlay: -1545551839 },
                { collection: -1016521996, overlay: -1545551839 },
                { collection: -1398869298, overlay: -434629734 },
                { collection: -1398869298, overlay: -434629734 },
                { collection: -1016521996, overlay: -256036523 },
                { collection: 601646824, overlay: -1802751878 },
                { collection: -1398869298, overlay: -1156010272 },
                { collection: -1398869298, overlay: -1156010272 },
                { collection: -1368357453, overlay: 421656072 },
                { collection: -1016521996, overlay: -887356639 },
                { collection: -1016521996, overlay: -887356639 },
                { collection: -1016521996, overlay: 1942093304 },
                { collection: -1016521996, overlay: 1942093304 },
                { collection: -1016521996, overlay: 1942093304 },
                { collection: -1201369729, overlay: 651012186 },
                { collection: -1201369729, overlay: 651012186 },
                { collection: -1398869298, overlay: -87213624 },
                { collection: -1398869298, overlay: -87213624 },
                { collection: -1398869298, overlay: -87213624 },
                { collection: -240234547, overlay: 1785762805 },
                { collection: -240234547, overlay: 1785762805 },
                { collection: -1016521996, overlay: -131581709 },
                { collection: -1016521996, overlay: -131581709 },
                { collection: -1016521996, overlay: -131581709 },
                { collection: 598190139, overlay: 1103130600 },
                { collection: 598190139, overlay: 1103130600 },
                { collection: -1368357453, overlay: -1734307114 },
                { collection: -1368357453, overlay: -1734307114 },
                { collection: -1368357453, overlay: -1734307114 },
            ],
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'missfbi3_party_d',
            anim: 'stand_talk_loop_a_male3',
            flag: 1,
        });

        this.targetFactory.createForBoxZone(
            'halloween2022:scenario4:createPedKaemy',
            {
                center: [2041.26, 2933.92, -62.9],
                length: 1,
                width: 1,
                heading: 77,
                minZ: -64,
                maxZ: -61,
            },
            [
                {
                    label: 'Kaemy',
                    icon: 'fas fa-question',
                    action: async () => {
                        this.notifier.notify(
                            "J'ai trouvé 106 citrouilles, mais on m'a tout de même refusé l'installation d'une chaise électrique pour vous torturer... C't'un drame lo",
                            'info'
                        );
                    },
                },
            ]
        );
    }

    private async createPedDarabesque() {
        await this.pedFactory.createPed({
            model: 'mp_f_freemode_01',
            coords: { x: 2132.94, y: 2924.91, z: -62.9, w: 234.28 },
            modelCustomization: {
                Hash: -1667301416,
                Father: 4,
                ShapeMix: 0.75,
                Mother: 35,
                SkinMix: 0.6,
            },
            components: {
                1: [0, 0, 0],
                3: [6, 0, 0],
                4: [1, 15, 0],
                6: [90, 14, 0],
                7: [8, 0, 0],
                8: [5, 7, 0],
                9: [0, 0, 0],
                10: [0, 0, 0],
                11: [427, 4, 0],
            },
            props: {
                0: [112, 19, 0],
                1: [11, 6, 0],
                2: [15, 0, 0],
                6: [19, 2, 0],
                7: [2, 0, 0],
            },
            face: {
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
            hair: {
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
            makeup: {
                BlushColor: 0,
                FullMakeupOpacity: 1.0,
                FullMakeupSecondaryColor: 0,
                LipstickColor: 11,
                LipstickType: 4,
                FullMakeupType: 32,
                FullMakeupPrimaryColor: 0,
                BlushType: -1,
                FullMakeupDefaultColor: 1,
                BlushOpacity: 1.0,
                LipstickOpacity: 0.5,
            },
            tattoos: [
                {
                    collection: -1368357453,
                    overlay: 1600841937,
                },
                {
                    collection: -1368357453,
                    overlay: 21830981,
                },
                {
                    collection: 1347816957,
                    overlay: 1864088729,
                },
                {
                    collection: 1347816957,
                    overlay: 1424803201,
                },
                {
                    collection: -1201369729,
                    overlay: -1011813098,
                },
                {
                    collection: -1368357453,
                    overlay: 421656072,
                },
                {
                    collection: 1347816957,
                    overlay: 1928040960,
                },
                {
                    collection: -1368357453,
                    overlay: -1598237536,
                },
                {
                    collection: -1201369729,
                    overlay: -1897002095,
                },
                {
                    collection: 1347816957,
                    overlay: -978468741,
                },
                {
                    collection: -1201369729,
                    overlay: 890225886,
                },
                {
                    collection: -1201369729,
                    overlay: 1121411181,
                },
                {
                    collection: -1368357453,
                    overlay: -1458871109,
                },
                {
                    collection: 1347816957,
                    overlay: -978468741,
                },
                {
                    collection: -1368357453,
                    overlay: 21830981,
                },
                {
                    collection: -1201369729,
                    overlay: 1121411181,
                },
                {
                    collection: -1368357453,
                    overlay: 1600841937,
                },
                {
                    collection: 1616273011,
                    overlay: -1814153457,
                },
                {
                    collection: -1201369729,
                    overlay: 427888057,
                },
                {
                    collection: -1201369729,
                    overlay: -1011813098,
                },
                {
                    collection: 1026837500,
                    overlay: -1363418653,
                },
                {
                    collection: 1026837500,
                    overlay: -1363418653,
                },
                {
                    collection: -1368357453,
                    overlay: 89152577,
                },
                {
                    collection: 1026837500,
                    overlay: 1654019571,
                },
                {
                    collection: -1201369729,
                    overlay: -2092436411,
                },
                {
                    collection: -1368357453,
                    overlay: -1598237536,
                },
                {
                    collection: 1026837500,
                    overlay: 415527077,
                },
                {
                    collection: 1347816957,
                    overlay: 98665018,
                },
            ],
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'anim@heists@heist_corona@single_team',
            anim: 'single_team_loop_boss',
            flag: 1,
        });

        this.targetFactory.createForBoxZone(
            'halloween2022:scenario4:createPedDaraBesque',
            {
                center: [2132.94, 2924.91, -62.9],
                length: 1,
                width: 1,
                heading: 234,
                minZ: -64,
                maxZ: -61,
            },
            [
                {
                    label: 'DaraBesque',
                    icon: 'fas fa-question',
                    action: async () => {
                        this.notifier.notify('...', 'info');
                    },
                },
            ]
        );
    }

    private async createPedTluap() {
        await this.pedFactory.createPed({
            model: 'mp_m_freemode_01',
            coords: { x: 2055.13, y: 2941.55, z: -62.9, w: 356.66 },
            modelCustomization: {
                Father: 13,
                Mother: 41,
                ShapeMix: 0.3,
                SkinMix: 0.8,
                Hash: 1885233650,
            },
            components: {
                1: [0, 0, 0],
                3: [6, 0, 0],
                4: [73, 0, 0],
                6: [24, 0, 0],
                7: [112, 2, 0],
                8: [2, 2, 0],
                9: [0, 0, 0],
                10: [0, 0, 0],
                11: [151, 3, 0],
            },
            props: {
                0: [5, 0, 0],
                1: [24, 2, 0],
            },
            face: {
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
            hair: {
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
            makeup: {
                FullMakeupDefaultColor: 1,
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
            tattoos: [
                {
                    collection: -1719270477,
                    overlay: 472458130,
                },
                {
                    collection: -240234547,
                    overlay: -964908188,
                },
                {
                    collection: -240234547,
                    overlay: 682382693,
                },
                {
                    collection: -363871405,
                    overlay: -1677889748,
                },
            ],
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'missfbi3_party_d',
            anim: 'stand_talk_loop_a_male3',
            flag: 1,
        });

        this.targetFactory.createForBoxZone(
            'halloween2022:scenario4:createPedTluap',
            {
                center: [2055.13, 2941.55, -62.9],
                length: 1,
                width: 1,
                heading: 356,
                minZ: -64,
                maxZ: -61,
            },
            [
                {
                    label: 'Tluap',
                    icon: 'fas fa-question',
                    action: async () => {
                        this.notifier.notify('...', 'info');
                    },
                },
            ]
        );
    }

    private async createPedDraglock() {
        await this.pedFactory.createPed({
            model: 'mp_m_freemode_01',
            coords: { x: 2062.58, y: 2982.98, z: -62.9, w: 143.5 },
            modelCustomization: {
                Father: 42,
                ShapeMix: 0.5,
                SkinMix: 0.5,
                Mother: 45,
            },
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
                1: [5, 5, 0],
                2: [25, 3, 0],
                6: [37, 1, 0],
                7: [2, 0, 0],
            },
            face: {
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
            hair: {
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
            makeup: {
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
            tattoos: [
                { collection: 598190139, overlay: 301211484 },
                { collection: 598190139, overlay: -820013196 },
                { collection: -240234547, overlay: 1200380295 },
                { collection: -240234547, overlay: 1200380295 },
                { collection: 1347816957, overlay: -1926213636 },
                { collection: -1056335443, overlay: 1027059614 },
                { collection: -1056335443, overlay: 1027059614 },
                { collection: -1056335443, overlay: 1027059614 },
                { collection: 598190139, overlay: -820013196 },
                { collection: 598190139, overlay: -820013196 },
                { collection: 598190139, overlay: -401355876 },
                { collection: 598190139, overlay: -401355876 },
                { collection: 598190139, overlay: -401355876 },
                { collection: 484754152, overlay: -1008363280 },
                { collection: 1926256505, overlay: 257911811 },
                { collection: 598190139, overlay: -221326558 },
                { collection: 598190139, overlay: -221326558 },
                { collection: 598190139, overlay: -221326558 },
                { collection: 1026837500, overlay: 1091795205 },
                { collection: 1026837500, overlay: 1091795205 },
                { collection: 601646824, overlay: -738078859 },
                { collection: 598190139, overlay: 301211484 },
                { collection: 598190139, overlay: 301211484 },
                { collection: 598190139, overlay: 301211484 },
                { collection: 484754152, overlay: -1008363280 },
                { collection: 484754152, overlay: -1008363280 },
                { collection: -1201369729, overlay: 555692245 },
                { collection: -1201369729, overlay: 555692245 },
                { collection: -1201369729, overlay: 555692245 },
                { collection: -1201369729, overlay: 555692245 },
                { collection: -1201369729, overlay: 555692245 },
                { collection: -1201369729, overlay: 555692245 },
                { collection: -1201369729, overlay: 555692245 },
                { collection: -1201369729, overlay: 555692245 },
                { collection: -1201369729, overlay: 555692245 },
                { collection: -1201369729, overlay: 555692245 },
                { collection: -1016521996, overlay: 654127400 },
                { collection: -1016521996, overlay: 654127400 },
                { collection: 1529191571, overlay: 2088037441 },
                { collection: 1926256505, overlay: 257911811 },
                { collection: 1926256505, overlay: 257911811 },
                { collection: 1926256505, overlay: 257911811 },
            ],
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'anim@heists@heist_corona@single_team',
            anim: 'single_team_loop_boss',
            flag: 1,
        });

        this.targetFactory.createForBoxZone(
            'halloween2022:scenario4:createPedDraglock',
            {
                center: [2062.58, 2982.98, -62.9],
                length: 1,
                width: 1,
                heading: 143,
                minZ: -64,
                maxZ: -61,
            },
            [
                {
                    label: 'Draglock',
                    icon: 'fas fa-question',
                    action: async () => {
                        this.notifier.notify('Huuuuuuum', 'info');
                    },
                },
            ]
        );
    }

    private async createPedPoulpito() {
        await this.pedFactory.createPed({
            model: 'mp_m_freemode_01',
            coords: { x: 2038.65, y: 2934.75, z: -62.9, w: 304.07 },
            modelCustomization: {
                Father: 44,
                ShapeMix: 0.4,
                SkinMix: 0.45,
                Mother: 31,
            },
            components: {
                0: [0, 0, 0],
                1: [0, 0, 0],
                2: [10, 0, 0],
                3: [1, 0, 0],
                4: [10, 0, 0],
                6: [10, 0, 0],
                7: [0, 0, 0],
                8: [130, 0, 0],
                9: [54, 0, 0],
                10: [0, 0, 0],
                11: [348, 0, 0],
            },
            props: {
                1: [8, 3, 0],
                2: [0, 0, 0],
                7: [0, 0, 0],
            },
            face: {
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
            hair: {
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
            makeup: {
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
            tattoos: [
                { collection: -1016521996, overlay: 1942093304 },
                { collection: -1056335443, overlay: 1617489838 },
                { collection: -1016521996, overlay: -131581709 },
                { collection: -1056335443, overlay: 1027059614 },
                { collection: -1398869298, overlay: -270395278 },
                { collection: -240234547, overlay: 1246243345 },
                { collection: 1926256505, overlay: -1531355431 },
                { collection: 598190139, overlay: -1822846187 },
                { collection: -240234547, overlay: -1937668252 },
                { collection: -1398869298, overlay: -87213624 },
                { collection: 1185637852, overlay: -1820938681 },
                { collection: -1719270477, overlay: 459313194 },
                { collection: -240234547, overlay: -1145896773 },
                { collection: -240234547, overlay: -927135334 },
                { collection: -240234547, overlay: -589592162 },
                { collection: -240234547, overlay: -883161109 },
                { collection: -240234547, overlay: -394853815 },
                { collection: -240234547, overlay: 1670479428 },
                { collection: -2086773, overlay: 709663738 },
                { collection: 1926256505, overlay: 2121965551 },
                { collection: 1926256505, overlay: 257911811 },
                { collection: -1201369729, overlay: -1820191335 },
                { collection: -1201369729, overlay: 1124688073 },
                { collection: 1616273011, overlay: 1832021545 },
                { collection: 1616273011, overlay: -648193607 },
                { collection: 1616273011, overlay: 2025651359 },
                { collection: -1398869298, overlay: 505181414 },
                { collection: -1398869298, overlay: 1252285617 },
                { collection: -975527441, overlay: 962023066 },
                { collection: 1529191571, overlay: 1045897298 },
                { collection: 1529191571, overlay: 2088037441 },
                { collection: 62137527, overlay: -481389646 },
                { collection: 484754152, overlay: 1775476370 },
                { collection: -1016521996, overlay: 654127400 },
                { collection: 598190139, overlay: -150640257 },
                { collection: 598190139, overlay: -150640257 },
                { collection: -1719270477, overlay: 459313194 },
            ],
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'amb@world_human_cop_idles@male@base',
            anim: 'base',
            flag: 1,
        });

        this.targetFactory.createForBoxZone(
            'halloween2022:scenario4:createPedPoulpito',
            {
                center: [2038.65, 2934.75, -62.9],
                length: 1,
                width: 1,
                heading: 304,
                minZ: -64,
                maxZ: -61,
            },
            [
                {
                    label: 'Poulpito',
                    icon: 'fas fa-question',
                    action: async () => {
                        this.notifier.notify(
                            "Si seulement j'avais pu prendre le flacon d'ADN de poulpe au labo ... plusieurs bras pour inventorier les citrouilles ça n'aurait pas été du luxe !  10h de boulot !",
                            'info'
                        );
                    },
                },
            ]
        );
    }

    private async createPedSniteur() {
        await this.pedFactory.createPed({
            model: 'mp_m_freemode_01',
            coords: { x: 2039.78, y: 2937.18, z: -62.9, w: 161.24 },
            modelCustomization: {
                Father: 4,
                ShapeMix: 0.5,
                SkinMix: 0.45,
                Mother: 31,
            },
            components: {
                0: [0, 0, 0],
                1: [0, 0, 0],
                2: [21, 0, 0],
                3: [4, 0, 0],
                4: [52, 2, 0],
                6: [20, 3, 0],
                7: [0, 0, 0],
                8: [15, 0, 0],
                9: [0, 0, 0],
                10: [0, 0, 0],
                11: [139, 3, 0],
            },
            props: {
                0: [61, 6, 0],
                1: [5, 0, 0],
                2: [31, 1, 0],
                6: [37, 4, 0],
            },
            face: {
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
            hair: {
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
            makeup: {
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
            tattoos: [
                { collection: -2086773, overlay: 1860213958 },
                { collection: -240234547, overlay: 2088424900 },
                { collection: 598190139, overlay: 1180435659 },
                { collection: 1926256505, overlay: 1745422723 },
                { collection: 1347816957, overlay: 1126903931 },
                { collection: 1026837500, overlay: 220143168 },
                { collection: 62137527, overlay: -1213131712 },
                { collection: 1529191571, overlay: -1528465573 },
                { collection: 598190139, overlay: -221326558 },
                { collection: -240234547, overlay: -2015343582 },
                { collection: 1616273011, overlay: -303409019 },
                { collection: 1026837500, overlay: 1091795205 },
            ],
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'missfbi3_party_d',
            anim: 'stand_talk_loop_a_male1',
            flag: 1,
        });

        this.targetFactory.createForBoxZone(
            'halloween2022:scenario4:createPedSniteur',
            {
                center: [2039.78, 2937.18, -62.9],
                length: 1,
                width: 1,
                heading: 161,
                minZ: -64,
                maxZ: -61,
            },
            [
                {
                    label: 'Sniteur ',
                    icon: 'fas fa-question',
                    action: async () => {
                        this.notifier.notify(
                            'Hmm... Tu veux quoi ? On a passé des heures dessus. Donc tu as intérêt à nous laisser 5 étoiles où je te retrouve et je te coule dans le lac.',
                            'info'
                        );
                    },
                },
            ]
        );
    }

    private async createPedBrouznouf() {
        await this.pedFactory.createPed({
            model: 'mp_m_freemode_01',
            coords: { x: 2051.49, y: 2987.67, z: -62.9, w: 166.98 },
            modelCustomization: {
                Mother: 38,
                Father: 13,
                ShapeMix: 0.15,
                SkinMix: 0.6,
            },
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
                0: [8, 6, 0],
                1: [10, 10, 0],
            },
            face: {
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
            hair: {
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
            makeup: {
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
            tattoos: [],
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'move_characters@tracey@core@',
            anim: 'idle',
            flag: 1,
        });

        this.targetFactory.createForBoxZone(
            'halloween2022:scenario4:createPedBrouznouf',
            {
                center: [2051.49, 2987.67, -62.9],
                length: 1,
                width: 1,
                heading: 166,
                minZ: -64,
                maxZ: -61,
            },
            [
                {
                    label: 'Brouznouf',
                    icon: 'fas fa-question',
                    action: async () => {
                        this.notifier.notify("Il paraît qu'il y a un fantôme qui sort son téléphone au BCSO ?", 'info');
                    },
                },
            ]
        );
    }

    private async createPedLaikker() {
        await this.pedFactory.createPed({
            model: 'mp_m_freemode_01',
            coords: { x: 2050.93 + 0.3, y: 2984.02 + 0.45, z: -62.4 - 0.5, w: 329.0 },
            modelCustomization: { SkinMix: 0.75, Hash: 1885233650, Father: 5, ShapeMix: 0.15, Mother: 29 },
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
            props: {},
            face: {
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
            hair: {
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
            makeup: {
                FullMakeupOpacity: 1.0,
                BlushOpacity: 1.0,
                FullMakeupType: -1,
                LipstickColor: 0,
                FullMakeupPrimaryColor: 0,
                BlushType: -1,
                LipstickType: -1,
                LipstickOpacity: 1.0,
                FullMakeupSecondaryColor: 0,
                FullMakeupDefaultColor: 1,
                BlushColor: 0,
            },
            tattoos: [],
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'switch@michael@sitting',
            anim: 'idle',
            flag: 1,
        });

        this.targetFactory.createForBoxZone(
            'halloween2022:scenario4:createPedLaikker',
            {
                center: [2050.93 + 0.3, 2984.02 + 0.45, -62.4 - 0.5],
                length: 1.5,
                width: 1.5,
                heading: 329,
                minZ: -64,
                maxZ: -61,
            },
            [
                {
                    label: 'Laikker',
                    icon: 'fas fa-question',
                    action: async () => {
                        this.notifier.notify('...', 'info');
                    },
                },
            ]
        );
    }

    private async createPedMoustache() {
        await this.pedFactory.createPed({
            model: 'mp_m_freemode_01',
            coords: { x: 2052.05 + 0.27, y: 2983.15 + 0.45, z: -62.4 - 0.5, w: 334.0 },
            modelCustomization: { Mother: 31, ShapeMix: 0.55, Hash: 1885233650, SkinMix: 1, Father: 4 },
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
                0: [7, 77, 0],
                1: [7, 0, 0],
                7: [5, 0, 0],
            },
            face: {
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
            hair: {
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
            makeup: {
                FullMakeupSecondaryColor: 0,
                LipstickColor: 0,
                FullMakeupDefaultColor: 1,
                FullMakeupPrimaryColor: 0,
                FullMakeupType: -1,
                LipstickType: -1,
                BlushType: -1,
                BlushOpacity: 1,
                FullMakeupOpacity: 1,
                BlushColor: 0,
                LipstickOpacity: 1,
            },
            tattoos: [
                {
                    collection: 1926256505,
                    overlay: 662247816,
                },
                {
                    collection: 1926256505,
                    overlay: 1031130678,
                },
                {
                    collection: 1347816957,
                    overlay: 1505585597,
                },
                {
                    collection: 62137527,
                    overlay: -2088194624,
                },
                {
                    collection: 601646824,
                    overlay: -738078859,
                },
                {
                    collection: 1926256505,
                    overlay: 1745422723,
                },
                {
                    collection: 1529191571,
                    overlay: 2088037441,
                },
            ],
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'switch@michael@sitting',
            anim: 'idle',
            flag: 1,
        });

        this.targetFactory.createForBoxZone(
            'halloween2022:scenario4:createPedMoustache',
            {
                center: [2052.05 + 0.27, 2983.15 + 0.45, -62.4 - 0.5],
                length: 1,
                width: 1,
                heading: 334,
                minZ: -64,
                maxZ: -61,
            },
            [
                {
                    label: 'Moustache',
                    icon: 'fas fa-question',
                    action: async () => {
                        this.notifier.notify('...', 'info');
                    },
                },
            ]
        );
    }

    private async createPedAurukh() {
        await this.pedFactory.createPed({
            model: 'mp_m_freemode_01',
            coords: { x: 2048.51 + 0.5, y: 2981.56, z: -62.39 - 0.5, w: 283.99 },
            modelCustomization: { Mother: 31, ShapeMix: 0.5, Hash: 1885233650, SkinMix: 0.5, Father: 4 },
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
            face: {
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
            hair: {
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
            makeup: {
                FullMakeupSecondaryColor: 0,
                LipstickColor: 0,
                FullMakeupDefaultColor: 1,
                FullMakeupPrimaryColor: 0,
                LipstickOpacity: 1,
                FullMakeupType: -1,
                BlushType: -1,
                BlushOpacity: 1,
                FullMakeupOpacity: 1,
                BlushColor: 0,
                LipstickType: -1,
            },
            tattoos: [],
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'switch@michael@sitting',
            anim: 'idle',
            flag: 1,
        });

        this.targetFactory.createForBoxZone(
            'halloween2022:scenario4:createPedAurukh',
            {
                center: [2048.51 + 0.5, 2981.56, -62.39 - 0.5],
                length: 1,
                width: 1,
                heading: 283,
                minZ: -64,
                maxZ: -61,
            },
            [
                {
                    label: 'Aurukh',
                    icon: 'fas fa-question',
                    action: async () => {
                        this.notifier.notify('...', 'info');
                    },
                },
            ]
        );
    }

    private async createPedRigonkmalk() {
        await this.pedFactory.createPed({
            model: 'mp_m_freemode_01',
            coords: { x: 2050.135 + 0.3, y: 2980.486 + 0.45, z: -62.29 - 0.65, w: 334.0 },
            modelCustomization: { SkinMix: 0.1, Father: 43, Mother: 31, ShapeMix: 0.7 },
            components: {
                1: [0, 0, 0],
                11: [9, 14, 0],
                10: [0, 0, 0],
                4: [4, 0, 0],
                3: [0, 0, 0],
                9: [0, 0, 0],
                8: [15, 0, 0],
                7: [0, 0, 0],
                6: [21, 0, 0],
            },
            props: {
                6: [18, 0, 0],
                7: [5, 0, 0],
                2: [17, 1, 0],
            },
            face: {
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
            hair: {
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
            makeup: {
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
            tattoos: [],
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'switch@michael@sitting',
            anim: 'idle',
            flag: 1,
        });

        this.targetFactory.createForBoxZone(
            'halloween2022:scenario4:createPedRigonkmalk',
            {
                center: [2050.135 + 0.3, 2980.486 + 0.45, -62.29 - 0.65],
                length: 1.5,
                width: 1.5,
                heading: 334,
                minZ: -64,
                maxZ: -61,
            },
            [
                {
                    label: 'Rigonkmalk',
                    icon: 'fas fa-question',
                    action: async () => {
                        this.notifier.notify(
                            "Mon entreprise de BTP Sancto&Co est quand même pas mal quand on a besoin d'un nouvel intérieur non ? Je prend du retard je pense, à plus !",
                            'info'
                        );
                    },
                },
            ]
        );
    }

    private async createPedOneiluj() {
        await this.pedFactory.createPed({
            model: 'mp_m_freemode_01',
            coords: { x: 2091.11, y: 2932.34, z: -62.9, w: 270.43 },
            modelCustomization: { Father: 43, ShapeMix: 0.5, SkinMix: 0.6, Mother: 30 },
            components: {
                3: [22, 0, 0],
                4: [VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.Legs] + 8, 0, 0],
                5: [VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.Bag] + 2, 1, 0],
                6: [51, 0, 0],
                7: [
                    VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.Accessories] + 4,
                    0,
                    0,
                ],
                8: [
                    VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.Undershirt] + 4,
                    0,
                    0,
                ],
                9: [
                    VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.BodyArmor] + 8,
                    0,
                    0,
                ],
                10: [0, 0, 0],
                11: [VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.Tops] + 2, 3, 0],
            },
            props: {
                0: [VanillaPropDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Prop.Hat] + 7, 0, 0],
            },
            face: {
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
            hair: {
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
            makeup: {
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
            tattoos: [],
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'missfbi3_party_d',
            anim: 'stand_talk_loop_b_male3',
            flag: 49,
        });

        this.targetFactory.createForBoxZone(
            'halloween2022:scenario4:createPedOneiluj',
            {
                center: [2091.11, 2932.34, -62.9],
                length: 1,
                width: 1,
                heading: 270,
                minZ: -64,
                maxZ: -61,
            },
            [
                {
                    label: 'Oneiluj',
                    icon: 'fas fa-question',
                    action: async () => {
                        this.notifier.notify(
                            "En tant que fier Sheriff du BCSO, je n'ai résolu aucune enquête.",
                            'info'
                        );
                    },
                },
            ]
        );
    }

    private async createPedLasbou() {
        await this.pedFactory.createPed({
            model: 'mp_m_freemode_01',
            coords: { x: 2093.17, y: 2932.41, z: -62.9, w: 79.39 },
            modelCustomization: { SkinMix: 0.5, ShapeMix: 0.5, Mother: 26, Father: 43 },
            components: {
                3: [22, 0, 0],
                4: [VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.Legs] + 1, 2, 0],
                5: [VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.Bag] + 2, 1, 0],
                6: [51, 0, 0],
                7: [
                    VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.Accessories] + 4,
                    0,
                    0,
                ],
                8: [
                    VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.Undershirt] + 4,
                    0,
                    0,
                ],
                9: [
                    VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.BodyArmor] + 8,
                    0,
                    0,
                ],
                10: [0, 0, 0],
                11: [VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.Tops] + 2, 2, 0],
            },
            props: {
                0: [VanillaPropDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Prop.Hat] + 6, 0, 0],
            },
            face: {
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
            hair: {
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
            makeup: {
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
            tattoos: [],
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'missfbi3_party_d',
            anim: 'stand_talk_loop_b_male1',
            flag: 49,
        });

        this.targetFactory.createForBoxZone(
            'halloween2022:scenario4:createPedLasbou',
            {
                center: [2093.17, 2932.41, -62.9],
                length: 1,
                width: 1,
                heading: 79,
                minZ: -64,
                maxZ: -61,
            },
            [
                {
                    label: 'Lasbou',
                    icon: 'fas fa-question',
                    action: async () => {
                        this.notifier.notify('Minou minou ? GRAOU GRAOU !', 'info');
                    },
                },
            ]
        );
    }

    private async createPedDaelbhas() {
        await this.pedFactory.createPed({
            model: 'mp_m_freemode_01',
            coords: { x: 2108.63, y: 2943.6, z: -62.9, w: 78.8 },
            modelCustomization: { Mother: 45, ShapeMix: 0.25, Father: 42, SkinMix: 0.5 },
            components: {
                0: [0, 0, 0],
                1: [0, 0, 0],
                4: [25, 5, 0],
                10: [0, 0, 0],
                11: [31, 7, 0],
                8: [34, 2, 0],
                9: [0, 0, 0],
                6: [40, 9, 0],
                7: [0, 0, 0],
                3: [1, 0, 0],
                2: [19, 0, 0],
            },
            props: {
                2: [33, 0, 0],
            },
            face: {
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
            hair: {
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
            makeup: {
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
            tattoos: [],
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'missfbi3_party_d',
            anim: 'stand_talk_loop_a_male3',
            flag: 1,
        });

        this.targetFactory.createForBoxZone(
            'halloween2022:scenario4:createPedDaelbhas',
            {
                center: [2108.63, 2943.6, -62.9],
                length: 1,
                width: 1,
                heading: 78,
                minZ: -64,
                maxZ: -61,
            },
            [
                {
                    label: 'Daelbhas',
                    icon: 'fas fa-question',
                    action: async () => {
                        this.notifier.notify(
                            "Moi, à une époque, je voulais faire vœu de pauvreté... Mais avec le pognon que j'rentrais, j'arrivais pas à concilier les deux.",
                            'info'
                        );
                    },
                },
            ]
        );
    }

    private async createPedOjymas() {
        await this.pedFactory.createPed({
            model: 'mp_m_freemode_01',
            coords: { x: 2107.38, y: 2944.69, z: -62.9, w: 191.75 },
            modelCustomization: { SkinMix: 1, ShapeMix: 0, Mother: 31, Father: 8, Hash: 1885233650 },
            components: {
                11: [VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.Tops] + 4, 0, 0],
                6: [51, 0, 0],
                7: [0, 0, 0],
                8: [
                    VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.Undershirt] + 4,
                    0,
                    0,
                ],
                1: [0, 0, 0],
                2: [19, 0, 0],
                3: [VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.Legs] + 1, 0, 0],
                4: [25, 0, 0],
                10: [VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.Decals] + 2, 2, 0],
                5: [VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.Bag], 0, 0],
            },
            props: {
                1: [5, 3, 0],
            },
            face: {
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
            hair: {
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
            makeup: {
                FullMakeupOpacity: 1,
                LipstickType: -1,
                LipstickColor: 0,
                FullMakeupSecondaryColor: 0,
                BlushOpacity: 1,
                LipstickOpacity: 1,
                FullMakeupPrimaryColor: 0,
                FullMakeupDefaultColor: 1,
                BlushColor: 0,
                FullMakeupType: -1,
                BlushType: -1,
            },
            tattoos: [
                {
                    collection: 598190139,
                    overlay: -189671992,
                },
                {
                    collection: 1926256505,
                    overlay: -2114317157,
                },
                {
                    collection: -1398869298,
                    overlay: -1092860637,
                },
                {
                    collection: -1398869298,
                    overlay: -434629734,
                },
                {
                    collection: 1926256505,
                    overlay: -862474356,
                },
            ],
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'missfbi3_party_d',
            anim: 'stand_talk_loop_a_male2',
            flag: 1,
        });

        this.targetFactory.createForBoxZone(
            'halloween2022:scenario4:createPedOjymas',
            {
                ...new BoxZone([2107.37, 2944.59, -61.9], 0.8, 0.8, {
                    heading: 106.46,
                    minZ: -62.9,
                    maxZ: -60.9,
                }),
            },
            [
                {
                    label: 'Ojymas',
                    icon: 'fas fa-question',
                    action: async () => {
                        this.notifier.notify(
                            "Alors si je compte trois potions par try, puis pour huit joueurs ça me ferait... Hein ? Hé, j'espère que t'as kiffé l'event !",
                            'info'
                        );
                    },
                },
            ]
        );
    }

    private async createPedPoulpitor() {
        await this.pedFactory.createPed({
            model: 'mp_m_freemode_01',
            coords: { x: 2053.91, y: 2942.04, z: -62.9, w: 357.21 },
            modelCustomization: { Father: 1, Mother: 22, ShapeMix: 0.05, Hash: 1885233650, SkinMix: 0.35 },
            components: {
                1: [0, 0, 0],
                9: [0, 0, 0],
                8: [146, 0, 0],
                7: [22, 1, 0],
                6: [104, 3, 0],
                4: [24, 5, 0],
                3: [4, 0, 0],
                10: [0, 0, 0],
                11: [31, 5, 0],
            },
            props: {
                0: [146, 0, 0],
                1: [8, 1, 0],
                2: [2, 0, 0],
                6: [16, 1, 0],
                7: [8, 2, 0],
            },
            face: {
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
            hair: {
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
            makeup: {
                FullMakeupDefaultColor: 1,
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
            tattoos: [],
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'missfbi3_party_d',
            anim: 'stand_talk_loop_a_male1',
            flag: 1,
        });

        this.targetFactory.createForBoxZone(
            'halloween2022:scenario4:createPedPoulpitor',
            {
                center: [2053.91, 2942.04, -62.9],
                length: 1,
                width: 1,
                heading: 357,
                minZ: -64,
                maxZ: -61,
            },
            [
                {
                    label: 'Poulpitor',
                    icon: 'fas fa-question',
                    action: async () => {
                        this.notifier.notify('...', 'info');
                    },
                },
            ]
        );
    }

    private async createPedDream() {
        await this.pedFactory.createPed({
            model: 'mp_m_freemode_01',
            coords: { x: 2056.4, y: 2941.29, z: -62.9, w: 12.79 },
            modelCustomization: { SkinMix: 0.5, ShapeMix: 0.15, Father: 20, Mother: 32 },
            components: {
                1: [0, 0, 0],
                3: [0, 0, 0],
                4: [103, 1, 0],
                7: [0, 0, 0],
                6: [1, 1, 0],
                9: [0, 0, 0],
                8: [15, 0, 0],
                11: [354, 4, 0],
                10: [0, 0, 0],
            },
            props: {},
            face: {
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
            hair: {
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
            makeup: {
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
            tattoos: [],
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'missfbi3_party_d',
            anim: 'stand_talk_loop_b_male2',
            flag: 1,
        });

        this.targetFactory.createForBoxZone(
            'halloween2022:scenario4:createPedDream',
            {
                center: [2056.4, 2941.29, -62.9],
                length: 1,
                width: 1,
                heading: 12,
                minZ: -64,
                maxZ: -61,
            },
            [
                {
                    label: 'DreamXZE',
                    icon: 'fas fa-question',
                    action: async () => {
                        this.notifier.notify(
                            "Heureusement que l'alien faisait juste son footing pour rester en forme et qu'il n'avait pas faim...",
                            'info'
                        );
                    },
                },
            ]
        );
    }

    private async createPedBalrock() {
        await this.pedFactory.createPed({
            model: 'mp_m_freemode_01',
            coords: { x: 2052.84, y: 2942.7, z: -62.9, w: 313.24 },
            modelCustomization: { SkinMix: 0.55, Mother: 26, Father: 44, ShapeMix: 0.55, Hash: 1885233650 },
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
                0: [5, 0, 0],
                1: [23, 9, 0],
                2: [32, 1, 0],
                6: [4, 1, 0],
            },
            face: {
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
            hair: {
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
            makeup: {
                LipstickColor: 0,
                FullMakeupSecondaryColor: 0,
                LipstickOpacity: 1.0,
                LipstickType: -1,
                BlushColor: 0,
                BlushType: -1,
                FullMakeupPrimaryColor: 0,
                FullMakeupDefaultColor: 1,
                FullMakeupOpacity: 1.0,
                FullMakeupType: -1,
                BlushOpacity: 1.0,
            },
            tattoos: [
                {
                    collection: -1056335443,
                    overlay: 1617489838,
                },
                {
                    collection: 598190139,
                    overlay: -1128139527,
                },
                {
                    collection: -240234547,
                    overlay: -1431574022,
                },
                {
                    collection: 484754152,
                    overlay: 956061600,
                },
                {
                    collection: 1616273011,
                    overlay: -54254731,
                },
                {
                    collection: -2086773,
                    overlay: 193320466,
                },
                {
                    collection: -1719270477,
                    overlay: -754981437,
                },
                {
                    collection: -363871405,
                    overlay: -1512326404,
                },
                {
                    collection: -363871405,
                    overlay: -1512326404,
                },
                {
                    collection: -1719270477,
                    overlay: -754981437,
                },
            ],
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'missfbi3_party_d',
            anim: 'stand_talk_loop_b_male2',
            flag: 1,
        });

        this.targetFactory.createForBoxZone(
            'halloween2022:scenario4:createPedBalrock',
            {
                ...new BoxZone([2052.91, 2942.8, -61.9], 0.8, 0.8, {
                    heading: 131.54,
                    minZ: -62.9,
                    maxZ: -60.9,
                }),
            },
            [
                {
                    label: 'Balrock',
                    icon: 'fas fa-question',
                    action: async () => {
                        this.notifier.notify('...', 'info');
                    },
                },
            ]
        );
    }

    private async createPedMarverikG() {
        await this.pedFactory.createPed({
            model: 'mp_m_freemode_01',
            coords: { x: 2080.95, y: 2934.67, z: -62.9, w: 173.58 },
            modelCustomization: {
                Father: 44,
                Mother: 21,
                ShapeMix: 0,
                Hash: 1885233650,
                SkinMix: 0.4,
            },
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
            face: {
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
            hair: {
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
            makeup: {
                FullMakeupDefaultColor: 1,
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
            tattoos: [
                {
                    collection: -363871405,
                    overlay: -770265298,
                },
                {
                    collection: -363871405,
                    overlay: -1170154756,
                },
                {
                    collection: -363871405,
                    overlay: -1512326404,
                },
                {
                    collection: -363871405,
                    overlay: 335386038,
                },
                {
                    collection: -363871405,
                    overlay: -1732002225,
                },
                {
                    collection: -240234547,
                    overlay: -1431574022,
                },
                {
                    collection: -2086773,
                    overlay: -1953737187,
                },
                {
                    collection: 598190139,
                    overlay: 1544332704,
                },
                {
                    collection: -975527441,
                    overlay: 34276608,
                },
                {
                    collection: 1616273011,
                    overlay: 1832021545,
                },
                {
                    collection: 601646824,
                    overlay: -1509810048,
                },
                {
                    collection: 601646824,
                    overlay: 2057657792,
                },
            ],
            invincible: true,
            freeze: true,
            blockevents: true,
            scenario: 'WORLD_HUMAN_LEANING',
        });

        this.targetFactory.createForBoxZone(
            'halloween2022:scenario4:createPedMarverickG',
            {
                ...new BoxZone([2080.91, 2934.68, -61.9], 0.6, 0.6, {
                    heading: 81.17,
                    minZ: -62.9,
                    maxZ: -60.9,
                }),
            },
            [
                {
                    label: 'MarverikG',
                    icon: 'fas fa-question',
                    action: async () => {
                        this.notifier.notify('...', 'info');
                    },
                },
            ]
        );
    }

    private async createPedSilverlord() {
        await this.pedFactory.createPed({
            model: 'mp_m_freemode_01',
            coords: { x: 2054.25, y: 2985.42, z: -62.9, w: 345.13 },
            modelCustomization: { Father: 20, Mother: 26, ShapeMix: 0.4, Hash: 1885233650, SkinMix: 0.45 },
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
            face: {
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
            hair: {
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
            makeup: {
                FullMakeupDefaultColor: 1,
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
            tattoos: [],
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'switch@michael@sitting',
            anim: 'idle',
            flag: 1,
        });

        this.targetFactory.createForBoxZone(
            'halloween2022:scenario4:createPedSilverlord',
            {
                ...new BoxZone([2054.07, 2985.13, -62.45], 1.0, 0.8, {
                    heading: 276.51,
                    minZ: -63.45,
                    maxZ: -61.45,
                }),
            },
            [
                {
                    label: 'Silverlord',
                    icon: 'fas fa-question',
                    action: async () => {
                        this.notifier.notify('...', 'info');
                    },
                },
            ]
        );
    }

    private async createPedAurelien() {
        await this.pedFactory.createPed({
            model: 'mp_m_freemode_01',
            coords: { x: 2047.15, y: 2979.47, z: -62.93, w: 320.7 },
            modelCustomization: { SkinMix: 0.5, ShapeMix: 0.5, Mother: 29, Father: 4, Hash: 1885233650 },
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
            props: {},
            face: {
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
            hair: {
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
            makeup: {
                FullMakeupOpacity: 1.0,
                LipstickType: -1,
                LipstickOpacity: 1.0,
                LipstickColor: 0,
                BlushOpacity: 1.0,
                BlushColor: 0,
                FullMakeupSecondaryColor: 0,
                FullMakeupDefaultColor: 1,
                FullMakeupPrimaryColor: 0,
                FullMakeupType: -1,
                BlushType: -1,
            },
            tattoos: [],
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'switch@michael@sitting',
            anim: 'idle',
            flag: 1,
        });

        this.targetFactory.createForBoxZone(
            'halloween2022:scenario4:createPedAurelien',
            {
                ...new BoxZone([2046.74, 2978.95, -61.9], 0.8, 0.8, {
                    heading: 52.35,
                    minZ: -62.9,
                    maxZ: -60.9,
                }),
            },
            [
                {
                    label: 'Aurelien',
                    icon: 'fas fa-question',
                    action: async () => {
                        this.notifier.notify('...', 'info');
                    },
                },
            ]
        );
    }

    private async createPedGuegette() {
        await this.pedFactory.createPed({
            model: 'mp_f_freemode_01',
            coords: { x: 2048.53, y: 2978.29, z: -62.9, w: 340.7 },
            modelCustomization: {
                SkinMix: 0.5,
                ShapeMix: 0.5,
                Mother: 31,
                Father: 42,
                Hash: -1667301416,
            },
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
                2: [7, 0, 0],
                6: [7, 1, 0],
            },
            face: {
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
            hair: {
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
            makeup: {
                FullMakeupOpacity: 1,
                LipstickType: -1,
                LipstickColor: 0,
                FullMakeupPrimaryColor: 0,
                BlushOpacity: 1,
                BlushColor: 0,
                FullMakeupSecondaryColor: 0,
                FullMakeupDefaultColor: 1,
                LipstickOpacity: 1,
                FullMakeupType: -1,
                BlushType: -1,
            },
            tattoos: [
                {
                    collection: 598190139,
                    overlay: 1953024330,
                },
                {
                    collection: -363871405,
                    overlay: 1152609891,
                },
                {
                    collection: -363871405,
                    overlay: -1009472289,
                },
                {
                    collection: -1201369729,
                    overlay: 547139312,
                },
                {
                    collection: -1398869298,
                    overlay: 258827560,
                },
                {
                    collection: -1398869298,
                    overlay: -1004417654,
                },
                {
                    collection: -1368357453,
                    overlay: -741632440,
                },
                {
                    collection: -240234547,
                    overlay: -2015343582,
                },
                {
                    collection: -1398869298,
                    overlay: 1157448359,
                },
                {
                    collection: -1368357453,
                    overlay: -1621104712,
                },
                {
                    collection: -363871405,
                    overlay: -1677889748,
                },
                {
                    collection: -1398869298,
                    overlay: 552929095,
                },
                {
                    collection: -1201369729,
                    overlay: -1897002095,
                },
                {
                    collection: -1398869298,
                    overlay: -87213624,
                },
                {
                    collection: -1398869298,
                    overlay: 552929095,
                },
                {
                    collection: -1398869298,
                    overlay: 552929095,
                },
                {
                    collection: -1398869298,
                    overlay: 893595891,
                },
                {
                    collection: -1398869298,
                    overlay: -434629734,
                },
                {
                    collection: -2086773,
                    overlay: 990002533,
                },
                {
                    collection: -1398869298,
                    overlay: 43105745,
                },
                {
                    collection: -1398869298,
                    overlay: -1758069771,
                },
                {
                    collection: -1398869298,
                    overlay: -673512330,
                },
                {
                    collection: -1398869298,
                    overlay: -1445222284,
                },
                {
                    collection: -363871405,
                    overlay: -511607931,
                },
            ],
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'switch@michael@sitting',
            anim: 'idle',
            flag: 1,
        });

        this.targetFactory.createForBoxZone(
            'halloween2022:scenario4:createPedGuegette',
            {
                ...new BoxZone([2048.24, 2977.92, -61.9], 0.8, 0.6, {
                    heading: 235.58,
                    minZ: -62.9,
                    maxZ: -60.9,
                }),
            },
            [
                {
                    label: 'Guegette',
                    icon: 'fas fa-question',
                    action: async () => {
                        this.notifier.notify('...', 'info');
                    },
                },
            ]
        );
    }
}
