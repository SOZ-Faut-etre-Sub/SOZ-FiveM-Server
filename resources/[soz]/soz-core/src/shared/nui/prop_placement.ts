import { PropClientData, PropCollection, PropCollectionData, PropServerData } from '../object';

export type PropPlacementMenuData = {
    props: PlacementPropList;
    serverData: PropServerData;
    clientData: PropClientData;
    collections: PropCollectionData[];
};

export type NuiPlacementPropMethodMap = {
    SetCollectionList: PropCollectionData[];
    SetCollection: PropCollection;
    SetDatas: { serverData: PropServerData; clientData: PropClientData };
};

export type PlacementProp = {
    model: string;
    label: string;
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
