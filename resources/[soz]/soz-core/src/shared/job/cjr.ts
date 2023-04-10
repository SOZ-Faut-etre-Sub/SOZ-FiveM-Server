import { Component, WardrobeConfig } from '../cloth';
import { joaat } from '../joaat';
import { Vector4 } from '../polyzone/vector';

export type HoradateurData = {
    tarif: number;
    distance: number;
};

export const TaxiConfig = {
    bankAccount: {
        main: 'taxi',
        safe: 'safe_taxi',
        farm: 'farm_taxi',
    },
};

export type TaxiStatus = {
    horodateurStarted: boolean;
    horodateurDisplayed: boolean;
    missionInprogress: boolean;
};

export const HorodateurTarif = 14;

export const CjrCloakroom: WardrobeConfig = {
    [joaat('mp_m_freemode_01')]: {
        ['Tenue de service']: {
            Components: {
                [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 25, Texture: 0, Palette: 0 },
                [Component.Shoes]: { Drawable: 10, Texture: 0, Palette: 0 },
                [Component.Accessories]: { Drawable: 27, Texture: 2, Palette: 0 },
                [Component.Undershirt]: { Drawable: 6, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 11, Texture: 1, Palette: 0 },
            },
            Props: {},
        },
        ["Tenue d'hiver"]: {
            Components: {
                [Component.Torso]: { Drawable: 22, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 24, Texture: 5, Palette: 0 },
                [Component.Shoes]: { Drawable: 10, Texture: 0, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 139, Texture: 3, Palette: 0 },
            },
            Props: {},
        },
        ['Tenue de direction']: {
            Components: {
                [Component.Torso]: { Drawable: 12, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 28, Texture: 0, Palette: 0 },
                [Component.Shoes]: { Drawable: 10, Texture: 0, Palette: 0 },
                [Component.Accessories]: { Drawable: 27, Texture: 2, Palette: 0 },
                [Component.Undershirt]: { Drawable: 33, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 31, Texture: 0, Palette: 0 },
            },
            Props: {},
        },
    },
    [joaat('mp_f_freemode_01')]: {
        ['Tenue de service']: {
            Components: {
                [Component.Torso]: { Drawable: 28, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 54, Texture: 2, Palette: 0 },
                [Component.Shoes]: { Drawable: 13, Texture: 0, Palette: 0 },
                [Component.Accessories]: { Drawable: 23, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 185, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 334, Texture: 1, Palette: 0 },
            },
            Props: {},
        },
        ["Tenue d'hiver"]: {
            Components: {
                [Component.Torso]: { Drawable: 23, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 37, Texture: 5, Palette: 0 },
                [Component.Shoes]: { Drawable: 29, Texture: 0, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 103, Texture: 3, Palette: 0 },
            },
            Props: {},
        },
        ['Tenue de direction']: {
            Components: {
                [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 54, Texture: 2, Palette: 0 },
                [Component.Shoes]: { Drawable: 13, Texture: 0, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 40, Texture: 2, Palette: 0 },
                [Component.Tops]: { Drawable: 7, Texture: 0, Palette: 0 },
            },
            Props: {},
        },
    },
};

export const AllowedVehicleModel = [joaat('taxi'), joaat('dynasty'), joaat('dynasty2')];

