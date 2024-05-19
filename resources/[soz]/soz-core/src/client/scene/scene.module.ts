import { Module } from '../../core/decorators/module';
import { SceneProvider } from './scene.provider';

@Module({
    providers: [SceneProvider],
})
export class SceneModule {}
