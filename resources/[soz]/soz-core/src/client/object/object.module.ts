import { Module } from '../../core/decorators/module';
import { CircularCameraProvider } from './circular.camera.provider';
import { ObjectEditorProvider } from './object.editor.provider';
import { ObjectProvider } from './object.provider';
import { GizmoControlProvider } from './prop.gizmo.provider';
import { PropImageProvider } from './prop.image.provider';
import { TextureReplacerProvider } from './texture.replacer.provider';

@Module({
    providers: [
        ObjectProvider,
        ObjectEditorProvider,
        CircularCameraProvider,
        GizmoControlProvider,
        PropImageProvider,
        TextureReplacerProvider,
    ],
})
export class ObjectModule {}
