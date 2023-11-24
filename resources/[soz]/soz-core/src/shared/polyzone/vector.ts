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

export const mult2Vector3 = (vector1: Vector3, vector2: Vector3): Vector3 => {
    return [vector1[0] * vector2[0], vector1[1] * vector2[1], vector1[2] * vector2[2]];
};

export const addVector3 = (vector: Vector3, value: number): Vector3 => {
    return [vector[0] + value, vector[1] + value, vector[2] + value];
};

export const add2Vector3 = (vector1: Vector3, vector2: Vector3): Vector3 => {
    return [vector1[0] + vector2[0], vector1[1] + vector2[1], vector1[2] + vector2[2]];
};
