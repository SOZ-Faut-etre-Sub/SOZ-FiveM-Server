import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { BankAccount } from '../../shared/bank';
import { RpcServerEvent } from '../../shared/rpc';
import { BankAccountRepository } from '../repository/bank.account.repository';
import { BankService } from './bank.service';

@Provider()
export class BankSafeProvider {
    @Inject(BankAccountRepository)
    private bankAccountRepository: BankAccountRepository;

    @Inject(BankService)
    private bankService: BankService;

    @Rpc(RpcServerEvent.BANK_SAFE_GET_ACCOUNT)
    public async getSafeAccount(source: number, job: string): Promise<BankAccount> {
        return await this.bankAccountRepository.find(`safe_${job}`);
    }

    @Rpc(RpcServerEvent.BANK_SAFE_TRANSFER_ACTION)
    public async transferSafeMoney(
        source: number,
        type: 'deposit' | 'withdraw',
        safe: string,
        moneyType: 'money' | 'marked_money',
        amount: number = 0
    ): Promise<boolean> {
        return this.bankService.transferSafeMoney(source, safe, type, moneyType, amount);
    }
}
