export type Vector2 = [number, number];
export type Point2D = Vector2;

export type Vector3 = [number, number, number];
export type Point3D = Vector3;

export type Vector4 = [number, number, number, number];

export type Polygon2D = Point2D[];

export const getDistance = (a: Vector2 | Vector3 | Vector4, b: Vector2 | Vector3 | Vector4) => {
    const x = a[0] - b[0];
    const y = a[1] - b[1];

    if (a.length >= 3 && b.length >= 3 && a[2] !== undefined && b[2] !== undefined) {
        const z = a[2] - b[2];

        return Math.sqrt(x * x + y * y + z * z);
    }

    return Math.sqrt(x * x + y * y);
};

export const toVector3Object = (vector: Vector3) => {
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
