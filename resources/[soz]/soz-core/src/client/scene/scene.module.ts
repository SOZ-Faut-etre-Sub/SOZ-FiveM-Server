import { Module } from '../../core/decorators/module';
import { SceneLiveProvider } from './scene.live.provider';
import { SceneProvider } from './scene.provider';

@Module({
    providers: [SceneLiveProvider, SceneProvider],
})
export class SceneModule {}
