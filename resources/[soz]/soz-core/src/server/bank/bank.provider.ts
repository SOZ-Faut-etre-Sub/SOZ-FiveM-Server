import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import { Logger } from '../../core/logger';
import { BankAccountRepository } from '../repository/bank.account.repository';

@Provider()
export class BankProvider {
    @Inject(Logger)
    private logger: Logger;

    @Inject(BankAccountRepository)
    private bankAccountRepository: BankAccountRepository;

    @Tick(5000, 'bank:pawl:metrics')
    public async onTick() {
        const accounts = await this.bankAccountRepository.get();
    }
}
