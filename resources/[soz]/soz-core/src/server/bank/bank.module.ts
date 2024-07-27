import { Module } from '../../core/decorators/module';
import { BankAtmProvider } from './bank.atm.provider';
import { BankPaycheckProvider } from './bank.paycheck.provider';
import { BankProvider } from './bank.provider';
import { BankSafeProvider } from './bank.safe.provider';
import { BankTaxProvider } from './bank.tax.provider';
import { BankWashMoneyProvider } from './bank.washmoney.provider';

@Module({
    providers: [
        BankProvider,
        BankAtmProvider,
        BankSafeProvider,
        BankPaycheckProvider,
        BankTaxProvider,
        BankWashMoneyProvider,
    ],
})
export class BankModule {}
