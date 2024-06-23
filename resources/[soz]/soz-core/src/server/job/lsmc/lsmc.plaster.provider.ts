import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { OnEvent } from '@public/core/decorators/event';
import { Rpc } from '@public/core/decorators/rpc';
import { Monitor } from '@public/server/monitor/monitor';
import { Notifier } from '@public/server/notifier';
import { PlayerService } from '@public/server/player/player.service';
import { ServerEvent } from '@public/shared/event';
import { PlasterConfigs, PlasterLocation } from '@public/shared/job/lsmc';
import { RpcServerEvent } from '@public/shared/rpc';

@Provider()
export class LSMCPlasterProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(Monitor)
    private monitor: Monitor;

    @Rpc(RpcServerEvent.LSMC_PLAYER_PLASTER)
    public onGetPlaster(source: number, id: number) {
        const player = this.playerService.getPlayer(id);

        if (!player) {
            return;
        }

        return player.metadata.plaster;
    }

    @OnEvent(ServerEvent.LSMC_PLASTER)
    public onPlaster(source: number, target: number, location: PlasterLocation) {
        const player = this.playerService.getPlayer(target);

        if (!player) {
            return;
        }

        const plasterConfig = PlasterConfigs[location];
        const index = player.metadata.plaster.indexOf(location);
        if (index != -1) {
            player.metadata.plaster.splice(index, 1);
            this.notifier.notify(source, 'Vous avez ~g~retiré~s~ une plâtre sur ' + plasterConfig.label);
        } else {
            player.metadata.plaster.push(location);
            this.notifier.notify(source, 'Vous avez ~g~posé~s~ une plâtre sur ' + plasterConfig.label);
        }

        this.monitor.traceEvent('lsmc_plaster', {
            player_source: source,
            target_source: target,
            plaster_location: location,
            plaster_remove: index != -1,
        });

        this.playerService.setPlayerMetadata(target, 'plaster', player.metadata.plaster);
    }
}
