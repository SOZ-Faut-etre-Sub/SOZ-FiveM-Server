import { Module } from '../../core/decorators/module';
import { ObjectService } from './object.service';
import { PropHighlightProvider } from './prop.highlight.provider';
import { PropPlacementProvider } from './prop.placement.provider';
import { PropProvider } from './prop.provider';

@Module({
    providers: [ObjectService, PropPlacementProvider, PropProvider, PropHighlightProvider],
})
export class ObjectModule {}
