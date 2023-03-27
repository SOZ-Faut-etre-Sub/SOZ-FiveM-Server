import { Module } from '../../core/decorators/module';
import { ObjectService } from './object.service';

@Module({
    providers: [ObjectService],
})
export class ObjectModule {}
