import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { BankAccount, BankActionType } from '../../shared/bank';
import { JobPermission, JobType } from '../../shared/job';
import { RpcServerEvent } from '../../shared/rpc';
import { JobService } from '../job.service';
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

    @Inject(JobService)
    private jobService: JobService;

    protected async hasAccessToSafe(source: number, accountId: string): Promise<boolean> {
        if (accountId.startsWith('safe_')) {
            const [playerJob, playerJobGrade] = this.playerService.getPlayerJobAndGrade(source);

            if (
                !(await this.jobService.hasTargetJobPermission(
                    accountId.replace('safe_', '') as JobType,
                    playerJob,
                    playerJobGrade,
                    JobPermission.SocietyMoneyStorage
                ))
            ) {
                this.notifier.error(source, "Vous n'avez pas accès à ce coffre.");
                return false;
            }
        }

        return true;
    }

    @Rpc(RpcServerEvent.BANK_GET_ACCOUNT)
    public async getAccount(source: number, accountId: string): Promise<BankAccount> {
        if (!(await this.hasAccessToSafe(source, accountId))) {
            return null;
        }
        return await this.bankAccountRepository.find(accountId);
    }

    @Rpc(RpcServerEvent.BANK_CASH_TRANSFER_ACTION)
    public async transferSafeMoney(
        source: number,
        type: BankActionType,
        accountId: string,
        moneyType: 'money' | 'marked_money',
        amount: number = 0
    ): Promise<boolean> {
        if (!(await this.hasAccessToSafe(source, accountId))) {
            return null;
        }

        return this.bankService.transferCashMoney(source, accountId, type, moneyType, amount);
    }
}
