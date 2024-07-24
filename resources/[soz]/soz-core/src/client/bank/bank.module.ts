import { Module } from '../../core/decorators/module';
import { BankMoneyCaseProvider } from './bank.money-case.provider';
import { BankUIProvider } from './bank.ui.provider';

@Module({
    providers: [BankMoneyCaseProvider, BankUIProvider],
})
export class BankModule {}
