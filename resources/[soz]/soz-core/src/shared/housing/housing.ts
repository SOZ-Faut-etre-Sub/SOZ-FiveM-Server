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
    tenant: string | null;
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
    housing_taxe_enabled: boolean;
} & ApartementTiers;

export type RentTaxe = {
    id: number;
    citizenid: string;
    value: number;
    created_at: Date;
};

export type ApartmentMenuData = {
    property: Property;
    apartments: Apartment[];
};

export type ApartmentSelectUpgradesMenuData = {
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

export const hasOwnedOrAccess = (property: Property, player: PlayerData, temporaryAccess: Set<number>) => {
    return (
        (isAdminHouse(property) && isGameMaster(player)) ||
        hasTemporaryAccess(property, temporaryAccess) ||
        hasPartyAccess(property, player.partyMember?.partyId) ||
        hasPlayerOwnedOrRentedApartmentInProperty(property, player.citizenid)
    );
};

export const hasAccess = (property: Property, player: PlayerData, temporaryAccess: Set<number>) => {
    return (
        (isAdminHouse(property) && isGameMaster(player)) ||
        hasTemporaryAccess(property, temporaryAccess) ||
        hasPartyAccess(property, player.partyMember?.partyId) ||
        hasPlayerRentedApartmentInProperty(property, player.citizenid) ||
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
        hasPlayerRentedApartment(apartment, player.citizenid) ||
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

export const hasApartmentWithoutAccessInProperty = (
    property: Property,
    player: PlayerData,
    temporaryAccess: Set<number>
) => {
    return property.apartments.some(
        apartment =>
            (apartment.owner || apartment.senatePartyId) && !hasApartmentAccess(apartment, player, temporaryAccess)
    );
};

export const hasPlayerOwnedApartment = (property: Property, citizenId: string) => {
    return property.apartments.some(apartment => apartment.owner === citizenId);
};

export const hasPlayerOwnedEmptyApartment = (property: Property, citizenId: string) => {
    return property.apartments.some(
        apartment => apartment.owner === citizenId && apartment.tenant === null && apartment.roommate === null
    );
};

export const hasPlayerOwnedNonEmptyApartment = (property: Property, citizenId: string) => {
    return property.apartments.some(
        apartment =>
            apartment.owner === citizenId &&
            (apartment.tenant !== null || apartment.roommate !== null) &&
            apartment.tenant !== citizenId
    );
};

export const hasPlayerTenantOrRoommateApartment = (property: Property, citizenId: string) => {
    return property.apartments.some(apartment => apartment.tenant === citizenId || apartment.roommate === citizenId);
};

export const hasPlayerTenantApartment = (property: Property, citizenId: string) => {
    return property.apartments.some(apartment => apartment.tenant === citizenId && apartment.owner !== citizenId);
};

export const hasPlayerRoommateApartment = (property: Property, citizenId: string) => {
    return property.apartments.some(apartment => apartment.roommate === citizenId);
};

const hasPlayerOwnedOrRentedApartmentInProperty = (property: Property, citizenId: string) => {
    return property.apartments.some(apartment => hasPlayerOwnedOrRentedApartment(apartment, citizenId));
};

export const hasPlayerOwnedOrRentedApartment = (apartment: Apartment, citizenId: string) => {
    return apartment.owner === citizenId || apartment.tenant === citizenId || apartment.roommate === citizenId;
};

const hasPlayerRentedApartmentInProperty = (property: Property, citizenId: string) => {
    return property.apartments.some(apartment => hasPlayerRentedApartment(apartment, citizenId));
};

export const hasPlayerRentedApartment = (apartment: Apartment, citizenId: string) => {
    return (
        (apartment.owner === citizenId && apartment.tenant === null && apartment.roommate === null) ||
        apartment.tenant === citizenId ||
        apartment.roommate === citizenId
    );
};

export const hasPropertyGarage = (property: Property) => {
    if (!property.garageZone) {
        return false;
    }

    const isPropertyTrailer = isTrailer(property);

    return property.apartments.some(apartment => !isPropertyTrailer || apartment.hasParkingPlace);
};

export const canPlayerAddTenant = (property: Property, citizenId: string) => {
    return property.apartments.some(apartment => apartment.owner === citizenId && apartment.tenant === null);
};

export const canPlayerAddRoommate = (property: Property, citizenId: string) => {
    return property.apartments.some(
        apartment => apartment.owner === citizenId && apartment.tenant !== null && apartment.roommate === null
    );
};

export const canPlayerRemoveTenant = (property: Property, citizenId: string) => {
    return property.apartments.some(
        apartment => apartment.owner === citizenId && apartment.tenant !== citizenId && apartment.tenant !== null
    );
};

export const canPlayerRemoveRoommate = (property: Property, citizenId: string) => {
    return property.apartments.some(
        apartment => apartment.owner === citizenId && apartment.roommate !== citizenId && apartment.roommate !== null
    );
};

export const getApartmentPriceWithUpgrade = (apartment: Apartment, property: Property) => {
    let price = apartment.price;

    if (isTrailer(property) && apartment.hasParkingPlace) {
        price += price;
    }

    for (const type of Object.keys(HousingTiers)) {
        for (let i = 0; i < (apartment[type] | 0) + 1; i++) {
            const tierPrice = (apartment.price * HousingTiers[type][i].pricePercent) / 100;
            price += tierPrice;
        }
    }

    return Math.round(price);
};

export const getResellPrice = (apartment: Apartment, property: Property) => {
    return Math.round(getApartmentPriceWithUpgrade(apartment, property) / 2);
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

export const canUseHousingInAppartment = (
    player: PlayerData,
    apartment: Apartment,
    temporaryAccess: Set<number>
): boolean => {
    return (
        player &&
        apartment.owner &&
        (apartment.owner === player.citizenid ||
            apartment.tenant === player.citizenid ||
            apartment.roommate === player.citizenid ||
            ['staff', 'admin'].includes(player.role) ||
            temporaryAccess.has(apartment.id)) &&
        !isApartmentExcludeFromHousing(apartment)
    );
};

export const canUseHousingInAppartmentNoStaff = (
    player: PlayerData,
    apartment: Apartment,
    temporaryAccess: Set<number>
): boolean => {
    return (
        player &&
        apartment.owner &&
        (apartment.owner === player.citizenid ||
            apartment.tenant === player.citizenid ||
            apartment.roommate === player.citizenid ||
            temporaryAccess.has(apartment.id)) &&
        !isApartmentExcludeFromHousing(apartment)
    );
};

export const canUseHousingInProperty = (
    player: PlayerData,
    property: Property,
    temporaryAccess: Set<number>
): boolean => {
    return property.apartments.some(
        apartment =>
            (apartment.senatePartyId !== null || apartment.owner !== null) &&
            canUseHousingInAppartmentNoStaff(player, apartment, temporaryAccess)
    );
};

export const canAccessTargetInApartment = (player: PlayerData, apartment: Apartment): boolean => {
    if (!player) {
        return false;
    }

    const hasWarrantAccess = hasSearchWarrantAccessInApartment(apartment, player);
    if (!hasWarrantAccess && apartment.tenant === null && apartment.roommate === null) {
        return false;
    }

    return (apartment.senatePartyId !== null || apartment.owner !== null) && isPlayerInsideApartment(player);
};
