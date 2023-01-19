import { On, Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { emitRpc } from '../../core/rpc';
import { Component, WardrobeConfig } from '../../shared/cloth';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { Feature, isFeatureEnabled } from '../../shared/features';
import { PlayerData, PlayerServerState, PlayerServerStateExercise } from '../../shared/player';
import { getDistance, Vector3, Vector4 } from '../../shared/polyzone/vector';
import { getRandomInt, getRandomItem } from '../../shared/random';
import { RpcEvent } from '../../shared/rpc';
import { AnimationService } from '../animation/animation.service';
import { BlipFactory } from '../blip';
import { Notifier } from '../notifier';
import { NuiDispatch } from '../nui/nui.dispatch';
import { ProgressService } from '../progress.service';
import { TargetFactory } from '../target/target.factory';
import { PlayerService } from './player.service';
import { PlayerWardrobe } from './player.wardrobe';

const CHIN_UPS_COORDS = [
    {
        name: 'chin_ups_1',
        zone: {
            center: [-1205.14, -1563.84, 4.61] as Vector3,
            heading: 35,
            width: 1.0,
            length: 1.2,
            minZ: 3.61,
            maxZ: 6.61,
        },
        coords: [-1204.74, -1564.26, 4.61, 38.12] as Vector4,
    },
    {
        name: 'chin_ups_2',
        zone: {
            center: [-1199.66, -1571.64, 4.61] as Vector3,
            heading: 305,
            width: 1.4,
            length: 1.0,
            minZ: 3.61,
            maxZ: 6.61,
        },
        coords: [-1199.98, -1571.16, 4.61, 216.0] as Vector4,
    },
    {
        name: 'chin_ups_3',
        zone: {
            center: [-1203.67, -1562.44, 4.62] as Vector3,
            heading: 35,
            width: 1.6,
            length: 1.2,
            minZ: 3.61,
            maxZ: 6.61,
        },
        coords: [-1203.06, -1563.18, 4.61, 38.15] as Vector4,
    },
    {
        name: 'chin_ups_4',
        zone: {
            center: [-1197.97, -1570.77, 4.61] as Vector3,
            heading: 35,
            width: 1.6,
            length: 1.2,
            minZ: 3.61,
            maxZ: 6.61,
        },
        coords: [-1198.53, -1570.13, 4.61, 216.0] as Vector4,
    },
    {
        name: 'chin_ups_5',
        zone: {
            center: [1449.22, 3573.09, 35.71] as Vector3,
            heading: 22,
            width: 0.6,
            length: 1.6,
            minZ: 33.71,
            maxZ: 38.71,
        },
        coords: [1449.04, 3573.3, 35.71, 202] as Vector4,
    },
    {
        name: 'chin_ups_6',
        zone: {
            center: [1465.43, 3579.09, 35.71] as Vector3,
            heading: 0,
            width: 1.4,
            length: 1.6,
            minZ: 34.71,
            maxZ: 38.71,
        },
        coords: [1464.63, 3579.07, 35.71, 270] as Vector4,
    },
    {
        name: 'chin_ups_7',
        zone: {
            center: [1464.34, 3582.6, 35.71] as Vector3,
            heading: 44,
            width: 1.4,
            length: 1.6,
            minZ: 34.71,
            maxZ: 38.71,
        },
        coords: [1463.8, 3581.92, 35.71, 314] as Vector4,
    },
    {
        name: 'chin_ups_8',
        zone: {
            center: [249.44, -268.54, 59.92] as Vector3,
            heading: 340,
            width: 1.2,
            length: 1.4,
            minZ: 58.92,
            maxZ: 62.92,
        },
        coords: [248.8, -268.39, 59.92, 255.54] as Vector4,
    },
    {
        name: 'chin_ups_9',
        zone: {
            center: [250.43, -266.64, 59.92] as Vector3,
            heading: 309,
            width: 1.4,
            length: 1.6,
            minZ: 58.92,
            maxZ: 62.92,
        },
        coords: [251.21, -266.92, 59.92, 70.94] as Vector4,
    },
];

const FREE_WEIGHT_COORDS = [
    {
        name: 'free_weight_1',
        zone: {
            center: [-1203.27, -1573.62, 4.61] as Vector3,
            length: 1.8,
            minZ: 3.61,
            maxZ: 6.61,
            width: 1,
            heading: 35,
        },
    },
    {
        name: 'free_weight_2',
        zone: {
            center: [-1197.5, -1564.53, 4.61] as Vector3,
            length: 1.8,
            width: 1,
            minZ: 3.61,
            maxZ: 6.61,
            heading: 36,
        },
    },
    {
        name: 'free_weight_3',
        zone: {
            center: [-1210.12, -1558.44, 4.61] as Vector3,
            length: 1.8,
            width: 1.2,
            minZ: 3.61,
            maxZ: 6.61,
            heading: 320,
        },
    },
    {
        name: 'free_weight_4',
        zone: {
            center: [1448.04, 3578.79, 35.71] as Vector3,
            length: 1.0,
            width: 1.6,
            minZ: 34.71,
            maxZ: 38.71,
            heading: 23,
        },
    },
    {
        name: 'free_weight_5',
        zone: {
            center: [1444.32, 3577.33, 35.71] as Vector3,
            length: 1.0,
            width: 1.6,
            minZ: 34.71,
            maxZ: 38.71,
            heading: 21,
        },
    },
];

const GymWardrobeConfig: WardrobeConfig = {
    [GetHashKey('mp_m_freemode_01')]: {
        'Homme natation': {
            Components: {
                [Component.Torso]: { Drawable: 15, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 16, Texture: 0, Palette: 0 },
                [Component.Shoes]: { Drawable: 34, Texture: 0, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 15, Texture: 0, Palette: 0 },
            },
            Props: {},
        },
        'Homme sport': {
            Components: {
                [Component.Torso]: { Drawable: 5, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 12, Texture: 0, Palette: 0 },
                [Component.Shoes]: { Drawable: 31, Texture: 0, Palette: 3 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 237, Texture: 0, Palette: 13 },
            },
            Props: {},
        },
    },
    [GetHashKey('mp_f_freemode_01')]: {
        'Femme natation': {
            Components: {
                [Component.Torso]: { Drawable: 15, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 17, Texture: 9, Palette: 0 },
                [Component.Shoes]: { Drawable: 35, Texture: 0, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 2, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 18, Texture: 0, Palette: 0 },
            },
            Props: {},
        },
        'Femme sport': {
            Components: {
                [Component.Torso]: { Drawable: 15, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 10, Texture: 0, Palette: 0 },
                [Component.Shoes]: { Drawable: 81, Texture: 0, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 284, Texture: 4, Palette: 0 },
            },
            Props: {},
        },
    },
};

const EXERCISE_TIME = 90_000;

@Provider()
export class PlayerHealthProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(AnimationService)
    private animationService: AnimationService;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Inject(PlayerWardrobe)
    private playerWardrobe: PlayerWardrobe;

    private lastRunPosition = null;

    @Tick(TickInterval.EVERY_MINUTE)
    private async nutritionLoop(): Promise<void> {
        if (this.playerService.isLoggedIn()) {
            TriggerServerEvent(ServerEvent.PLAYER_NUTRITION_LOOP);
        }
    }

    private async doStrengthExercise(type: keyof PlayerServerStateExercise) {
        const playerState = await emitRpc<PlayerServerState>(RpcEvent.PLAYER_GET_SERVER_STATE);

        if (playerState.exercise.completed === 0) {
            this.notifier.notify(
                "Tu as débuté ta Daily Routine ! Effectue 4 exercices afin ~g~d'augmenter ta force~s~.",
                'success'
            );
        }

        TriggerServerEvent(ServerEvent.PLAYER_INCREASE_STRENGTH, type);

        if (!playerState.exercise[type] && playerState.exercise.completed < 3) {
            this.notifier.notify(
                `Tu as complété ${playerState.exercise.completed + 1} des exercices de ta Daily Routine, Keep up !`,
                'success'
            );
        } else if (!playerState.exercise[type] && playerState.exercise.completed === 3) {
            this.notifier.notify(
                "Tu as terminé ta Daily Routine ! Tu te sens en forme pour toute la journée. Il t'est inutile de faire plus de sport, tes muscles ont besoins de repos.",
                'success'
            );
        }
    }

    private canDoExercise(): boolean {
        const player = this.playerService.getPlayer();

        if (!player) {
            return false;
        }

        if (player.metadata.disease) {
            this.notifier.notify("Vous êtes ~r~malade~s~, vous ne pouvez pas faire d'exercice.", 'error');

            return false;
        }

        return true;
    }

    @OnEvent(ClientEvent.PLAYER_HEALTH_DO_FREE_WEIGHT)
    public async doFreeWeight(): Promise<void> {
        if (!this.canDoExercise()) {
            return;
        }

        this.animationService
            .playScenario({
                name: 'world_human_muscle_free_weights',
            })
            .then(cancelled => {
                if (cancelled) {
                    this.progressService.cancel();
                }
            });
        const { completed } = await this.progressService.progress(
            'Haltères',
            'Vous faites des haltères...',
            EXERCISE_TIME
        );

        if (completed) {
            await this.doStrengthExercise('freeWeight');
        }

        this.animationService.stop();
    }

    @OnEvent(ClientEvent.PLAYER_HEALTH_DO_PUSH_UP)
    public async doPushUps(): Promise<void> {
        await this.doSports('amb@world_human_push_ups@male@', 'pushUp', 'Vous faites des pompes...', 3800, 5166);
    }

    @OnEvent(ClientEvent.PLAYER_HEALTH_DO_SIT_UP)
    public async doSitUps(): Promise<void> {
        await this.doSports('amb@world_human_sit_ups@male@', 'sitUp', 'Vous faites des abdos...', 4000, 5000);
    }

    private async doChinUps(coords: Vector4): Promise<void> {
        await this.animationService.walkToCoords(coords, 2000);

        await this.doSports(
            'amb@prop_human_muscle_chin_ups@male@',
            'chinUp',
            'Vous faites des tractions...',
            2800,
            2100
        );
    }

    private async doSports(
        dict: string,
        type: keyof PlayerServerStateExercise,
        message: string,
        enterduration: number,
        exitduration: number
    ): Promise<void> {
        if (!this.canDoExercise()) {
            return;
        }

        const animationPromise = this.animationService
            .playAnimation({
                enter: enterduration
                    ? {
                          dictionary: dict + 'enter',
                          name: 'enter',
                          duration: enterduration,
                          options: {
                              enablePlayerControl: false,
                          },
                      }
                    : null,
                base: {
                    dictionary: dict + 'base',
                    name: 'base',
                    options: {
                        enablePlayerControl: false,
                        repeat: true,
                    },
                },
                exit: exitduration
                    ? {
                          dictionary: dict + 'exit',
                          name: 'exit',
                          duration: exitduration,
                          options: {
                              enablePlayerControl: false,
                          },
                      }
                    : null,
            })
            .then(cancelled => {
                if (cancelled) {
                    this.progressService.cancel();
                }
            });

        const { completed } = await this.progressService.progress(type, message, EXERCISE_TIME);

        if (completed) {
            this.doStrengthExercise(type);
        }

        this.animationService.stop();

        await animationPromise;
    }

    @Tick(TickInterval.EVERY_SECOND)
    async checkRunning(): Promise<void> {
        if (!isFeatureEnabled(Feature.MyBodySummer)) {
            return;
        }

        const player = this.playerService.getPlayer();

        if (!player) {
            return;
        }

        if (player.metadata.isdead || player.metadata.disease) {
            return;
        }

        const playerPed = PlayerPedId();
        const currentVehicle = GetVehiclePedIsIn(playerPed, false);
        const isRunning = IsPedRunning(playerPed) || IsPedSprinting(playerPed);
        const isSwimming = IsPedSwimming(playerPed);
        const isInBicycle = currentVehicle && IsThisModelABicycle(GetEntityModel(currentVehicle));

        if (isRunning || isSwimming || isInBicycle) {
            const position = GetEntityCoords(playerPed, true) as Vector3;

            if (this.lastRunPosition !== null) {
                const distance = getDistance(this.lastRunPosition, position);

                if ((distance > 2.5 && isSwimming) || isRunning || (distance > 5.0 && isInBicycle)) {
                    TriggerServerEvent(ServerEvent.PLAYER_INCREASE_RUN_TIME);
                }
            }

            this.lastRunPosition = position;
        } else {
            this.lastRunPosition = null;
        }

        const playerId = PlayerId();
        const stamina = GetPlayerStamina(playerId);
        if (player.metadata.max_stamina >= 100.0) {
            if (stamina >= 100 && stamina < player.metadata.max_stamina && !IsPedSprinting(playerPed)) {
                const deltastam = isRunning ? 1.0 : 3.33;
                const newstamina = Math.min(player.metadata.max_stamina, stamina + deltastam);
                SetPlayerMaxStamina(playerId, newstamina);
                RestorePlayerStamina(playerId, 1.0);
                SetPlayerMaxStamina(playerId, 100.0);
            }
        } else {
            if (stamina > player.metadata.max_stamina && IsPedSprinting(playerPed)) {
                SetPlayerStamina(playerId, stamina - (100 - player.metadata.max_stamina));
            }
        }
    }

    @OnEvent(ClientEvent.PLAYER_REQUEST_HEALTH_BOOK)
    async requestHealthBook(target: number, action: 'see' | 'show'): Promise<void> {
        if (action === 'show') {
            TriggerServerEvent(ServerEvent.PLAYER_SHOW_HEALTH_BOOK, target);

            return;
        }

        const targetPlayer = await emitRpc<PlayerData | null>(RpcEvent.PLAYER_GET_HEALTH_BOOK, target);

        if (null !== targetPlayer) {
            this.nuiDispatch.dispatch('health_book', 'ShowHealthBook', targetPlayer);
        }
    }

    @OnEvent(ClientEvent.IDENTITY_HIDE)
    async identityHide(): Promise<void> {
        this.nuiDispatch.dispatch('health_book', 'HideHealthBook');
    }

    @Once()
    async onStart(): Promise<void> {
        if (!isFeatureEnabled(Feature.MyBodySummer)) {
            return;
        }

        for (const { name, zone, coords } of CHIN_UPS_COORDS) {
            this.targetFactory.createForBoxZone(name, zone, [
                {
                    label: 'Faire des tractions',
                    canInteract: () => true,
                    action: () => {
                        this.doChinUps(coords);
                    },
                },
            ]);
        }

        for (const { name, zone } of FREE_WEIGHT_COORDS) {
            this.targetFactory.createForBoxZone(name, zone, [
                {
                    label: 'Faire des haltères',
                    canInteract: () => true,
                    action: () => {
                        this.doFreeWeight();
                    },
                },
            ]);
        }
    }

    @Once(OnceStep.PlayerLoaded)
    async onPlayerLoaded(): Promise<void> {
        if (!isFeatureEnabled(Feature.MyBodySummer)) {
            return;
        }

        this.blipFactory.create('outdoorSport1', {
            name: 'Zone de sport',
            coords: { x: -1202.53, y: -1567.85, z: 4.44 }, // vector3(-1202.53, -1567.85, 4.44)
            sprite: 311,
            scale: 0.9,
            color: 5,
        });

        this.blipFactory.create('outdoorSport2', {
            name: 'Zone de sport',
            coords: { x: 1453.92, y: 3576.09, z: 36.06 },
            sprite: 311,
            scale: 0.9,
            color: 5,
        });

        this.blipFactory.create('musclePeach', {
            name: 'Salle de sport',
            coords: { x: 256.3, y: -256.14, z: 54.02 },
            sprite: 311,
            scale: 0.9,
            color: 47,
        });

        const targets = [
            {
                icon: 'c:jobs/habiller.png',
                label: 'Changer de tenue',
                canInteract: () => {
                    const player = this.playerService.getPlayer();

                    if (!player) {
                        return false;
                    }

                    if (!player.metadata.gym_subscription_expire_at) {
                        return false;
                    }

                    return (
                        player.metadata.gym_subscription_expire_at &&
                        player.metadata.gym_subscription_expire_at > Date.now()
                    );
                },
                action: async () => {
                    const menWardrobe = GymWardrobeConfig[GetHashKey('mp_m_freemode_01')];
                    const femaleWardrobe = GymWardrobeConfig[GetHashKey('mp_f_freemode_01')];

                    menWardrobe['Homme natation'].Components[Component.Legs].Texture = getRandomInt(0, 11);
                    menWardrobe['Homme sport'].Components[Component.Legs].Texture = getRandomItem([0, 5, 7, 12]);
                    menWardrobe['Homme sport'].Components[Component.Shoes].Texture = getRandomInt(0, 4);
                    menWardrobe['Homme sport'].Components[Component.Undershirt].Texture = getRandomInt(0, 7);
                    menWardrobe['Homme sport'].Components[Component.Tops].Texture = getRandomInt(0, 20);

                    const randomSwimTexture = getRandomInt(0, 11);

                    femaleWardrobe['Femme natation'].Components[Component.Legs].Texture = randomSwimTexture;
                    femaleWardrobe['Femme natation'].Components[Component.Tops].Texture = randomSwimTexture;
                    femaleWardrobe['Femme sport'].Components[Component.Legs].Texture = getRandomInt(0, 2);
                    femaleWardrobe['Femme sport'].Components[Component.Shoes].Texture = getRandomInt(0, 3);
                    femaleWardrobe['Femme sport'].Components[Component.Tops].Texture = getRandomInt(0, 11);

                    const outfitSelection = await this.playerWardrobe.selectOutfit(GymWardrobeConfig, 'Tenue civile');

                    if (outfitSelection.canceled) {
                        return;
                    }

                    const { completed } = await this.progressService.progress(
                        'switch_clothes',
                        "Changement d'habits...",
                        5000,
                        {
                            name: 'male_shower_towel_dry_to_get_dressed',
                            dictionary: 'anim@mp_yacht@shower@male@',
                            options: {
                                cancellable: false,
                                enablePlayerControl: false,
                            },
                        },
                        {
                            disableCombat: true,
                            disableMovement: true,
                        }
                    );

                    if (!completed) {
                        return;
                    }

                    if (outfitSelection.outfit) {
                        TriggerServerEvent('soz-character:server:SetPlayerJobClothes', outfitSelection.outfit);
                    } else {
                        TriggerServerEvent('soz-character:server:SetPlayerJobClothes', null);
                    }
                },
            },
        ];

        this.targetFactory.createForBoxZone(
            'gym_wardrobe_1',
            {
                center: [265.31, -271.74, 53.98],
                heading: 251,
                width: 12.4,
                length: 4.2,
                minZ: 52.98,
                maxZ: 56.98,
            },
            targets
        );

        this.targetFactory.createForBoxZone(
            'gym_wardrobe_2',
            {
                center: [274.64, -275.26, 53.98],
                heading: 251,
                width: 12.2,
                length: 4.6,
                minZ: 52.98,
                maxZ: 56.98,
            },
            targets
        );

        this.targetFactory.createForPed({
            model: 'a_f_y_fitness_01',
            coords: { w: 341.61, x: 258.39, y: -271.52, z: 52.96 },
            invincible: true,
            freeze: true,
            spawnNow: true,
            blockevents: true,
            animDict: 'anim@amb@casino@valet_scenario@pose_d@',
            anim: 'base_a_m_y_vinewood_01',
            flag: 49,
            target: {
                distance: 2.5,
                options: [
                    {
                        label: 'Prendre un abonnement.',
                        canInteract: () => {
                            const player = this.playerService.getPlayer();

                            if (!player) {
                                return false;
                            }

                            return !player.metadata.gym_subscription_expire_at;
                        },
                        action: () => {
                            TriggerServerEvent(ServerEvent.PLAYER_HEALTH_GYM_SUBSCRIBE);
                        },
                    },
                    {
                        label: 'Renouveler son abonnement.',
                        canInteract: () => {
                            const player = this.playerService.getPlayer();

                            if (!player) {
                                return false;
                            }

                            if (!player.metadata.gym_subscription_expire_at) {
                                return false;
                            }

                            return (
                                player.metadata.gym_subscription_expire_at &&
                                player.metadata.gym_subscription_expire_at < Date.now()
                            );
                        },
                        action: () => {
                            TriggerServerEvent(ServerEvent.PLAYER_HEALTH_GYM_SUBSCRIBE);
                        },
                    },
                ],
            },
        });
    }

    @On('QBCore:Player:SetPlayerData')
    public async updateMaxHealth(playerData: PlayerData): Promise<void> {
        const playerPed = PlayerPedId();
        SetPedMaxHealth(playerPed, playerData.metadata.max_health);

        if (GetEntityHealth(playerPed) > playerData.metadata.max_health) {
            SetEntityHealth(playerPed, playerData.metadata.max_health);
        }
    }
}
