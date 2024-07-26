import { Module } from '../../core/decorators/module';
import { BankMoneyCaseProvider } from './bank.money-case.provider';
import { BankProvider } from './bank.provider';
import { BankSafeProvider } from './bank.safe.provider';
import { BankUIProvider } from './bank.ui.provider';

@Module({
    providers: [BankProvider, BankSafeProvider, BankMoneyCaseProvider, BankUIProvider],
})
export class BankModule {}
