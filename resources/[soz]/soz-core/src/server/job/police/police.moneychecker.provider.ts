import { OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { PlayerService } from '@public/server/player/player.service';
import { QBCore } from '@public/server/qbcore';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { JobType } from '@public/shared/job';

const jobAllowed = [JobType.FBI, JobType.LSPD, JobType.BCSO, JobType.FBI];

export class PoliceMoneyCheckerProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(QBCore)
    private qbcore: QBCore;

    @OnEvent(ServerEvent.POLICE_CONFISCATE_MONEY)
    public onConfiscateMoney(source: number, targetId: number) {
        const player = this.playerService.getPlayer(source);
        const target = this.playerService.getPlayer(targetId);

        if (player && target && player != target) {
            if (jobAllowed.includes(player.job.id)) {
                const markedAmount = target.money.marked_money;
                if (markedAmount > 0) {
                    const playerQBCore = this.qbcore.getPlayer(source);
                    playerQBCore.Functions.RemoveMoney('marked_money', markedAmount);
                    TriggerClientEvent(
                        ClientEvent.NOTIFICATION_DRAW,
                        player.source,
                        `Vous avez confisqué ~g~$${markedAmount}~s~ à ${target.name}`
                    );
                    TriggerClientEvent(
                        ClientEvent.NOTIFICATION_DRAW,
                        target.source,
                        `~r~$${markedAmount}~s~ vous ont été confisqué par ${player.name}`
                    );
                } else {
                    TriggerClientEvent(
                        ClientEvent.NOTIFICATION_DRAW,
                        player.source,
                        `${target.name} n'a pas d'argent sur lui`
                    );
                }
            }
        }
    }
}
