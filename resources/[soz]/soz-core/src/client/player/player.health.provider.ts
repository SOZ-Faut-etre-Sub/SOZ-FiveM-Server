import { Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { emitRpc } from '../../core/rpc';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { Feature, isFeatureEnabled } from '../../shared/features';
import { PlayerData, PlayerServerState, PlayerServerStateExercise } from '../../shared/player';
import { Vector3, Vector4 } from '../../shared/polyzone/vector';
import { RpcEvent } from '../../shared/rpc';
import { AnimationService } from '../animation/animation.service';
import { Notifier } from '../notifier';
import { NuiDispatch } from '../nui/nui.dispatch';
import { ProgressService } from '../progress.service';
import { TargetFactory } from '../target/target.factory';
import { PlayerService } from './player.service';

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
];

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

    @OnEvent(ClientEvent.PLAYER_HEALTH_DO_PUSH_UP)
    public async doPushUps(): Promise<void> {
        if (!this.canDoExercise()) {
            return;
        }

        const animationPromise = this.animationService.playAnimation({
            enter: {
                dictionary: 'amb@world_human_push_ups@male@enter',
                name: 'enter',
                duration: 3050,
                options: {
                    enablePlayerControl: false,
                },
            },
            base: {
                dictionary: 'amb@world_human_push_ups@male@base',
                name: 'base',
                options: {
                    enablePlayerControl: false,
                    repeat: true,
                },
            },
            exit: {
                dictionary: 'amb@world_human_push_ups@male@exit',
                name: 'exit',
                duration: 3050,
                options: {
                    enablePlayerControl: false,
                },
            },
        });

        const { completed } = await this.progressService.progress('Pompes', 'Vous faites des pompes...', EXERCISE_TIME);

        if (completed) {
            await this.doStrengthExercise('pushUp');
        }

        this.animationService.stop();

        await animationPromise;
    }

    @OnEvent(ClientEvent.PLAYER_HEALTH_DO_SIT_UP)
    public async doSitUps(): Promise<void> {
        if (!this.canDoExercise()) {
            return;
        }

        const animationPromise = this.animationService.playAnimation({
            enter: {
                dictionary: 'amb@world_human_sit_ups@male@enter',
                name: 'enter',
                duration: 3050,
                options: {
                    enablePlayerControl: false,
                },
            },
            base: {
                dictionary: 'amb@world_human_sit_ups@male@base',
                name: 'base',
                options: {
                    enablePlayerControl: false,
                    repeat: true,
                },
            },
            exit: {
                dictionary: 'amb@world_human_sit_ups@male@exit',
                name: 'exit',
                duration: 3050,
                options: {
                    enablePlayerControl: false,
                },
            },
        });

        const { completed } = await this.progressService.progress(
            'Abdominaux',
            'Vous faites des abdos...',
            EXERCISE_TIME
        );

        if (completed) {
            await this.doStrengthExercise('sitUp');
        }

        this.animationService.stop();

        await animationPromise;
    }

    @OnEvent(ClientEvent.PLAYER_HEALTH_DO_FREE_WEIGHT)
    public async doFreeWeight(): Promise<void> {
        if (!this.canDoExercise()) {
            return;
        }

        const { completed } = await this.progressService.progress(
            'Haltères',
            'Vous faites des haltères...',
            EXERCISE_TIME,
            {
                task: 'world_human_muscle_free_weights',
                options: {
                    cancellable: true,
                    enablePlayerControl: false,
                    repeat: true,
                },
            }
        );

        if (completed) {
            await this.doStrengthExercise('freeWeight');
        }
    }

    private async doChinUps(coords: Vector4): Promise<void> {
        if (!this.canDoExercise()) {
            return;
        }

        await this.animationService.walkToCoords(coords, 2000);

        const { completed } = await this.progressService.progress(
            'Tractions',
            'Vous faites des tractions...',
            EXERCISE_TIME,
            {
                task: 'prop_human_muscle_chin_ups',
                options: {
                    cancellable: true,
                    enablePlayerControl: false,
                    repeat: true,
                },
            }
        );

        if (completed) {
            this.doStrengthExercise('chinUp');
        }
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

        if (player.metadata.isdead || player.metadata.disease !== false) {
            return;
        }

        if (IsPedRunning(PlayerPedId()) || IsPedSwimming(PlayerPedId())) {
            TriggerServerEvent(ServerEvent.PLAYER_INCREASE_RUN_TIME);
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
    async onPlayerLoaded(player: PlayerData): Promise<void> {
        if (!isFeatureEnabled(Feature.MyBodySummer)) {
            return;
        }

        SetPlayerMaxStamina(PlayerId(), player.metadata.max_stamina);
    }
}
