import { ClientEvent } from '@public/shared/event';

import { Inject, Injectable } from '../../core/decorators/injectable';
import { PlayerClientState, PlayerServerState } from '../../shared/player';
import { PlayerService } from './player.service';

@Injectable()
export class PlayerStateService {
    @Inject(PlayerService)
    private playerService: PlayerService;

    private serverStateByCitizenId: Record<string, PlayerServerState> = {};

    private clientStateByCitizenId: Record<string, PlayerClientState> = {};

    public getServerStateByCitizenId(citizenId: string) {
        if (!this.serverStateByCitizenId[citizenId]) {
            this.serverStateByCitizenId[citizenId] = this.getDefaultPlayerServerState();
        }

        return this.serverStateByCitizenId[citizenId];
    }

    public getClientStateByCitizenId(citizenId: string) {
        if (!this.serverStateByCitizenId[citizenId]) {
            this.clientStateByCitizenId[citizenId] = this.getDefaultPlayerClientState();
        }

        return this.clientStateByCitizenId[citizenId];
    }

    private getPlayerIdentifierByType(source: string, type: string): string | null {
        return GetPlayerIdentifierByType(source, type);
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

    public getServerState(source: number): PlayerServerState {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return this.getDefaultPlayerServerState();
        }

        return this.getServerStateByCitizenId(player.citizenid);
    }

    public getClientState(source: number): PlayerClientState {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return this.getDefaultPlayerClientState();
        }

        return this.getClientStateByCitizenId(player.citizenid);
    }

    public setServerState(source: number, state: Partial<PlayerServerState>) {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        const serverState = this.getServerStateByCitizenId(player.citizenid);

        this.serverStateByCitizenId[player.citizenid] = {
            ...serverState,
            ...state,
        };
    }

    public setClientState(source: number, state: Partial<PlayerClientState>) {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        const clientState = this.getClientStateByCitizenId(player.citizenid);

        this.clientStateByCitizenId[player.citizenid] = {
            ...clientState,
            ...state,
        };

        TriggerClientEvent(ClientEvent.PLAYER_UPDATE_STATE, source, this.clientStateByCitizenId[player.citizenid]);

        return this.clientStateByCitizenId[player.citizenid];
    }

    private getDefaultPlayerServerState(): PlayerServerState {
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

    private getDefaultPlayerClientState(): PlayerClientState {
        return {
            disableMoneyCase: false,
            isDead: false,
            isEscorted: false,
            isEscorting: false,
            isHandcuffed: false,
            isInventoryBusy: false,
            tankerEntity: null,
            isInShop: false,
            isInHub: false,
            hasPrisonerClothes: false,
            isInHospital: false,
            isWearingPatientOutfit: false,
            escorting: null,
            isLooted: false,
            isZipped: false,
        };
    }
}
