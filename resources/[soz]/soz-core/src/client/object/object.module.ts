import { Module } from '../../core/decorators/module';
import { ObjectService } from './object.service';
import { PropPlacementProvider } from './prop.placement.provider';
import { PropProvider } from './prop.provider';

@Module({
    providers: [ObjectService, PropPlacementProvider, PropProvider],
})
export class ObjectModule {}
