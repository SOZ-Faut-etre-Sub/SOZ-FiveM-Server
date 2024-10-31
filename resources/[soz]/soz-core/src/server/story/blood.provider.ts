import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { OnEvent } from '@public/core/decorators/event';
import { Monitor } from '@public/server/monitor/monitor';
import { ClientEvent, ServerEvent } from '@public/shared/event';

import { PlayerService } from '../player/player.service';

@Provider()
export class BloodProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Monitor)
    private monitor: Monitor;

    @OnEvent(ServerEvent.HALLOWEEN_SUCK_NPC)
    public onNpcSuck(source: number) {
        this.playerService.incrementMetadata(source, 'hunger', 25, 0, 100);
        this.playerService.incrementMetadata(source, 'thirst', 25, 0, 100);
        this.monitor.traceEvent('halloween_suck_player', {
            player_source: source,
        });
    }

    @OnEvent(ServerEvent.HALLOWEEN_SUCK_PLAYER_START)
    public onPlayerSuckStart(source: number, target: number) {
        TriggerClientEvent(ClientEvent.HALLOWEEN_SUCK_PLAYER_START, target);
        this.monitor.traceEvent('halloween_suck_player', {
            player_source: source,
            target_source: target,
        });
    }

    @OnEvent(ServerEvent.HALLOWEEN_SUCK_PLAYER_END)
    public onPlayerSuckEnd(source: number, target: number, abort: boolean) {
        TriggerClientEvent(ClientEvent.HALLOWEEN_SUCK_PLAYER_END, target);

        if (!abort) {
            this.playerService.incrementMetadata(source, 'hunger', 25, 0, 100);
            this.playerService.incrementMetadata(source, 'thirst', 25, 0, 100);
            this.playerService.incrementMetadata(target, 'hunger', -25, 0, 100);
            this.playerService.incrementMetadata(target, 'thirst', -25, 0, 100);
        }
    }
}
