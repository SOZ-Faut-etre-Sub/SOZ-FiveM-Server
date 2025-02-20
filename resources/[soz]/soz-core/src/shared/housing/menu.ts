import { SozRole } from '@core/permissions';
import { Property } from '@public/shared/housing/housing';
import { ApartementTiers } from '@public/shared/housing/housing';
import { SenateParty } from '@public/shared/senate';

export type HousingUpgradesMenuData = {
    apartmentId: number;
    propertyId: number;
    currentTier: ApartementTiers;
    hasParking: boolean;
    apartmentPrice: number;
    isApartmentTrailer: boolean;
};

export type AdminMapperMenuData = {
    permission: SozRole;
    properties: Property[];
    showInterior: boolean;
    parties: SenateParty[];
};
