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
    playername?: string;
    showcone?: boolean;
    heading?: number;
    showheading?: boolean;
    secondarycolor?: number;
    friend?: boolean;
    mission?: boolean;
    friendly?: boolean;
    routeColor?: number;
    scale?: number;
    route?: boolean;
    name: string;
    coords: { x: number; y: number; z?: number };
    position?: Vector3 | Vector4;
};

export type Blip = RequireAtLeastOne<QbBlip, 'coords' | 'position'>;
