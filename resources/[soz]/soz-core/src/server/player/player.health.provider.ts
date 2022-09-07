import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { Feature, isFeatureEnabled } from '../../shared/features';
import { PlayerData, PlayerMetadata } from '../../shared/player';
import { PollutionLevel } from '../../shared/pollution';
import { RpcEvent } from '../../shared/rpc';
import { Hud } from '../hud';
import { Notifier } from '../notifier';
import { Pollution } from '../pollution';
import { PlayerService } from './player.service';

const HUNGER_RATE = -1.6;
const THIRST_RATE = -2.2;
const ALCOHOL_RATE = -3.8;
const DRUG_RATE = -2.1;
const FIBER_RATE = -0.5;
const LIPID_RATE = -0.5;
const SUGAR_RATE = -0.5;
const PROTEIN_RATE = -0.5;
const STRENGTH_RATE = -1.0;
const MAX_STAMINA_RATE = -1.0;
const STRESS_RATE = -1.0;

@Provider()
export class PlayerHealthProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Pollution)
    private pollution: Pollution;

    @Inject(Hud)
    private hud: Hud;

    @Inject(Notifier)
    private notifier: Notifier;

    @OnEvent(ServerEvent.PLAYER_NUTRITION_LOOP)
    public async nutritionLoop(source: number): Promise<void> {
        const player = this.playerService.getPlayer(source);

        if (player === null || player.metadata.godmode || player.metadata.isdead) {
            return;
        }

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
            this.playerService.incrementMetadata(source, 'fiber', FIBER_RATE, 0, 200);
            this.playerService.incrementMetadata(source, 'lipid', LIPID_RATE, 0, 200);
            this.playerService.incrementMetadata(source, 'sugar', SUGAR_RATE, 0, 200);
            this.playerService.incrementMetadata(source, 'protein', PROTEIN_RATE, 0, 200);

            if (!player.metadata.last_strength_update) {
                this.playerService.setPlayerMetadata(source, 'last_strength_update', new Date().toUTCString());
            } else {
                const lastUpdate = new Date(player.metadata.last_strength_update);
                const now = new Date();
                const diff = now.getTime() - lastUpdate.getTime();
                const hours = diff / (1000 * 60 * 60);

                if (hours > 1) {
                    this.playerService.setPlayerMetadata(source, 'last_strength_update', new Date().toUTCString());
                    this.playerService.incrementMetadata(source, 'strength', STRENGTH_RATE, 50, 120);
                    this.playerService.updatePlayerMaxWeight(source);

                    this.notifier.notify(source, 'Vous vous sentez ~r~moins puissant~s~.', 'error');
                }
            }

            if (!player.metadata.last_max_stamina_update) {
                this.playerService.setPlayerMetadata(source, 'last_max_stamina_update', new Date().toUTCString());
            } else {
                const lastUpdate = new Date(player.metadata.last_max_stamina_update);
                const now = new Date();
                const diff = now.getTime() - lastUpdate.getTime();
                const hours = diff / (1000 * 60 * 60);

                if (hours > 1) {
                    this.playerService.setPlayerMetadata(source, 'last_max_stamina_update', new Date().toUTCString());
                    this.playerService.incrementMetadata(source, 'max_stamina', MAX_STAMINA_RATE, 50, 120);

                    this.notifier.notify(source, 'Vous vous sentez ~r~moins athlétique~s~.', 'error');
                }
            }

            if (!player.metadata.last_stress_level_update) {
                this.playerService.setPlayerMetadata(source, 'last_stress_level_update', new Date().toUTCString());
            } else {
                const lastUpdate = new Date(player.metadata.last_stress_level_update);
                const now = new Date();
                const diff = now.getTime() - lastUpdate.getTime();

                if (diff > 1000 * 60 * 10) {
                    this.playerService.setPlayerMetadata(source, 'last_stress_level_update', new Date().toUTCString());
                    this.playerService.incrementMetadata(source, 'stress_level', STRESS_RATE, 0, 100);

                    this.notifier.notify(source, 'Vous vous sentez moins ~g~angoissé~s~.', 'error');
                }
            }
        }

        this.hud.updateNeeds(source);
        this.playerService.save(source);
    }

    @OnEvent(ServerEvent.PLAYER_INCREASE_STRENGTH)
    public async increaseStrength(source: number): Promise<void> {
        this.playerService.setPlayerMetadata(source, 'last_strength_update', new Date().toUTCString());
        this.playerService.incrementMetadata(source, 'strength', 2, 50, 120);
        this.playerService.updatePlayerMaxWeight(source);
    }

    @OnEvent(ServerEvent.PLAYER_INCREASE_STAMINA)
    public async increaseStamina(source: number): Promise<void> {
        this.playerService.setPlayerMetadata(source, 'last_max_stamina_update', new Date().toUTCString());
        this.playerService.incrementMetadata(source, 'max_stamina', 2, 50, 120);
    }

    @OnEvent(ServerEvent.PLAYER_INCREASE_STRESS)
    public async increaseStress(source: number, stress: number): Promise<void> {
        this.playerService.setPlayerMetadata(source, 'last_stress_level_update', new Date().toUTCString());
        this.playerService.incrementMetadata(source, 'stress_level', stress, 0, 100);
    }

    @OnEvent(ServerEvent.PLAYER_SHOW_HEALTH_BOOK)
    public async showHealthBook(source: number, target: number): Promise<void> {
        TriggerClientEvent(ClientEvent.PLAYER_REQUEST_HEALTH_BOOK, target, source, 'see');
    }

    @OnEvent(ServerEvent.IDENTITY_HIDE_AROUND)
    public async identityHideAround(source: number, target: number): Promise<void> {
        console.log('identityHideAround', source, target);
        TriggerClientEvent(ClientEvent.IDENTITY_HIDE, target);
    }

    @Rpc(RpcEvent.PLAYER_GET_HEALTH_BOOK)
    public getHealthBook(source: number, target: number): PlayerData | null {
        const targetPlayer = this.playerService.getPlayer(target);

        if (targetPlayer === null) {
            return null;
        }

        return targetPlayer;
    }

    @OnEvent(ServerEvent.PLAYER_NUTRITION_CHECK)
    public async checkHealth(source: number): Promise<void> {
        const player = this.playerService.getPlayer(source);

        if (player === null || player.metadata.godmode || player.metadata.isdead) {
            return;
        }

        const keys = ['fiber', 'lipid', 'sugar', 'protein'] as Array<keyof PlayerMetadata>;
        let badKeys = 0;

        for (const key of keys) {
            if (player.metadata[key] < 1 || player.metadata[key] >= 100) {
                badKeys++;
            }
        }

        if (badKeys > 0) {
            this.playerService.incrementMetadata(source, 'health_level', -badKeys, 0, 100);
        } else {
            this.playerService.incrementMetadata(source, 'health_level', 1, 0, 100);
        }
    }
}
