import { Module } from '../../../core/decorators/module';
import { BaunResellProvider } from './baun.resell.provider';

@Module({
    providers: [BaunResellProvider],
})
export class BaunModule {}
