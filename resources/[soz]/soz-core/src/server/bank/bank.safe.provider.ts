import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { BankAccount } from '../../shared/bank';
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

    @Rpc(RpcServerEvent.BANK_SAFE_GET_ACCOUNT)
    public async getSafeAccount(source: number, safe: string): Promise<BankAccount> {
        if (!(await this.hasAccessToSafe(source, safe))) {
            return null;
        }

        return await this.bankAccountRepository.find(safe);
    }

    @Rpc(RpcServerEvent.BANK_SAFE_TRANSFER_ACTION)
    public async transferSafeMoney(
        source: number,
        type: 'deposit' | 'withdraw',
        safe: string,
        moneyType: 'money' | 'marked_money',
        amount: number = 0
    ): Promise<boolean> {
        if (!(await this.hasAccessToSafe(source, safe))) {
            return null;
        }

        return this.bankService.transferSafeMoney(source, safe, type, moneyType, amount);
    }
}
