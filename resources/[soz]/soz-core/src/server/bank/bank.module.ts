import { Module } from '../../core/decorators/module';
import { BankPaycheckProvider } from './bank.paycheck.provider';
import { BankProvider } from './bank.provider';
import { BankSafeProvider } from './bank.safe.provider';
import { BankTaxProvider } from './bank.tax.provider';

@Module({
    providers: [BankProvider, BankSafeProvider, BankPaycheckProvider, BankTaxProvider],
})
export class BankModule {}
