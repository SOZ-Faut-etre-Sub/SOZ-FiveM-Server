export type Vector2 = [number, number];
export type Point2D = Vector2;

export type Vector3 = [number, number, number];
export type Point3D = Vector3;

export type Vector4 = [number, number, number, number];

export type Polygon2D = Point2D[];

export const rotatePoint = (
    center: Point2D | Point3D | Vector4,
    point: Point2D | Point3D,
    angleInRad: number
): Point2D => {
    const cos = Math.cos(angleInRad);
    const sin = Math.sin(angleInRad);

    const x = point[0] - center[0];
    const y = point[1] - center[1];

    const newX = x * cos - y * sin;
    const newY = x * sin + y * cos;

    return [newX + center[0], newY + center[1]];
};

export const rotatePoint3D = (center: Point3D | Vector4, point: Point3D, angleInRad: number): Point3D => {
    const cos = Math.cos(angleInRad);
    const sin = Math.sin(angleInRad);

    const x = point[0] - center[0];
    const y = point[1] - center[1];

    const newX = x * cos - y * sin;
    const newY = x * sin + y * cos;

    return [newX + center[0], newY + center[1], point[2]];
};

export const transformForwardPoint2D = (point: Point2D, angleInRad: number, distance: number): Point2D => {
    // we move the point only on the y axis (where the angle is 0)
    const newPoint: Point2D = [point[0], point[1] + distance];

    // we rotate the point around the center
    return rotatePoint(point, newPoint, angleInRad);
};

export const getDistance = (a: Vector2 | Vector3 | Vector4, b: Vector2 | Vector3 | Vector4) => {
    const x = a[0] - b[0];
    const y = a[1] - b[1];

    if (a.length >= 3 && b.length >= 3 && a[2] !== undefined && b[2] !== undefined) {
        const z = a[2] - b[2];

        return Math.sqrt(x * x + y * y + z * z);
    }

    return Math.sqrt(x * x + y * y);
};

export const fromVector3Object = ({ x, y, z }: { x: number; y: number; z: number }): Vector3 => {
    return [x, y, z];
};

export const fromVector4Object = ({ x, y, z, w }: { x: number; y: number; z: number; w: number }): Vector4 => {
    return [x, y, z, w];
};

export const toVector2Object = (vector: Vector2 | Vector3 | Vector4) => {
    return {
        x: vector[0],
        y: vector[1],
    };
};

export const toVector3Object = (vector: Vector3 | Vector4) => {
    return {
        x: vector[0],
        y: vector[1],
        z: vector[2],
    };
};

export const rad = (x: number) => {
    return (x * Math.PI) / 180;
};

export const deg = (x: number) => {
    return (x * 180) / Math.PI;
};

export const toVector4Object = (vector: Vector4) => {
    return {
        x: vector[0],
        y: vector[1],
        z: vector[2],
        w: vector[3],
    };
};

export const toVectorNorm = (vector: Vector3) => {
    return Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1] + vector[2] * vector[2]);
};

export const toVector2Norm = (vector: Vector3) => {
    return Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
};

export const multVector3 = (vector: Vector3 | Vector4, value: number): Vector3 => {
    return [vector[0] * value, vector[1] * value, vector[2] * value];
};

export const dot2Vector3 = (vector1: Vector3, vector2: Vector3): number => {
    return vector1[0] * vector2[0] + vector1[1] * vector2[1] + vector1[2] * vector2[2];
};

export const add2Vector3 = (vector1: Vector3, vector2: Vector3): Vector3 => {
    return [vector1[0] + vector2[0], vector1[1] + vector2[1], vector1[2] + vector2[2]];
};

