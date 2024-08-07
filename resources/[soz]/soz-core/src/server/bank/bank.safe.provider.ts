import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { BankAccount, BankActionType, BankMoneyType } from '../../shared/bank';
import { RpcServerEvent } from '../../shared/rpc';
import { Notifier } from '../notifier';
import { PlayerService } from '../player/player.service';
import { BankAccountRepository } from '../repository/bank.account.repository';
import { BankService } from './bank.service';

@Provider()
export class BankSafeProvider {
    @Inject(BankAccountRepository)
    private bankAccountRepository: BankAccountRepository;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(BankService)
    private bankService: BankService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Rpc(RpcServerEvent.BANK_GET_ACCOUNT)
    public async getAccount(source: number, accountId: string): Promise<BankAccount> {
        const player = this.playerService.getPlayer(source);
        if (!player) return;

        const account = await this.bankAccountRepository.find(accountId);

        if (!(await this.bankAccountRepository.hasAccessToAccount(player, account))) {
            this.notifier.error(source, "Vous n'avez pas accès à ce coffre.");
            return;
        }

        return account;
    }

    @Rpc(RpcServerEvent.BANK_CASH_TRANSFER_ACTION)
    public async transferSafeMoney(
        source: number,
        type: BankActionType,
        accountId: string,
        moneyType: BankMoneyType,
        amount: number = 0
    ): Promise<boolean> {
        const player = this.playerService.getPlayer(source);
        if (!player) return;

        const account = await this.bankAccountRepository.find(accountId);

        if (!(await this.bankAccountRepository.hasAccessToAccount(player, account))) {
            this.notifier.error(source, "Vous n'avez pas accès à ce coffre.");
            return;
        }

        return this.bankService.transferCashMoney(source, accountId, type, moneyType, amount);
    }
}
