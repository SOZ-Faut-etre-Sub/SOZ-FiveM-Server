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
    taxiMissionInProgress?: boolean;
    busMissionInProgress?: boolean;
};

export type BusStatus = {
    missionInprogress: boolean;
};

export const HorodateurTarif = 30;
export const BusStopTarif = 300;

export const CjrCloakroom: WardrobeConfig = {
    [joaat('mp_m_freemode_01')]: {
        ['Tenue de service']: {
            Components: {
                [Component.Torso]: { Drawable: 26, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 25, Texture: 0, Palette: 0 },
                [Component.Shoes]: { Drawable: 10, Texture: 0, Palette: 0 },
                [Component.Accessories]: { Drawable: 25, Texture: 8, Palette: 0 },
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
                [Component.Undershirt]: { Drawable: 150, Texture: 13, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 31, Texture: 3, Palette: 0 },
            },
            Props: {},
        },
        ['Tenue de direction']: {
            Components: {
                [Component.Torso]: { Drawable: 20, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 28, Texture: 0, Palette: 0 },
                [Component.Shoes]: { Drawable: 10, Texture: 0, Palette: 0 },
                [Component.Accessories]: { Drawable: 27, Texture: 8, Palette: 0 },
                [Component.Undershirt]: { Drawable: 33, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 31, Texture: 0, Palette: 0 },
            },
            Props: {},
        },
        ["Tenue d'été"]: {
            Components: {
                [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 13, Texture: 0, Palette: 0 },
                [Component.Shoes]: { Drawable: 10, Texture: 0, Palette: 0 },
                [Component.Accessories]: { Drawable: 23, Texture: 5, Palette: 0 },
                [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 13, Texture: 0, Palette: 0 },
            },
            Props: {},
        },
    },
    [joaat('mp_f_freemode_01')]: {
        ['Tenue de service']: {
            Components: {
                [Component.Torso]: { Drawable: 28, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 54, Texture: 2, Palette: 0 },
                [Component.Shoes]: { Drawable: 29, Texture: 0, Palette: 0 },
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
                [Component.Shoes]: { Drawable: 29, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 40, Texture: 2, Palette: 0 },
                [Component.Tops]: { Drawable: 7, Texture: 0, Palette: 0 },
            },
            Props: {},
        },
    },
};

export const AllowedTaxiModel = [joaat('taxi'), joaat('dynasty'), joaat('dynasty2')];

export const AllowedBusModel = [joaat('coach'), joaat('coach2')];

export const NPCTakeLocations: Vector4[] = [
    // Elgin
    [257.61, -380.57, 44.71, 340.5],

    // San Andreas Avenue
    [-48.58, -790.12, 44.22, 340.5],
    [240.06, -862.77, 29.73, 341.5],

    // Pupular Street
    [826.0, -1885.26, 29.32, 81.5],

    // Jamestown Street
    [350.84, -1974.13, 24.52, 318.5],

    // Maze Bank Arena
    [-229.11, -2043.16, 27.75, 233.5],

    // Airport
    [-1053.23, -2716.2, 13.75, 329.5],

    // Marina South
    //METEOR [-774.04, -1277.25, 5.15, 171.5],

    // Bay City
    //METEOR [-1184.3, -1304.16, 5.24, 293.5],
    [-1321.28, -833.8, 16.95, 140.5],

    // Del Perro
    [-1613.99, -1015.82, 13.12, 342.5],

    // Bahama Mamas
    [-1392.74, -584.91, 30.24, 32.5],

    // Mandatory
    [-515.19, -260.29, 35.53, 201.5],

    // Del Perro Church
    [-760.84, -34.35, 37.83, 208.5],

    // Eclipse Boulevard
    [-1284.06, 297.52, 64.93, 148.5],

    // Villa
    [-808.29, 828.88, 202.89, 200.5],

    // Sandy Shore
    [1681.84, 3851.03, 35.03, 144.87],

    // Grapeseed
    [2500.22, 4092.98, 37.79, 72.31],
    [1681.11, 4827.0, 42.02, 98.42],
    [1802.53, 4591.42, 37.68, 179.18],

    // Senora Freeway
    [2716.62, 4150.77, 43.43, 87.26],

    // Catfish
    [3263.07, 5155.3, 19.64, 105.83],

    // Senora Way
    [2540.92, 2626.55, 37.66, 286.4],

    // Palomino Freeway
    [2571.87, 475.63, 108.38, 97.73],

    // Canyon Drive
    [-2715.43, 1498.76, 106.4, 268.33],

    // Paleto
    [-129.13, 6549.18, 29.44, 243.09],
    [-428.75, 6267.24, 30.41, 173.41],
    [-679.94, 5833.96, 17.66, 143.75],

    // Fuente Blanca
    [1374.76, 1148.84, 113.48, 93.76],

    // Vinewood Lake
    [-68.69, 887.69, 235.91, 37.78],

    // Chupacabra Street
    //METEOR [91.04, -2558.5, 5.94, 4.9],
];

