import { Module } from '../../core/decorators/module';
import { ZEventProvider } from './zevent.provider';

@Module({
    providers: [ZEventProvider],
})
export class ZEventModule {}
