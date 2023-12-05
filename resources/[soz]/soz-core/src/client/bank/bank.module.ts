import { Module } from '../../core/decorators/module';
import { BankMoneyCaseProvider } from './bank.money-case.provider';

@Module({
    providers: [BankMoneyCaseProvider],
})
export class BankModule {}