export const NPCDeliverLocations: Vector4[] = [
    // You News
    [-1074.39, -266.64, 37.75, 117.5],

    // Bahama Mamas
    [-1412.07, -591.75, 30.38, 298.5],

    // Little Seoul
    [-679.9, -845.01, 23.98, 269.5],

    // Forum Drive
    [-158.05, -1565.3, 35.06, 139.5],

    // Fourrière Sud
    [442.09, -1684.33, 29.25, 320.5],

    // Sud Mirror Park
    [1120.73, -957.31, 47.43, 289.5],

    // Mirror Park
    [1238.85, -377.73, 69.03, 70.5],

    // Sud El Rancho
    [922.24, -2224.03, 30.39, 354.5],

    // Sandy Shore
    [1920.93, 3703.85, 32.63, 120.5],
    [1412.57, 3594.21, 34.62, 105.9],
    [911.31, 3637.05, 32.72, 94.65],

    // Grapeseed
    [1662.55, 4876.71, 42.05, 185.5],
    [2242.62, 5190.37, 60.43, 79.67],
    [3260.0, 5147.74, 19.6, 102.99],

    // Paleto
    [-9.51, 6529.67, 31.37, 136.5],
    [-42.41, 6364.27, 30.66, 135.74],
    [-437.92, 6056.9, 30.67, 205.57],

    // Chumash
    //METEOR [-3232.7, 1013.16, 12.09, 177.5],

    // Bay City
    [-1604.09, -401.66, 42.35, 321.5],

    // Mandatory
    [-586.48, -255.96, 35.91, 210.5],

    //Go Postal
    [23.66, -60.23, 63.62, 341.5],

    // Vinewood
    [550.3, 172.55, 100.11, 339.5],

    // Aéroport
    [-1048.55, -2540.58, 13.69, 148.5],

    // Stonks
    [-9.55, -544.0, 38.63, 87.5],

    // Rockford Plaza
    [-7.86, -258.22, 46.9, 68.5],

    // Villa
    [-743.34, 817.81, 213.6, 219.5],
    [218.34, 677.47, 189.26, 359.5],

    // SSisyphus Theater
    [263.2, 1138.81, 221.75, 203.5],

    // Hammer Place
    [220.64, -1010.81, 29.22, 160.5],

    // Tongva Valley
    [-1499.94, 1510.95, 115.65, 172.5],

    // Great Chaparral
    [-89.25, 1986.66, 182.99, 282.67],

    // Harmony
    [336.49, 2619.37, 44.17, 287.62],

    // Road 68
    [1137.82, 2664.52, 37.68, 181.61],
    [-1136.23, 2673.41, 18.31, 39.11],

    // Senora Freeway
    [2635.2, 3262.89, 55.3, 226.06],

    // Docks
    //METEOR [174.83, -3088.46, 5.68, 347.54],
];

export const busLinesConfig = {
    maxPedPerStops: 3,
    minPedPerStops: 1,
};

