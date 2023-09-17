import { Module } from '../../core/decorators/module';
import { CircularCameraProvider } from './circular.camera.provider';
import { ObjectProvider } from './object.provider';
import { PropHighlightProvider } from './prop.highlight.provider';
import { PropPlacementProvider } from './prop.placement.provider';
import { PropProvider } from './prop.provider';

@Module({
    providers: [ObjectProvider, PropPlacementProvider, PropProvider, PropHighlightProvider, CircularCameraProvider],
})
export class ObjectModule {}