export const createVector3FromPoint = (a: Point3D, b: Point3D): Vector3 => {
    return [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
};

export const sub2Vector3 = (vector1: Vector3 | Vector4, vector2: Vector3): Vector3 => {
    return [vector1[0] - vector2[0], vector1[1] - vector2[1], vector1[2] - vector2[2]];
};

export const crossProductVector3 = (vector1: Vector3, vector2: Vector3): Vector3 => {
    return [
        vector1[1] * vector2[2] - vector1[2] * vector2[1],
        vector1[2] * vector2[0] - vector1[0] * vector2[2],
        vector1[0] * vector2[1] - vector1[1] * vector2[0],
    ];
};

export const planeEquationCoeffs = (p1: Point3D, p2: Point3D, p3: Point3D): [number, number, number, number] => {
    const vector1 = sub2Vector3(p2, p1);
    const vector2 = sub2Vector3(p3, p1);
    const normal = crossProductVector3(vector1, vector2);
    const D = -dot2Vector3(normal, p1);

    return [normal[0], normal[1], normal[2], D];
};

export const clampMagnitudeVector3 = (v: Vector3, max: number) => {
    const norm = toVectorNorm(v);
    if (norm > max) {
        return multVector3(v, max / norm);
    }
    return v;
};

export const applyOffset = (v: Vector4, offset: Vector3): Vector4 => {
    const radAngle = rad(v[3]);

    const coords = [...v] as Vector4;
    coords[0] += offset[0] * Math.cos(radAngle) - offset[1] * Math.sin(radAngle);
    coords[1] += offset[0] * Math.sin(radAngle) + offset[1] * Math.cos(radAngle);
    coords[2] += offset[2];

    return coords;
};

export const getRotationForATargetingB = (A: Vector3, B: Vector3): Vector3 => {
    // Calcul du vecteur directionnel
    const directionVector = sub2Vector3(B, A);
    const distanceXY = Math.sqrt(directionVector[0] ** 2 + directionVector[1] ** 2);

    // Calcul du yaw (rotation autour de l'axe Y) en radians
    const yaw = Math.atan2(directionVector[1], directionVector[0]);
    const pitch = Math.atan2(-directionVector[2], distanceXY);
    const roll = 0;

    // Conversion en degrés
    const yawDeg = yaw * (180 / Math.PI); // Conversion en degrés
    const pitchDeg = pitch * (180 / Math.PI); // Conversion en degrés

    return [pitchDeg, roll, yawDeg];
};

export function quaternionToEuler(quaternion: Vector4): Vector3 {
    return [
        deg(
            Math.atan2(
                2 * (quaternion[3] * quaternion[0] + quaternion[1] * quaternion[2]),
                1 - 2 * (quaternion[0] * quaternion[0] + quaternion[1] * quaternion[1])
            )
        ),
        deg(
            -Math.PI / 2 +
                2 *
                    Math.atan2(
                        Math.sqrt(1 + 2 * (quaternion[3] * quaternion[1] - quaternion[0] * quaternion[2])),
                        Math.sqrt(1 - 2 * (quaternion[3] * quaternion[1] - quaternion[0] * quaternion[2]))
                    )
        ),
        deg(
            Math.atan2(
                2 * (quaternion[3] * quaternion[2] + quaternion[0] * quaternion[1]),
                1 - 2 * (quaternion[1] * quaternion[1] + quaternion[2] * quaternion[2])
            )
        ),
    ];
}

export function eulerToQuaternion(eulerAngles: Vector3): Vector4 {
    const halfPhi = 0.5 * eulerAngles[0]; // Half the roll.
    const halfTheta = 0.5 * eulerAngles[1]; // Half the pitch.
    const halfPsi = 0.5 * eulerAngles[2]; // Half the yaw.

    const cosHalfPhi = Math.cos(halfPhi);
    const sinHalfPhi = Math.sin(halfPhi);
    const cosHalfTheta = Math.cos(halfTheta);
    const sinHalfTheta = Math.sin(halfTheta);
    const cosHalfPsi = Math.cos(halfPsi);
    const sinHalfPsi = Math.sin(halfPsi);

    return [
        cosHalfPhi * cosHalfTheta * cosHalfPsi - sinHalfPhi * sinHalfTheta * sinHalfPsi,
        sinHalfPhi * cosHalfTheta * cosHalfPsi + cosHalfPhi * sinHalfTheta * sinHalfPsi,
        cosHalfPhi * sinHalfTheta * cosHalfPsi - sinHalfPhi * cosHalfTheta * sinHalfPsi,
        cosHalfPhi * cosHalfTheta * sinHalfPsi + sinHalfPhi * sinHalfTheta * cosHalfPsi,
    ];
}

export function normalize180(ang: number) {
    while (ang < -180) {
        ang += 360;
    }
    while (ang >= 180) {
        ang -= 360;
    }
    return ang;
}

export function angleDist(angle1: number, angle2: number) {
    const delta = Math.abs(normalize180(angle1) - normalize180(angle2));
    return Math.min(delta, 360 - delta);
}

export function clampAngle(angle: number, center: number, maxOffset: number) {
    const offset = angleDist(center, angle);

    if (offset < maxOffset) {
        return angle;
    }
    if (angleDist(angle, center + maxOffset) > angleDist(angle, center - maxOffset)) {
        return normalize180(center - maxOffset);
    }
    return normalize180(center + maxOffset);
}

export const getHeadingFromVector2d = (x: number, y: number): number => {
    const angle = Math.atan2(-x, -y);
    return (deg(angle) + 360) % 360;
};

export function multiplyVector(vec: Vector3, quat: Vector4): Vector3 {
    const num = quat[0] * 2;
    const num2 = quat[1] * 2;
    const num3 = quat[2] * 2;
    const num4 = quat[0] * num;
    const num5 = quat[1] * num2;
    const num6 = quat[2] * num3;
    const num7 = quat[0] * num2;
    const num8 = quat[0] * num3;
    const num9 = quat[1] * num3;
    const num10 = quat[3] * num;
    const num11 = quat[3] * num2;
    const num12 = quat[3] * num3;
    return [
        (1 - (num5 + num6)) * vec[0] + (num7 - num12) * vec[1] + (num8 + num11) * vec[2],
        (num7 + num12) * vec[0] + (1 - (num4 + num6)) * vec[1] + (num9 - num10) * vec[2],
        (num8 - num11) * vec[0] + (num9 + num10) * vec[1] + (1 - (num4 + num5)) * vec[2],
    ];
}
