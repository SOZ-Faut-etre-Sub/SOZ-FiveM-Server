import { Exportable } from '../../core/decorators/exports';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { BankService } from './bank.service';

@Provider()
export class BankProvider {
    @Inject(BankService)
    private bankService: BankService;

    @Exportable('AddTransfer')
    addTransfer(transmitter: string, receiver: string, amount: number) {
        this.bankService.handleBankTransfer(transmitter, receiver, amount);
    }
}
