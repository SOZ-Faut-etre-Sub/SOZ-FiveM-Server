import { Module } from '../../core/decorators/module';
import { ObjectProvider } from './object.provider';
import { PropHighlightProvider } from './prop.highlight.provider';
import { PropPlacementProvider } from './prop.placement.provider';
import { PropProvider } from './prop.provider';

@Module({
    providers: [ObjectProvider, PropPlacementProvider, PropProvider, PropHighlightProvider],
})
export class ObjectModule {}
