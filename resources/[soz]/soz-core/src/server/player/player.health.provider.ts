import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ServerEvent } from '../../shared/event';
import { PlayerMetadata } from '../../shared/player';
import { PollutionLevel } from '../../shared/pollution';
import { Hud } from '../hud';
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

        if (!player.metadata.lastStrengthUpdate) {
            this.playerService.setPlayerMetadata(source, 'lastStrengthUpdate', new Date().toUTCString());
        } else {
            const lastUpdate = new Date(player.metadata.lastStrengthUpdate);
            const now = new Date();
            const diff = now.getTime() - lastUpdate.getTime();
            const hours = diff / (1000 * 60 * 60);

            if (hours > 1) {
                this.playerService.setPlayerMetadata(source, 'lastStrengthUpdate', new Date().toUTCString());
                this.playerService.incrementMetadata(source, 'strength', STRENGTH_RATE);
            }
        }

        if (!player.metadata.lastMaxStaminaUpdate) {
            this.playerService.setPlayerMetadata(source, 'lastMaxStaminaUpdate', new Date().toUTCString());
        } else {
            const lastUpdate = new Date(player.metadata.lastMaxStaminaUpdate);
            const now = new Date();
            const diff = now.getTime() - lastUpdate.getTime();
            const hours = diff / (1000 * 60 * 60);

            if (hours > 1) {
                this.playerService.setPlayerMetadata(source, 'lastMaxStaminaUpdate', new Date().toUTCString());
                this.playerService.incrementMetadata(source, 'maxstamina', MAX_STAMINA_RATE);
            }
        }

        if (!player.metadata.lastStressUpdate) {
            this.playerService.setPlayerMetadata(source, 'lastStressUpdate', new Date().toUTCString());
        } else {
            const lastUpdate = new Date(player.metadata.lastStressUpdate);
            const now = new Date();
            const diff = now.getTime() - lastUpdate.getTime();

            if (diff > 1000 * 60 * 10) {
                this.playerService.setPlayerMetadata(source, 'lastStressUpdate', new Date().toUTCString());
                this.playerService.incrementMetadata(source, 'stressLevel', STRESS_RATE);
            }
        }

        this.playerService.incrementMetadata(source, 'hunger', hungerDiff, 0, 100);
        this.playerService.incrementMetadata(source, 'thirst', thirstDiff, 0, 100);
        this.playerService.incrementMetadata(source, 'alcohol', ALCOHOL_RATE);
        this.playerService.incrementMetadata(source, 'drug', DRUG_RATE);
        this.playerService.incrementMetadata(source, 'fiber', FIBER_RATE);
        this.playerService.incrementMetadata(source, 'lipid', LIPID_RATE);
        this.playerService.incrementMetadata(source, 'sugar', SUGAR_RATE);
        this.playerService.incrementMetadata(source, 'protein', PROTEIN_RATE);

        this.hud.updateNeeds(source);
        this.playerService.save(source);
    }

    @OnEvent(ServerEvent.PLAYER_INCREASE_STRENGTH)
    public async increaseStrength(source: number): Promise<void> {
        this.playerService.setPlayerMetadata(source, 'lastStrengthUpdate', new Date().toUTCString());
        this.playerService.incrementMetadata(source, 'strength', 2, 0, 100);
    }

    @OnEvent(ServerEvent.PLAYER_INCREASE_STAMINA)
    public async increaseStamina(source: number): Promise<void> {
        this.playerService.setPlayerMetadata(source, 'lastMaxStaminaUpdate', new Date().toUTCString());
        this.playerService.incrementMetadata(source, 'maxstamina', 2, 0, 100);
    }

    @OnEvent(ServerEvent.PLAYER_INCREASE_STRESS)
    public async increaseStress(source: number, stress: number): Promise<void> {
        this.playerService.setPlayerMetadata(source, 'lastStressUpdate', new Date().toUTCString());
        this.playerService.incrementMetadata(source, 'stressLevel', stress, 0, 100);
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
            this.playerService.incrementMetadata(source, 'healthLevel', -badKeys, 0, 100);
        } else {
            this.playerService.incrementMetadata(source, 'healthLevel', 1, 0, 100);
        }
    }
}
