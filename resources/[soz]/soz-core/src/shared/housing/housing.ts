import { FOURNITURE_PER_TIER, HousingTiers } from '@public/shared/housing/upgrades';
import { isGameMaster, PlayerData } from '@public/shared/player';

import { FDO, JobType } from '../job';
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
    shell: boolean;
    hasParkingPlace: boolean;
    senatePartyId: string | null;
    search_warrant_access: number;
} & ApartementTiers;

export type ApartmentMenuData = {
    property: Property;
    apartments: Apartment[];
};

export type ApartementTiers = {
    tier: number | null;
    cloth_tier: number | null;
    money_tier: number | null;
    park_tier: number | null;
};

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
        hasPlayerRentedApartment(property, player.citizenid) ||
        hasSearchWarrantAccessInProperty(property, player)
    );
};

export const hasSearchWarrantAccessInProperty = (property: Property, player: PlayerData) => {
    const now = new Date();
    const apartement = property.apartments.some(apartment => {
        return (
            (apartment.owner || apartment.senatePartyId) &&
            apartment.search_warrant_access &&
            new Date(apartment.search_warrant_access) > now
        );
    });

    if (!apartement) {
        return false;
    }

    return (FDO.includes(player.job.id) || player.job.id === JobType.MDR) && player.job.onduty;
};

export const hasSearchWarrantAccessInApartment = (apartment: Apartment, player: PlayerData) => {
    const now = new Date();
    if (
        (!apartment.owner && !apartment.senatePartyId) ||
        !apartment.search_warrant_access ||
        new Date(apartment.search_warrant_access) <= now
    ) {
        return false;
    }

    return (FDO.includes(player.job.id) || player.job.id === JobType.MDR) && player.job.onduty;
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

    for (const type of Object.keys(HousingTiers)) {
        for (let i = 0; i < (apartment[type] | 0) + 1; i++) {
            const tierPrice = (apartment.price * HousingTiers[type][i].pricePercent) / 100;
            price += tierPrice / 2;
        }
    }

    return Math.round(price);
};

export const getMaxFourntiure = (apartment: Apartment): number => {
    return (
        ((apartment.tier | 0) +
            (apartment.money_tier | 0) +
            (apartment.park_tier | 0) +
            (apartment.cloth_tier | 0) +
            4) *
        FOURNITURE_PER_TIER
    );
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

const includeHousingApartment = ['v_trailer', 'V_TRAILER', 'house', 'appartements', 'soz_villa'];

export const isApartmentExcludeFromHousing = (apartment: Apartment) => {
    return !includeHousingApartment.some(k => apartment.identifier.includes(k));
};

export const canUseHousingInAppartment = (player: PlayerData, apartment: Apartment): boolean => {
    return (
        player &&
        apartment.owner &&
        (apartment.owner === player.citizenid ||
            apartment.roommate === player.citizenid ||
            ['staff', 'admin'].includes(player.role)) &&
        !isApartmentExcludeFromHousing(apartment)
    );
};

export const canUseHousingInAppartmentNoStaff = (player: PlayerData, apartment: Apartment): boolean => {
    return (
        player &&
        apartment.owner &&
        (apartment.owner === player.citizenid || apartment.roommate === player.citizenid) &&
        !isApartmentExcludeFromHousing(apartment)
    );
};

export const canUseHousingInProperty = (player: PlayerData, property: Property): boolean => {
    return property.apartments.some(
        apartment =>
            (apartment.senatePartyId !== null || apartment.owner !== null) &&
            canUseHousingInAppartmentNoStaff(player, apartment)
    );
};
