import { Inject, Injectable } from '@public/core/decorators/injectable';
import { ServerEvent } from '@public/shared/event';

import { PlayerService } from '../player/player.service';
import { PlayerStateProvider } from '../player/player.state.provider';

@Injectable()
export class JobInteractionService {
    @Inject(PlayerStateProvider)
    private playerStateProvider: PlayerStateProvider;

    @Inject(PlayerService)
    private playerService: PlayerService;

    public async searchPlayer(entity: number, canForceConsume: boolean) {
        const player = NetworkGetPlayerIndexFromPed(entity);

        const playerPed = GetPlayerPed(player);
        const playerId = GetPlayerServerId(player);

        if (
            IsEntityPlayingAnim(playerPed, 'missminuteman_1ig_2', 'handsup_base', 3) ||
            IsEntityPlayingAnim(playerPed, 'mp_arresting', 'idle', 3)
        ) {
            TriggerServerEvent(ServerEvent.INVENTORY_OPEN_TARGET, playerId, canForceConsume);
        }
    }

    public async escortPlayer(entity: number, crimi: boolean) {
        const player = NetworkGetPlayerIndexFromPed(entity);
        const playerState = this.playerStateProvider.getState();
        const playerMetadata = this.playerService.getPlayer().metadata;

        if (
            !playerState.isEscorted &&
            !playerState.isEscorting &&
            !playerState.isDead &&
            !playerState.isHandcuffed &&
            !playerMetadata['inlaststand']
        ) {
            const playerId = GetPlayerServerId(player);
            TriggerServerEvent(ServerEvent.ESCORT_PLAYER, playerId, crimi);
        }
    }
}
