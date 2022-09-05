import { Module } from '../../core/decorators/module';
import { BankProvider } from './bank.provider';

@Module({
    providers: [BankProvider],
})
export class BankModule {}
