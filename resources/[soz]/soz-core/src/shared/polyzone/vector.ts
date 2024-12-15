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

export const multVector3 = (vector: Vector3, value: number): Vector3 => {
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

export const sub2Vector3 = (vector1: Vector3, vector2: Vector3): Vector3 => {
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

// @TODO Fix this

export const getRotation = (a: Vector3, b: Vector3): Vector3 => {
    const directionVector = sub2Vector3(b, a);
    const norm = toVectorNorm(directionVector);

    const yaw = Math.atan2(directionVector[0], directionVector[2]);
    const pitch = Math.asin(directionVector[1] / norm);

    return [deg(pitch), 0, deg(yaw)];
};

export const calculateYawPitchRoll = (A: Vector3, B: Vector3): Vector3 => {
    // Calcul du vecteur directionnel
    const v_x = B[0] - A[0];
    const v_y = B[1] - A[1];
    const v_z = B[2] - A[2];

    // Calcul du yaw (rotation autour de l'axe Y) en radians
    const yaw = Math.atan2(v_z, v_x);

    // Calcul du pitch (rotation autour de l'axe X) en radians
    const pitch = Math.atan2(v_y, Math.sqrt(v_x ** 2 + v_z ** 2));

    // Roll n'est pas nécessaire, on le définit comme 0
    const roll = 0;

    // Conversion en degrés
    const yawDeg = yaw * (180 / Math.PI); // Conversion en degrés
    const pitchDeg = pitch * (180 / Math.PI); // Conversion en degrés

    return [pitchDeg, roll, yawDeg];
};
