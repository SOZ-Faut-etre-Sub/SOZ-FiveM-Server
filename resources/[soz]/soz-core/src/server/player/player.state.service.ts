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

    private getPlayerIdentifierByType(source: string, type: string): string | null {
        // @TODO: Enable when we upgrade server
        // if (GetPlayerIdentifierByType) {
        //     return GetPlayerIdentifierByType(source, type);
        // }

        const identifiers = getPlayerIdentifiers(source);

        for (const identifier of identifiers) {
            if (identifier.startsWith(`${type}:`)) {
                return identifier;
            }
        }

        return null;
    }

    public getIdentifier(source: string): string | null {
        if (GetConvar('soz_disable_steam_credential', 'false') === 'true') {
            return this.getPlayerIdentifierByType(source, 'license');
        }

        const steamIdentifier = this.getPlayerIdentifierByType(source, 'steam');

        if (!steamIdentifier) {
            return null;
        }

        const steamHex = steamIdentifier.replace('steam:', '');

        return BigInt(`0x${steamHex}`).toString();
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
