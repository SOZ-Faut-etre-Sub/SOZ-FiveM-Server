import { Property } from '@public/shared/housing/housing';
import { ZoneTyped } from '@public/shared/polyzone/box.zone';
import { SenateParty } from '@public/shared/senate';

export type HousingUpgradesMenuData = {
    currentTier: number;
    hasParking: boolean;
    apartmentPrice: number;
    enableParking: boolean;
};

export type AdminMapperMenuData = {
    properties: Property[];
    zones: ZoneTyped[];
    showInterior: boolean;
    parties: SenateParty[];
};
