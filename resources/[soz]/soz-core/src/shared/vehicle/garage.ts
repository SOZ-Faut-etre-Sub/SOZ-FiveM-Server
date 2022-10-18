import { JobType } from '../job';
import { BoxZone } from '../polyzone/box.zone';

export enum GarageType {
    Public = 'public',
    Private = 'private',
    Job = 'job',
    Gang = 'gang',
    Depot = 'depot',
    House = 'house',
}

export enum GarageCategory {
    Car = 'car',
    Air = 'air',
    Sea = 'sea',
}

export enum PlaceCapacity {
    Small = 1,
    Medium = 2,
    Large = 3,
}
export type GarageParkingPlaceData = {
    capacity: PlaceCapacity[];
};

export type Garage = {
    name: string;
    type: GarageType;
    category: GarageCategory;
    job?: JobType;
    zone: BoxZone;
    parkingPlaces: BoxZone<GarageParkingPlaceData>[];
};
