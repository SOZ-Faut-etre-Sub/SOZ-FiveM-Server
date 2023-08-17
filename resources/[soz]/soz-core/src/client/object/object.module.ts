import { Module } from '../../core/decorators/module';
import { ObjectProvider } from './object.provider';

@Module({
    providers: [ObjectProvider],
})
export class ObjectModule {}
