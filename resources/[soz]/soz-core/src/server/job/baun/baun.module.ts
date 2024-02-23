import { Module } from '../../../core/decorators/module';
import { BaunResellProvider } from './baun.resell.provider';
import { BaunCofeProvider } from './baun.cofe.provider';

@Module({
    providers: [BaunResellProvider, BaunCofeProvider],
})
export class BaunModule {}
