import { Module } from '../../core/decorators/module';
import { BankMoneyCaseProvider } from './bank.money-case.provider';
import { BankProvider } from './bank.provider';
import { BankUIProvider } from './bank.ui.provider';

@Module({
    providers: [BankProvider, BankMoneyCaseProvider, BankUIProvider],
})
export class BankModule {}
