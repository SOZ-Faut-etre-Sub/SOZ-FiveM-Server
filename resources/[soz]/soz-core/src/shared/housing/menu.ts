import { Property } from '@public/shared/housing/housing';

export type HousingUpgradesMenuData = {
    currentTier: number;
    hasParking: boolean;
    apartmentPrice: number;
    enableParking: boolean;
};

export type AdminMapperMenuData = {
    properties: Property[];
};
