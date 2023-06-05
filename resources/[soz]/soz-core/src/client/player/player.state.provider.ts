import { Once, OnceStep, OnEvent } from '@core/decorators/event';
import { Exportable } from '@core/decorators/exports';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { emitRpc } from '@core/rpc';
import { PlayerService } from '@public/client/player/player.service';
import { ClientEvent } from '@public/shared/event';

import { PlayerClientState, PlayerListStateKey } from '../../shared/player';
import { RpcServerEvent } from '../../shared/rpc';
import { PlayerListStateService } from './player.list.state.service';

@Provider()
export class PlayerStateProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(PlayerListStateService)
    private playerListStateService: PlayerListStateService;

    @Once(OnceStep.PlayerLoaded)
    public async onStart() {
        this.playerService.setState(await emitRpc<PlayerClientState>(RpcServerEvent.PLAYER_GET_CLIENT_STATE));
    }

    @Exportable('GetPlayerState')
    public getState(): PlayerClientState {
        return this.playerService.getState();
    }

    @Exportable('GetSpecificPlayerState')
    public async getSpecificPlayerState(target: number): Promise<PlayerClientState> {
        return await emitRpc<PlayerClientState>(RpcServerEvent.PLAYER_GET_CLIENT_STATE, target);
    }

    @Exportable('SetPlayerState')
    public async setState(state: Partial<PlayerClientState>): Promise<void> {
        await this.playerService.updateState(state);
    }

    @OnEvent(ClientEvent.PLAYER_UPDATE_STATE)
    public onStateUpdate(state: PlayerClientState) {
        this.playerService.setState(state);
    }

    @OnEvent(ClientEvent.PLAYER_UPDATE_LIST_STATE)
    public onListStateUpdate(key: PlayerListStateKey, players: number[]) {
        this.playerListStateService.updateList(key, players);
    }
}
