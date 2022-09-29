import { Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { wait } from '../../core/utils';
import { Disease } from '../../shared/disease';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { Feature, isFeatureEnabled } from '../../shared/features';
import { PlayerData } from '../../shared/player';
import { PollutionLevel } from '../../shared/pollution';
import { AnimationService } from '../animation/animation.service';
import { Notifier } from '../notifier';
import { Pollution } from '../pollution';
import { PlayerService } from './player.service';

const DISEASE_RANGE: Record<PollutionLevel, number> = {
    [PollutionLevel.Low]: 2000,
    [PollutionLevel.Neutral]: 1000,
    [PollutionLevel.High]: 500,
};

@Provider()
export class PlayerDiseaseProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(AnimationService)
    private animationService: AnimationService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(Pollution)
    private pollution: Pollution;

    private currentDisease: Disease = false;

    private currentDiseaseLoop: Promise<void> | null = null;

    private async fluLoop(): Promise<void> {
        while (this.currentDisease === 'grippe') {
            const [playerPed, distance] = this.playerService.getClosestPlayer();
            const playerServerId = GetPlayerServerId(playerPed);
            const propagation = Math.round(Math.random() * 4);

            if (playerServerId != -1 && distance < 4.5 && propagation == 0) {
                TriggerServerEvent(ServerEvent.PLAYER_SET_CURRENT_DISEASE, 'grippe', playerServerId);
            }

            await wait(1000 * 60);
        }
    }

    private async commonColdLoop(): Promise<void> {
        while (this.currentDisease === 'rhume') {
            TriggerScreenblurFadeIn(100);

            await this.animationService.playAnimation({
                base: {
                    dictionary: 'amb@code_human_wander_idles_fat@female@idle_a',
                    name: 'idle_b_sneeze',
                    duration: 1800,
                    options: {
                        enablePlayerControl: true,
                        onlyUpperBody: true,
                    },
                },
            });

            TriggerScreenblurFadeOut(100);
            ClearPedTasks(PlayerPedId());

            await wait(1000 * 10);
        }
    }

    private async backPainLoop(): Promise<void> {
        while (this.currentDisease === 'backpain') {
            DisableControlAction(0, 21, true);
            DisableControlAction(0, 22, true);

            await wait(0);
        }
    }

    private async intoxicationLoop(): Promise<void> {
        while (this.currentDisease === 'intoxication') {
            await this.animationService.playAnimation({
                base: {
                    dictionary: 'random@drunk_driver_1',
                    name: 'vomit_outside',
                    options: {
                        onlyUpperBody: true,
                    },
                    duration: 1500,
                },
            });

            ClearPedTasks(PlayerPedId());

            await wait(45 * 1000);
        }
    }

    @OnEvent(ClientEvent.LSMC_DISEASE_APPLY_CURRENT_EFFECT)
    public applyCurrentDiseaseEffect(disease: Disease) {
        if (disease === false) {
            TriggerScreenblurFadeOut(120);
            ClearPedTasks(PlayerPedId());

            this.currentDisease = false;
            this.currentDiseaseLoop = null;

            return;
        }

        if (this.currentDisease) {
            return;
        }

        this.currentDisease = disease;

        if (disease === 'rhume') {
            this.notifier.notify('Vous avez un petit rhume.');
            this.currentDiseaseLoop = this.commonColdLoop();
        }

        if (disease === 'grippe') {
            TriggerScreenblurFadeIn(100);

            this.notifier.notify('Vous avez la grippe.');
            this.currentDiseaseLoop = this.fluLoop();
        }

        if (disease === 'backpain') {
            this.notifier.notify('Vous avez mal au dos.');
            this.currentDiseaseLoop = this.backPainLoop();
        }

        if (disease === 'intoxication') {
            this.notifier.notify('Vous avez mangé un truc pas frais...');
            this.currentDiseaseLoop = this.intoxicationLoop();
        }
    }

    @Tick(TickInterval.EVERY_15_MINUTE)
    public async diseaseLoop(): Promise<void> {
        const player = this.playerService.getPlayer();

        if (player === null || player.metadata.godmode || player.metadata.isdead) {
            return;
        }

        const range = Math.max(DISEASE_RANGE[this.pollution.getPollutionLevel()], 10);
        const diseaseApply = Math.round(Math.random() * range);

        if (diseaseApply == 1) {
            TriggerServerEvent(ServerEvent.PLAYER_SET_CURRENT_DISEASE, 'rhume');
        }

        if (diseaseApply == 10) {
            TriggerServerEvent(ServerEvent.PLAYER_SET_CURRENT_DISEASE, 'grippe');
        }
    }

    @Once(OnceStep.PlayerLoaded)
    async onPlayerLoaded(player: PlayerData): Promise<void> {
        if (player.metadata.disease) {
            this.applyCurrentDiseaseEffect(player.metadata.disease);
        }
    }
}
