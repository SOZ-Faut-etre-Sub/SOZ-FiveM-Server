import { Injectable } from '../core/decorators/injectable';
import { Vector3 } from '../shared/polyzone/vector';

@Injectable()
export class CameraService {
    public setupCamera(position: Vector3, target: Vector3) {
        const cam = CreateCamWithParams(
            'DEFAULT_SCRIPTED_CAMERA',
            position[0],
            position[1],
            position[2],
            0,
            0,
            0,
            60,
            false,
            0
        );
        PointCamAtCoord(cam, target[0], target[1], target[2]);
        SetCamActive(cam, true);
        RenderScriptCams(true, true, 1000, true, true);
    }

    public deleteCamera() {
        RenderScriptCams(false, true, 1000, true, true);
        DestroyAllCams(true);
        SetFocusEntity(PlayerPedId());
    }
}
