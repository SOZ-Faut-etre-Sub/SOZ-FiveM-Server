import { Once, OnceStep } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { emitRpc } from '../../../core/rpc';
import { wait } from '../../../core/utils';
import { Feature, isFeatureEnabled } from '../../../shared/features';
import { Vector4 } from '../../../shared/polyzone/vector';
import { RpcEvent } from '../../../shared/rpc';
import { Halloween2022Scenario4 } from '../../../shared/story/halloween-2022/scenario4';
import { Dialog } from '../../../shared/story/story';
import { AnimationService } from '../../animation/animation.service';
import { BlipFactory } from '../../blip';
import { EntityFactory } from '../../factory/entity.factory';
import { PedFactory } from '../../factory/ped.factory';
import { Notifier } from '../../notifier';
import { PlayerService } from '../../player/player.service';
import { ProgressService } from '../../progress.service';
import { TargetFactory } from '../../target/target.factory';
import { StoryProvider } from '../story.provider';

@Provider()
export class Halloween2022Scenario4Provider {
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

    @Inject(Notifier)
    private notifier: Notifier;

    @Once(OnceStep.PlayerLoaded)
    public async onPlayerLoaded() {
        if (!isFeatureEnabled(Feature.HalloweenScenario4)) {
            return;
        }

        this.blipFactory.create('halloween_scenario4', {
            name: 'Activité suspecte',
            coords: { x: -1538.24, y: 217.14, z: 59.88 },
            sprite: 484,
            scale: 0.99,
            color: 44,
        });

        await this.createPedsFiB();
        await this.createPedDOA();
        await this.createPedSheriffNord();
        await this.createPedSheriffSud();
        await this.createPedAlien();
        await this.createPedZerator();

        await this.createTeleport();
        await this.createActionZones();

        // Caméo de la mort
        await this.createPedNariieL(); // TODO: text
        await this.createPedDraglock();
        await this.createPedPoulpito();
        await this.createPedSniteur();
        await this.createPedKaemy();
        await this.createPedBrouznouf();
        await this.createPedFrozennide();
        await this.createPedMcFloy(); // TODO: text
        await this.createPedBlaqq(); // TODO: text
        await this.createPedRigonkmalk();
        await this.createPedOneiluj(); // TODO: text
        await this.createPedLasbou(); // TODO: text
        await this.createPedTheSeds();
        await this.createPedDaelbhas(); // TODO: text
        await this.createPedOjymas();
        await this.createPedPano();
        await this.createPedVik();
        await this.createPedDream();
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
                    canInteract: () => this.storyService.canInteractForPart('halloween2022', 'scenario4', 1),
                    action: async () => {
                        const dialog = await emitRpc<Dialog | null>(RpcEvent.STORY_HALLOWEEN_SCENARIO4, 'part1');
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
                        const dialog = await emitRpc<Dialog | null>(RpcEvent.STORY_HALLOWEEN_SCENARIO4, 'part2');
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
                        const dialog = await emitRpc<Dialog | null>(RpcEvent.STORY_HALLOWEEN_SCENARIO4, 'part3');
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
                        const dialog = await emitRpc<Dialog | null>(RpcEvent.STORY_HALLOWEEN_SCENARIO4, 'part4');
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
                        const dialog = await emitRpc<Dialog | null>(RpcEvent.STORY_HALLOWEEN_SCENARIO4, 'part7');
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
                            const dialog = await emitRpc<Dialog | null>(RpcEvent.STORY_HALLOWEEN_SCENARIO4, zone.name);
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
                ShapeMix: 0.95,
                Father: 6,
                Mother: 21,
            },
            components: {
                1: [0, 0, 0],
                3: [4, 0, 0],
                2: [86, 0, 0],
                4: [8, 0, 0],
                7: [0, 0, 0],
                6: [6, 0, 0],
                9: [54, 0, 0],
                8: [152, 0, 0],
                11: [13, 0, 0],
                10: [0, 0, 0],
            },
            props: {
                6: [7, 1, 0],
            },
            face: {
                CheeksBoneHigh: 0.0,
                NosePeakLength: 0.0,
                Blemish: -1,
                NoseWidth: 0.0,
                ChimpBoneLength: 0.0,
                ChimpHole: 0.0,
                JawBoneWidth: 0.0,
                Ageing: -1,
                EyebrowHigh: 0.0,
                NeckThickness: 0.0,
                NoseBoneHigh: 0.0,
                ChimpBoneWidth: 0.0,
                Moles: 0,
                ChimpBoneLower: 0.0,
                NoseBoneTwist: 0.0,
                LipsThickness: 0.0,
                JawBoneBackLength: 0.0,
                CheeksWidth: 0.0,
                Complexion: -1,
                EyeColor: 2,
                CheeksBoneWidth: 0.0,
                BodyBlemish: -1,
                EyebrowForward: 0.0,
                AddBodyBlemish: -1,
                EyesOpening: 0.0,
                NosePeakLower: 0.0,
                NosePeakHeight: 0.0,
            },
            hair: {
                BeardType: -1,
                HairColor: 14,
                EyebrowColor: 8,
                EyebrowOpacity: 1.0,
                BeardOpacity: 1.0,
                HairSecondaryColor: 10,
                ChestHairOpacity: 1.0,
                ChestHairColor: 0,
                EyebrowType: 1,
                BeardColor: 0,
                ChestHairType: -1,
                HairType: 3,
            },
            makeup: {
                FullMakeupType: 1,
                LipstickOpacity: 0.7,
                BlushOpacity: 0.4,
                FullMakeupSecondaryColor: 0,
                FullMakeupPrimaryColor: 0,
                LipstickColor: 2,
                LipstickType: 0,
                FullMakeupOpacity: 1.0,
                BlushType: 0,
                BlushColor: 6,
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
                        this.notifier.notify(
                            "... Prononce un truc incompréhensible mais ca avait l'air intéressant ...",
                            'info'
                        );
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

    private async createPedTheSeds() {
        await this.pedFactory.createPed({
            model: 'mp_f_freemode_01',
            coords: { x: 2132.94, y: 2924.91, z: -62.9, w: 234.28 },
            modelCustomization: {
                Father: 12,
                ShapeMix: 0.75,
                SkinMix: 0.3,
                Mother: 31,
            },
            components: {
                1: [0, 0, 0],
                3: [9, 0, 0],
                4: [3, 7, 0],
                6: [52, 0, 0],
                7: [8, 0, 0],
                8: [51, 1, 0],
                9: [0, 0, 0],
                10: [44, 9, 0],
                11: [192, 2, 0],
            },
            props: {
                0: [32, 1, 0],
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
                EyeColor: 0,
                Moles: 3,
                ChimpBoneLower: 0.0,
                NosePeakLower: 0.0,
                CheeksBoneWidth: 0.0,
                JawBoneBackLength: 0.0,
                CheeksWidth: 0.0,
                Complexion: -1,
                BodyBlemish: -1,
                NoseBoneTwist: 0.0,
                NosePeakHeight: 0.0,
                EyebrowForward: 0.0,
                AddBodyBlemish: -1,
                EyesOpening: 0.0,
                Blemish: 1,
                LipsThickness: 0.8,
            },
            hair: {
                BeardType: -1,
                BeardColor: 0,
                EyebrowColor: 57,
                HairColor: 35,
                BeardOpacity: 1.0,
                HairSecondaryColor: 32,
                ChestHairOpacity: 1.0,
                ChestHairColor: 0,
                EyebrowType: 0,
                ChestHairType: -1,
                EyebrowOpacity: 1.0,
                HairType: 81,
            },
            makeup: {
                FullMakeupType: 55,
                LipstickOpacity: 1.0,
                BlushOpacity: 0.6,
                FullMakeupOpacity: 0.65,
                FullMakeupPrimaryColor: 56,
                LipstickColor: 0,
                FullMakeupSecondaryColor: 52,
                LipstickType: 0,
                BlushType: -1,
                BlushColor: 0,
            },
            tattoos: [
                { collection: 598190139, overlay: -1352706360 },
                { collection: -1056335443, overlay: 1617489838 },
                { collection: 598190139, overlay: -766009308 },
                { collection: -1016521996, overlay: -131581709 },
                { collection: -1056335443, overlay: 1027059614 },
                { collection: -240234547, overlay: -2015343582 },
                { collection: 1347816957, overlay: 373164468 },
                { collection: -1201369729, overlay: -358202620 },
                { collection: -1368357453, overlay: 363449858 },
                { collection: 598190139, overlay: 1103130600 },
                { collection: -1398869298, overlay: -1156010272 },
                { collection: -1201369729, overlay: -38278649 },
                { collection: 598190139, overlay: -766009308 },
                { collection: 1926256505, overlay: 1896039464 },
                { collection: 1616273011, overlay: 1832021545 },
                { collection: 1616273011, overlay: 1832021545 },
                { collection: 1616273011, overlay: 1832021545 },
                { collection: 1616273011, overlay: 1832021545 },
                { collection: 1616273011, overlay: 1832021545 },
                { collection: 1616273011, overlay: 1832021545 },
                { collection: 1616273011, overlay: 1832021545 },
                { collection: 1616273011, overlay: 1832021545 },
                { collection: 1616273011, overlay: 1832021545 },
                { collection: 1616273011, overlay: 1832021545 },
                { collection: 1616273011, overlay: -648193607 },
                { collection: 1616273011, overlay: -648193607 },
                { collection: 1616273011, overlay: -648193607 },
                { collection: 1616273011, overlay: -648193607 },
                { collection: 1616273011, overlay: -648193607 },
                { collection: 1616273011, overlay: -648193607 },
                { collection: 1616273011, overlay: -648193607 },
                { collection: 1616273011, overlay: 2025651359 },
                { collection: 1616273011, overlay: 2025651359 },
                { collection: -1398869298, overlay: 1252285617 },
                { collection: -1398869298, overlay: 1252285617 },
                { collection: -1398869298, overlay: 1252285617 },
                { collection: -1398869298, overlay: 1252285617 },
                { collection: -1398869298, overlay: 1252285617 },
                { collection: -1398869298, overlay: 1252285617 },
                { collection: -1398869298, overlay: 1252285617 },
                { collection: -975527441, overlay: 962023066 },
                { collection: -975527441, overlay: 962023066 },
                { collection: -975527441, overlay: 962023066 },
                { collection: -975527441, overlay: 962023066 },
                { collection: -975527441, overlay: 962023066 },
                { collection: -975527441, overlay: 962023066 },
                { collection: -975527441, overlay: 962023066 },
                { collection: 598190139, overlay: -150640257 },
                { collection: 598190139, overlay: -150640257 },
                { collection: 598190139, overlay: -150640257 },
                { collection: 598190139, overlay: -922055286 },
                { collection: 598190139, overlay: -922055286 },
                { collection: 598190139, overlay: -922055286 },
                { collection: 598190139, overlay: -922055286 },
                { collection: 598190139, overlay: -922055286 },
                { collection: 598190139, overlay: -150640257 },
                { collection: 598190139, overlay: -150640257 },
                { collection: 598190139, overlay: -150640257 },
                { collection: 598190139, overlay: -150640257 },
                { collection: 598190139, overlay: -150640257 },
                { collection: 62137527, overlay: -481389646 },
                { collection: 62137527, overlay: -481389646 },
                { collection: 62137527, overlay: -481389646 },
                { collection: 62137527, overlay: -481389646 },
                { collection: 62137527, overlay: -481389646 },
                { collection: 62137527, overlay: -481389646 },
                { collection: -1016521996, overlay: -1545551839 },
                { collection: -1016521996, overlay: -1545551839 },
                { collection: -1016521996, overlay: -1545551839 },
            ],
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'anim@heists@heist_corona@single_team',
            anim: 'single_team_loop_boss',
            flag: 1,
        });

        this.targetFactory.createForBoxZone(
            'halloween2022:scenario4:createPedTheSeds',
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
                    label: 'TheSeds',
                    icon: 'fas fa-question',
                    action: async () => {
                        this.notifier.notify(
                            "J'suis encore en retard dans mes corrections... Hein, quoi? Oui, je viendrai tester plus tard... Mais pas besoin, l'évent a été fantastique, non?",
                            'info'
                        );
                    },
                },
            ]
        );
    }

