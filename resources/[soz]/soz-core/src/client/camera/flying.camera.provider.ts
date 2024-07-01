import { Provider } from '@public/core/decorators/provider';
import { Tick, TickInterval } from '@public/core/decorators/tick';
import { Control } from '@public/shared/input';
import { Vector3 } from '@public/shared/polyzone/vector';

@Provider()
export class FlyingCameraProvider {
    private camera: number;

    private cameraMoveSpeed = 0.1;
    private cameraRotationSpeed = 6;

    private vecX: Vector3;
    private vecY: Vector3;
    private vecZ: Vector3;

    private restrictionLogic: (previousPosition: Vector3, newPosition: Vector3) => Vector3;

    public createCamera(): number {
        const pedPos = GetEntityCoords(PlayerPedId());
        const pos = GetGameplayCamCoord();
        const rot = GetGameplayCamRot(0);

        this.camera = CreateCamWithParams(
            'DEFAULT_SCRIPTED_CAMERA',
            pos[0],
            pos[1],
            pedPos[2] + 0.75,
            0,
            rot[1],
            rot[2],
            80,
            true,
            0
        );

        RenderScriptCams(true, true, 1000, true, true);

        this.vecX = [1, 0, 0];
        this.vecY = [0, 1, 0];
        this.vecZ = [0, 0, 1];

        return this.camera;
    }

    public deleteCamera() {
        RenderScriptCams(false, true, 1000, true, true);
        DestroyAllCams(true);
        SetFocusEntity(PlayerPedId());
        this.restrictionLogic = null;
        this.camera = null;
    }

    @Tick(TickInterval.EVERY_FRAME)
    public async handleFlyingCamera() {
        if (!this.camera) {
            return;
        }

        DisableAllControlActions(0);

        const { lookX, lookY, moveX, moveY, moveZ } = this.getInput();

        const pos = GetCamCoord(this.camera) as Vector3;
        const rot = GetCamRot(this.camera, 0);

        const rotZ = rot[0] + -lookY * this.cameraRotationSpeed;
        const rotY = rot[1];
        const rotX = rot[2] + -lookX * this.cameraRotationSpeed;

        const speed = this.cameraMoveSpeed * GetFrameTime() * 60;

        const newPos = [
            pos[0] + this.vecX[0] * moveX * speed + this.vecY[0] * -moveY * speed + this.vecZ[0] * moveZ * speed,
            pos[1] + this.vecX[1] * moveX * speed + this.vecY[1] * -moveY * speed + this.vecZ[1] * moveZ * speed,
            pos[2] + this.vecX[2] * moveX * speed + this.vecY[2] * -moveY * speed + this.vecZ[2] * moveZ * speed,
        ] as Vector3;

        this.handleCameraPosition(pos, newPos);
        this.handleCameraRotation([rotZ, rotY, rotX]);
    }

    public handleCameraPosition(previousPosition: Vector3, newPosition: Vector3) {
        const newPos = this.getRestrictedCamPosition(previousPosition, newPosition);
        SetCamCoord(this.camera, newPos[0], newPos[1], newPos[2]);
    }

    public handleCameraRotation([rotZ, rotY, rotX]) {
        const [clampRotZ, clampRotY, clampRotX] = [rotZ % 360, rotY % 360, rotX % 360] as Vector3;

        SetCamRot(this.camera, clampRotZ, clampRotY, clampRotX, 0);

        [this.vecX, this.vecY, this.vecZ] = this.EuleurToMatrix(clampRotZ, clampRotY, clampRotX);
    }

    private EuleurToMatrix(rotZ: number, rotY: number, rotX: number) {
        const radZ = (rotZ * Math.PI) / 180;
        const radY = (rotY * Math.PI) / 180;
        const radX = (rotX * Math.PI) / 180;

        const sinZ = Math.sin(radZ);
        const sinY = Math.sin(radY);
        const sinX = Math.sin(radX);
        const cosZ = Math.cos(radZ);
        const cosY = Math.cos(radY);
        const cosX = Math.cos(radX);

        const vecX = [cosY * cosX, cosY * sinX, -sinY] as Vector3;
        const vecY = [cosX * sinZ * sinY - cosZ * sinX, cosZ * cosX - sinZ * sinY * sinX, cosY * sinZ] as Vector3;
        const vecZ = [-cosZ * cosX * sinY + sinZ * sinX, -cosX * sinZ + cosZ * sinY * sinX, cosZ * cosY] as Vector3;

        return [vecX, vecY, vecZ];
    }

    getInput() {
        const lookX = GetDisabledControlNormal(0, Control.LookLeftRight);
        const lookY = GetDisabledControlNormal(0, Control.LookUpDown);

        const moveX = GetDisabledControlNormal(0, Control.MoveLeftRight);
        const moveY = GetDisabledControlNormal(0, Control.MoveUpDown);

        const moveZ =
            GetDisabledControlNormal(0, Control.ParachuteBrakeLeft) -
            GetDisabledControlNormal(0, Control.ParachuteBrakeRight);

        return { lookX, lookY, moveX, moveY, moveZ };
    }

    public setRestrictionLogic(restrictionLogic: (previousPosition: Vector3, newPosition: Vector3) => Vector3) {
        this.restrictionLogic = restrictionLogic;
    }

    public getRestrictedCamPosition(previousPosition: Vector3, newPosition: Vector3): Vector3 {
        if (!this.restrictionLogic) {
            return newPosition;
        }

        return this.restrictionLogic(previousPosition, newPosition);
    }
}
