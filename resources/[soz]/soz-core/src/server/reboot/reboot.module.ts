import { Module } from '../../core/decorators/module';
import { RebootProvider } from './reboot.provider';

@Module({
    providers: [RebootProvider],
})
export class RebootModule {}
