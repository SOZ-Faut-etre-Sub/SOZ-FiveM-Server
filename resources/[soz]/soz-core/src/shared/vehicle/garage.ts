import { JobType } from '../job';
import { Zone } from '../polyzone/box.zone';
import { PlayerServerVehicle } from './player.vehicle';

export enum GarageType {
    Public = 'public',
    Private = 'private',
    Job = 'job',
    JobLuxury = 'job_luxury',
    Depot = 'depot',
    House = 'house',
}

export enum GarageCategory {
    Car = 'car',
    Air = 'air',
    Sea = 'sea',
    All = 'all',
}

export enum PlaceCapacity {
    Small = 1,
    Medium = 2,
    Large = 3,
}

export const HouseGarageLimits = {
    0: 2,
    1: 4,
    2: 6,
    3: 8,
    4: 10,
};

export type GarageParkingPlaceData = {
    capacity: PlaceCapacity[];
};

export type Garage = {
    id: string;
    name: string;
    legacyId?: string;
    type: GarageType;
    category: GarageCategory;
    job?: JobType;
    zone: Zone;
    allowTrailers?: boolean;
    parkingPlaces: Zone<GarageParkingPlaceData>[];
    isTrailerGarage?: boolean;
    transferList?: string[];
};

export type GarageVehicle = {
    vehicle: PlayerServerVehicle;
    weight: number | null;
    price: number | null;
    name: string | null;
};

export type GarageMenuData = {
    vehicles: GarageVehicle[];
    garage: Garage;
    free_places: number | null;
    id: string;
    max_places: number | null;
    has_fake_ticket: boolean;
    transferGarageList: {
        id: string;
        garage: Garage;
    }[];
};

export function getTransferPrice(weight: number) {
    return 100 + Math.round((weight / 1000) * 15);
}
