import { Module } from '../../core/decorators/module';
import { ZEventPopcornProvider } from './zevent.popcorn.provider';

@Module({
    providers: [ZEventPopcornProvider],
})
export class ZEventModule {}
