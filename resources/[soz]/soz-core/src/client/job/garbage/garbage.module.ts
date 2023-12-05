import { Module } from '../../../core/decorators/module';
import { GarbageProvider } from './garbage.provider';

@Module({
    providers: [GarbageProvider],
})
export class GarbageModule {}
