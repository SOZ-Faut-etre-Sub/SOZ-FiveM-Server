import { Injectable } from '@core/decorators/injectable';
import { wait } from '@core/utils';

import { Control } from '../shared/input';
import { add2Vector3, multVector3, sub2Vector3, Vector2, Vector3 } from '../shared/polyzone/vector';

@Injectable()
export class ScreenService {
    private intersectEverything = false;

    public world3DToScreen2D(world3D: Vector3): Vector2 {
        const screenCorrd = GetScreenCoordFromWorldCoord(world3D[0], world3D[1], world3D[2]);
        return [screenCorrd[1], screenCorrd[2]];
    }

    private rotationToDirection(rotation: Vector3): Vector3 {
        const x = (rotation[0] * Math.PI) / 180.0;
        const z = (rotation[2] * Math.PI) / 180.0;
        const num = Math.abs(Math.cos(x));

        return [-Math.sin(z) * num, Math.cos(z) * num, Math.sin(x)];
    }

    private getScreenToWorldPosition(camePosition: Vector3, camRotation: Vector3, cursor: Vector2): [Vector3, Vector3] {
        const camForward = this.rotationToDirection(camRotation);
        const rotUp = [camRotation[0] + 1.0, camRotation[1], camRotation[2]] as Vector3;
        const rotDown = [camRotation[0] - 1.0, camRotation[1], camRotation[2]] as Vector3;
        const rotLeft = [camRotation[0], camRotation[1], camRotation[2] - 1.0] as Vector3;
        const rotRight = [camRotation[0], camRotation[1], camRotation[2] + 1.0] as Vector3;
        const camRight = sub2Vector3(this.rotationToDirection(rotRight), this.rotationToDirection(rotLeft));
        const camUp = sub2Vector3(this.rotationToDirection(rotUp), this.rotationToDirection(rotDown));
        const rollRad = -((camRotation[1] * Math.PI) / 180.0);
        const camRightRoll = sub2Vector3(
            multVector3(camRight, Math.cos(rollRad)),
            multVector3(camUp, Math.sin(rollRad))
        );
        const camUpRoll = add2Vector3(multVector3(camRight, Math.sin(rollRad)), multVector3(camUp, Math.cos(rollRad)));
        const point3DZero = add2Vector3(camePosition, multVector3(camForward, 1.0));
        const point3D = add2Vector3(point3DZero, add2Vector3(camRightRoll, camUpRoll));
        const point2D = this.world3DToScreen2D(point3D);
        const point2DZero = this.world3DToScreen2D(point3DZero);
        const scaleX = (cursor[0] - point2DZero[0]) / (point2D[0] - point2DZero[0]);
        const scaleY = (cursor[1] - point2DZero[1]) / (point2D[1] - point2DZero[1]);
        const point3Dret = add2Vector3(
            point3DZero,
            add2Vector3(multVector3(camRightRoll, scaleX), multVector3(camUpRoll, scaleY))
        );
        const forwardDir = add2Vector3(
            camForward,
            add2Vector3(multVector3(camRightRoll, scaleX), multVector3(camUpRoll, scaleY))
        );

        return [point3Dret, forwardDir];
    }

    public async getEntityOnMousePosition(): Promise<[number, Vector3]> {
        const posX = GetControlNormal(0, Control.CursorX);
        const posY = GetControlNormal(0, Control.CursorY);

        const cursor = [posX, posY] as Vector2;
        return this.getEntityOnPosition(cursor);
    }

    public async getEntityOnPosition(
        cursor: Vector2,
        coords?: Vector3,
        rotations?: Vector3
    ): Promise<[number, Vector3]> {
        if (!coords) {
            coords = GetFinalRenderedCamCoord() as Vector3;
        }
        if (!rotations) {
            rotations = GetFinalRenderedCamRot(0) as Vector3;
        }

        const [cam3DPos, forwardDir] = this.getScreenToWorldPosition(coords, rotations, cursor);
        const direction = add2Vector3(coords, multVector3(forwardDir, 1000.0));
        const rayHandle = StartShapeTestLosProbe(
            cam3DPos[0],
            cam3DPos[1],
            cam3DPos[2],
            direction[0],
            direction[1],
            direction[2],
            this.intersectEverything ? -1 : 30,
            PlayerPedId(),
            0
        );

        // eslint-disable-next-line no-constant-condition
        while (true) {
            const [result, , endCoords, , entity] = GetShapeTestResult(rayHandle);

            if (result === 2) {
                return [entity, endCoords as Vector3];
            }

            if (result !== 1) {
                return [null, null];
            }

            this.intersectEverything = !this.intersectEverything;

            await wait(0);
        }
    }
}
