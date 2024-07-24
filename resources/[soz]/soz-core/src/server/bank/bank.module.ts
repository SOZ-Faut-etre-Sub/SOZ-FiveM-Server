import { Module } from '../../core/decorators/module';
import { BankPaycheckProvider } from './bank.paycheck.provider';
import { BankProvider } from './bank.provider';
import { BankTaxProvider } from './bank.tax.provider';

@Module({
    providers: [BankProvider, BankPaycheckProvider, BankTaxProvider],
})
export class BankModule {}
