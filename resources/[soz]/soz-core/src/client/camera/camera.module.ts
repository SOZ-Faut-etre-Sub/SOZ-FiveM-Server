import { Module } from '@core/decorators/module';

import { FlyingCameraProvider } from './flying.camera.provider';

@Module({
    providers: [FlyingCameraProvider],
})
export class CameraModule {}
