import { Provider } from '@public/core/decorators/provider';
import { Tick, TickInterval } from '@public/core/decorators/tick';
import { Control } from '@public/shared/input';

import { Vector3 } from '../../shared/polyzone/vector';

@Provider()
export class OrbitalCameraProvider {
    private cameraSpeed = 6;

    private camera: number;
    private entity: number;
    private offset: Vector3;
    private focusPoint: Vector3;
    private rotation: Vector3;
    private currentRadius: number;
    private maxRadius: number;
    private focusOffset: Vector3 = [0, 0, 0];
    private freeMode: boolean = false;

    private handleFocusOffset() {
        const speed = 0.02;
        let forward = 0;
        let right = 0;
        let up = 0;

        if (IsDisabledControlPressed(0, Control.MoveUpOnly)) forward -= speed;
        if (IsDisabledControlPressed(0, Control.MoveDownOnly)) forward += speed;
        if (IsDisabledControlPressed(0, Control.MoveLeftOnly)) right -= speed;
        if (IsDisabledControlPressed(0, Control.MoveRightOnly)) right += speed;
        if (IsDisabledControlPressed(0, Control.Sprint)) up += speed;
        if (IsDisabledControlPressed(0, Control.FrontendRs)) up -= speed;

        if (forward !== 0 || right !== 0 || up !== 0) {
            const yaw = (this.rotation[2] * Math.PI) / 180;
            const pitch = (this.rotation[1] * Math.PI) / 180;

            const forwardVec: Vector3 = [
                Math.cos(yaw) * Math.cos(pitch),
                Math.sin(yaw) * Math.cos(pitch),
                Math.sin(pitch),
            ];
            const rightVec: Vector3 = [-Math.sin(yaw), Math.cos(yaw), 0];
            const upVec: Vector3 = [0, 0, 1];

            for (let i = 0; i < 3; i++) {
                this.focusOffset[i] += forward * forwardVec[i] + right * rightVec[i] + up * upVec[i];
            }

            const length = Math.sqrt(this.focusOffset[0] ** 2 + this.focusOffset[1] ** 2 + this.focusOffset[2] ** 2);
            if (length > 1) {
                this.focusOffset = [
                    this.focusOffset[0] / length,
                    this.focusOffset[1] / length,
                    this.focusOffset[2] / length,
                ] as Vector3;
            }
        }
    }

    public createCamera(
        entity: number,
        offset: Vector3 = [0, 0, 0.5],
        maxRadius: number = 20,
        initialRadius?: number,
        freeMode: boolean = false
    ) {
        initialRadius = initialRadius ?? 5;
        this.entity = entity;
        this.offset = offset;
        this.maxRadius = maxRadius;
        this.currentRadius = initialRadius ?? maxRadius;
        this.freeMode = freeMode;

        const rotation = GetGameplayCamRot(2);
        this.rotation = [0, -rotation[0], rotation[2] - 90];

        ClearFocus();
        const pos = GetEntityCoords(this.entity);
        this.focusPoint = [pos[0] + this.offset[0], pos[1] + this.offset[1], pos[2] + this.offset[2]];
        this.camera = CreateCamWithParams(
            'DEFAULT_SCRIPTED_CAMERA',
            this.focusPoint[0],
            this.focusPoint[1],
            this.focusPoint[2],
            0,
            0,
            0,
            GetGameplayCamFov(),
            false,
            2
        );

        PointCamAtCoord(this.camera, pos[0], pos[1], pos[2]);
        SetCamActive(this.camera, true);
        RenderScriptCams(true, true, 1000, true, true);

        return this.camera;
    }

    public deleteCamera() {
        ClearFocus();
        RenderScriptCams(false, true, 1000, true, true);
        DestroyAllCams(true);
        SetFocusEntity(PlayerPedId());

        this.focusOffset = [0, 0, 0];
        this.camera = null;
        this.entity = null;
        this.offset = null;
        this.focusPoint = null;
        this.rotation = null;
        this.currentRadius = null;
        this.maxRadius = null;
        this.freeMode = false;
    }

    @Tick(TickInterval.EVERY_FRAME)
    public async handleCamera() {
        if (!this.camera || !this.entity || (IsNuiFocused() && this.freeMode)) {
            return;
        }

        if (!this.freeMode) {
            DisableAllControlActions(0);
        }

        if (!IsCamActive(this.camera)) {
            return;
        }

        this.handleZoom();
        this.handleRotation();
        this.handleFocusOffset();
        this.handleFocusPoint();

        const cosY = Math.cos((this.rotation[1] * Math.PI) / 180);
        const offset = [
            Math.cos((this.rotation[2] * Math.PI) / 180) * cosY * this.currentRadius,
            Math.sin((this.rotation[2] * Math.PI) / 180) * cosY * this.currentRadius,
            Math.sin((this.rotation[1] * Math.PI) / 180) * this.currentRadius,
        ];

        const newPow = [this.focusPoint[0] + offset[0], this.focusPoint[1] + offset[1], this.focusPoint[2] + offset[2]];

        SetCamCoord(this.camera, newPow[0], newPow[1], newPow[2]);
        PointCamAtCoord(this.camera, this.focusPoint[0], this.focusPoint[1], this.focusPoint[2]);
        SetFocusPosAndVel(this.focusPoint[0], this.focusPoint[1], this.focusPoint[2], 0.0, 0.0, 0.0);
    }

    private handleFocusPoint() {
        const pos = GetEntityCoords(this.entity);

        this.focusPoint = [
            pos[0] + this.offset[0] + this.focusOffset[0],
            pos[1] + this.offset[1] + this.focusOffset[1],
            pos[2] + this.offset[2] + this.focusOffset[2],
        ];
    }

    private handleZoom() {
        if (IsDisabledControlJustPressed(0, Control.CursorScrollUp)) {
            this.currentRadius = Math.max(this.currentRadius - 1.0, 1);
        }
        if (IsDisabledControlJustPressed(0, Control.CursorScrollDown)) {
            this.currentRadius = Math.min(this.currentRadius + 1.0, this.maxRadius);
        }
    }

    private handleRotation() {
        this.rotation[2] -= GetDisabledControlNormal(0, Control.LookLeftRight) * this.cameraSpeed;
        this.rotation[1] += GetDisabledControlNormal(0, Control.LookUpDown) * this.cameraSpeed;
        this.rotation[1] = Math.max(Math.min(this.rotation[1], 89), -89);
    }
}
