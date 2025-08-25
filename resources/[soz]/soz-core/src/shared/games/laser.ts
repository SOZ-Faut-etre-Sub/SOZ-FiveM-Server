import { AdminPlayer } from '@public/shared/admin/admin';
import { Blip } from '@public/shared/blip';
import { Outfit } from '@public/shared/cloth';
import { RGBColor } from '@public/shared/color';
import { PlayerPedHash } from '@public/shared/player';
import { Vector4 } from '@public/shared/polyzone/vector';

export enum LaserGameTypeEnum {
    FFA = 'ffa',
    TEAM2 = 'team2',
    TEAM3 = 'team3',
    TEAM5 = 'team5',
    TEAM10 = 'team10',
}

export enum LaserGameStateEnum {
    NONE = 'none',
    CREATED = 'created',
    STARTED = 'started',
    ENDED = 'ended',
}

export enum LaserGameTeamEnum {
    A = 'a',
    B = 'b',
}

export enum LaserGameColorEnum {
    YELLOW = 'yellow',
    BLUE = 'blue',
    ORANGE = 'orange',
    PINK = 'pink',
    RED = 'red',
    GREEN = 'green',
    WHITE = 'white',
    PURPLE = 'purple',
    CREAM = 'cream',
    GREY = 'grey',
}

export type TeamColorChoicesItem = {
    label: string;
    color: RGBColor;
};

export const TeamColorChoices: Record<LaserGameColorEnum, TeamColorChoicesItem> = {
    [LaserGameColorEnum.YELLOW]: {
        label: 'Jaune',
        color: [251, 226, 18],
    },
    [LaserGameColorEnum.BLUE]: {
        label: 'Bleu',
        color: [11, 156, 241],
    },
    [LaserGameColorEnum.ORANGE]: {
        label: 'Orange',
        color: [255, 128, 0],
    },
    [LaserGameColorEnum.PINK]: {
        label: 'Rose',
        color: [253, 214, 205],
    },
    [LaserGameColorEnum.RED]: {
        label: 'Rouge',
        color: [188, 25, 23],
    },
    [LaserGameColorEnum.GREEN]: {
        label: 'Vert',
        color: [152, 210, 35],
    },
    [LaserGameColorEnum.WHITE]: {
        label: 'Blanc',
        color: [255, 255, 255],
    },
    [LaserGameColorEnum.PURPLE]: {
        label: 'Violet',
        color: [107, 31, 123],
    },
    [LaserGameColorEnum.CREAM]: {
        label: 'Crème',
        color: [188, 172, 143],
    },
    [LaserGameColorEnum.GREY]: {
        label: 'Gris',
        color: [152, 159, 175],
    },
};

export const LaserGameType: Record<LaserGameTypeEnum, { name: string; descrption: string }> = {
    [LaserGameTypeEnum.FFA]: {
        name: 'Match à mort',
        descrption: 'Chacun pour soi, entre 2 et 20 joueurs',
    },
    [LaserGameTypeEnum.TEAM2]: {
        name: '2v2',
        descrption: 'Match en équipe à 4 joueurs',
    },
    [LaserGameTypeEnum.TEAM3]: {
        name: '3v3',
        descrption: 'Match en équipe à 6 joueurs',
    },
    [LaserGameTypeEnum.TEAM5]: {
        name: '5v5',
        descrption: 'Match en équipe à 10 joueurs',
    },
    [LaserGameTypeEnum.TEAM10]: {
        name: '10v10',
        descrption: 'Match en équipe à 20 joueurs',
    },
};

