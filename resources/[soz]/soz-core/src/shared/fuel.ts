import { JobType } from './job';
import { Zone } from './polyzone/box.zone';
import { Vector3, Vector4 } from './polyzone/vector';

export enum FuelType {
    Essence = 'essence',
    Kerosene = 'kerosene',
}

export enum FuelStationType {
    Public = 'public',
    Private = 'private',
}

export type FuelStation = {
    id: number;
    name: string;
    model: number;
    position: Vector4;
    zone: Zone;
    type: FuelStationType;
    fuel: FuelType;
    stock: number;
    price: number | null;
    job: JobType | null;
};
