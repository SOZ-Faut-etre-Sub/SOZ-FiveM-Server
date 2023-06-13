import { Module } from '../../core/decorators/module';
import { AlertProvider } from './alert.provider';

@Module({
    providers: [AlertProvider],
})
export class AlertModule {}
