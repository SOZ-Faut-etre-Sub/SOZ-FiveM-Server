import { OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { BankService } from '@public/server/bank/bank.service';
import { PlayerMoneyService } from '@public/server/player/player.money.service';
import { PlayerService } from '@public/server/player/player.service';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { JobType } from '@public/shared/job';

const jobAllowed = [JobType.FBI, JobType.LSPD, JobType.BCSO, JobType.FBI];

@Provider()
export class PoliceMoneyCheckerProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(PlayerMoneyService)
    private playerMoneyService: PlayerMoneyService;

    @Inject(BankService)
    private bankService: BankService;

    @OnEvent(ServerEvent.POLICE_CONFISCATE_MONEY)
    public onConfiscateMoney(source: number, targetId: number) {
        const player = this.playerService.getPlayer(source);
        const target = this.playerService.getPlayer(targetId);

        if (player && target && player != target) {
            if (jobAllowed.includes(player.job.id)) {
                const markedAmount = target.money.marked_money;
                if (markedAmount > 0) {
                    this.playerMoneyService.remove(targetId, markedAmount, 'marked_money');
                    this.bankService.addMoney('safe_' + player.job.id, markedAmount, 'marked_money', true);
                    TriggerClientEvent(
                        ClientEvent.NOTIFICATION_DRAW,
                        player.source,
                        `Vous avez confisqué ~g~$${markedAmount}~s~ à ${target.charinfo.firstname} ${target.charinfo.lastname}`
                    );
                    TriggerClientEvent(
                        ClientEvent.NOTIFICATION_DRAW,
                        target.source,
                        `~r~$${markedAmount}~s~ vous ont été confisqué par ${player.charinfo.firstname} ${player.charinfo.lastname}`
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
