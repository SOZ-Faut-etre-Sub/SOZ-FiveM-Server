import { Module } from '../../core/decorators/module';
import { CircularCameraProvider } from './circular.camera.provider';
import { ObjectEditorProvider } from './object.editor.provider';
import { ObjectProvider } from './object.provider';
import { GizmoControlProvider } from './prop.gizmo.provider';
import { PropPlacementProvider } from './prop.placement.provider';

@Module({
    providers: [
        ObjectProvider,
        ObjectEditorProvider,
        PropPlacementProvider,
        CircularCameraProvider,
        GizmoControlProvider,
    ],
})
export class ObjectModule {}
