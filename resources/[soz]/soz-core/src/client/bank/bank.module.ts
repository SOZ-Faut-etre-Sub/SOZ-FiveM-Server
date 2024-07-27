import { Module } from '../../core/decorators/module';
import { BankMoneyCaseProvider } from './bank.money-case.provider';
import { BankProvider } from './bank.provider';
import { BankSafeProvider } from './bank.safe.provider';

@Module({
    providers: [BankProvider, BankSafeProvider, BankMoneyCaseProvider],
})
export class BankModule {}
