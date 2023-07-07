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
        model: 'upwpile',
        label: 'Onduleur',
    },
    {
        model: 'soz_atm_entreprise',
        label: 'ATM entreprise',
    },
];
