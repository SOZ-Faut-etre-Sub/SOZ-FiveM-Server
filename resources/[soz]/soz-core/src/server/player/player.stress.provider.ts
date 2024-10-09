import { Provider } from '@core/decorators/provider';
import { Rpc } from '@core/decorators/rpc';
import { Inject } from '@public/core/decorators/injectable';
import { Notifier } from '@public/server/notifier';
import { PlayerHealthProvider } from '@public/server/player/player.health.provider';
import { PlayerService } from '@public/server/player/player.service';
import { IntervalByStressLooseType, PointsByStressLooseType, StressLooseType } from '@public/shared/health';
import { RpcServerEvent } from '@public/shared/rpc';

@Provider()
export class PlayerStressProvider {
    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(PlayerHealthProvider)
    private playerHealthProvider: PlayerHealthProvider;

    private playerLastStressTypeUsedAt: Record<number, Partial<Record<StressLooseType, number>>> = {};

    @Rpc(RpcServerEvent.STRESS_UPDATE)
    public async onRPCUpdateStress(source: number, type: StressLooseType, updateTimer: number): Promise<number> {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return null;
        }

        this.playerLastStressTypeUsedAt[player.citizenid] ??= {};
        const lastUsedAt = this.playerLastStressTypeUsedAt[player.citizenid][type];

        if (lastUsedAt !== undefined && updateTimer - lastUsedAt < IntervalByStressLooseType[type] * 60 * 1000) {
            return lastUsedAt;
        }

        const stressPoints = PointsByStressLooseType[type];
        this.playerHealthProvider.increaseStress(source, stressPoints);

        if (stressPoints > 0) {
            this.notifier.notify(source, 'Un événement vous a ~r~angoissé~s~.', 'error');
        } else {
            this.notifier.notify(source, 'Vous vous sentez moins ~g~angoissé~s~.', 'success');
        }

        if (lastUsedAt === undefined || updateTimer > this.playerLastStressTypeUsedAt[player.citizenid][type]) {
            this.playerLastStressTypeUsedAt[player.citizenid][type] = updateTimer;
        }
        return this.playerLastStressTypeUsedAt[player.citizenid][type];
    }
}
