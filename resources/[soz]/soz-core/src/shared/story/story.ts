import { RGBColor } from '@public/shared/color';

import { NamedZone } from '../polyzone/box.zone';
import { Vector3 } from '../polyzone/vector';

export type Dialog = {
    audio: string;
    text: string[];
    timing?: number[];
};

export type StoryObject = {
    model: string;
    coords: Vector3;
    rotation: Vector3;
};

export type Story = {
    name: string;
    dialog: { [key: string]: Dialog };
    zones?: (NamedZone & { part: number; label: string; icon: string })[];
    props?: StoryObject[];
};

export enum ScenarioState {
    NotStarted,
    Running,
    Finished,
}

export const ScenarioOrder = {
    halloween2022: ['scenario1', 'scenario2', 'scenario3', 'scenario4'],
    halloween2023: ['scenario1', 'scenario2', 'scenario3', 'scenario4'],
};

export enum SceneColor {
    Black = 'black',
    Blue = 'blue',
    Brown = 'brown',
    Cyan = 'cyan',
    Green = 'green',
    Lime = 'lime',
    Orange = 'orange',
    Red = 'red',
    Rose = 'rose',
    Violet = 'violet',
    White = 'white',
    Yellow = 'yellow',
}

export enum SpotColor {
    Blue = 'blue',
    Red = 'red',
    Yellow = 'yellow',
    White = 'white',
}

export const SCENE_COLORS: Record<SceneColor, RGBColor> = {
    [SceneColor.Black]: [0, 0, 0],
    [SceneColor.Blue]: [0, 0, 255],
    [SceneColor.Brown]: [165, 42, 42],
    [SceneColor.Cyan]: [0, 255, 255],
    [SceneColor.Green]: [0, 128, 0],
    [SceneColor.Lime]: [0, 255, 0],
    [SceneColor.Orange]: [255, 165, 0],
    [SceneColor.Red]: [255, 0, 0],
    [SceneColor.Rose]: [255, 0, 255],
    [SceneColor.Violet]: [128, 0, 128],
    [SceneColor.White]: [255, 255, 255],
    [SceneColor.Yellow]: [255, 255, 0],
};

export const SCENE_COLORS_LABELS: Record<SceneColor, string> = {
    [SceneColor.Black]: 'Noir',
    [SceneColor.Blue]: 'Bleu',
    [SceneColor.Brown]: 'Marron',
    [SceneColor.Cyan]: 'Cyan',
    [SceneColor.Green]: 'Vert',
    [SceneColor.Lime]: 'Citron',
    [SceneColor.Orange]: 'Orange',
    [SceneColor.Red]: 'Rouge',
    [SceneColor.Rose]: 'Rose',
    [SceneColor.Violet]: 'Violet',
    [SceneColor.White]: 'Blanc',
    [SceneColor.Yellow]: 'Jaune',
};

export const SPOT_COLORS: Record<SpotColor, RGBColor> = {
    [SpotColor.Blue]: [0, 0, 255],
    [SpotColor.Red]: [255, 0, 0],
    [SpotColor.Yellow]: [255, 255, 0],
    [SpotColor.White]: [255, 255, 255],
};

export const SPOT_COLORS_LABELS: Record<SpotColor, string> = {
    [SpotColor.Blue]: 'Bleu',
    [SpotColor.Red]: 'Rouge',
    [SpotColor.Yellow]: 'Jaune',
    [SpotColor.White]: 'Blanc',
};

export const SCENE_COLOR_TEXTURE_NAMES: Record<SceneColor, string> = {
    [SceneColor.Black]: 'soz_gouv_black',
    [SceneColor.Blue]: 'soz_gouv_blue',
    [SceneColor.Brown]: 'soz_gouv_brown',
    [SceneColor.Cyan]: 'soz_gouv_cyan',
    [SceneColor.Green]: 'soz_gouv_green',
    [SceneColor.Lime]: 'soz_gouv_lime',
    [SceneColor.Orange]: 'soz_gouv_orange',
    [SceneColor.Red]: 'soz_gouv_red',
    [SceneColor.Rose]: 'soz_gouv_rose',
    [SceneColor.Violet]: 'soz_gouv_violet',
    [SceneColor.White]: 'soz_gouv_white',
    [SceneColor.Yellow]: 'soz_gouv_yellow',
};

