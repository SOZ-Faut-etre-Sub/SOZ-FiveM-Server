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
};

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

export const hasPlayerGarage = (property: Property, citizenId: string) => {
    if (!property.garageZone) {
        return false;
    }

    const isPropertyTrailer = isTrailer(property);

    return property.apartments.some(
        apartment =>
            (apartment.owner === citizenId || apartment.roommate === citizenId) &&
            (!isPropertyTrailer || apartment.hasParkingPlace)
    );
};

export const canPlayerAddRoommate = (property: Property, citizenId: string) => {
    return property.apartments.some(apartment => apartment.owner === citizenId && apartment.roommate === null);
};

export const canPlayerRemoveRoommate = (property: Property, citizenId: string) => {
    return property.apartments.some(apartment => apartment.owner === citizenId && apartment.roommate !== null);
};

export const isPlayerInsideApartment = (player: PlayerData) => {
    return (
        player &&
        player.metadata.inside &&
        player.metadata.inside.property !== null &&
        player.metadata.inside.apartment !== null
    );
};
