import { OnEvent } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { BankService } from '@public/server/bank/bank.service';
import { ServerEvent } from '@public/shared/event';
import { TaxiConfig } from '@public/shared/job/cjr';
import { Monitor } from '@public/shared/monitor';
import { toVector3Object, Vector3 } from '@public/shared/polyzone/vector';

@Provider()
export class TaxiProvider {
    @Inject(BankService)
    private bankService: BankService;

    @Inject(Monitor)
    private monitor: Monitor;

    @OnEvent(ServerEvent.TAXI_NPC_PAY)
    public async decrement(source: number, amount: number) {
        const transfer = await this.bankService.transferBankMoney(
            TaxiConfig.bankAccount.farm,
            TaxiConfig.bankAccount.safe,
            amount
        );
        if (!transfer) {
            this.monitor.log('ERROR', 'Failed to transfer money to safe', {
                account_source: TaxiConfig.bankAccount.farm,
                account_destination: TaxiConfig.bankAccount.safe,
                amount: amount,
            });
        }

        this.monitor.publish(
            'job_carljr_npc_course',
            {
                player_source: source,
            },
            {
                amount: amount,
                position: toVector3Object(GetEntityCoords(GetPlayerPed(source)) as Vector3),
            }
        );
    }
}