export const LaserGameFFASpawnPosition: Array<Vector4> = [
    [2348.15, 2950.21, -85.8, 93.32],
    [2328.84, 2941.73, -85.8, 88.58],
    [2307.34, 2924.94, -85.8, 101.17],
    [2288.62, 2941.49, -85.8, 91.32],
    [2269.45, 2950.05, -85.8, 93.54],
    [2249.88, 2941.32, -85.8, 90.39],
    [2229.77, 2925.43, -85.8, 86.57],
    [2217.17, 2937.93, -85.8, 100.48],
    [2199.87, 2943.5, -85.8, 96.25],
    [2189.22, 2932.54, -85.8, 94.19],
    [2347.49, 2908.42, -85.8, 90.24],
    [2328.15, 2899.86, -85.8, 89.48],
    [2307.19, 2891.39, -85.8, 85.31],
    [2287.17, 2899.88, -85.8, 88.78],
    [2268.49, 2907.98, -85.8, 90.37],
    [2247.91, 2899.49, -85.8, 94.23],
    [2231.38, 2892.43, -85.8, 80.78],
    [2216.59, 2903.88, -85.8, 79.0],
    [2200.94, 2916.19, -85.8, 91.88],
    [2189.9, 2908.82, -85.8, 76.95],
    [1985.98, 2891.21, -85.8, 272.7],
    [2008.17, 2899.62, -85.8, 269.0],
    [2027.83, 2908.67, -85.8, 270.11],
    [2047.86, 2900.38, -85.8, 268.8],
    [2067.77, 2891.45, -85.8, 270.97],
    [2088.05, 2900.1, -85.8, 269.34],
    [2106.36, 2909.35, -85.8, 265.43],
    [2119.62, 2903.86, -85.8, 277.04],
    [2134.96, 2898.08, -85.8, 288.05],
    [2146.5, 2908.9, -85.8, 280.84],
    [1987.89, 2933.81, -85.8, 268.63],
    [2008.01, 2942.05, -85.8, 272.17],
    [2026.49, 2950.64, -85.8, 280.43],
    [2047.75, 2942.02, -85.8, 272.83],
    [2065.32, 2933.33, -85.8, 267.68],
    [2088.75, 2941.63, -85.8, 274.95],
    [2104.8, 2949.8, -85.8, 257.97],
    [2118.3, 2938.23, -85.8, 257.75],
    [2133.09, 2925.92, -85.8, 263.46],
    [2146.87, 2932.65, -85.8, 247.49],
];

export const LaserGameTeamSpawnPosition: Record<LaserGameTeamEnum, Array<Vector4>> = {
    [LaserGameTeamEnum.A]: [
        [1997.63, 2913.63, -85.8, 2703.0],
        [1997.85, 2918.41, -85.8, 271.04],
        [1997.69, 2922.37, -85.8, 268.22],
        [1997.72, 2931.11, -85.8, 264.58],
        [1997.72, 2931.11, -85.8, 264.58],
        [2017.82, 2905.76, -85.8, 257.63],
        [2018.12, 2913.83, -85.8, 295.95],
        [2017.54, 2922.57, -85.8, 270.05],
        [2017.4, 2930.81, -85.8, 264.8],
        [1997.72, 2931.11, -85.8, 264.58],
    ],
    [LaserGameTeamEnum.B]: [
        [2338.53, 2935.94, -85.8, 90.12],
        [2338.4, 2927.25, -85.8, 92.34],
        [2338.22, 2918.93, -85.8, 94.99],
        [2337.96, 2910.68, -85.8, 93.47],
        [2337.7, 2902.71, -85.8, 95.59],
        [2318.35, 2902.86, -85.8, 88.54],
        [2318.17, 2911.2, -85.8, 91.07],
        [2317.93, 2919.52, -85.8, 83.15],
        [2317.65, 2927.7, -85.8, 91.51],
        [2318.25, 2936.16, -85.8, 80.2],
    ],
};

export const LaserGameTeam: Record<LaserGameTeamEnum, string> = {
    [LaserGameTeamEnum.A]: 'Equipe A',
    [LaserGameTeamEnum.B]: 'Equipe B',
};

export type LaserGameClient = {
    type: LaserGameTypeEnum;
    state: LaserGameStateEnum;
    creator: string;
};

export type LaserGamePlayerData = {
    citizenId: string;
    name: string;
    team: LaserGameTeamEnum | null;
    color: LaserGameColorEnum | null;
};

