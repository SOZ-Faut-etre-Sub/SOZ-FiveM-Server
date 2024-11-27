import { Injectable } from '@core/decorators/injectable';

import { Vector3 } from '../shared/polyzone/vector';

@Injectable()
export class CameraService {
    public createCamera(position: Vector3, fov: number = 60) {
        return CreateCamWithParams(
            'DEFAULT_SCRIPTED_CAMERA',
            position[0],
            position[1],
            position[2],
            0,
            0,
            0,
            fov,
            false,
            0
        );
    }

    public setupCamera(position: Vector3, target: Vector3) {
        const cam = this.createCamera(position);
        PointCamAtCoord(cam, target[0], target[1], target[2]);
        this.setCameraActive(cam, true);
        this.renderCamera();
        return cam;
    }

    public setCameraActive(cam: number, active: boolean) {
        SetCamActive(cam, active);
    }

    public setCameraFov(cam: number, fov: number) {
        SetCamFov(cam, fov);
    }

    public setCameraPosition(cam: number, position: Vector3) {
        SetCamCoord(cam, position[0], position[1], position[2]);
        SetFocusPosAndVel(position[0], position[1], position[2], 0, 0, 0);
    }

    public setCameraRotation(cam: number, rotation: Vector3) {
        SetCamRot(cam, rotation[0], rotation[1], rotation[2], 2);
    }

    public setCameraPointAt(cam: number, target: Vector3) {
        PointCamAtCoord(cam, target[0], target[1], target[2]);
    }

    public updateCameraPosition(cam: number, position: Vector3, rotation: Vector3, duration: number = 1000) {
        SetCamParams(
            cam,
            position[0],
            position[1],
            position[2],
            rotation[0],
            rotation[1],
            rotation[2],
            GetCamFov(cam),
            duration,
            duration / 4,
            duration / 4,
            2
        );
        SetFocusPosAndVel(position[0], position[1], position[2], rotation[0], rotation[1], rotation[2]);
    }

    public renderCamera(duration: number = 1000) {
        RenderScriptCams(true, true, duration, true, true);
    }

    public deleteCamera() {
        RenderScriptCams(false, true, 1000, true, true);
        DestroyAllCams(true);
        SetFocusEntity(PlayerPedId());
    }
}
