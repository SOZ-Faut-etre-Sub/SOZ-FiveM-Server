import { Vector3 } from './polyzone/vector';

export type TravelingPoint = {
    position: Vector3;
    rotation: Vector3;
    fov: number;
    wait: number;
};

export type TravelingCamera = {
    id: number;
    name: string;
    job: string;
    points: TravelingPoint[];
};