export type LaserGameData = LaserGameClient & {
    players: Record<string, LaserGamePlayerData>;
    teams: Record<LaserGameTeamEnum, LaserGameColorEnum>;
    scores: Record<any, number>;
    scoreGoal: number;
    gameDuration: number;
};

export type LaserGameInfo = LaserGameData & {
    createdAt: number;
    startedAt: number;
    bucket: number;
};

export type LaserGameAdminInfo = LaserGameInfo & {
    players: Record<string, AdminPlayer>;
};

export const LaserGameOutPosition: Vector4 = [760.52, -816.12, 25.31, 87.7];
export const LaserGameInPosition: Vector4 = [2154.62, 2920.95, -82.08, 272.4];
export const LaserGamePosition: Vector4 = [759.02, -816.17, 25.3, 270.66];
export const LaserGameManagePosition: Vector4 = [2167.8, 2926.42, -81.08, 209.89];

export const LaserGameMinimalDuration = 60000; // 1min
export const LaserGameMaximalDuration = 3600000; // 60min
export const LaserGameDefaultDuration = 1200000; // 20min
export const LaserGameBlipOptions: Blip = {
    name: 'Laser Game',
    coords: {
        x: LaserGamePosition[0],
        y: LaserGamePosition[1],
        z: LaserGamePosition[2],
    },
    sprite: 740,
    color: 13,
};

export const LaserGamePrice = 500;
export const LaserGameAddPlayerDistance = 15;
export const LaserGameMinimalPlayer: Record<LaserGameTypeEnum, number> = {
    [LaserGameTypeEnum.FFA]: 2,
    [LaserGameTypeEnum.TEAM2]: 4,
    [LaserGameTypeEnum.TEAM3]: 6,
    [LaserGameTypeEnum.TEAM5]: 10,
    [LaserGameTypeEnum.TEAM10]: 20,
};
export const LaserGameMaximalPlayer: Record<LaserGameTypeEnum, number> = {
    [LaserGameTypeEnum.FFA]: 20,
    [LaserGameTypeEnum.TEAM2]: 4,
    [LaserGameTypeEnum.TEAM3]: 6,
    [LaserGameTypeEnum.TEAM5]: 10,
    [LaserGameTypeEnum.TEAM10]: 20,
};

export type NuiLaserGameManageMethodMap = {
    SetPlayerData: { players: Record<string, LaserGamePlayerData> };
};

