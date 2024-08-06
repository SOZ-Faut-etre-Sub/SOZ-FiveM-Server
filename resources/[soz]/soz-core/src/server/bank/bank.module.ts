import { Module } from '../../core/decorators/module';
import { BankAtmProvider } from './bank.atm.provider';
import { BankInvoiceProvider } from './bank.invoice.provider';
import { BankNuiProvider } from './bank.nui.provider';
import { BankPaycheckProvider } from './bank.paycheck.provider';
import { BankProvider } from './bank.provider';
import { BankSafeProvider } from './bank.safe.provider';
import { BankTaxProvider } from './bank.tax.provider';
import { BankWashMoneyProvider } from './bank.washmoney.provider';

@Module({
    providers: [
        BankProvider,
        BankNuiProvider,
        BankAtmProvider,
        BankSafeProvider,
        BankInvoiceProvider,
        BankPaycheckProvider,
        BankTaxProvider,
        BankWashMoneyProvider,
    ],
})
export class BankModule {}