export const NPCTakeLocations: Vector4[] = [
    [257.61, -380.57, 44.71, 340.5],
    [-48.58, -790.12, 44.22, 340.5],
    [240.06, -862.77, 29.73, 341.5],
    [826.0, -1885.26, 29.32, 81.5],
    [350.84, -1974.13, 24.52, 318.5],
    [-229.11, -2043.16, 27.75, 233.5],
    [-1053.23, -2716.2, 13.75, 329.5],
    [-774.04, -1277.25, 5.15, 171.5],
    [-1184.3, -1304.16, 5.24, 293.5],
    [-1321.28, -833.8, 16.95, 140.5],
    [-1613.99, -1015.82, 13.12, 342.5],
    [-1392.74, -584.91, 30.24, 32.5],
    [-515.19, -260.29, 35.53, 201.5],
    [-760.84, -34.35, 37.83, 208.5],
    [-1284.06, 297.52, 64.93, 148.5],
    [-808.29, 828.88, 202.89, 200.5],
    [1681.84, 3851.03, 35.03, 144.87],
    [2500.22, 4092.98, 37.79, 72.31],
    [2716.62, 4150.77, 43.43, 87.26],
    [3263.07, 5155.3, 19.64, 105.83],
    [2540.92, 2626.55, 37.66, 286.4],
    [2571.87, 475.63, 108.38, 97.73],
    [1681.11, 4827.0, 42.02, 98.42],
    [-2715.43, 1498.76, 106.4, 268.33],
    [-129.13, 6549.18, 29.44, 243.09],
    [-428.75, 6267.24, 30.41, 173.41],
    [-679.94, 5833.96, 17.66, 143.75],
    [1374.76, 1148.84, 113.48, 93.76],
    [-68.69, 887.69, 235.91, 37.78],
    [91.04, -2558.5, 5.94, 4.9],
];

export const NPCDeliverLocations: Vector4[] = [
    [-1074.39, -266.64, 37.75, 117.5],
    [-1412.07, -591.75, 30.38, 298.5],
    [-679.9, -845.01, 23.98, 269.5],
    [-158.05, -1565.3, 35.06, 139.5],
    [442.09, -1684.33, 29.25, 320.5],
    [1120.73, -957.31, 47.43, 289.5],
    [1238.85, -377.73, 69.03, 70.5],
    [922.24, -2224.03, 30.39, 354.5],
    [1920.93, 3703.85, 32.63, 120.5],
    [1662.55, 4876.71, 42.05, 185.5],
    [-9.51, 6529.67, 31.37, 136.5],
    [-3232.7, 1013.16, 12.09, 177.5],
    [-1604.09, -401.66, 42.35, 321.5],
    [-586.48, -255.96, 35.91, 210.5],
    [23.66, -60.23, 63.62, 341.5],
    [550.3, 172.55, 100.11, 339.5],
    [-1048.55, -2540.58, 13.69, 148.5],
    [-9.55, -544.0, 38.63, 87.5],
    [-7.86, -258.22, 46.9, 68.5],
    [-743.34, 817.81, 213.6, 219.5],
    [218.34, 677.47, 189.26, 359.5],
    [263.2, 1138.81, 221.75, 203.5],
    [220.64, -1010.81, 29.22, 160.5],
    [-1499.94, 1510.95, 115.65, 172.5],
    [-89.25, 1986.66, 182.99, 282.67],
    [336.49, 2619.37, 44.17, 287.62],
    [1137.82, 2664.52, 37.68, 181.61],
    [1412.57, 3594.21, 34.62, 105.9],
    [911.31, 3637.05, 32.72, 94.65],
    [2242.62, 5190.37, 60.43, 79.67],
    [2635.2, 3262.89, 55.3, 226.06],
    [-1136.23, 2673.41, 18.31, 39.11],
    [174.83, -3088.46, 5.68, 347.54],
];

