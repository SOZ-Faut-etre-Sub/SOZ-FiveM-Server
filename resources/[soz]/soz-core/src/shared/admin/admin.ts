import { PlayerCharInfo } from '@public/shared/player';

import { SozRole } from '../../core/permissions';
import { Component, Outfit, Prop } from '../cloth';

export const MONEY_OPTIONS = [
    { label: '$1,000', value: 1000 },
    { label: '$5,000', value: 5000 },
    { label: '$10,000', value: 10000 },
    { label: '$100,000', value: 100000 },
];

export const HEALTH_OPTIONS = [
    { label: 'Tuer', value: 'kill' },
    { label: 'Réanimer', value: 'revive' },
];

export const MOVEMENT_OPTIONS = [
    { label: 'Bloquer', value: 'freeze' },
    { label: 'Débloquer', value: 'unfreeze' },
];

export const VOCAL_OPTIONS = [
    { label: 'Status', value: 'status' },
    { label: 'Muter', value: 'mute' },
    { label: 'Démuter', value: 'unmute' },
];

export const LICENCES = [
    { label: 'Voiture', value: 'car' },
    { label: 'Poids lourd', value: 'truck' },
    { label: 'Moto', value: 'motorcycle' },
    { label: 'Hélicoptère', value: 'heli' },
    { label: 'Bateau', value: 'boat' },
];

export type GameMasterSubMenuState = {
    moneyCase: boolean;
    invisible: boolean;
};

export type InteractiveSubMenuState = {
    displayOwners: boolean;
    displayPlayerNames: boolean;
    displayPlayersOnMap: boolean;
};

export type SkinSubMenuState = {
    clothConfig: Outfit;
    maxOptions: {
        componentIndex?: Component;
        propIndex?: Prop;
        maxDrawables: number;
    }[];
};

export type DeveloperSubMenuState = {
    noClip: boolean;
    displayCoords: boolean;
};

export type AdminMenuData = {
    banner: string;
    permission: SozRole;
    characters: Record<string, PlayerCharInfo>;
    state: {
        gameMaster: GameMasterSubMenuState;
        interactive: InteractiveSubMenuState;
        skin: SkinSubMenuState;
        developer: DeveloperSubMenuState;
    };
};

/**
 * A very simple version of the admin player.
 * If you need more, use the FullAdminPlayer.
 */
export type AdminPlayer = {
    id: number; // That's the server id of the player.
    citizenId: string;
    license: string;
    name: string;
    rpFullName: string;
};

export type FullAdminPlayer = AdminPlayer & {
    coords: number[];
    heading: number;
    cid: string;
    ped: number;
};
