import { Injectable } from '@core/decorators/injectable';

import { Vector3 } from '../shared/polyzone/vector';

@Injectable()
export class CameraService {
    public createCamera(active = false) {
        return CreateCam('DEFAULT_SCRIPTED_CAMERA', active);
    }

    public createCameraAtPosition(position: Vector3, fov: number = 60) {
        const cam = CreateCamWithParams(
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
        SetFocusPosAndVel(position[0], position[1], position[2], 0, 0, 0);
        return cam;
    }

    public setupCamera(position: Vector3, target: Vector3) {
        const cam = this.createCameraAtPosition(position);
        PointCamAtCoord(cam, target[0], target[1], target[2]);
        this.setCameraActive(cam, true);
        this.renderCamera();
        return cam;
    }

    public setCameraActive(cam: number, active: boolean) {
        SetCamActive(cam, active);

        if (!active) {
            RenderScriptCams(false, true, 1000, true, true);
        }
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

    public setCameraParams(
        cam: number,
        position: Vector3,
        rotation: Vector3 = [0, 0, 0],
        fov: number = 60,
        transition: number = 0,
        acceleration: number = 1,
        deceleration: number = 1,
        rotationOrder: number = 2
    ) {
        SetCamParams(
            cam,
            position[0],
            position[1],
            position[2],
            rotation[0],
            rotation[1],
            rotation[2],
            fov,
            transition,
            acceleration,
            deceleration,
            rotationOrder
        );
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

    public deleteCamera(cam: number) {
        Citizen.invokeNative('0x7659886d4d8ac36a', 4);
        DestroyCam(cam, false);
        ClearFocus();
    }

    public deleteAllCameras() {
        Citizen.invokeNative('0x7659886d4d8ac36a', 4);
        RenderScriptCams(false, true, 1000, true, true);
        DestroyAllCams(true);
        ClearFocus();
    }
}
