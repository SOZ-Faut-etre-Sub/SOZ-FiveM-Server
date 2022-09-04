import { Module } from '../../core/decorators/module';
import { StreamProvider } from './stream.provider';

@Module({
    providers: [StreamProvider],
})
export class StreamModule {}
