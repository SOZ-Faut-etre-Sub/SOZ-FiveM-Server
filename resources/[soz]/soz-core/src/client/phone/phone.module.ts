import { Module } from '../../core/decorators/module';
import { PhoneManager } from './phone.manager';
import { PhoneProvider } from './phone.provider';

@Module({
    providers: [PhoneManager, PhoneProvider],
})
export class PhoneModule {}
