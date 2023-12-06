import { Inject, Injectable } from '@public/core/decorators/injectable';
import { ServerEvent } from '@public/shared/event';
import { getDistance, Vector3 } from '@public/shared/polyzone/vector';

import { Notifier } from '../notifier';
import { PlayerService } from '../player/player.service';
import { PlayerStateProvider } from '../player/player.state.provider';
import { ProgressService } from '../progress.service';

@Injectable()
export class JobInteractionService {
    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(PlayerStateProvider)
    private playerStateProvider: PlayerStateProvider;

    @Inject(PlayerService)
    private playerService: PlayerService;

    public async searchPlayer(entity: number) {
        const player = NetworkGetPlayerIndexFromPed(entity);
        const ped = PlayerPedId();
        const playerPed = GetPlayerPed(player);
        const playerId = GetPlayerServerId(player);
        if (
            IsEntityPlayingAnim(playerPed, 'missminuteman_1ig_2', 'handsup_base', 3) ||
            IsEntityPlayingAnim(playerPed, 'mp_arresting', 'idle', 3)
        ) {
            const { completed } = await this.progressService.progress(
                'police-search',
                'Fouille en cours...',
                Math.floor(Math.random() * (7000 - 5000 + 1) + 5000),
                {
                    dictionary: 'anim@gangops@morgue@table@',
                    name: 'player_search',
                    options: { repeat: true },
                },
                {
                    disableMovement: true,
                    disableCarMovement: true,
                    disableMouse: false,
                    disableCombat: true,
                }
            );
            if (!completed) {
                this.notifier.error('Fouille annulée');
                return;
            }
            const plyCoords = GetEntityCoords(playerPed) as Vector3;
            const pos = GetEntityCoords(ped) as Vector3;
            if (getDistance(plyCoords, pos) < 2.5) {
                StopAnimTask(ped, 'random@shop_robbery', 'robbery_action_b', 1.0);
                TriggerServerEvent('inventory:server:openInventory', 'player', playerId);
                TriggerServerEvent(
                    ServerEvent.MONITOR_ADD_EVENT,
                    'job_police_search_player',
                    {},
                    {
                        target_source: playerId,
                        position: plyCoords,
                    },
                    true
                );
            } else {
                this.notifier.error("Personne n'est à portée de vous");
                return;
            }
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
            TriggerServerEvent(
                ServerEvent.MONITOR_ADD_EVENT,
                'job_police_escort_player',
                {},
                {
                    target_source: playerId,
                    crimi: crimi,
                    position: GetEntityCoords(GetPlayerPed(player)),
                },
                true
            );
        }
    }
}
