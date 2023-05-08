import { Zone } from '../polyzone/box.zone';
import { Vector4 } from '../polyzone/vector';

export type Property = {
    id: number;
    identifier: string;
    entryZone: Zone;
    garageZone: Zone;
    exteriorCulling: number[];
    apartments: Apartment[];
};

export type Apartment = {
    id: number;
    identifier: string;
    label: string;
    price: number;
    owner: string;
    roommate: string;
    position: Vector4;
    exitZone: Zone;
    fridgeZone: Zone;
    stashZone: Zone;
    closetZone: Zone;
    moneyZone: Zone;
    tier: number;
    hasParkingPlace: boolean;
};
