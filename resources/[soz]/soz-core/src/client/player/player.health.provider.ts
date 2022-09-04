import { Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { emitRpc } from '../../core/rpc';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { Feature, isFeatureEnabled } from '../../shared/features';
import { PlayerData } from '../../shared/player';
import { BoxZone } from '../../shared/polyzone/box.zone';
import { Vector3, Vector4 } from '../../shared/polyzone/vector';
import { RpcEvent } from '../../shared/rpc';
import { AnimationService } from '../animation/animation.service';
import { Notifier } from '../notifier';
import { NuiDispatch } from '../nui/nui.dispatch';
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
        coords: [-1204.74, -1564.26, 4.61, 30.12] as Vector4,
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
        coords: [-1199.98, -1571.16, 4.61, 215.66] as Vector4,
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
];

const UNARMED_WEAPON_HASH = GetHashKey('WEAPON_UNARMED');

const MAX_RUN_COUNT = 5;
const RUN_DURATION = 45;

@Provider()
export class PlayerHealthProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(AnimationService)
    private animationService: AnimationService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    private runningStartTime: number | null = null;

    private lastExerciseCompleted: number | null = null;

    private strengthExercisesCount = 0;

    private runCount = 0;

    private sportZone = new BoxZone([-1202.52, -1566.88, 4.37], 12.2, 26.2, {
        maxZ: 6.37,
        minZ: 3.37,
    });

    @Tick(TickInterval.EVERY_MINUTE)
    private async nutritionLoop(): Promise<void> {
        if (this.playerService.isLoggedIn()) {
            TriggerServerEvent(ServerEvent.PLAYER_NUTRITION_LOOP);
        }
    }

    @Tick(TickInterval.EVERY_HOUR)
    private async nutritionCheck(): Promise<void> {
        if (!isFeatureEnabled(Feature.MyBodySummer)) {
            return;
        }

        if (this.playerService.isLoggedIn()) {
            TriggerServerEvent(ServerEvent.PLAYER_NUTRITION_CHECK);
        }
    }

    private doStrengthExercise(): void {
        this.strengthExercisesCount++;

        let displayExercisesCount = this.strengthExercisesCount % 10;

        if (displayExercisesCount === 0) {
            displayExercisesCount = 10;
        }

        this.notifier.notify(`Exercice ${displayExercisesCount} / 10.`, 'success');

        if (this.strengthExercisesCount % 10 === 0) {
            this.notifier.notify('Vous vous sentez plus en forme.', 'success');
            TriggerServerEvent(ServerEvent.PLAYER_INCREASE_STRENGTH);
        }

        if (this.strengthExercisesCount >= 30) {
            this.notifier.notify('Vous vous sentez fatigué, il est temps de faire une pause.', 'error');
            this.lastExerciseCompleted = GetGameTimer();
            this.strengthExercisesCount = 0;
        }
    }

    private canDoExercise(): boolean {
        if (!this.lastExerciseCompleted || GetGameTimer() - this.lastExerciseCompleted > 60 * 1000 * 60 * 2) {
            return true;
        }

        this.notifier.notify('Vous êtes trop fatigué pour faire un autre exercice.', 'error');

        return false;
    }

    @OnEvent(ClientEvent.PLAYER_HEALTH_DO_PUSH_UP)
    public async doPushUps(): Promise<void> {
        if (!this.canDoExercise()) {
            return;
        }

        const position = GetEntityCoords(PlayerPedId(), true) as Vector3;

        if (!this.sportZone.isPointInside(position)) {
            this.notifier.notify("Vous devez être à l'interieur de la zone de musculation.", 'error');

            return;
        }

        await this.animationService.playAnimation({
            enter: {
                dictionary: 'amb@world_human_push_ups@male@enter',
                name: 'enter',
                duration: 3050,
            },
            base: {
                dictionary: 'amb@world_human_push_ups@male@base',
                name: 'base',
                duration: 10000,
            },
            exit: {
                dictionary: 'amb@world_human_push_ups@male@exit',
                name: 'exit',
                duration: 3400,
            },
        });

        this.doStrengthExercise();
    }

    @OnEvent(ClientEvent.PLAYER_HEALTH_DO_SIT_UP)
    public async doSitUps(): Promise<void> {
        if (!this.canDoExercise()) {
            return;
        }

        const position = GetEntityCoords(PlayerPedId(), true) as Vector3;

        if (!this.sportZone.isPointInside(position)) {
            this.notifier.notify("Vous devez être à l'interieur de la zone de musculation.", 'error');

            return;
        }

        await this.animationService.playAnimation({
            enter: {
                dictionary: 'amb@world_human_sit_ups@male@enter',
                name: 'enter',
                duration: 3050,
            },
            base: {
                dictionary: 'amb@world_human_sit_ups@male@base',
                name: 'base',
                duration: 10000,
            },
            exit: {
                dictionary: 'amb@world_human_sit_ups@male@exit',
                name: 'exit',
                duration: 3400,
            },
        });

        this.doStrengthExercise();
    }

    private async doFreeWeight(): Promise<void> {
        if (!this.canDoExercise()) {
            return;
        }

        await this.animationService.playScenario({
            name: 'world_human_muscle_free_weights',
            duration: 10000,
        });

        this.doStrengthExercise();
    }

    private async doChinUps(coords: Vector4): Promise<void> {
        if (!this.canDoExercise()) {
            return;
        }

        await this.animationService.walkToCoords(coords, 2000);

        await this.animationService.playScenario({
            name: 'prop_human_muscle_chin_ups',
            duration: 10000,
        });

        this.doStrengthExercise();
    }

    @Tick(TickInterval.EVERY_FRAME)
    async checkRunning(): Promise<void> {
        if (!isFeatureEnabled(Feature.MyBodySummer)) {
            return;
        }

        if (this.runningStartTime) {
            const duration = (GetGameTimer() - this.runningStartTime) / 1000;

            if (duration >= RUN_DURATION) {
                this.runningStartTime = null;
                this.runCount++;

                if (this.runCount > MAX_RUN_COUNT) {
                    this.notifier.notify("Vous avez beaucoup couru aujourd'hui, reposez vous.", 'error');

                    return;
                } else {
                    this.notifier.notify('Vous vous sentez plus en forme.', 'success');

                    TriggerServerEvent(ServerEvent.PLAYER_INCREASE_STAMINA);
                }
            }
        }

        if (IsPedRunning(PlayerPedId())) {
            if (!this.runningStartTime) {
                this.runningStartTime = GetGameTimer();
            }
        } else {
            this.runningStartTime = null;
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
                    label: 'Soulever le poids',
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

    @Tick(TickInterval.EVERY_FRAME)
    async setDamageMultiplier(): Promise<void> {
        if (!isFeatureEnabled(Feature.MyBodySummer)) {
            return;
        }

        const player = this.playerService.getPlayer();

        if (!player) {
            return;
        }

        const multiplier = player.metadata.strength / 100;

        if (GetSelectedPedWeapon(PlayerPedId()) === UNARMED_WEAPON_HASH) {
            SetPlayerWeaponDamageModifier(PlayerId(), multiplier);
        } else {
            SetPlayerWeaponDamageModifier(PlayerId(), 1.0);
        }
    }
}
