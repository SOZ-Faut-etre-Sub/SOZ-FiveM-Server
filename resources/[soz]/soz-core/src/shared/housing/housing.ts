import { PlayerData } from '@public/shared/player';

import { Zone } from '../polyzone/box.zone';
import { Vector4 } from '../polyzone/vector';

export type Property = {
    id: number;
    identifier: string;
    entryZone: Zone | null;
    garageZone: Zone | null;
    exteriorCulling: number[];
    apartments: Apartment[];
};

export type Apartment = {
    id: number;
    identifier: string;
    label: string;
    price: number;
    owner: string | null;
    roommate: string | null;
    position: Vector4;
    exitZone: Zone | null;
    fridgeZone: Zone | null;
    stashZone: Zone | null;
    closetZone: Zone | null;
    moneyZone: Zone | null;
    tier: number;
    hasParkingPlace: boolean;
    senatePartyId: string | null;
};

export const UPGRADE_TIER_PERCENT: [number, number, number, number, number] = [0, 20, 45, 70, 100];

export const isBuilding = (property: Property) => {
    return property.apartments.length > 1;
};

export const isHouse = (property: Property) => {
    return !isBuilding(property);
};

export const isTrailer = (property: Property) => {
    return property.identifier.includes('trailer');
};

export const hasAvailableApartment = (property: Property) => {
    return property.apartments.some(apartment => apartment.owner === null);
};

export const hasRentedApartment = (property: Property, excludeCitizenId: string = null) => {
    return property.apartments.some(apartment => apartment.owner !== null && apartment.owner !== excludeCitizenId);
};

export const hasPlayerOwnedApartment = (property: Property, citizenId: string) => {
    return property.apartments.some(apartment => apartment.owner === citizenId);
};

export const hasPlayerRoommateApartment = (property: Property, citizenId: string) => {
    return property.apartments.some(apartment => apartment.roommate === citizenId);
};

export const hasPlayerRentedApartment = (property: Property, citizenId: string) => {
    return property.apartments.some(apartment => apartment.owner === citizenId || apartment.roommate === citizenId);
};

export const hasPropertyGarage = (property: Property) => {
    if (!property.garageZone) {
        return false;
    }

    const isPropertyTrailer = isTrailer(property);

    return property.apartments.some(apartment => !isPropertyTrailer || apartment.hasParkingPlace);
};

export const canPlayerAddRoommate = (property: Property, citizenId: string) => {
    return property.apartments.some(apartment => apartment.owner === citizenId && apartment.roommate === null);
};

export const canPlayerRemoveRoommate = (property: Property, citizenId: string) => {
    return property.apartments.some(apartment => apartment.owner === citizenId && apartment.roommate !== null);
};

export const getResellPrice = (apartment: Apartment, property: Property) => {
    let price = apartment.price / 2;

    if (isTrailer(property)) {
        price += price / 2;
    }

    for (let i = 0; i < apartment.tier; i++) {
        const tierPrice = (apartment.price * UPGRADE_TIER_PERCENT[i]) / 100;
        price += tierPrice / 2;
    }

    return Math.round(price);
};

export const getPropertyGarageName = (property: Property) => {
    return 'property_' + property.identifier;
};

export const getApartmentGarageName = (apartment: Apartment) => {
    return 'apartment_' + apartment.identifier;
};

export const isPlayerInsideApartment = (player: PlayerData): boolean => {
    return (
        player &&
        player.metadata.inside &&
        player.metadata.inside.property &&
        player.metadata.inside.apartment !== false
    );
};
