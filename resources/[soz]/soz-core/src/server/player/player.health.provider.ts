import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { Feature, isFeatureEnabled } from '../../shared/features';
import { PlayerData, PlayerServerStateExercise } from '../../shared/player';
import { PollutionLevel } from '../../shared/pollution';
import { RpcEvent } from '../../shared/rpc';
import { Hud } from '../hud';
import { Notifier } from '../notifier';
import { Pollution } from '../pollution';
import { PlayerMoneyService } from './player.money.service';
import { PlayerService } from './player.service';
import { PlayerStateService } from './player.state.service';

const HUNGER_RATE = -1.6;
const THIRST_RATE = -2.2;
const ALCOHOL_RATE = -3.8;
const DRUG_RATE = -2.1;
const STRENGTH_RATE = -1.0;
const MAX_STAMINA_RATE = -2.0;
const STRESS_RATE = -1.0;

@Provider()
export class PlayerHealthProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(PlayerStateService)
    private playerStateService: PlayerStateService;

    @Inject(Pollution)
    private pollution: Pollution;

    @Inject(Hud)
    private hud: Hud;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(PlayerMoneyService)
    private playerMoneyService: PlayerMoneyService;

    @OnEvent(ServerEvent.PLAYER_NUTRITION_LOOP)
    public async nutritionLoop(source: number): Promise<void> {
        const player = this.playerService.getPlayer(source);

        if (player === null || player.metadata.godmode || player.metadata.isdead) {
            return;
        }

        const playerState = this.playerStateService.getByCitizenId(player.citizenid);

        let hungerDiff = HUNGER_RATE;
        let thirstDiff = THIRST_RATE;

        if (this.pollution.getPollutionLevel() == PollutionLevel.High) {
            hungerDiff *= 1.2;
            thirstDiff *= 1.2;
        }

        if (player.metadata.organ === 'rein') {
            hungerDiff -= 8.4;
        }

        if (player.metadata.organ === 'foie') {
            thirstDiff -= 7.6;
        }

        this.playerService.incrementMetadata(source, 'hunger', hungerDiff, 0, 100);
        this.playerService.incrementMetadata(source, 'thirst', thirstDiff, 0, 100);
        this.playerService.incrementMetadata(source, 'alcohol', ALCOHOL_RATE, 0, 200);
        this.playerService.incrementMetadata(source, 'drug', DRUG_RATE, 0, 200);

        if (isFeatureEnabled(Feature.MyBodySummer)) {
            if (!player.metadata.last_strength_update) {
                this.playerService.setPlayerMetadata(source, 'last_strength_update', new Date().toUTCString());
            } else {
                const lastUpdate = new Date(player.metadata.last_strength_update);
                const now = new Date();
                const diff = now.getTime() - lastUpdate.getTime();

                if (diff > 30 * 60 * 1000 && playerState.lostStrength < 4 && playerState.exercise.completed < 4) {
                    this.playerService.setPlayerMetadata(source, 'last_strength_update', new Date().toUTCString());
                    this.playerService.incrementMetadata(source, 'strength', STRENGTH_RATE, 60, 150);
                    this.playerService.updatePlayerMaxWeight(source);

                    playerState.lostStrength += 1;

                    this.notifier.notify(source, 'Vous vous sentez ~r~moins puissant~s~.', 'error');
                }
            }

            if (!player.metadata.last_max_stamina_update) {
                this.playerService.setPlayerMetadata(source, 'last_max_stamina_update', new Date().toUTCString());
            } else {
                const lastUpdate = new Date(player.metadata.last_max_stamina_update);
                const now = new Date();
                const diff = now.getTime() - lastUpdate.getTime();

                if (diff > 60 * 60 * 1000 && playerState.lostStamina < 3 && playerState.runTime < 60 * 8) {
                    this.playerService.setPlayerMetadata(source, 'last_max_stamina_update', new Date().toUTCString());
                    this.playerService.incrementMetadata(source, 'max_stamina', MAX_STAMINA_RATE, 60, 150);

                    playerState.lostStamina += 1;

                    this.notifier.notify(source, 'Vous vous sentez ~r~moins athlétique~s~.', 'error');
                }
            }

            if (!player.metadata.last_stress_level_update) {
                this.playerService.setPlayerMetadata(source, 'last_stress_level_update', new Date().toUTCString());
            } else {
                const lastUpdate = new Date(player.metadata.last_stress_level_update);
                const now = new Date();
                const diff = now.getTime() - lastUpdate.getTime();

                if (diff > 1000 * 60 * 30) {
                    this.playerService.setPlayerMetadata(source, 'last_stress_level_update', new Date().toUTCString());
                    this.playerService.incrementMetadata(source, 'stress_level', STRESS_RATE, 0, 100);

                    this.notifier.notify(source, 'Vous vous sentez moins ~g~angoissé~s~.', 'success');
                }
            }
        }

        this.hud.updateNeeds(source);
        this.playerService.save(source);
    }

    @OnEvent(ServerEvent.PLAYER_INCREASE_STRENGTH)
    public async increaseStrength(source: number, exercise: keyof PlayerServerStateExercise): Promise<void> {
        const player = this.playerService.getPlayer(source);

        if (player === null || player.metadata.godmode || player.metadata.isdead) {
            return;
        }

        const playerState = this.playerStateService.getByCitizenId(player.citizenid);

        if (playerState.exercise[exercise]) {
            return;
        }

        playerState.exercise[exercise] = true;
        playerState.exercise.completed += 1;

        this.playerService.incrementMetadata(source, 'strength', 2, 60, 150);
        this.playerService.updatePlayerMaxWeight(source);
    }

    @OnEvent(ServerEvent.PLAYER_INCREASE_STAMINA)
    public async increaseStamina(source: number): Promise<void> {
        this.playerService.setPlayerMetadata(source, 'last_max_stamina_update', new Date().toUTCString());
        this.playerService.incrementMetadata(source, 'max_stamina', 2, 60, 150);
    }

    @OnEvent(ServerEvent.PLAYER_INCREASE_STRESS)
    public async increaseStress(source: number, stress: number): Promise<void> {
        this.playerService.setPlayerMetadata(source, 'last_stress_level_update', new Date().toUTCString());
        this.playerService.incrementMetadata(source, 'stress_level', stress, 0, 100);
    }

    @OnEvent(ServerEvent.PLAYER_INCREASE_RUN_TIME)
    public async increaseRunTime(source: number): Promise<void> {
        const player = this.playerService.getPlayer(source);

        if (player === null || player.metadata.godmode || player.metadata.isdead) {
            return;
        }

        const playerState = this.playerStateService.getByCitizenId(player.citizenid);

        playerState.runTime += 1;

        if (playerState.runTime > 60 * 8) {
            return;
        }

        if (playerState.runTime % 60 === 0) {
            const minutes = playerState.runTime / 60;

            if (playerState.runTime % 120 == 0) {
                this.playerService.incrementMetadata(source, 'max_stamina', 1);
            }

            if (minutes < 8) {
                this.notifier.notify(
                    source,
                    `Tu as couru durant ${minutes} ${
                        minutes === 1 ? 'minute' : 'minutes'
                    } ! Tu te sens de plus en plus endurant, continue comme ça.`,
                    'success'
                );
            } else if (minutes === 8) {
                this.notifier.notify(
                    source,
                    "Tu as couru tes 8 minutes de la journée ! Tu te sens en forme pour toute la journée. Courir n'améliore plus ton endurance, et ce, jusqu'au lendemain.",
                    'success'
                );
            }
        }
    }

    @OnEvent(ServerEvent.PLAYER_SHOW_HEALTH_BOOK)
    public async showHealthBook(source: number, target: number): Promise<void> {
        TriggerClientEvent(ClientEvent.PLAYER_REQUEST_HEALTH_BOOK, target, source, 'see');
    }

    @OnEvent(ServerEvent.IDENTITY_HIDE_AROUND)
    public async identityHideAround(source: number, target: number): Promise<void> {
        TriggerClientEvent(ClientEvent.IDENTITY_HIDE, target);
    }

    @OnEvent(ServerEvent.PLAYER_DO_YOGA)
    public async doYoga(source: number): Promise<void> {
        const player = this.playerService.getPlayer(source);

        if (player === null) {
            return;
        }

        const playerState = this.playerStateService.getByCitizenId(player.citizenid);

        if (playerState.yoga) {
            return;
        }

        playerState.yoga = true;

        this.notifier.notify(source, 'Vous vous sentez moins ~g~angoissé~s~.', 'success');

        await this.increaseStress(source, -8);
    }

    @Rpc(RpcEvent.PLAYER_GET_HEALTH_BOOK)
    public getHealthBook(source: number, target: number): PlayerData | null {
        const targetPlayer = this.playerService.getPlayer(target);

        if (targetPlayer === null) {
            return null;
        }

        return targetPlayer;
    }

    @OnEvent(ServerEvent.PLAYER_HEALTH_GYM_SUBSCRIBE)
    public onGymSubscribe(source: number) {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        if (player.metadata.gym_subscription_expire_at && player.metadata.gym_subscription_expire_at > Date.now()) {
            return;
        }

        if (this.playerMoneyService.remove(source, 300)) {
            this.playerService.setPlayerMetadata(
                source,
                'gym_subscription_expire_at',
                Date.now() + 7 * 24 * 60 * 60 * 1000
            );

            this.notifier.notify(source, `Merci pour votre ~g~abonnement~s~ à la salle de sport.`, 'success');
        } else {
            this.notifier.notify(
                source,
                `Payez notre abonnement d'une semaine pour ~r~$300~s~ afin de rofiter de nos vestiaires et installations sportives !`,
                'error'
            );
        }
    }
}