export const busLines: Record<string, Vector4[]> = {
    ['Maze Bank - South Vespucci']: [
        [-142.23, -2047.67, 22.96, 74.29],
        [438.577576, -2032.654, 23.4790154, 0],
        [839.01, -2462.25, 27.06, 344.13],
        [810.355, -1352.39148, 26.2624512, 0],
        [788.6035, -776.336731, 26.345108, 0],
        [-697.104431, -1.262863, 38.2245026, 0],
        [-712.4643, -824.146545, 23.4815369, 0],
        //METEOR [-1215.26587, -1219.59143, 7.61792, 0],
    ],
    ['South Vespucci - Maze Bank']: [
        //METEOR [-1172.61, -1475.31, 4.38, 306.28],
        [-694.92, -852.63, 23.71, 354.99],
        [-723.11, -95.84, 38.12, 30.02],
        [764.48, -942.4, 25.7, 275.56],
        [781.62, -1369.58, 26.62, 269.91],
        [855.04, -2442.91, 27.88, 170.64],
        [432.19, -1980.04, 23.14, 142.08],
        [-142.23, -2047.67, 22.96, 74.29],
    ],

    ['Maze Bank - Vinewood Bowl']: [
        [-132.51, -1987.85, 22.81, 85.95],
        [53.95, -1539.53, 29.32, 264.25],
        [356.15, -1067.03, 29.56, 14.21],
        [114.91, -782.17, 31.4, 166.13],
        [-176.07, -818.52, 31.12, 221.26],
        [-737.87, -750.8, 26.84, 115.84],
        [-1169.89, -396.37, 35.53, 169.39],
        [-1418.87, -91.42, 52.43, 25.87],
        [-672.46, 238.37, 81.28, 18.58],
        [290.15, 145.88, 104.11, 325.96],
        [714.65, 659.3, 128.91, 9.26],
    ],

    ['Vinewood Bowl - Maze Bank']: [
        [690.38, 675.64, 129.05, 159.78],
        [322.95, 170.17, 103.67, 160.81],
        [-636.2, 286.02, 81.45, 168.99],
        [-1444.02, -46.11, 52.59, 288.82],
        [-1169.96, -427.2, 34.92, 12.21],
        [-754.88, -712.74, 29.44, 272.12],
        [-119.58, -754.26, 34.15, 71.86],
        [131.89, -821.09, 31.21, 337.98],
        [318.67, -1033.69, 29.22, 181.96],
        [-112.55, -1683.95, 29.31, 231.29],
        [-132.51, -1987.85, 22.81, 85.95],
    ],

    ['Aéroport - Sandy Shore']: [
        [-1029.81, -2493.55, 20.17, 237.16],
        //METEOR [-596.86, -2265.33, 6.08, 69.09],
        [55.46, -1538.47, 29.29, 46.94],
        [257.13, -1120.68, 29.37, 177.95],
        [453.23, 2666.08, 43.5, 5.86],
        [1430.53, 3581.94, 34.96, 35.32],
        [1962.92, 3778.45, 32.2, 29.12],
        [1679.6, 4854.77, 42.07, 94.81],
    ],
    ['Paleto - Maze Bank']: [
        [-219.74, 6176.4, 31.37, 225.53],
        [-1532.98, 4995.46, 62.12, 218.57],
        [-2238.45, 4317.79, 48.32, 349.52],
        [-2530.88, 2347.33, 33.06, 200.27],
        [-3151.42, 1105.06, 20.85, 247.5],
        //METEOR [-3021.51, 83.66, 11.66, 319.29],
        [-1475.93, -634.39, 30.6, 32.53],
        [-505.43, -670.51, 33.1, 2.77],
        [356.25, -1067.28, 29.56, 11.18],
        [785.34, -1369.41, 26.61, 280.67],
        [-132.95, -1988.12, 22.81, 163.7],
    ],
    ['Bay City - Maze Bank']: [
        [-1418.06, -91.91, 52.44, 19.0],
        [-1169.3, -396.75, 35.55, 195.04],
        [-691.85, -670.63, 30.87, 341.31],
        [-250.08, -886.72, 30.62, 344.91],
        [356.14, -1067.25, 29.56, 9.01],
        [788.31, -776.15, 26.42, 88.48],
        [528.52, -133.03, 60.02, 136.81],
        [1181.59, -422.23, 67.37, 254.14],
        [1232.48, -1272.77, 35.08, 260.52],
        [933.01, -1750.01, 31.16, 179.17],
        [-136.02, -2030.4, 22.96, 78.38],
    ],
    ['Aéroport - Touristique']: [
        [-1034.26, -2732.31, 20.17, 335.13],
        [-133.24, -1977.54, 22.81, 94.05],
        //METEOR [-773.61, -1277.26, 5.15, 214.99],
        //METEOR [-1046.28, -1648.36, 4.55, 317.69],
        [-1603.99, -1047.31, 13.04, 313.62],
        [-1475.83, -634.3, 30.6, 24.85],
        [-2317.51, 436.12, 174.47, 269.17],
        [-1602.73, 147.05, 59.94, 20.58],
        [-412.16, 1171.57, 325.81, 308.94],
        [226.26, 1172.42, 225.46, 292.18],
        [224.17, 296.7, 105.54, 254.45],
        [941.76, 154.61, 80.83, 304.19],
        [768.42, -941.54, 25.7, 279.14],
        [257.08, -1119.61, 29.36, 173.71],
        [-110.2, -1685.87, 29.31, 209.7],
        [-131.75, -1982.98, 22.81, 89.56],
    ],
};

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