    private async createPedVik() {
        await this.pedFactory.createPed({
            model: 'mp_m_freemode_01',
            coords: { x: 2055.13, y: 2941.55, z: -62.9, w: 356.66 },
            modelCustomization: {
                Father: 43,
                ShapeMix: 0.35,
                SkinMix: 0.55,
                Mother: 31,
            },
            components: {
                1: [51, 1, 0],
                3: [5, 0, 0],
                4: [71, 0, 0],
                6: [51, 0, 0],
                7: [0, 0, 0],
                8: [15, 0, 0],
                9: [0, 0, 0],
                10: [0, 0, 0],
                11: [237, 2, 0],
            },
            props: {
                0: [83, 5, 0],
                1: [5, 3, 0],
                7: [5, 0, 0],
            },
            face: {
                CheeksBoneHigh: 0.0,
                NosePeakLength: 0.0,
                ChimpBoneWidth: 0.0,
                NoseWidth: -0.5,
                ChimpBoneLength: 0.0,
                ChimpHole: 0.0,
                JawBoneWidth: 0.5,
                Ageing: -1,
                EyebrowHigh: 0.0,
                NeckThickness: 0.2,
                NoseBoneHigh: 0.8,
                NosePeakHeight: -0.4,
                Moles: -1,
                BodyBlemish: -1,
                NoseBoneTwist: -0.1,
                ChimpBoneLower: 0.0,
                JawBoneBackLength: -0.2,
                CheeksWidth: 0.0,
                Complexion: -1,
                NosePeakLower: 0.0,
                CheeksBoneWidth: 0.0,
                Blemish: -1,
                EyebrowForward: 0.0,
                AddBodyBlemish: -1,
                EyesOpening: 0.5,
                EyeColor: 0,
                LipsThickness: 0.0,
            },
            hair: {
                BeardType: 26,
                BeardColor: 0,
                EyebrowColor: 62,
                HairColor: 58,
                BeardOpacity: 1.0,
                HairSecondaryColor: 0,
                ChestHairOpacity: 1.0,
                ChestHairColor: 0,
                EyebrowType: 0,
                ChestHairType: 1,
                EyebrowOpacity: 1.0,
                HairType: 19,
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
                { collection: 598190139, overlay: -1352706360 },
                { collection: -1719270477, overlay: 472458130 },
                { collection: 1529191571, overlay: 1045897298 },
                { collection: 1529191571, overlay: 2088037441 },
                { collection: -240234547, overlay: -964908188 },
                { collection: -240234547, overlay: 682382693 },
                { collection: 598190139, overlay: 701448198 },
                { collection: 598190139, overlay: 1369179057 },
                { collection: -1398869298, overlay: 1395583642 },
                { collection: -363871405, overlay: -1732002225 },
                { collection: 1529191571, overlay: -1502257606 },
                { collection: -1016521996, overlay: -256036523 },
                { collection: -240234547, overlay: 1396060544 },
                { collection: 1529191571, overlay: -1528465573 },
                { collection: 598190139, overlay: 1029633009 },
                { collection: -240234547, overlay: -1937668252 },
                { collection: 1616273011, overlay: 291473683 },
            ],
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'missfbi3_party_d',
            anim: 'stand_talk_loop_a_male3',
            flag: 1,
        });

        this.targetFactory.createForBoxZone(
            'halloween2022:scenario4:createPedVik',
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
                    label: 'Vik',
                    icon: 'fas fa-question',
                    action: async () => {
                        this.notifier.notify(
                            "Jamais vu autant de monde avoir des hallucinations... Ok ok j'ai fais 2-3 crises cardiaques mais c'était bien fun.",
                            'info'
                        );
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
                        this.notifier.notify("Il parait qu'il y a un fantôme qui sort son téléphone au BCSO ?", 'info');
                    },
                },
            ]
        );
    }

    private async createPedFrozennide() {
        await this.pedFactory.createPed({
            model: 'mp_m_freemode_01',
            coords: { x: 2050.93 + 0.3, y: 2984.02 + 0.45, z: -62.4 - 0.5, w: 329.0 },
            modelCustomization: { SkinMix: 0.75, Father: 10, Mother: 31, ShapeMix: 0.25 },
            components: {
                4: [103, 1, 0],
                3: [11, 0, 0],
                6: [1, 0, 0],
                1: [0, 0, 0],
                7: [0, 0, 0],
                8: [15, 0, 0],
                10: [0, 0, 0],
                11: [354, 11, 0],
                9: [0, 0, 0],
            },
            props: {},
            face: {
                ChimpBoneLower: 0.0,
                NoseBoneHigh: -0.3,
                EyesOpening: -0.6,
                EyeColor: 5,
                Complexion: -1,
                ChimpBoneLength: 0.0,
                LipsThickness: 0.4,
                CheeksBoneHigh: -0.7,
                CheeksWidth: -0.5,
                NosePeakLower: 0.0,
                CheeksBoneWidth: -0.6,
                EyebrowHigh: 0.0,
                NeckThickness: -0.5,
                NosePeakHeight: -0.1,
                Ageing: 0,
                Moles: -1,
                ChimpBoneWidth: 0.0,
                EyebrowForward: 0.3,
                JawBoneWidth: 0.3,
                JawBoneBackLength: 0.2,
                BodyBlemish: -1,
                NosePeakLength: -0.5,
                ChimpHole: 0.0,
                NoseWidth: 0.5,
                AddBodyBlemish: -1,
                Blemish: -1,
                NoseBoneTwist: 0.0,
            },
            hair: {
                BeardType: 10,
                EyebrowColor: 2,
                BeardColor: 2,
                ChestHairType: 4,
                ChestHairOpacity: 0.8,
                EyebrowOpacity: 1.0,
                EyebrowType: 26,
                HairColor: 1,
                HairType: 31,
                ChestHairColor: 2,
                BeardOpacity: 0.85,
                HairSecondaryColor: 27,
            },
            makeup: {
                LipstickColor: 0,
                BlushColor: 0,
                FullMakeupOpacity: 1.0,
                LipstickType: -1,
                FullMakeupType: -1,
                BlushOpacity: 1.0,
                LipstickOpacity: 1.0,
                FullMakeupSecondaryColor: 0,
                BlushType: -1,
                FullMakeupPrimaryColor: 0,
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
            'halloween2022:scenario4:createPedFrozennide',
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
                    label: 'Frozennide',
                    icon: 'fas fa-question',
                    action: async () => {
                        this.notifier.notify(
                            'Je ne suis pas souvent en ville, mais à chaque fois que je viens, il pleut... bref...',
                            'info'
                        );
                    },
                },
            ]
        );
    }

    private async createPedMcFloy() {
        await this.pedFactory.createPed({
            model: 'mp_m_freemode_01',
            coords: { x: 2052.05 + 0.27, y: 2983.15 + 0.45, z: -62.4 - 0.5, w: 334.0 },
            modelCustomization: { SkinMix: 0.5, Father: 0, Mother: 33, ShapeMix: 0.3 },
            components: {
                9: [0, 0, 0],
                7: [0, 0, 0],
                8: [15, 0, 0],
                6: [20, 0, 0],
                3: [11, 0, 0],
                4: [25, 0, 0],
                1: [0, 0, 0],
                10: [0, 0, 0],
                11: [260, 14, 0],
            },
            props: {
                1: [33, 0, 0],
                7: [2, 0, 0],
                0: [12, 0, 0],
                6: [19, 1, 0],
            },
            face: {
                CheeksBoneHigh: -0.6,
                EyebrowHigh: 0.0,
                NoseWidth: 0.2,
                EyebrowForward: -0.1,
                JawBoneBackLength: 0.1,
                NeckThickness: 0.3,
                CheeksWidth: -0.2,
                NosePeakLower: 0.3,
                Moles: -1,
                NoseBoneTwist: 0.0,
                ChimpBoneLength: 0.1,
                NoseBoneHigh: 0.0,
                Ageing: -1,
                JawBoneWidth: 0.6,
                Blemish: -1,
                CheeksBoneWidth: 0.7,
                LipsThickness: 0.3,
                Complexion: -1,
                NosePeakHeight: -0.4,
                AddBodyBlemish: -1,
                BodyBlemish: -1,
                NosePeakLength: 0.3,
                EyesOpening: -0.2,
                ChimpHole: 0.0,
                EyeColor: 3,
                ChimpBoneWidth: 0.4,
                ChimpBoneLower: -0.1,
            },
            hair: {
                HairType: 17,
                EyebrowType: 28,
                BeardColor: 60,
                EyebrowOpacity: 1.0,
                ChestHairType: 1,
                HairSecondaryColor: 5,
                ChestHairColor: 61,
                ChestHairOpacity: 1.0,
                BeardType: 10,
                HairColor: 58,
                EyebrowColor: 61,
                BeardOpacity: 1.0,
            },
            makeup: {
                LipstickColor: 0,
                BlushOpacity: 1.0,
                LipstickOpacity: 1.0,
                FullMakeupSecondaryColor: 0,
                LipstickType: -1,
                FullMakeupOpacity: 1.0,
                BlushColor: 0,
                BlushType: -1,
                FullMakeupPrimaryColor: 0,
                FullMakeupType: -1,
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
            'halloween2022:scenario4:createPedMcFloy',
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
                    label: 'McFloy',
                    icon: 'fas fa-question',
                    action: async () => {
                        this.notifier.notify(
                            "... Prononce un truc incompréhensible mais ca avait l'air intéressant ...",
                            'info'
                        );
                    },
                },
            ]
        );
    }

    private async createPedBlaqq() {
        await this.pedFactory.createPed({
            model: 'mp_m_freemode_01',
            coords: { x: 2048.51 + 0.5, y: 2981.56, z: -62.39 - 0.5, w: 283.99 },
            modelCustomization: { Father: 43, SkinMix: 0.5, Mother: 34, ShapeMix: 0.5 },
            components: {
                11: [89, 0, 0],
                10: [0, 0, 0],
                1: [0, 0, 0],
                3: [6, 0, 0],
                4: [0, 1, 0],
                6: [1, 0, 0],
                7: [0, 0, 0],
                8: [15, 0, 0],
                9: [0, 0, 0],
            },
            props: {},
            face: {
                CheeksWidth: -0.3,
                ChimpHole: 0.0,
                LipsThickness: 0.7,
                NeckThickness: -1.0,
                NosePeakLower: -0.9,
                NoseBoneTwist: 0.0,
                Ageing: -1,
                BodyBlemish: 0,
                EyesOpening: 1.0,
                ChimpBoneLength: 0.0,
                NoseWidth: -1.0,
                ChimpBoneWidth: 1.0,
                ChimpBoneLower: 0.0,
                AddBodyBlemish: -1,
                Complexion: -1,
                JawBoneWidth: -1.0,
                NosePeakLength: -0.7,
                EyebrowHigh: 0.0,
                EyebrowForward: 1.0,
                NosePeakHeight: 0.4,
                CheeksBoneWidth: 0.6,
                NoseBoneHigh: -0.4,
                Blemish: -1,
                JawBoneBackLength: -1.0,
                EyeColor: 2,
                Moles: 6,
                CheeksBoneHigh: 0.4,
            },
            hair: {
                BeardType: 4,
                ChestHairOpacity: 1.0,
                HairSecondaryColor: 2,
                ChestHairColor: 0,
                BeardOpacity: 1.0,
                HairType: 36,
                EyebrowColor: 56,
                HairColor: 61,
                EyebrowType: 0,
                EyebrowOpacity: 1.0,
                BeardColor: 0,
                ChestHairType: -1,
            },
            makeup: {
                FullMakeupPrimaryColor: 0,
                BlushOpacity: 0.5,
                LipstickOpacity: 1.0,
                FullMakeupType: -1,
                BlushType: 0,
                FullMakeupSecondaryColor: 0,
                LipstickColor: 0,
                BlushColor: 1,
                LipstickType: -1,
                FullMakeupOpacity: 1.0,
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
            'halloween2022:scenario4:createPedBlaqq',
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
                    label: 'BlaqqEndWhyT',
                    icon: 'fas fa-question',
                    action: async () => {
                        this.notifier.notify(
                            "... Prononce un truc incompréhensible mais ca avait l'air intéressant ...",
                            'info'
                        );
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
                1: [0, 0, 0],
                3: [11, 0, 0],
                4: [22, 8, 0],
                6: [51, 0, 0],
                7: [8, 0, 0],
                8: [38, 1, 0],
                9: [0, 0, 0],
                10: [43, 0, 0],
                11: [190, 3, 0],
            },
            props: {
                0: [33, 1, 0],
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
                            "... Prononce un truc incompréhensible mais ca avait l'air intéressant ...",
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
                1: [0, 0, 0],
                3: [11, 0, 0],
                4: [35, 0, 0],
                5: [52, 0, 0],
                6: [51, 0, 0],
                7: [8, 0, 0],
                8: [56, 0, 0],
                9: [0, 0, 0],
                10: [44, 5, 0],
                11: [190, 0, 0],
            },
            props: {},
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
                        this.notifier.notify(
                            "... Prononce un truc incompréhensible mais ca avait l'air intéressant ...",
                            'info'
                        );
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
                            "... Prononce un truc incompréhensible mais ca avait l'air intéressant ...",
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
            coords: { x: 2103.28, y: 2944.7, z: -62.9, w: 258.68 },
            modelCustomization: { Mother: 29, SkinMix: 0.75, Father: 44, ShapeMix: 0.0 },
            components: {
                11: [21, 2, 0],
                6: [7, 2, 0],
                7: [0, 0, 0],
                8: [6, 0, 0],
                1: [0, 0, 0],
                2: [19, 0, 0],
                3: [11, 0, 0],
                4: [25, 0, 0],
                9: [0, 0, 0],
                10: [0, 0, 0],
                0: [0, 0, 0],
            },
            props: {
                6: [4, 1, 0],
                0: [7, 0, 0],
            },
            face: {
                EyebrowHigh: 0.0,
                ChimpBoneWidth: 0.0,
                CheeksBoneWidth: 0.0,
                EyesOpening: 0.4,
                NosePeakLength: 0.0,
                ChimpBoneLength: -1.0,
                NosePeakHeight: 0.0,
                Ageing: 4,
                Blemish: -1,
                AddBodyBlemish: -1,
                NoseBoneHigh: 0.0,
                JawBoneBackLength: 0.0,
                LipsThickness: 0.6,
                EyebrowForward: 0.4,
                NeckThickness: 0.0,
                CheeksWidth: 0.0,
                ChimpHole: 0.0,
                NoseBoneTwist: 0.0,
                NosePeakLower: 0.0,
                CheeksBoneHigh: 0.0,
                NoseWidth: -0.8,
                ChimpBoneLower: 0.0,
                EyeColor: 0,
                Moles: -1,
                Complexion: -1,
                BodyBlemish: -1,
                JawBoneWidth: 0.8,
            },
            hair: {
                EyebrowType: 8,
                ChestHairOpacity: 1.0,
                HairSecondaryColor: 0,
                EyebrowColor: 8,
                ChestHairColor: 0,
                EyebrowOpacity: 1.0,
                BeardColor: 6,
                BeardType: 11,
                ChestHairType: 0,
                HairType: 19,
                HairColor: 7,
                BeardOpacity: 0.75,
            },
            makeup: {
                FullMakeupOpacity: 1.0,
                FullMakeupPrimaryColor: 0,
                BlushType: -1,
                LipstickType: -1,
                BlushOpacity: 1.0,
                BlushColor: 0,
                LipstickColor: 0,
                FullMakeupType: -1,
                LipstickOpacity: 1.0,
                FullMakeupSecondaryColor: 0,
            },
            tattoos: [{ overlay: 875367934, collection: -1056335443 }],
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
                center: [2103.28, 2944.7, -62.9],
                length: 1,
                width: 1,
                heading: 258,
                minZ: -64,
                maxZ: -61,
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

    private async createPedPano() {
        await this.pedFactory.createPed({
            model: 'mp_m_freemode_01',
            coords: { x: 2053.91, y: 2942.04, z: -62.9, w: 357.21 },
            modelCustomization: { Father: 16, SkinMix: 0.8, Mother: 26, ShapeMix: 0.45 },
            components: {
                9: [0, 0, 0],
                8: [15, 0, 0],
                7: [0, 0, 0],
                6: [8, 8, 0],
                4: [8, 14, 0],
                3: [11, 0, 0],
                10: [0, 0, 0],
                11: [234, 25, 0],
                1: [0, 0, 0],
            },
            props: {
                0: [122, 0, 0],
                6: [31, 0, 0],
                1: [5, 0, 0],
            },
            face: {
                LipsThickness: 0.5,
                EyebrowHigh: 0.0,
                JawBoneWidth: 0.3,
                EyesOpening: 0.0,
                AddBodyBlemish: -1,
                NoseWidth: -0.9,
                ChimpBoneLength: 0.0,
                ChimpBoneWidth: 0.0,
                NoseBoneHigh: 0.5,
                Ageing: -1,
                EyeColor: 7,
                ChimpHole: 0.0,
                EyebrowForward: 0.0,
                CheeksWidth: 0.0,
                NoseBoneTwist: 0.0,
                NosePeakLength: 0.6,
                BodyBlemish: -1,
                CheeksBoneHigh: 0.0,
                NosePeakLower: 0.2,
                Blemish: -1,
                JawBoneBackLength: 0.0,
                CheeksBoneWidth: 0.0,
                Moles: -1,
                NosePeakHeight: 0.0,
                Complexion: -1,
                NeckThickness: 1.0,
                ChimpBoneLower: 0.0,
            },
            hair: {
                BeardType: 11,
                EyebrowColor: 4,
                ChestHairOpacity: 1.0,
                ChestHairColor: 0,
                BeardColor: 8,
                HairType: 19,
                HairColor: 13,
                ChestHairType: -1,
                EyebrowOpacity: 1.0,
                HairSecondaryColor: 12,
                BeardOpacity: 1.0,
                EyebrowType: 0,
            },
            makeup: {
                FullMakeupOpacity: 1.0,
                FullMakeupPrimaryColor: 0,
                FullMakeupType: -1,
                LipstickColor: 0,
                BlushOpacity: 1.0,
                LipstickOpacity: 1.0,
                BlushType: -1,
                FullMakeupSecondaryColor: 0,
                LipstickType: -1,
                BlushColor: 0,
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
            'halloween2022:scenario4:createPedPano',
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
                    label: 'Pano',
                    icon: 'fas fa-question',
                    action: async () => {
                        this.notifier.notify(
                            "J'ai pas les 100 citrouilles avec une carte et le no clip. PS: Pello n'est pas mort, ce n'est donc pas un fantôme.",
                            'info'
                        );
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
}
