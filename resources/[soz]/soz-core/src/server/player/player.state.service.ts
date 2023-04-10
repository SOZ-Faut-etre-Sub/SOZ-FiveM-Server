import { Inject, Injectable } from '../../core/decorators/injectable';
import { PlayerServerState } from '../../shared/player';
import { PlayerService } from './player.service';

@Injectable()
export class PlayerStateService {
    @Inject(PlayerService)
    private playerService: PlayerService;

    private stateByCitizenId: Record<string, PlayerServerState> = {};

    public getByCitizenId(citizenId: string) {
        if (!this.stateByCitizenId[citizenId]) {
            this.stateByCitizenId[citizenId] = this.getDefaultPlayerSate();
        }

        return this.stateByCitizenId[citizenId];
    }

    public getIdentifier(source: string): string {
        if (GetConvar('soz_disable_steam_credential', 'false') === 'true') {
            return GetPlayerIdentifierByType(source, 'license');
        }

        const steamIdentifier = GetPlayerIdentifierByType(source, 'steam');

        if (!steamIdentifier) {
            return null;
        }

        const steamHex = steamIdentifier.replace('steam:', '');
        const steamId = parseInt(steamHex, 16);

        return String(steamId);
    }

    public get(source: number): PlayerServerState {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return this.getDefaultPlayerSate();
        }

        return this.getByCitizenId(player.citizenid);
    }

    private getDefaultPlayerSate(): PlayerServerState {
        return {
            exercise: { chinUp: false, pushUp: false, sitUp: false, freeWeight: false, completed: 0 },
            exercisePushUp: false,
            lostStamina: 0,
            lostStrength: 0,
            runTime: 0,
            yoga: false,
            lastStrengthUpdate: new Date(),
            lastMaxStaminaUpdate: new Date(),
            lastStressLevelUpdate: new Date(),
        };
    }
}
