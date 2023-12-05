import { RGBAColor, RGBColor } from '../color';
import { AbstractZone } from './abstract.zone';
import { Point3D, Vector2 } from './vector';

export type PolygonZoneOptions<T> = {
    minZ?: number;
    maxZ?: number;
    data?: T;
};

export class PolygonZone<T = never> implements AbstractZone {
    public readonly data?: T;
    public readonly minZ?: number;
    public readonly maxZ?: number;

    protected points: Vector2[];

    public constructor(points: Vector2[], options?: PolygonZoneOptions<T>) {
        this.points = points;
        this.minZ = options?.minZ;
        this.maxZ = options?.maxZ;

        if (this.maxZ < this.minZ) {
            const minZ = this.minZ;
            this.minZ = this.maxZ;
            this.maxZ = minZ;
        }

        this.data = options?.data;
    }

    public isPointInside(point: Point3D): boolean {
        if (this.minZ && point[2] < this.minZ) {
            return false;
        }

        if (this.maxZ && point[2] > this.maxZ) {
            return false;
        }

        const sides = this.points.length;
        let count = 0;
        const x = point[0];
        const y = point[1];

        for (let i = 0; i < sides - 1; i++) {
            const side = {
                a: {
                    x: this.points[i][0],
                    y: this.points[i][1],
                },
                b: {
                    x: this.points[i + 1][0],
                    y: this.points[i + 1][1],
                },
            };

            const x1 = side.a.x;
            const y1 = side.a.y;
            const x2 = side.b.x;
            const y2 = side.b.y;

            if (y1 > y !== y2 > y && x < ((x2 - x1) * (y - y1)) / (y2 - y1) + x1) {
                count++;
            }
        }

        return count % 2 !== 0;
    }

    public draw(wallColor: RGBAColor | RGBColor, alpha?: number): void {
        const minZ = this.minZ || -10000;
        const maxZ = this.maxZ || 10000;
        const sides = this.points.length;

        if (typeof wallColor[3] === 'undefined') {
            wallColor[3] = alpha || 150;
        }

        // Get polygon center
        const center = {
            x: 0,
            y: 0,
        };

        for (let i = 0; i < sides - 1; i++) {
            center.x += this.points[i][0];
            center.y += this.points[i][1];
        }

        center.x /= sides - 1;
        center.y /= sides - 1;

        // Draw each side of the polygon
        for (let i = 0; i < sides - 1; i++) {
            const side = {
                a: {
                    x: this.points[i][0],
                    y: this.points[i][1],
                },
                b: {
                    x: this.points[i + 1][0],
                    y: this.points[i + 1][1],
                },
            };

            DrawLine(side.a.x, side.a.y, minZ, side.b.x, side.b.y, minZ, 255, 0, 0, 150);
            DrawLine(side.a.x, side.a.y, maxZ, side.b.x, side.b.y, maxZ, 255, 0, 0, 150);
            DrawLine(side.a.x, side.a.y, minZ, side.a.x, side.a.y, maxZ, 255, 0, 0, 150);

            DrawPoly(
                side.a.x,
                side.a.y,
                minZ,
                side.b.x,
                side.b.y,
                minZ,
                side.a.x,
                side.a.y,
                maxZ,
                wallColor[0],
                wallColor[1],
                wallColor[2],
                wallColor[3]
            );
            DrawPoly(
                side.b.x,
                side.b.y,
                minZ,
                side.a.x,
                side.a.y,
                minZ,
                side.a.x,
                side.a.y,
                maxZ,
                wallColor[0],
                wallColor[1],
                wallColor[2],
                wallColor[3]
            );
            DrawPoly(
                side.b.x,
                side.b.y,
                maxZ,
                side.b.x,
                side.b.y,
                minZ,
                side.a.x,
                side.a.y,
                maxZ,
                wallColor[0],
                wallColor[1],
                wallColor[2],
                wallColor[3]
            );
            DrawPoly(
                side.b.x,
                side.b.y,
                minZ,
                side.b.x,
                side.b.y,
                maxZ,
                side.a.x,
                side.a.y,
                maxZ,
                wallColor[0],
                wallColor[1],
                wallColor[2],
                wallColor[3]
            );

            // Draw top
            DrawPoly(
                side.a.x,
                side.a.y,
                maxZ,
                side.b.x,
                side.b.y,
                maxZ,
                center.x,
                center.y,
                maxZ,
                wallColor[0],
                wallColor[1],
                wallColor[2],
                wallColor[3]
            );
            DrawPoly(
                center.x,
                center.y,
                maxZ,
                side.b.x,
                side.b.y,
                maxZ,
                side.a.x,
                side.a.y,
                maxZ,
                wallColor[0],
                wallColor[1],
                wallColor[2],
                wallColor[3]
            );

            DrawPoly(
                side.a.x,
                side.a.y,
                minZ,
                side.b.x,
                side.b.y,
                minZ,
                center.x,
                center.y,
                minZ,
                wallColor[0],
                wallColor[1],
                wallColor[2],
                wallColor[3]
            );
        }
    }
}
