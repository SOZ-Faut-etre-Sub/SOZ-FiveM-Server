import { JobType } from './job';
import { Zone } from './polyzone/box.zone';
import { Vector4 } from './polyzone/vector';

export enum FuelType {
    Essence = 'essence',
    Kerosene = 'kerosene',
}

export enum FuelStationType {
    Public = 'public',
    Private = 'private',
}

export type FuelStation = {
    entity?: number;
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

export type UpwCharger = {
    id: number;
    station: string;
    position: Vector4;
    active: boolean;
};

export type UpwStation = {
    id: number;
    station: string;
    stock: number;
    max_stock: number;
    price: number;
    position: Vector4;
};
