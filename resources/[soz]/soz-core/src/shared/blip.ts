import { RGBColor } from '@public/shared/color';
import { Vector3, Vector4 } from '@public/shared/polyzone/vector';

type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
    {
        [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
    }[Keys];

export type QbBlip = {
    sprite?: number;
    range?: boolean;
    color?: number;
    alpha?: number;
    display?: number;
    playerId?: number;
    showCone?: boolean;
    heading?: number;
    showHeading?: boolean;
    secondaryColor?: RGBColor;
    friend?: boolean;
    mission?: boolean;
    friendly?: boolean;
    routeColor?: number;
    scale?: number;
    route?: boolean;
    name: string;
    coords: { x: number; y: number; z?: number };
    position?: Vector3 | Vector4;
    category?: number;
};

export type Blip = RequireAtLeastOne<QbBlip, 'coords' | 'position'>;