export type SpotState = {
    color: SpotColor;
    enabled: boolean;
};

export type XmasSceneState = {
    video_url: string | null;
    scene_bottom_color: SceneColor;
    scene_middle_color: SceneColor;
    scene_top_color: SceneColor;
    spots: Partial<Record<Spot, SpotState>>;
    track_player: boolean;
};

export enum Spot {
    SPOT_SCENE_BOTTOM_FRONT_RIGHT = 'SPOT_SCENE_BOTTOM_FRONT_RIGHT',
    SPOT_SCENE_BOTTOM_FRONT_LEFT = 'SPOT_SCENE_BOTTOM_FRONT_LEFT',
    SPOT_SCENE_BOTTOM_BACK_RIGHT = 'SPOT_SCENE_BOTTOM_BACK_RIGHT',
    SPOT_SCENE_BOTTOM_BACK_LEFT = 'SPOT_SCENE_BOTTOM_BACK_LEFT',
    SPOT_SCENE_UP_FIRST_ROW_1 = 'SPOT_SCENE_UP_FIRST_ROW_1',
    SPOT_SCENE_UP_FIRST_ROW_2 = 'SPOT_SCENE_UP_FIRST_ROW_2',
    SPOT_SCENE_UP_FIRST_ROW_3 = 'SPOT_SCENE_UP_FIRST_ROW_3',
    SPOT_SCENE_UP_FIRST_ROW_4 = 'SPOT_SCENE_UP_FIRST_ROW_4',
    SPOT_SCENE_UP_FIRST_ROW_5 = 'SPOT_SCENE_UP_FIRST_ROW_5',
    SPOT_SCENE_UP_FIRST_ROW_6 = 'SPOT_SCENE_UP_FIRST_ROW_6',
    SPOT_SCENE_UP_SECOND_ROW_1 = 'SPOT_SCENE_UP_SECOND_ROW_1',
    SPOT_SCENE_UP_SECOND_ROW_2 = 'SPOT_SCENE_UP_SECOND_ROW_2',
    SPOT_SCENE_UP_SECOND_ROW_3 = 'SPOT_SCENE_UP_SECOND_ROW_3',
    SPOT_SCENE_UP_SECOND_ROW_4 = 'SPOT_SCENE_UP_SECOND_ROW_4',
    SPOT_SCENE_UP_SECOND_ROW_5 = 'SPOT_SCENE_UP_SECOND_ROW_5',
    SPOT_SCENE_UP_SECOND_ROW_6 = 'SPOT_SCENE_UP_SECOND_ROW_6',
}

export const SPOT_LABELS: Record<Spot, string> = {
    [Spot.SPOT_SCENE_BOTTOM_FRONT_RIGHT]: 'Bas devant droite',
    [Spot.SPOT_SCENE_BOTTOM_FRONT_LEFT]: 'Bas devant gauche',
    [Spot.SPOT_SCENE_BOTTOM_BACK_RIGHT]: 'Bas derrière droite',
    [Spot.SPOT_SCENE_BOTTOM_BACK_LEFT]: 'Bas derrière gauche',
    [Spot.SPOT_SCENE_UP_FIRST_ROW_1]: 'Haut 1ère rangée 1',
    [Spot.SPOT_SCENE_UP_FIRST_ROW_2]: 'Haut 1ère rangée 2',
    [Spot.SPOT_SCENE_UP_FIRST_ROW_3]: 'Haut 1ère rangée 3',
    [Spot.SPOT_SCENE_UP_FIRST_ROW_4]: 'Haut 1ère rangée 4',
    [Spot.SPOT_SCENE_UP_FIRST_ROW_5]: 'Haut 1ère rangée 5',
    [Spot.SPOT_SCENE_UP_FIRST_ROW_6]: 'Haut 1ère rangée 6',
    [Spot.SPOT_SCENE_UP_SECOND_ROW_1]: 'Haut 2ème rangée 1',
    [Spot.SPOT_SCENE_UP_SECOND_ROW_2]: 'Haut 2ème rangée 2',
    [Spot.SPOT_SCENE_UP_SECOND_ROW_3]: 'Haut 2ème rangée 3',
    [Spot.SPOT_SCENE_UP_SECOND_ROW_4]: 'Haut 2ème rangée 4',
    [Spot.SPOT_SCENE_UP_SECOND_ROW_5]: 'Haut 2ème rangée 5',
    [Spot.SPOT_SCENE_UP_SECOND_ROW_6]: 'Haut 2ème rangée 6',
};

