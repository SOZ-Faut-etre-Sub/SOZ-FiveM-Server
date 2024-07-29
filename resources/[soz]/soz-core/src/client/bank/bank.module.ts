import { Module } from '../../core/decorators/module';
import { BankAtmProvider } from './bank.atm.provider';
import { BankMoneyCaseProvider } from './bank.money-case.provider';
import { BankProvider } from './bank.provider';
import { BankSafeProvider } from './bank.safe.provider';

@Module({
    providers: [BankProvider, BankAtmProvider, BankSafeProvider, BankMoneyCaseProvider],
})
export class BankModule {}
