import { Vector3 } from '../polyzone/vector';

export type PropPlacementMenuData = {
    props: PlacementPropList;
    propState: PlacementProp;
};

export type PlacementProp = {
    model: string;
    label: string;
    entity?: number;
};

export type PlacedProp = {
    entity: number;
    model: string;
    label: string;
    position: Vector3;
};

export type PlacementPropList = PlacementProp[];

export const PLACEMENT_PROP_LIST: PlacementPropList = [
    {
        model: 'soz_prop_bb_bin',
        label: 'Poubelle',
    },
    {
        model: 'soz_prop_elec01___default',
        label: 'Borne civile',
    },
    {
        model: 'soz_prop_elec02___entreprise',
        label: 'Borne entreprise',
    },
    {
        model: 'upwpile',
        label: 'Onduleur',
    },
    {
        model: 'soz_atm_entreprise',
        label: 'ATM entreprise',
    },
];
