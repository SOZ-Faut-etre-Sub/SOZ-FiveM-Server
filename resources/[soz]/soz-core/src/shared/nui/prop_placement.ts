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
    EnterEditorMode: void;
};

export type PlacementProp = {
    model: string;
    label: string;
    collision?: boolean;
};

export type PlacementPropList = PlacementProp[];

export const PLACEMENT_PROP_LIST: PlacementPropList = [
    {
        model: 'soz_prop_bb_bin',
        label: 'Poubelle',
        collision: true,
    },
    {
        model: 'upwpile',
        label: 'Onduleur',
        collision: true,
    },
    {
        model: 'soz_atm_entreprise',
        label: 'ATM entreprise',
        collision: false,
    },
];
