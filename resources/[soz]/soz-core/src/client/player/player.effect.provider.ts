import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent } from '../../shared/event';
import { PlayerData } from '../../shared/player';
import { PlayerService } from './player.service';
import { PlayerWalkstyleProvider } from './player.walkstyle.provider';

@Provider()
export class PlayerEffectProvider {
    @Inject(PlayerService)
    private readonly playerService: PlayerService;

    @Inject(PlayerWalkstyleProvider)
    private readonly playerWalkstyleProvider: PlayerWalkstyleProvider;

    private forceDrugEffect = false;

    private forceAlcoholEffect = false;

    @OnEvent(ClientEvent.PLAYER_FORCE_ALCOHOL_EFFECT)
    async setForceAlcoholEffect(value: boolean): Promise<void> {
        const player = this.playerService.getPlayer();

        if (!player) {
            return;
        }

        this.forceAlcoholEffect = value;
        await this.onPlayerUpdate(player);
    }

    @OnEvent(ClientEvent.PLAYER_FORCE_DRUG_EFFECT)
    async setForceDrugEffect(value: boolean): Promise<void> {
        const player = this.playerService.getPlayer();

        if (!player) {
            return;
        }

        this.forceDrugEffect = value;
        await this.onPlayerUpdate(player);
    }

    @OnEvent(ClientEvent.PLAYER_UPDATE)
    async onPlayerUpdate(player: PlayerData): Promise<void> {
        if ((this.forceDrugEffect || player.metadata.drug > 0) && !AnimpostfxIsRunning('DrugsMichaelAliensFight')) {
            AnimpostfxPlay('DrugsMichaelAliensFightIn', 0, false);
            AnimpostfxPlay('DrugsMichaelAliensFight', 0, true);
        }

        if (!this.forceDrugEffect && player.metadata.drug <= 0 && AnimpostfxIsRunning('DrugsMichaelAliensFight')) {
            AnimpostfxStopAndDoUnk('DrugsMichaelAliensFight');
            AnimpostfxStopAndDoUnk('DrugsMichaelAliensFightIn');
        }

        if (
            (this.forceAlcoholEffect || player.metadata.alcohol > 0) &&
            !AnimpostfxIsRunning('DrugsTrevorClownsFight')
        ) {
            AnimpostfxPlay('DrugsTrevorClownsFightIn', 0, false);
            AnimpostfxPlay('DrugsTrevorClownsFight', 0, true);
        }

        if (!this.forceAlcoholEffect && player.metadata.alcohol <= 0 && AnimpostfxIsRunning('DrugsTrevorClownsFight')) {
            AnimpostfxStopAndDoUnk('DrugsTrevorClownsFight');
            AnimpostfxStopAndDoUnk('DrugsTrevorClownsFightIn');
        }

        if (
            this.forceAlcoholEffect ||
            this.forceDrugEffect ||
            player.metadata.drug > 80 ||
            player.metadata.alcohol > 80
        ) {
            ShakeGameplayCam('DRUNK_SHAKE', 1.0);
            SetPedIsDrunk(PlayerPedId(), true);

            await this.playerWalkstyleProvider.updateWalkStyle('drugAlcool', 'move_m@drunk@verydrunk');
        } else if (player.metadata.drug > 40 || player.metadata.alcohol > 40) {
            ShakeGameplayCam('DRUNK_SHAKE', 0.5);
            SetPedIsDrunk(PlayerPedId(), true);

            await this.playerWalkstyleProvider.updateWalkStyle('drugAlcool', 'move_m@drunk@moderatedrunk');
        } else if (player.metadata.drug > 0 || player.metadata.alcohol > 0) {
            ShakeGameplayCam('DRUNK_SHAKE', 0.0);
            SetPedIsDrunk(PlayerPedId(), false);

            await this.playerWalkstyleProvider.updateWalkStyle('drugAlcool', 'move_m@drunk@slightlydrunk');
        } else {
            ShakeGameplayCam('DRUNK_SHAKE', 0.0);
            SetPedIsDrunk(PlayerPedId(), false);

            await this.playerWalkstyleProvider.updateWalkStyle('drugAlcool', null);
        }
    }
}