export const SPOT_RELATIVE_POSITIONS: Record<Spot, Vector3> = {
    [Spot.SPOT_SCENE_BOTTOM_FRONT_RIGHT]: [-554.21, -680.16, 33.11],
    [Spot.SPOT_SCENE_BOTTOM_FRONT_LEFT]: [-535.79, -680.54, 33.19],
    [Spot.SPOT_SCENE_BOTTOM_BACK_RIGHT]: [-559.01, -698.27, 33.19],
    [Spot.SPOT_SCENE_BOTTOM_BACK_LEFT]: [-531.79, -697.86, 33.44],
    [Spot.SPOT_SCENE_UP_FIRST_ROW_1]: [-534.08, -691.37, 43.45],
    [Spot.SPOT_SCENE_UP_FIRST_ROW_2]: [-540.45, -690.85, 47.13],
    [Spot.SPOT_SCENE_UP_FIRST_ROW_3]: [-544.06, -691.31, 47.77],
    [Spot.SPOT_SCENE_UP_FIRST_ROW_4]: [-547.19, -691.15, 47.67],
    [Spot.SPOT_SCENE_UP_FIRST_ROW_5]: [-550.66, -691.15, 47.08],
    [Spot.SPOT_SCENE_UP_FIRST_ROW_6]: [-556.56, -690.98, 43.45],
    [Spot.SPOT_SCENE_UP_SECOND_ROW_1]: [-536.67, -697.46, 42.73],
    [Spot.SPOT_SCENE_UP_SECOND_ROW_2]: [-541.42, -697.77, 45.67],
    [Spot.SPOT_SCENE_UP_SECOND_ROW_3]: [-544.4, -697.75, 45.82],
    [Spot.SPOT_SCENE_UP_SECOND_ROW_4]: [-547.2, -697.87, 45.84],
    [Spot.SPOT_SCENE_UP_SECOND_ROW_5]: [-550.09, -698.01, 45.14],
    [Spot.SPOT_SCENE_UP_SECOND_ROW_6]: [-555.29, -697.88, 42.37],
};

export const SPOT_GROUP_BOTTOM = [
    Spot.SPOT_SCENE_BOTTOM_FRONT_RIGHT,
    Spot.SPOT_SCENE_BOTTOM_FRONT_LEFT,
    Spot.SPOT_SCENE_BOTTOM_BACK_RIGHT,
    Spot.SPOT_SCENE_BOTTOM_BACK_LEFT,
];

export const SPOT_GROUP_FIRST_ROW = [
    Spot.SPOT_SCENE_UP_FIRST_ROW_1,
    Spot.SPOT_SCENE_UP_FIRST_ROW_2,
    Spot.SPOT_SCENE_UP_FIRST_ROW_3,
    Spot.SPOT_SCENE_UP_FIRST_ROW_4,
    Spot.SPOT_SCENE_UP_FIRST_ROW_5,
    Spot.SPOT_SCENE_UP_FIRST_ROW_6,
];

export const SPOT_GROUP_SECOND_ROW = [
    Spot.SPOT_SCENE_UP_SECOND_ROW_1,
    Spot.SPOT_SCENE_UP_SECOND_ROW_2,
    Spot.SPOT_SCENE_UP_SECOND_ROW_3,
    Spot.SPOT_SCENE_UP_SECOND_ROW_4,
    Spot.SPOT_SCENE_UP_SECOND_ROW_5,
    Spot.SPOT_SCENE_UP_SECOND_ROW_6,
];
