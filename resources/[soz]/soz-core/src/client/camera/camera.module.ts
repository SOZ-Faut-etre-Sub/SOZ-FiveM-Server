import { Module } from '@core/decorators/module';

import { FlyingCameraProvider } from './flying.camera.provider';
import { OrbitalCameraProvider } from './orbital.camera.provider';

@Module({
    providers: [FlyingCameraProvider, OrbitalCameraProvider],
})
export class CameraModule {}
