import { SozRole } from '@core/permissions';
import { VampireGameCollection, VampireGameObjectiveTypePart2, VampireGameRole } from '@public/shared/halloween';
import { PlayerCharInfo } from '@public/shared/player';
import { EventInfo } from '@public/shared/scene';
import { SenateParty, SenatePartyMember } from '@public/shared/senate';

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
    { label: 'Statut', value: 'status' },
    { label: 'Muter', value: 'mute' },
    { label: 'Démuter', value: 'unmute' },
];

export const LICENCES = [
    { label: 'Voiture', value: 'car' },
    { label: 'Poids lourd', value: 'truck' },
    { label: 'Moto', value: 'motorcycle' },
    { label: 'Hélicoptère', value: 'heli' },
    { label: 'Bateau', value: 'boat' },
    { label: 'Arme', value: 'weapon' },
];

export type GameMasterSubMenuState = {
    moneyCase: boolean;
    invisible: boolean;
    adminGPS: boolean;
    adminPoliceLocator: boolean;
};

export type InteractiveSubMenuState = {
    displayOwners: boolean;
    displayDebugSurface: boolean;
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
    displayMileage: boolean;
    displayMouseDebug: boolean;
    doors: boolean;
};

export type VehicleSubMenuState = {
    noStall: boolean;
    noBurstTyres: boolean;
    noSurfaceCalc: boolean;
};

export type MeteorSubMenuState = {
    disableNpc: boolean;
    siren: number;
    music: number;
    chronos: number;
    highWave: boolean;
    earthQuake: boolean;
    sandstormmusic: number;
};

export type HalloweenSubMenuState = {
    started: boolean;
    excludedPlayers: Partial<AdminPlayer>[];
    gameDuration: number;
    roleMaxNumber: Record<VampireGameRole, number>;
    mortalObjectivePart1: Record<Exclude<VampireGameCollection, 'player'>, number>;
    mortalObjectivePart2: Record<VampireGameObjectiveTypePart2, number>;
    mortalObjectivePart3: number;
};

export type AdminMenuData = {
    banner: string;
    permission: SozRole;
    event: EventInfo;
    characters: Record<string, PlayerCharInfo>;
    parties: SenateParty[];
    state: {
        gameMaster: GameMasterSubMenuState;
        interactive: InteractiveSubMenuState;
        skin: SkinSubMenuState;
        developer: DeveloperSubMenuState;
        vehicule: VehicleSubMenuState;
        meteor: MeteorSubMenuState;
        halloween: HalloweenSubMenuState;
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
    injuries: number;
    partyMember: SenatePartyMember | null;
    plate: boolean | null;
    specialPlate: boolean | null;
    vampireGameExcluded?: boolean;
};

export type FullAdminPlayer = AdminPlayer & {
    coords: number[];
    heading: number;
    cid: string;
    ped: number;
};