export const TeamColorClotheSet: Record<PlayerPedHash, Record<LaserGameColorEnum, Outfit>> = {
    [PlayerPedHash.Male]: {
        [LaserGameColorEnum.YELLOW]: {
            Components: {
                '3': { Collection: '', Drawable: 4, Texture: 0, Palette: 0 },
                '4': { Collection: 'mp_m_bikerdlc_01', Drawable: 6, Texture: 0, Palette: 0 },
                '6': { Collection: 'mp_m_bikerdlc_01', Drawable: 5, Texture: 0, Palette: 0 },
                '8': { Collection: '', Drawable: 15, Texture: 0, Palette: 0 },
                '10': { Drawable: 0, Texture: 0, Palette: 0 },
                '11': { Collection: 'mp_m_bikerdlc_01', Drawable: 21, Texture: 0, Palette: 0 },
            },
            Props: {
                Helmet: { Collection: 'mp_m_bikerdlc_01', Drawable: 8, Texture: 0 },
            },
        },
        [LaserGameColorEnum.BLUE]: {
            Components: {
                '3': { Collection: '', Drawable: 4, Texture: 0, Palette: 0 },
                '4': { Collection: 'mp_m_bikerdlc_01', Drawable: 6, Texture: 6, Palette: 0 },
                '6': { Collection: 'mp_m_bikerdlc_01', Drawable: 5, Texture: 6, Palette: 0 },
                '8': { Collection: '', Drawable: 15, Texture: 0, Palette: 0 },
                '10': { Drawable: 0, Texture: 0, Palette: 0 },
                '11': { Collection: 'mp_m_bikerdlc_01', Drawable: 21, Texture: 6, Palette: 0 },
            },
            Props: {
                Helmet: { Collection: 'mp_m_bikerdlc_01', Drawable: 8, Texture: 6 },
            },
        },
        [LaserGameColorEnum.ORANGE]: {
            Components: {
                '3': { Collection: '', Drawable: 4, Texture: 0, Palette: 0 },
                '4': { Collection: 'mp_m_bikerdlc_01', Drawable: 6, Texture: 2, Palette: 0 },
                '6': { Collection: 'mp_m_bikerdlc_01', Drawable: 5, Texture: 2, Palette: 0 },
                '8': { Collection: '', Drawable: 15, Texture: 0, Palette: 0 },
                '10': { Drawable: 0, Texture: 0, Palette: 0 },
                '11': { Collection: 'mp_m_bikerdlc_01', Drawable: 21, Texture: 2, Palette: 0 },
            },
            Props: {
                Helmet: { Collection: 'mp_m_bikerdlc_01', Drawable: 8, Texture: 2 },
            },
        },
        [LaserGameColorEnum.PINK]: {
            Components: {
                '3': { Collection: '', Drawable: 4, Texture: 0, Palette: 0 },
                '4': { Collection: 'mp_m_bikerdlc_01', Drawable: 6, Texture: 4, Palette: 0 },
                '6': { Collection: 'mp_m_bikerdlc_01', Drawable: 5, Texture: 4, Palette: 0 },
                '8': { Collection: '', Drawable: 15, Texture: 0, Palette: 0 },
                '10': { Drawable: 0, Texture: 0, Palette: 0 },
                '11': { Collection: 'mp_m_bikerdlc_01', Drawable: 21, Texture: 4, Palette: 0 },
            },
            Props: {
                Helmet: { Collection: 'mp_m_bikerdlc_01', Drawable: 8, Texture: 4 },
            },
        },
        [LaserGameColorEnum.RED]: {
            Components: {
                '3': { Collection: '', Drawable: 4, Texture: 0, Palette: 0 },
                '4': { Collection: 'mp_m_bikerdlc_01', Drawable: 6, Texture: 5, Palette: 0 },
                '6': { Collection: 'mp_m_bikerdlc_01', Drawable: 5, Texture: 5, Palette: 0 },
                '8': { Collection: '', Drawable: 15, Texture: 0, Palette: 0 },
                '10': { Drawable: 0, Texture: 0, Palette: 0 },
                '11': { Collection: 'mp_m_bikerdlc_01', Drawable: 21, Texture: 5, Palette: 0 },
            },
            Props: {
                Helmet: { Collection: 'mp_m_bikerdlc_01', Drawable: 8, Texture: 5 },
            },
        },
        [LaserGameColorEnum.GREEN]: {
            Components: {
                '3': { Collection: '', Drawable: 4, Texture: 0, Palette: 0 },
                '4': { Collection: 'mp_m_bikerdlc_01', Drawable: 6, Texture: 1, Palette: 0 },
                '6': { Collection: 'mp_m_bikerdlc_01', Drawable: 5, Texture: 1, Palette: 0 },
                '8': { Collection: '', Drawable: 15, Texture: 0, Palette: 0 },
                '10': { Drawable: 0, Texture: 0, Palette: 0 },
                '11': { Collection: 'mp_m_bikerdlc_01', Drawable: 21, Texture: 1, Palette: 0 },
            },
            Props: {
                Helmet: { Collection: 'mp_m_bikerdlc_01', Drawable: 8, Texture: 1 },
            },
        },
        [LaserGameColorEnum.WHITE]: {
            Components: {
                '3': { Collection: '', Drawable: 4, Texture: 0, Palette: 0 },
                '4': { Collection: 'mp_m_bikerdlc_01', Drawable: 6, Texture: 9, Palette: 0 },
                '6': { Collection: 'mp_m_bikerdlc_01', Drawable: 5, Texture: 9, Palette: 0 },
                '8': { Collection: '', Drawable: 15, Texture: 0, Palette: 0 },
                '10': { Drawable: 0, Texture: 0, Palette: 0 },
                '11': { Collection: 'mp_m_bikerdlc_01', Drawable: 21, Texture: 9, Palette: 0 },
            },
            Props: {
                Helmet: { Collection: 'mp_m_bikerdlc_01', Drawable: 8, Texture: 9 },
            },
        },
        [LaserGameColorEnum.PURPLE]: {
            Components: {
                '3': { Collection: '', Drawable: 4, Texture: 0, Palette: 0 },
                '4': { Collection: 'mp_m_bikerdlc_01', Drawable: 6, Texture: 3, Palette: 0 },
                '6': { Collection: 'mp_m_bikerdlc_01', Drawable: 5, Texture: 3, Palette: 0 },
                '8': { Collection: '', Drawable: 15, Texture: 0, Palette: 0 },
                '10': { Drawable: 0, Texture: 0, Palette: 0 },
                '11': { Collection: 'mp_m_bikerdlc_01', Drawable: 21, Texture: 3, Palette: 0 },
            },
            Props: {
                Helmet: { Collection: 'mp_m_bikerdlc_01', Drawable: 8, Texture: 3 },
            },
        },
        [LaserGameColorEnum.CREAM]: {
            Components: {
                '3': { Collection: '', Drawable: 4, Texture: 0, Palette: 0 },
                '4': { Collection: 'mp_m_bikerdlc_01', Drawable: 6, Texture: 8, Palette: 0 },
                '6': { Collection: 'mp_m_bikerdlc_01', Drawable: 5, Texture: 8, Palette: 0 },
                '8': { Collection: '', Drawable: 15, Texture: 0, Palette: 0 },
                '10': { Drawable: 0, Texture: 0, Palette: 0 },
                '11': { Collection: 'mp_m_bikerdlc_01', Drawable: 21, Texture: 8, Palette: 0 },
            },
            Props: {
                Helmet: { Collection: 'mp_m_bikerdlc_01', Drawable: 8, Texture: 8 },
            },
        },
        [LaserGameColorEnum.GREY]: {
            Components: {
                '3': { Collection: '', Drawable: 4, Texture: 0, Palette: 0 },
                '4': { Collection: 'mp_m_bikerdlc_01', Drawable: 6, Texture: 7, Palette: 0 },
                '6': { Collection: 'mp_m_bikerdlc_01', Drawable: 5, Texture: 7, Palette: 0 },
                '8': { Collection: '', Drawable: 15, Texture: 0, Palette: 0 },
                '10': { Drawable: 0, Texture: 0, Palette: 0 },
                '11': { Collection: 'mp_m_bikerdlc_01', Drawable: 21, Texture: 7, Palette: 0 },
            },
            Props: {
                Helmet: { Collection: 'mp_m_bikerdlc_01', Drawable: 8, Texture: 7 },
            },
        },
    },
    [PlayerPedHash.Female]: {
        [LaserGameColorEnum.YELLOW]: {
            Components: {
                '3': { Collection: '', Drawable: 3, Texture: 0, Palette: 0 },
                '4': { Collection: 'mp_f_bikerdlc_01', Drawable: 6, Texture: 0, Palette: 0 },
                '6': { Collection: 'mp_f_bikerdlc_01', Drawable: 7, Texture: 0, Palette: 0 },
                '8': { Collection: '', Drawable: 15, Texture: 0, Palette: 0 },
                '10': { Drawable: 0, Texture: 0, Palette: 0 },
                '11': { Collection: 'mp_f_bikerdlc_01', Drawable: 26, Texture: 0, Palette: 0 },
            },
            Props: {
                Helmet: { Collection: 'mp_f_bikerdlc_01', Drawable: 8, Texture: 0 },
            },
        },
        [LaserGameColorEnum.BLUE]: {
            Components: {
                '3': { Collection: '', Drawable: 3, Texture: 0, Palette: 0 },
                '4': { Collection: 'mp_f_bikerdlc_01', Drawable: 6, Texture: 6, Palette: 0 },
                '6': { Collection: 'mp_f_bikerdlc_01', Drawable: 7, Texture: 6, Palette: 0 },
                '8': { Collection: '', Drawable: 15, Texture: 0, Palette: 0 },
                '10': { Drawable: 0, Texture: 0, Palette: 0 },
                '11': { Collection: 'mp_f_bikerdlc_01', Drawable: 26, Texture: 6, Palette: 0 },
            },
            Props: {
                Helmet: { Collection: 'mp_f_bikerdlc_01', Drawable: 8, Texture: 6 },
            },
        },
        [LaserGameColorEnum.ORANGE]: {
            Components: {
                '3': { Collection: '', Drawable: 3, Texture: 0, Palette: 0 },
                '4': { Collection: 'mp_f_bikerdlc_01', Drawable: 6, Texture: 2, Palette: 0 },
                '6': { Collection: 'mp_f_bikerdlc_01', Drawable: 7, Texture: 2, Palette: 0 },
                '8': { Collection: '', Drawable: 15, Texture: 0, Palette: 0 },
                '10': { Drawable: 0, Texture: 0, Palette: 0 },
                '11': { Collection: 'mp_f_bikerdlc_01', Drawable: 26, Texture: 2, Palette: 0 },
            },
            Props: {
                Helmet: { Collection: 'mp_f_bikerdlc_01', Drawable: 8, Texture: 2 },
            },
        },
        [LaserGameColorEnum.PINK]: {
            Components: {
                '3': { Collection: '', Drawable: 3, Texture: 0, Palette: 0 },
                '4': { Collection: 'mp_f_bikerdlc_01', Drawable: 6, Texture: 4, Palette: 0 },
                '6': { Collection: 'mp_f_bikerdlc_01', Drawable: 7, Texture: 4, Palette: 0 },
                '8': { Collection: '', Drawable: 15, Texture: 0, Palette: 0 },
                '10': { Drawable: 0, Texture: 0, Palette: 0 },
                '11': { Collection: 'mp_f_bikerdlc_01', Drawable: 26, Texture: 4, Palette: 0 },
            },
            Props: {
                Helmet: { Collection: 'mp_f_bikerdlc_01', Drawable: 8, Texture: 4 },
            },
        },
        [LaserGameColorEnum.RED]: {
            Components: {
                '3': { Collection: '', Drawable: 3, Texture: 0, Palette: 0 },
                '4': { Collection: 'mp_f_bikerdlc_01', Drawable: 6, Texture: 5, Palette: 0 },
                '6': { Collection: 'mp_f_bikerdlc_01', Drawable: 7, Texture: 5, Palette: 0 },
                '8': { Collection: '', Drawable: 15, Texture: 0, Palette: 0 },
                '10': { Drawable: 0, Texture: 0, Palette: 0 },
                '11': { Collection: 'mp_f_bikerdlc_01', Drawable: 26, Texture: 5, Palette: 0 },
            },
            Props: {
                Helmet: { Collection: 'mp_f_bikerdlc_01', Drawable: 8, Texture: 5 },
            },
        },
        [LaserGameColorEnum.GREEN]: {
            Components: {
                '3': { Collection: '', Drawable: 3, Texture: 0, Palette: 0 },
                '4': { Collection: 'mp_f_bikerdlc_01', Drawable: 6, Texture: 1, Palette: 0 },
                '6': { Collection: 'mp_f_bikerdlc_01', Drawable: 7, Texture: 1, Palette: 0 },
                '8': { Collection: '', Drawable: 15, Texture: 0, Palette: 0 },
                '10': { Drawable: 0, Texture: 0, Palette: 0 },
                '11': { Collection: 'mp_f_bikerdlc_01', Drawable: 26, Texture: 1, Palette: 0 },
            },
            Props: {
                Helmet: { Collection: 'mp_f_bikerdlc_01', Drawable: 8, Texture: 1 },
            },
        },
        [LaserGameColorEnum.WHITE]: {
            Components: {
                '3': { Collection: '', Drawable: 3, Texture: 0, Palette: 0 },
                '4': { Collection: 'mp_f_bikerdlc_01', Drawable: 6, Texture: 9, Palette: 0 },
                '6': { Collection: 'mp_f_bikerdlc_01', Drawable: 7, Texture: 9, Palette: 0 },
                '8': { Collection: '', Drawable: 15, Texture: 0, Palette: 0 },
                '10': { Drawable: 0, Texture: 0, Palette: 0 },
                '11': { Collection: 'mp_f_bikerdlc_01', Drawable: 26, Texture: 9, Palette: 0 },
            },
            Props: {
                Helmet: { Collection: 'mp_f_bikerdlc_01', Drawable: 8, Texture: 9 },
            },
        },
        [LaserGameColorEnum.PURPLE]: {
            Components: {
                '3': { Collection: '', Drawable: 3, Texture: 0, Palette: 0 },
                '4': { Collection: 'mp_f_bikerdlc_01', Drawable: 6, Texture: 3, Palette: 0 },
                '6': { Collection: 'mp_f_bikerdlc_01', Drawable: 7, Texture: 3, Palette: 0 },
                '8': { Collection: '', Drawable: 15, Texture: 0, Palette: 0 },
                '10': { Drawable: 0, Texture: 0, Palette: 0 },
                '11': { Collection: 'mp_f_bikerdlc_01', Drawable: 26, Texture: 3, Palette: 0 },
            },
            Props: {
                Helmet: { Collection: 'mp_f_bikerdlc_01', Drawable: 8, Texture: 3 },
            },
        },
        [LaserGameColorEnum.CREAM]: {
            Components: {
                '3': { Collection: '', Drawable: 3, Texture: 0, Palette: 0 },
                '4': { Collection: 'mp_f_bikerdlc_01', Drawable: 6, Texture: 8, Palette: 0 },
                '6': { Collection: 'mp_f_bikerdlc_01', Drawable: 7, Texture: 8, Palette: 0 },
                '8': { Collection: '', Drawable: 15, Texture: 0, Palette: 0 },
                '10': { Drawable: 0, Texture: 0, Palette: 0 },
                '11': { Collection: 'mp_f_bikerdlc_01', Drawable: 26, Texture: 8, Palette: 0 },
            },
            Props: {
                Helmet: { Collection: 'mp_f_bikerdlc_01', Drawable: 8, Texture: 8 },
            },
        },
        [LaserGameColorEnum.GREY]: {
            Components: {
                '3': { Collection: '', Drawable: 3, Texture: 0, Palette: 0 },
                '4': { Collection: 'mp_f_bikerdlc_01', Drawable: 6, Texture: 7, Palette: 0 },
                '6': { Collection: 'mp_f_bikerdlc_01', Drawable: 7, Texture: 7, Palette: 0 },
                '8': { Collection: '', Drawable: 15, Texture: 0, Palette: 0 },
                '10': { Drawable: 0, Texture: 0, Palette: 0 },
                '11': { Collection: 'mp_f_bikerdlc_01', Drawable: 26, Texture: 7, Palette: 0 },
            },
            Props: {
                Helmet: { Collection: 'mp_f_bikerdlc_01', Drawable: 8, Texture: 7 },
            },
        },
    },
};

export function getDurationStr(ms: number) {
    const timeMinutes = Math.floor(ms / 60000.0);
    const timeMinutesStr = timeMinutes >= 10 ? timeMinutes.toString() : '0' + timeMinutes.toString();
    const timeSeconds = (ms - 60000 * timeMinutes) / 1000.0;
    const timeSecondsStr = timeSeconds > 10 ? timeSeconds.toFixed(0) : '0' + timeSeconds.toFixed(0);

    return timeMinutesStr + ':' + timeSecondsStr;
}
