import { isGameMaster, PlayerData } from '@public/shared/player';

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
    propertyId: number;
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

export type ApartmentMenuData = {
    property: Property;
    apartments: Apartment[];
};

export const UPGRADE_TIER_PERCENT: [number, number, number, number, number] = [0, 20, 45, 70, 100];

export const isBuilding = (property: Property) => {
    return property.apartments.length > 1;
};

export const isHouse = (property: Property) => {
    return !isBuilding(property);
};

export const isAdminHouse = (property: Property) => {
    return property.identifier === 'cayo_villa';
};

export const isAdminApartment = (apartment: Apartment) => {
    return apartment.identifier === 'villa_cayo';
};

export const isTrailer = (property: Property) => {
    return property.identifier.includes('trailer');
};

export const hasAccess = (property: Property, player: PlayerData, temporaryAccess: Set<number>) => {
    return (
        (isAdminHouse(property) && isGameMaster(player)) ||
        hasTemporaryAccess(property, temporaryAccess) ||
        hasPartyAccess(property, player.partyMember?.partyId) ||
        hasPlayerRentedApartment(property, player.citizenid)
    );
};

export const hasApartmentAccess = (apartment: Apartment, player: PlayerData, temporaryAccess: Set<number>) => {
    return (
        (isAdminApartment(apartment) && isGameMaster(player)) ||
        apartment.owner === player.citizenid ||
        apartment.roommate === player.citizenid ||
        temporaryAccess.has(apartment.id) ||
        (apartment.senatePartyId !== null && apartment.senatePartyId === player.partyMember?.partyId)
    );
};

export const hasPartyAccess = (property: Property, partyId: string | null) => {
    for (const apartment of property.apartments) {
        if (apartment.senatePartyId !== null && apartment.senatePartyId === partyId) {
            return true;
        }
    }

    return false;
};

export const hasTemporaryAccess = (property: Property, temporaryAccess: Set<number>) => {
    for (const apartment of property.apartments) {
        if (temporaryAccess.has(apartment.id)) {
            return true;
        }
    }

    return false;
};

export const hasAvailableApartment = (property: Property) => {
    return (
        !isAdminHouse(property) &&
        property.apartments.some(apartment => apartment.owner === null && apartment.senatePartyId === null)
    );
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

    if (isTrailer(property) && apartment.hasParkingPlace) {
        price += price / 2;
    }

    for (let i = 0; i < apartment.tier + 1; i++) {
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
