import { OnEvent } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { BankService } from '@public/server/bank/bank.service';
import { Monitor } from '@public/server/monitor/monitor';
import { ServerEvent } from '@public/shared/event';
import { TaxiConfig } from '@public/shared/job/cjr';
import { toVector3Object, Vector3 } from '@public/shared/polyzone/vector';

import { Logger } from '../../../core/logger';

@Provider()
export class TaxiProvider {
    @Inject(BankService)
    private bankService: BankService;

    @Inject(Monitor)
    private monitor: Monitor;

    @Inject(Logger)
    private logger: Logger;

    @OnEvent(ServerEvent.TAXI_NPC_PAY)
    public async decrement(source: number, amount: number) {
        const transfer = await this.bankService.transferBankMoney(
            TaxiConfig.bankAccount.farm,
            TaxiConfig.bankAccount.safe,
            amount
        );
        if (!transfer) {
            this.logger.error(
                'Failed to transfer money to safe',
                JSON.stringify({
                    account_source: TaxiConfig.bankAccount.farm,
                    account_destination: TaxiConfig.bankAccount.safe,
                    amount: amount,
                })
            );
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
