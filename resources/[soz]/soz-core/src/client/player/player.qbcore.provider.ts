import { On, Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { OnceLoader } from '../../core/loader/once.loader';
import { PlayerData } from '../../shared/player';
import { Qbcore } from '../qbcore';
import { PlayerService } from './player.service';

@Provider()
export class PlayerQbcoreProvider {
    @Inject(OnceLoader)
    private onceLoader: OnceLoader;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Qbcore)
    private qbcore: Qbcore;

    @On('QBCore:Client:OnPlayerLoaded')
    playerLoaded(): void {
        const playerData = this.qbcore.getPlayer();

        this.playerService.setPlayer(playerData);
        this.onceLoader.trigger(OnceStep.PlayerLoaded, playerData);
    }

    @On('QBCore:Player:SetPlayerData')
    playerUpdate(playerData: PlayerData): void {
        this.playerService.setPlayer(playerData);
    }

    @Once(OnceStep.Start)
    async onStart(): Promise<void> {
        const playerData = this.qbcore.getPlayer();

        if (!playerData || !playerData.metadata) {
            return;
        }

        this.onceLoader.trigger(OnceStep.PlayerLoaded, playerData);
        this.playerService.setPlayer(playerData);
    }

    @Once(OnceStep.NuiLoaded)
    async onNuiLoad(): Promise<void> {
        const playerData = this.qbcore.getPlayer();

        if (!playerData || !playerData.metadata) {
            return;
        }

        this.playerService.setPlayer(playerData);
    }
}
