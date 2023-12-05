import { Provider } from '@public/core/decorators/provider';
import { Tick, TickInterval } from '@public/core/decorators/tick';
import { wait } from '@public/core/utils';

import { getDistance, Vector3 } from '../../shared/polyzone/vector';

export type CircularCameraState = {
    cam: number;
    target: Vector3;
    targetBuffer: Vector3[];
    polarAngleDeg: number;
    azimuthAngleDeg: number;
    radius: number;
};

@Provider()
export class CircularCameraProvider {
    private cameraState: CircularCameraState = null;

    public createCamera(target: Vector3) {
        const cam = CreateCamWithParams(
            'DEFAULT_SCRIPTED_CAMERA',
            target[0],
            target[1],
            target[2] + 5,
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

        this.cameraState = {
            cam,
            target,
            targetBuffer: [],
            polarAngleDeg: 0,
            azimuthAngleDeg: 100,
            radius: 5,
        };

        return cam;
    }

    public deleteCamera() {
        RenderScriptCams(false, true, 1000, true, true);
        DestroyAllCams(true);
        SetFocusEntity(PlayerPedId());
        this.cameraState = null;
    }

    public updateTarget(target: Vector3) {
        if (getDistance(target, this.cameraState.target) > 1.0) {
            this.cameraState.targetBuffer.push(target);
        }
    }

    @Tick(TickInterval.EVERY_FRAME)
    public async handleCamera() {
        if (!this.cameraState) {
            return;
        }

        await this.handleZoom();
        await this.handleRotation();
        await this.handleCameraTransition();
    }

    // Utils

    public polarToWorld(target: Vector3, polarAngleDeg: number, azimuthAngleDeg: number, radius: number): Vector3 {
        const polarAngleRad = polarAngleDeg * (Math.PI / 180);
        const azimuthAngleRad = azimuthAngleDeg * (Math.PI / 180);
        const x = target[0] + radius * Math.sin(azimuthAngleRad) * Math.cos(polarAngleRad);
        const y = target[1] - radius * Math.sin(azimuthAngleRad) * Math.sin(polarAngleRad);
        const z = target[2] - radius * Math.cos(azimuthAngleRad);
        return [x, y, z] as Vector3;
    }

    // Handlers

    public async handleZoom() {
        if (IsDisabledControlJustPressed(0, 241)) {
            this.cameraState.radius = Math.max(this.cameraState.radius - 1.0, 1);
        }
        if (IsDisabledControlJustPressed(0, 242)) {
            this.cameraState.radius = Math.min(this.cameraState.radius + 1.0, 20);
        }
    }

    public async handleCameraTransition() {
        const newTarget = this.cameraState.targetBuffer.shift();
        if (!newTarget) {
            return;
        }

        const newCam = CreateCamWithParams(
            'DEFAULT_SCRIPTED_CAMERA',
            newTarget[0],
            newTarget[1],
            newTarget[2],
            0,
            0,
            0,
            60,
            false,
            0
        );

        const newTargetPosition = this.polarToWorld(
            newTarget,
            this.cameraState.polarAngleDeg,
            this.cameraState.azimuthAngleDeg,
            this.cameraState.radius
        );
        SetCamCoord(newCam, newTargetPosition[0], newTargetPosition[1], newTargetPosition[2]);
        PointCamAtCoord(newCam, newTarget[0], newTarget[1], newTarget[2]);

        const oldCam = this.cameraState.cam;
        SetCamActive(newCam, true);
        SetCamActiveWithInterp(newCam, oldCam, 1000, 1, 1);
        await wait(1000);
        DestroyCam(oldCam, true);
        if (!this.cameraState) {
            return;
        }
        this.cameraState.cam = newCam;
        this.cameraState.target = newTarget;
    }

    public async handleRotation() {
        const xMagnitude = GetDisabledControlNormal(0, 220);
        const yMagnitude = GetDisabledControlNormal(0, 221);

        this.cameraState.polarAngleDeg += xMagnitude * 10;

        if (this.cameraState.polarAngleDeg > 360) {
            this.cameraState.polarAngleDeg -= 360;
        } else if (this.cameraState.polarAngleDeg < 0) {
            this.cameraState.polarAngleDeg += 360;
        }

        this.cameraState.azimuthAngleDeg += yMagnitude * 10;

        if (this.cameraState.azimuthAngleDeg < 85) {
            this.cameraState.azimuthAngleDeg = 85;
        } else if (this.cameraState.azimuthAngleDeg > 179) {
            this.cameraState.azimuthAngleDeg = 179;
        }

        const position = this.polarToWorld(
            this.cameraState.target,
            this.cameraState.polarAngleDeg,
            this.cameraState.azimuthAngleDeg,
            this.cameraState.radius
        );

        const camRot = GetCamRot(this.cameraState.cam, 2);

        SetCamParams(
            this.cameraState.cam,
            position[0],
            position[1],
            position[2],
            camRot[0],
            camRot[1],
            camRot[2],
            60.0,
            9100,
            0,
            0,
            2
        );
        PointCamAtCoord(
            this.cameraState.cam,
            this.cameraState.target[0],
            this.cameraState.target[1],
            this.cameraState.target[2]
        );
    }
}
