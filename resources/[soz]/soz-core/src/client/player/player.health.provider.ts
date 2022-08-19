import { Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { ServerEvent } from '../../shared/event';
import { Feature, isFeatureEnabled } from '../../shared/features';
import { PlayerData } from '../../shared/player';
import { Vector3, Vector4 } from '../../shared/polyzone/vector';
import { AnimationService } from '../animation/animation.service';
import { Notifier } from '../notifier';
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

    private runningStartTime: number | null = null;

    private lastExerciseCompleted: number | null = null;

    private strengthExercisesCount = 0;

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

    private async doPushUps(): Promise<void> {
        if (!this.canDoExercise()) {
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
                duration: 4000,
            },
            exit: {
                dictionary: 'amb@world_human_push_ups@male@exit',
                name: 'exit',
                duration: 3400,
            },
        });

        this.doStrengthExercise();
    }

    private async doSitUps(): Promise<void> {
        if (!this.canDoExercise()) {
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
                duration: 4000,
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

        if (IsPedRunning(PlayerPedId())) {
            if (!this.runningStartTime) {
                this.runningStartTime = GetGameTimer();
            }
        } else {
            if (this.runningStartTime) {
                const duration = (GetGameTimer() - this.runningStartTime) / 1000;

                if (duration >= 60) {
                    this.notifier.notify('Vous vous sentez plus en forme.', 'success');

                    TriggerServerEvent(ServerEvent.PLAYER_INCREASE_STAMINA);
                }

                this.runningStartTime = null;
            }
        }

        const player = this.playerService.getPlayer();
        if (!player) {
            return;
        }
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

        // @TODO Set damage multiplier
    }
}
