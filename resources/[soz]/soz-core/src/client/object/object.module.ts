import { Module } from '../../core/decorators/module';
import { ObjectService } from './object.service';
import { PropPlacementProvider } from './prop.placement.provider';

@Module({
    providers: [ObjectService, PropPlacementProvider],
})
export class ObjectModule {}