export const NpcSkins = [
    'a_f_m_skidrow_01',
    'a_f_m_soucentmc_01',
    'a_f_m_soucent_01',
    'a_f_m_soucent_02',
    'a_f_m_tourist_01',
    'a_f_m_trampbeac_01',
    'a_f_m_tramp_01',
    'a_f_o_genstreet_01',
    'a_f_o_indian_01',
    'a_f_o_ktown_01',
    'a_f_o_salton_01',
    'a_f_o_soucent_01',
    'a_f_o_soucent_02',
    'a_f_y_beach_01',
    'a_f_y_bevhills_01',
    'a_f_y_bevhills_02',
    'a_f_y_bevhills_03',
    'a_f_y_bevhills_04',
    'a_f_y_business_01',
    'a_f_y_business_02',
    'a_f_y_business_03',
    'a_f_y_business_04',
    'a_f_y_eastsa_01',
    'a_f_y_eastsa_02',
    'a_f_y_eastsa_03',
    'a_f_y_epsilon_01',
    'a_f_y_fitness_01',
    'a_f_y_fitness_02',
    'a_f_y_genhot_01',
    'a_f_y_golfer_01',
    'a_f_y_hiker_01',
    'a_f_y_hipster_01',
    'a_f_y_hipster_02',
    'a_f_y_hipster_03',
    'a_f_y_hipster_04',
    'a_f_y_indian_01',
    'a_f_y_juggalo_01',
    'a_f_y_runner_01',
    'a_f_y_rurmeth_01',
    'a_f_y_scdressy_01',
    'a_f_y_skater_01',
    'a_f_y_soucent_01',
    'a_f_y_soucent_02',
    'a_f_y_soucent_03',
    'a_f_y_tennis_01',
    'a_f_y_tourist_01',
    'a_f_y_tourist_02',
    'a_f_y_vinewood_01',
    'a_f_y_vinewood_02',
    'a_f_y_vinewood_03',
    'a_f_y_vinewood_04',
    'a_f_y_yoga_01',
    'g_f_y_ballas_01',
    'ig_barry',
    'ig_bestmen',
    'ig_beverly',
    'ig_car3guy1',
    'ig_car3guy2',
    'ig_casey',
    'ig_chef',
    'ig_chengsr',
    'ig_chrisformage',
    'ig_clay',
    'ig_claypain',
    'ig_cletus',
    'ig_dale',
    'ig_dreyfuss',
    'ig_fbisuit_01',
    'ig_floyd',
    'ig_groom',
    'ig_hao',
    'ig_hunter',
    'csb_prolsec',
    'ig_joeminuteman',
    'ig_josef',
    'ig_josh',
    'ig_lamardavis',
    'ig_lazlow',
    'ig_lestercrest',
    'ig_lifeinvad_01',
    'ig_lifeinvad_02',
    'ig_manuel',
    'ig_milton',
    'ig_mrk',
    'ig_nervousron',
    'ig_nigel',
    'ig_old_man1a',
    'ig_old_man2',
    'ig_oneil',
    'ig_orleans',
    'ig_ortega',
    'ig_paper',
    'ig_priest',
    'ig_prolsec_02',
    'ig_ramp_gang',
    'ig_ramp_hic',
    'ig_ramp_hipster',
    'ig_ramp_mex',
    'ig_roccopelosi',
    'ig_russiandrunk',
    'ig_siemonyetarian',
    'ig_solomon',
    'ig_stevehains',
    'ig_stretch',
    'ig_talina',
    'ig_taocheng',
    'ig_taostranslator',
    'ig_tenniscoach',
    'ig_terry',
    'ig_tomepsilon',
    'ig_tylerdix',
    'ig_wade',
    'ig_zimbor',
    's_m_m_paramedic_01',
    'a_m_m_afriamer_01',
    'a_m_m_beach_01',
    'a_m_m_beach_02',
    'a_m_m_bevhills_01',
    'a_m_m_bevhills_02',
    'a_m_m_business_01',
    'a_m_m_eastsa_01',
    'a_m_m_eastsa_02',
    'a_m_m_farmer_01',
    'a_m_m_fatlatin_01',
    'a_m_m_genfat_01',
    'a_m_m_genfat_02',
    'a_m_m_golfer_01',
    'a_m_m_hasjew_01',
    'a_m_m_hillbilly_01',
    'a_m_m_hillbilly_02',
    'a_m_m_indian_01',
    'a_m_m_ktown_01',
    'a_m_m_malibu_01',
    'a_m_m_mexcntry_01',
    'a_m_m_mexlabor_01',
    'a_m_m_og_boss_01',
    'a_m_m_paparazzi_01',
    'a_m_m_polynesian_01',
    'a_m_m_prolhost_01',
    'a_m_m_rurmeth_01',
];
