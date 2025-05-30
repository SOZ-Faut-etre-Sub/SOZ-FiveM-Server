import { Module } from '@core/decorators/module';
import { TravelingCameraProvider } from '@public/server/camera/traveling.camera.provider';

@Module({
    providers: [TravelingCameraProvider],
})
export class CameraModule {}
