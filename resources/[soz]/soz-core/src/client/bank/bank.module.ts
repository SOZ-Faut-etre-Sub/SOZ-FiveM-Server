import { Module } from '../../core/decorators/module';
import { BankAtmProvider } from './bank.atm.provider';
import { BankInvoiceProvider } from './bank.invoice.provider';
import { BankMoneyCaseProvider } from './bank.money-case.provider';
import { BankNuiProvider } from './bank.nui.provider';
import { BankProvider } from './bank.provider';
import { BankSafeProvider } from './bank.safe.provider';

@Module({
    providers: [
        BankProvider,
        BankInvoiceProvider,
        BankNuiProvider,
        BankAtmProvider,
        BankSafeProvider,
        BankMoneyCaseProvider,
    ],
})
export class BankModule {}
