import { TattooShopCategory } from '@public/shared/shop';

export type ShopConfig = {
    brand: ShopBrand;
    location: number[];
    positionInShop?: number[];
    cameraInShop?: number[];
    cameraTarget?: number[];
};

export type BrandConfig = {
    label: string;
    blipSprite?: number;
    blipColor?: number;
    pedModel?: string;
    banner?: string;
};

export enum ShopBrand {
    Ponsonbys = 'ponsonbys',
    Suburban = 'suburban',
    Binco = 'binco',
    Mask = 'mask',
    Jewelry = 'jewelry',
    Supermarket247North = '247supermarket-north',
    Supermarket247South = '247supermarket-south',
    LtdGasolineNorth = 'ltdgasoline-north',
    LtdGasolineSouth = 'ltdgasoline-south',
    RobsliquorNorth = 'robsliquor-north',
    RobsliquorSouth = 'robsliquor-south',
    Tattoo = 'tattoo',
    Barber = 'barber',
    Ammunation = 'ammunation',
    Zkea = 'zkea',
}

export const BrandsConfig: Record<ShopBrand, BrandConfig> = {
    [ShopBrand.Ponsonbys]: {
        label: 'Ponsonbys',
        blipSprite: 73,
        blipColor: 26,
        pedModel: 's_f_m_shop_high',
        banner: 'https://nui-img/soz/menu_shop_clothe_luxe',
    },
    [ShopBrand.Suburban]: {
        label: 'Suburban',
        blipSprite: 73,
        blipColor: 29,
        pedModel: 's_f_y_shop_mid',
        banner: 'https://nui-img/soz/menu_shop_clothe_normal',
    },
    [ShopBrand.Binco]: {
        label: 'Binco',
        blipSprite: 73,
        blipColor: 33,
        pedModel: 's_f_y_shop_low',
        banner: 'https://nui-img/soz/menu_shop_clothe_normal',
    },
    [ShopBrand.Mask]: {
        label: 'Magasin de Masques',
        blipSprite: 362,
        banner: 'https://nui-img/soz/menu_shop_accessory',
    },
    [ShopBrand.Jewelry]: {
        label: 'Bijoutier',
        blipSprite: 617,
        blipColor: 0,
        pedModel: 'u_m_m_jewelsec_01',
        banner: 'https://nui-img/soz/menu_shop_jewelry',
    },
    [ShopBrand.Supermarket247North]: {
        label: 'Superette',
        blipSprite: 52,
        blipColor: 2,
        pedModel: 'ig_ashley',
        banner: 'https://nui-img/soz/menu_shop_supermarket',
    },
    [ShopBrand.Supermarket247South]: {
        label: 'Superette',
        blipSprite: 52,
        blipColor: 2,
        pedModel: 'cs_ashley',
        banner: 'https://nui-img/soz/menu_shop_supermarket',
    },
    [ShopBrand.LtdGasolineNorth]: {
        label: 'Superette',
        blipSprite: 52,
        blipColor: 2,
        pedModel: 's_m_m_autoshop_01',
        banner: 'https://nui-img/soz/menu_shop_supermarket',
    },
    [ShopBrand.LtdGasolineSouth]: {
        label: 'Superette',
        blipSprite: 52,
        blipColor: 2,
        pedModel: 's_m_m_autoshop_02',
        banner: 'https://nui-img/soz/menu_shop_supermarket',
    },
    [ShopBrand.RobsliquorNorth]: {
        label: 'Superette',
        blipSprite: 52,
        blipColor: 2,
        pedModel: 'a_m_m_genfat_02',
        banner: 'https://nui-img/soz/menu_shop_supermarket',
    },
    [ShopBrand.RobsliquorSouth]: {
        label: 'Superette',
        blipSprite: 52,
        blipColor: 2,
        pedModel: 'a_m_m_genfat_01',
        banner: 'https://nui-img/soz/menu_shop_supermarket',
    },
    [ShopBrand.Tattoo]: {
        label: 'Tatoueur',
        blipSprite: 75,
        blipColor: 1,
        pedModel: 'u_m_y_tattoo_01',
        banner: 'https://nui-img/soz/menu_shop_tattoo',
    },
    [ShopBrand.Barber]: {
        label: 'Coiffeur',
        blipSprite: 71,
        blipColor: 0,
        pedModel: 's_f_m_fembarber',
        banner: 'https://nui-img/soz/menu_shop_barber',
    },
    [ShopBrand.Ammunation]: {
        label: 'Ammu-Nation',
        blipSprite: 110,
        blipColor: 17,
        pedModel: 's_m_y_ammucity_01',
        banner: 'https://nui-img/soz/menu_shop_ammunation',
    },
    [ShopBrand.Zkea]: {
        label: 'Zkea',
        blipSprite: 123,
        blipColor: 69,
        pedModel: 'ig_brad',
        banner: 'https://nui-img/soz/menu_shop_supermarket',
    },
};

export const ShopsConfig: Record<string, ShopConfig> = {
    ['ponsonbys1']: {
        brand: ShopBrand.Ponsonbys,
        location: [-707.84, -152.87, 37.42, 125.7],
        positionInShop: [-705.48, -152.0, 37.42, 277.09],
        cameraInShop: [-703.22, -152.0, 37.42, 91.85],
    },
    ['ponsonbys2']: {
        brand: ShopBrand.Ponsonbys,
        location: [-164.61, -301.41, 39.73, 256.5],
        positionInShop: [-166.93, -300.1, 39.73, 63.27],
        cameraInShop: [-168.39, -298.7, 39.73, 218.13],
    },
    ['ponsonbys3']: {
        brand: ShopBrand.Ponsonbys,
        location: [-1449.84, -239.2, 49.81, 50.99],
        positionInShop: [-1448.08, -241.41, 49.82, 214.5],
        cameraInShop: [-1447.43, -243.13, 49.82, 24.69],
    },
    ['suburban1']: {
        brand: ShopBrand.Suburban,
        location: [127.42, -223.54, 54.56, 71.99],
        positionInShop: [117.5, -226.73, 54.56, 250.04],
        cameraInShop: [118.71, -228.28, 54.56, 25.09],
    },
    ['suburban3']: {
        brand: ShopBrand.Suburban,
        location: [-1194.53, -767.3, 17.32, 216.9],
        positionInShop: [-1184.8, -769.37, 17.33, 40.76],
        cameraInShop: [-1185.04, -767.84, 17.33, 185.19],
    },
    ['suburban4']: {
        brand: ShopBrand.Suburban,
        location: [-3168.95, 1043.83, 20.86, 70.68],
        positionInShop: [-3178.92, 1041.06, 20.86, 237.32],
        cameraInShop: [-3177.37, 1039.44, 20.86, 24.7],
    },
    ['binco1']: {
        brand: ShopBrand.Binco,
        location: [427.32, -806.08, 29.49, 87.53],
        positionInShop: [429.78, -812.19, 29.49, 357.94],
        cameraInShop: [429.64, -810.34, 29.49, 185.2],
    },
    ['binco2']: {
        brand: ShopBrand.Binco,
        location: [-823.21, -1072.28, 11.33, 208.86],
        positionInShop: [-819.41, -1066.95, 11.33, 122.24],
        cameraInShop: [-820.94, -1067.97, 11.33, 302.64],
    },
    ['binco3']: {
        brand: ShopBrand.Binco,
        location: [73.65, -1392.97, 29.38, 268.02],
        positionInShop: [71.11, -1386.93, 29.38, 180.38],
        cameraInShop: [71.31, -1388.83, 29.38, 357.27],
    },
    ['binco4']: {
        brand: ShopBrand.Binco,
        location: [6.12, 6511.31, 31.88, 47.79],
        positionInShop: [3.53, 6505.53, 31.88, 312.0],
        cameraInShop: [4.7, 6506.85, 31.88, 133.22],
    },
    ['binco5']: {
        brand: ShopBrand.Binco,
        location: [1695.48, 4823.14, 42.06, 114.62],
        positionInShop: [1698.91, 4817.47, 42.06, 5.87],
        cameraInShop: [1698.54, 4819.34, 42.06, 187.54],
    },
    ['binco6']: {
        brand: ShopBrand.Binco,
        location: [1196.47, 2711.95, 38.22, 179.31],
        positionInShop: [1202.65, 2714.47, 38.22, 87.5],
        cameraInShop: [1200.77, 2714.4, 38.22, 270.77],
    },
    ['binco7']: {
        brand: ShopBrand.Binco,
        location: [-1102.7, 2711.59, 19.11, 229.23],
        positionInShop: [-1099.84, 2717.69, 19.11, 135.67],
        cameraInShop: [-1101.08, 2716.36, 19.11, 310.78],
    },
    ['barber']: {
        brand: ShopBrand.Barber,
        location: [-823.04, -183.63, 37.57, 208.03],
    },
    ['barber2']: {
        brand: ShopBrand.Barber,
        location: [134.98, -1707.95, 29.29, 152.5],
    },
    ['barber3']: {
        brand: ShopBrand.Barber,
        location: [1211.68, -470.88, 66.21, 74.72],
    },
    ['barber4']: {
        brand: ShopBrand.Barber,
        location: [-277.87, 6230.14, 31.7, 50.93],
    },
    ['barber5']: {
        brand: ShopBrand.Barber,
        location: [-1283.93, -1115.55, 6.99, 89.85],
    },
    ['barber6']: {
        brand: ShopBrand.Barber,
        location: [1930.92, 3728.27, 32.84, 218.55],
    },
    ['barber7']: {
        brand: ShopBrand.Barber,
        location: [-30.98, -151.74, 57.08, 346.24],
    },
    ['jewelry']: {
        brand: ShopBrand.Jewelry,
        location: [-623.22, -229.24, 38.06, 82.19],
    },
    ['mask']: {
        brand: ShopBrand.Mask,
        location: [-1335.76, -1278.67, 4.86, 316.75],
        positionInShop: [-1337.08, -1279.66, 4.85, 316.75],
        cameraInShop: [-1336.26, -1278.35, 5.65, 316.75],
        cameraTarget: [-1337.08, -1279.66, 5.05],
    },
    ['247supermarket4']: {
        brand: ShopBrand.Supermarket247North,
        location: [1728.33, 6416.87, 35.04, 237.95],
    },
    ['247supermarket5']: {
        brand: ShopBrand.Supermarket247North,
        location: [1958.92, 3741.33, 32.34, 299.67],
    },
    ['247supermarket6']: {
        brand: ShopBrand.Supermarket247North,
        location: [549.52, 2669.55, 42.16, 98.65],
    },
    ['247supermarket7']: {
        brand: ShopBrand.Supermarket247North,
        location: [2676.47, 3280.02, 55.24, 333.41],
    },
    ['247supermarket10']: {
        brand: ShopBrand.Supermarket247North,
        location: [-2539.01, 2312.01, 33.41, 94.82],
    },
    ['247supermarket11']: {
        brand: ShopBrand.Supermarket247North,
        location: [161.57, 6643.05, 31.71, 222.18],
    },
    ['247supermarket']: {
        brand: ShopBrand.Supermarket247South,
        location: [24.17, -1345.49, 29.5, 273.39],
    },
    ['247supermarket2']: {
        brand: ShopBrand.Supermarket247South,
        location: [-3040.65, 583.85, 7.91, 22.65],
    },
    ['247supermarket3']: {
        brand: ShopBrand.Supermarket247South,
        location: [-3244.07, 999.89, 12.83, 0.41],
    },
    ['247supermarket8']: {
        brand: ShopBrand.Supermarket247South,
        location: [2555.43, 380.62, 108.62, 1.74],
    },
    ['247supermarket9']: {
        brand: ShopBrand.Supermarket247South,
        location: [372.86, 328.17, 103.57, 253.87],
    },
    ['ltdgasoline5']: {
        brand: ShopBrand.LtdGasolineNorth,
        location: [1697.24, 4923.27, 42.06, 324.94],
    },
    ['ltdgasoline']: {
        brand: ShopBrand.LtdGasolineSouth,
        location: [-47.22, -1758.73, 29.42, 49.1],
    },
    ['ltdgasoline2']: {
        brand: ShopBrand.LtdGasolineSouth,
        location: [-705.96, -914.47, 19.22, 88.63],
    },
    ['ltdgasoline3']: {
        brand: ShopBrand.LtdGasolineSouth,
        location: [-1819.42, 793.7, 138.08, 126.03],
    },
    ['ltdgasoline4']: {
        brand: ShopBrand.LtdGasolineSouth,
        location: [1165.09, -323.52, 69.21, 110.25],
    },
    ['ltdgasoline6']: {
        brand: ShopBrand.LtdGasolineSouth,
        location: [-1422.39, -271.12, 46.28, 51.58],
    },
    ['ltdgasoline7']: {
        brand: ShopBrand.LtdGasolineSouth,
        location: [-2071.21, -333.42, 13.32, 357.19],
    },
    ['robsliquor4']: {
        brand: ShopBrand.RobsliquorNorth,
        location: [1165.26, 2710.93, 38.16, 180.89],
    },
    ['robsliquor6']: {
        brand: ShopBrand.RobsliquorNorth,
        location: [-162.42, 6322.55, 31.59, 322.62],
    },
    ['robsliquor']: {
        brand: ShopBrand.RobsliquorSouth,
        location: [-1221.34, -908.13, 12.33, 31.52],
    },
    ['robsliquor2']: {
        brand: ShopBrand.RobsliquorSouth,
        location: [-1486.6, -377.43, 40.16, 135.93],
    },
    ['robsliquor3']: {
        brand: ShopBrand.RobsliquorSouth,
        location: [-2966.06, 391.64, 15.04, 86.14],
    },
    ['robsliquor5']: {
        brand: ShopBrand.RobsliquorSouth,
        location: [1134.02, -983.14, 46.42, 281.3],
    },
    ['zkea']: {
        brand: ShopBrand.Zkea,
        location: [2748.29, 3472.55, 55.68, 254.93],
    },
    ['tattooshop']: {
        brand: ShopBrand.Tattoo,
        location: [319.67, 181.11, 103.59, 248.97],
        positionInShop: [324.69, 180.53, 103.59, 134.05],
    },
    ['tattooshop2']: {
        brand: ShopBrand.Tattoo,
        location: [1862.56, 3748.41, 33.03, 33.12],
        positionInShop: [1864.91, 3746.62, 33.03, 28.24],
    },
    ['tattooshop3']: {
        brand: ShopBrand.Tattoo,
        location: [-292.15, 6199.63, 31.49, 232.53],
        positionInShop: [-294.79, 6200.76, 31.49, 212.67],
    },
    ['tattooshop4']: {
        brand: ShopBrand.Tattoo,
        location: [-1151.95, -1423.96, 4.95, 128.08],
        positionInShop: [-1155.23, -1427.59, 4.95, 6.04],
    },
    ['tattooshop5']: {
        brand: ShopBrand.Tattoo,
        location: [1324.83, -1650.14, 52.28, 129.56],
        positionInShop: [1321.72, -1654.25, 52.28, 9.94],
    },
    ['tattooshop6']: {
        brand: ShopBrand.Tattoo,
        location: [-3170.73, 1072.86, 20.83, 332.32],
        positionInShop: [-3169.81, 1077.92, 20.83, 220.92],
    },
    ['ammunation']: {
        brand: ShopBrand.Ammunation,
        location: [-661.61, -933.49, 21.83, 176.46],
    },
    ['ammunation2']: {
        brand: ShopBrand.Ammunation,
        location: [809.58, -2159.08, 29.62, 359.76],
    },
    ['ammunation3']: {
        brand: ShopBrand.Ammunation,
        location: [1692.65, 3761.4, 34.71, 225.95],
    },
    ['ammunation4']: {
        brand: ShopBrand.Ammunation,
        location: [-331.22, 6085.34, 31.45, 225.39],
    },
    ['ammunation5']: {
        brand: ShopBrand.Ammunation,
        location: [253.6, -51.11, 69.94, 64.6],
    },
    ['ammunation6']: {
        brand: ShopBrand.Ammunation,
        location: [23.06, -1105.72, 29.8, 162.29],
    },
    ['ammunation7']: {
        brand: ShopBrand.Ammunation,
        location: [2567.43, 292.62, 108.73, 1.02],
    },
    ['ammunation8']: {
        brand: ShopBrand.Ammunation,
        location: [-1118.56, 2700.09, 18.55, 229.33],
    },
    ['ammunation9']: {
        brand: ShopBrand.Ammunation,
        location: [841.8, -1035.26, 28.19, 356.67],
    },
    ['ammunation10']: {
        brand: ShopBrand.Ammunation,
        location: [-3173.41, 1089.23, 20.84, 223.04],
    },
    ['ammunation11']: {
        brand: ShopBrand.Ammunation,
        location: [-1304.12, -395.54, 36.7, 61.39],
    },
};

export const ShopTattooConfig: Record<string, TattooShopCategory> = {
    ['ZONE_HEAD']: {
        label: 'Visage',
        cam: [
            [0.0, 0.7, 0.7],
            [0.7, 0.0, 0.7],
            [0.0, -0.7, 0.7],
            [-0.7, 0.0, 0.7],
        ],
        player: [0.0, 0.0, 0.5],
    },
    ['ZONE_TORSO']: {
        label: 'Torse',
        cam: [
            [0.0, 0.7, 0.2],
            [-0.5, 0.7, 0.2],
            [-0.5, -0.7, 0.2],
            [0.0, -0.7, 0.2],
            [0.5, -0.7, 0.2],
            [0.5, 0.7, 0.2],
        ],
        player: [0.0, 0.0, 0.2],
    },
    ['ZONE_LEFT_ARM']: {
        label: 'Bras gauche',
        cam: [
            [-0.4, 0.5, 0.2],
            [-0.7, 0.0, 0.2],
            [-0.4, -0.5, 0.2],
        ],
        player: [-0.2, 0.0, 0.2],
    },
    ['ZONE_RIGHT_ARM']: {
        label: 'Bras droit',
        cam: [
            [0.4, 0.5, 0.2],
            [0.7, 0.0, 0.2],
            [0.4, -0.5, 0.2],
        ],
        player: [0.2, 0.0, 0.2],
    },
    ['ZONE_LEFT_LEG']: {
        label: 'Jambe gauche',
        cam: [
            [-0.2, 0.7, -0.7],
            [-0.7, 0.0, -0.7],
            [-0.2, -0.7, -0.7],
        ],
        player: [-0.2, 0.0, -0.6],
    },
    ['ZONE_RIGHT_LEG']: {
        label: 'Jambe droite',
        cam: [
            [0.2, 0.7, -0.7],
            [0.7, 0.0, -0.7],
            [0.2, -0.7, -0.7],
        ],
        player: [0.2, 0.0, -0.6],
    },
};

// Maybe put this somewhere else

export const UndershirtCategoryNeedingReplacementTorso = {
    [-1667301416]: {
        [3]: {
            [0]: 0,
            [1]: 1,
            [2]: 2,
            [3]: 3,
            [4]: 11,
            [5]: 9,
            [6]: 3,
            [7]: 3,
            [8]: 8,
            [9]: 9,
            [10]: 10,
            [11]: 11,
            [12]: 11,
            [13]: 13,
            [14]: 14,
            [15]: 11,
        },
        [4]: {
            [0]: 0,
            [1]: 1,
            [2]: 2,
            [3]: 3,
            [4]: 11,
            [5]: 1,
            [6]: 3,
            [7]: 3,
            [8]: 8,
            [9]: 9,
            [10]: 10,
            [11]: 11,
            [12]: 11,
            [13]: 13,
            [14]: 14,
            [15]: 11,
        },
    },
    [1885233650]: {
        [4]: {
            [0]: 0,
            [1]: 1,
            [2]: 2,
            [3]: 3,
            [4]: 4,
            [5]: 5,
            [6]: 6,
            [7]: 7,
            [8]: 8,
            [9]: 9,
            [10]: 10,
            [11]: 11,
            [12]: 12,
            [13]: 13,
            [14]: 4,
            [15]: 5,
        },
        [5]: {
            [0]: 11,
            [1]: 1,
            [2]: 11,
            [3]: 3,
            [4]: 4,
            [5]: 11,
            [6]: 6,
            [7]: 7,
            [8]: 8,
            [9]: 9,
            [10]: 10,
            [11]: 11,
            [12]: 12,
            [13]: 13,
            [14]: 14,
            [15]: 11,
        },
        [6]: {
            [0]: 4,
            [1]: 4,
            [2]: 4,
            [3]: 4,
            [4]: 4,
            [5]: 4,
            [6]: 4,
            [7]: 4,
            [8]: 4,
            [9]: 4,
            [10]: 4,
            [11]: 4,
            [12]: 4,
            [13]: 4,
            [14]: 4,
            [15]: 4,
        },
        [7]: {
            [0]: 4,
            [1]: 4,
            [2]: 4,
            [3]: 4,
            [4]: 4,
            [5]: 4,
            [6]: 4,
            [7]: 4,
            [8]: 4,
            [9]: 4,
            [10]: 4,
            [11]: 4,
            [12]: 4,
            [13]: 4,
            [14]: 4,
            [15]: 4,
        },
        [8]: {
            [0]: 4,
            [1]: 4,
            [2]: 4,
            [3]: 4,
            [4]: 4,
            [5]: 4,
            [6]: 4,
            [7]: 4,
            [8]: 4,
            [9]: 4,
            [10]: 4,
            [11]: 4,
            [12]: 4,
            [13]: 4,
            [14]: 4,
            [15]: 4,
        },
    },
};

export const ProperTorsos = {
    [1885233650]: {
        [0]: 0,
        [1]: 0,
        [2]: 15,
        [3]: 14,
        [4]: 14,
        [5]: 5,
        [6]: 14,
        [7]: 14,
        [8]: 8,
        [9]: 0,
        [10]: 14,
        [11]: 15,
        [12]: 1,
        [13]: 11,
        [14]: 4,
        [15]: 15, // Torse nu
        [16]: 0,
        [17]: 5,
        [18]: 0,
        [19]: 14,
        [20]: 14,
        [21]: 15,
        [22]: 0,
        [23]: 14,
        [24]: 14,
        [25]: 15,
        [26]: 11,
        [27]: 14,
        [28]: 14,
        [29]: 14, // needs undershirt
        [30]: 14, // needs undershirt
        [31]: 14, // needs undershirt
        [32]: 14, // needs undershirt
        [33]: 0,
        [34]: 0,
        [35]: 14,
        [36]: 5,
        [37]: 14,
        [38]: 8,
        [39]: 0,
        [40]: 15,
        [41]: 1,
        [42]: 11,
        [43]: 11,
        [44]: 0,
        [45]: 15,
        [46]: 14,
        [47]: 0,
        [48]: 1,
        [49]: 1,
        [50]: 1,
        [51]: 1,
        [52]: 4,
        [53]: 4,
        [54]: 4,
        [55]: 0,
        [56]: 0,
        [57]: 1,
        [58]: 14,
        [59]: 14,
        [60]: 8, // needs undershirt
        [61]: 1,
        [62]: 14,
        [63]: 0,
        [64]: 14,
        [65]: 14,
        [66]: 15, // doomed
        [67]: 14, // doomed ou need pantalon très long
        [68]: 14, // Attention coupe de cheveux (capuche)
        [69]: 14,
        [70]: 14,
        [71]: 0,
        [72]: 14,
        [73]: 0,
        [74]: 14,
        [75]: 1,
        [76]: 6,
        [77]: 14, // needs under
        [78]: 6,
        [79]: 6,
        [80]: 0,
        [81]: 0,
        [82]: 0,
        [83]: 0,
        [84]: 4,
        [85]: 1,
        [86]: 1,
        [87]: 1,
        [88]: 14,
        [89]: 2,
        [90]: 1,
        [91]: 14, // torse nu
        [92]: 6,
        [93]: 0,
        [94]: 0, // need pantalon
        [95]: 11,
        [96]: 1,
        [97]: 0,
        [98]: 1, // need pantalon
        [99]: 14,
        [100]: 14,
        [101]: 14, // bugged
        [102]: 14, // bugged
        [103]: 14, // bugged
        [104]: 15,
        [105]: 0,
        [106]: 14,
        [107]: 4,
        [108]: 15,
        [109]: 5,
        [110]: 4,
        [111]: 4,
        [112]: 14,
        [113]: 6,
        [114]: 14, // doomed or pants
        [115]: 14,
        [116]: 14,
        [117]: 6,
        [118]: 14,
        [119]: 14,
        [120]: 15,
        [121]: 4,
        [122]: 14,
        [123]: 0,
        [124]: 14,
        [125]: 4,
        [126]: 4,
        [127]: 14,
        [128]: 0,
        [129]: 4,
        [130]: 14,
        [131]: 0,
        [132]: 0,
        [133]: 11,
        [134]: 4,
        [135]: 0,
        [136]: 14,
        [137]: 5,
        [138]: 4,
        [139]: 4,
        [140]: 14,
        [141]: 6,
        [142]: 14,
        [143]: 4,
        [144]: 6,
        [145]: 14,
        [146]: 0,
        [147]: 4,
        [148]: 4,
        [149]: 14,
        [150]: 4,
        [151]: 14,
        [152]: 4,
        [153]: 4,
        [154]: 6,
        [155]: 14,
        [156]: 14,
        [157]: 15,
        [158]: 5,
        [159]: 15,
        [160]: 15,
        [161]: 6,
        [162]: 5,
        [163]: 14,
        [164]: 0,
        [165]: 6,
        [166]: 14,
        [167]: 14,
        [168]: 6,
        [169]: 14,
        [170]: 15,
        [171]: 4,
        [172]: 14,
        [173]: 15,
        [174]: 6,
        [175]: 5,
        [176]: 14,
        [177]: 5,
        [178]: 4,
        [179]: 15,
        [180]: 5,
        [181]: 14,
        [182]: 4,
        [183]: 14,
        [184]: 4,
        [185]: 14,
        [186]: 4,
        [187]: 6,
        [188]: 4,
        [189]: 14,
        [190]: 0,
        [191]: 14,
        [192]: 14,
        [193]: 0,
        [194]: 6,
        [195]: 6,
        [196]: 6,
        [197]: 6,
        [198]: 6,
        [199]: 6,
        [200]: 4,
        [201]: 3,
        [202]: 5,
        [203]: 6,
        [204]: 6,
        [205]: 5,
        [206]: 5,
        [207]: 5,
        [208]: 0,
        [209]: 4,
        [210]: 4,
        [211]: 4,
        [212]: 14,
        [213]: 0,
        [214]: 4,
        [215]: 14,
        [216]: 15,
        [217]: 4,
        [218]: 4,
        [219]: 5,
        [220]: 4,
        [221]: 4,
        [222]: 0,
        [223]: 5,
        [224]: 6,
        [225]: 8,
        [226]: 0,
        [227]: 4,
        [228]: 4,
        [229]: 4,
        [230]: 14,
        [231]: 4,
        [232]: 14,
        [233]: 14,
        [234]: 11,
        [235]: 0,
        [236]: 0,
        [237]: 5,
        [238]: 5,
        [239]: 5,
        [240]: 14,
        [241]: 0,
        [242]: 0,
        [243]: 4,
        [244]: 6,
        [245]: 6,
        [246]: 7,
        [247]: 5,
        [248]: 6,
        [249]: 6,
        [250]: 0,
        [251]: 4,
        [252]: 15, // nu
        [253]: 4,
        [254]: 4,
        [255]: 4,
        [256]: 4,
        [257]: 6,
        [258]: 6,
        [259]: 6,
        [260]: 11,
        [261]: 14,
        [262]: 4,
        [263]: 6,
        [264]: 6,
        [265]: 4,
        [266]: 14,
        [267]: 14,
        [268]: 14,
        [269]: 14,
        [270]: 4,
        [271]: 0,
        [272]: 4,
        [273]: 0,
        [274]: 7,
        [275]: 4,
        [276]: 4,
        [277]: 0, // doomed
        [278]: 4,
        [279]: 4,
        [280]: 4,
        [281]: 6,
        [282]: 0,
        [283]: 4,
        [284]: 4,
        [285]: 6,
        [286]: 4,
        [287]: 7,
        [288]: 6,
        [289]: 5,
        [290]: 15,
        [291]: 14, // doomed gloves
        [292]: 14,
        [293]: 14,
        [294]: 14,
        [295]: 14,
        [296]: 4,
        [297]: 4,
        [298]: 4,
        [299]: 11,
        [300]: 4,
        [301]: 4,
        [302]: 4,
        [303]: 14,
        [304]: 14,
        [305]: 4,
        [306]: 6,
        [307]: 6,
        [308]: 4,
        [309]: 14,
        [310]: 14, // doomed
        [311]: 14,
        [312]: 14,
        [313]: 0,
        [314]: 4,
        [315]: 4,
        [316]: 4,
        [317]: 4,
        [318]: 11,
        [319]: 11,
        [320]: 4,
        [321]: 4,
        [322]: 4,
        [323]: 0,
        [324]: 4,
        [325]: 0,
        [326]: 6,
        [327]: 5,
        [328]: 4,
        [329]: 4,
        [330]: 4,
        [331]: 6,
        [332]: 6,
        [333]: 0, // doomed
        [334]: 0,
        [335]: 8,
        [336]: 4,
        [337]: 11,
        [338]: 14,
        [339]: 14,
        [340]: 14,
        [341]: 4,
        [342]: 4,
        [343]: 4,
        [344]: 14,
        [345]: 0,
        [346]: 11,
        [347]: 11,
        [348]: 4,
        [349]: 4,
        [350]: 0,
        [351]: 0,
        [352]: 4,
        [353]: 4,
        [354]: 11,
        [355]: 11,
        [356]: 8,
        [357]: 5,
        [358]: 6,
        [359]: 4,
        [360]: 14,
        [361]: 4,
        [362]: 15,
        [363]: 4,
        [364]: 15, // doomed or pants
        [365]: 15,
        [366]: 15,
        [367]: 15,
        [368]: 6,
        [369]: 5,
        [370]: 6,
        [371]: 4,
        [372]: 7,
        [373]: 14,
        [374]: 14,
        [375]: 11,
        [376]: 0,
        [377]: 0,
        [378]: 6,
        [379]: 4,
        [380]: 4,
        [381]: 14,
        [382]: 0,
        [383]: 0,
        [384]: 4,
        [385]: 6,
        [386]: 4,
        [387]: 14,
        [388]: 4,
        [389]: 4,
        [390]: 14,
        [391]: 14,
        [392]: 0,
        [393]: 6,
        [394]: 5,
        [395]: 6,
        [396]: 5,
        [397]: 0, // doomed
        [398]: 6,
        [399]: 5,
        [400]: 6,
        [401]: 6,
        [402]: 4,
        [403]: 14,
        [404]: 5,
        [405]: 5,
        [406]: 0,
        [407]: 5,
        [408]: 4,
        [409]: 14,
        [410]: 6,
        [411]: 6,
        [412]: 5,
        [413]: 6,
        [414]: 14,
        [415]: 15,
        [416]: 6,
        [417]: 15,
        [418]: 0,
        [419]: 0, // Needs an undershirt
        [420]: 0, // Needs an undershirt
        [421]: 14,
        [422]: 14,
        [423]: 1,
        [424]: 8,
        [425]: 0,
        [426]: 6,
        [427]: 6,
        [428]: 1,
        [429]: 0,
        [430]: 0,
        [431]: 1,
        [432]: 14,
        [433]: 14,
        [434]: 14,
        [435]: 0,
        [436]: 0,
        [437]: 1,
        [438]: 1,
        [439]: 14,
        [440]: 14,
        [441]: 1,
    },
    [-1667301416]: {
        [0]: 15,
        [1]: 5,
        [2]: 2,
        [3]: 3,
        [4]: 4,
        [5]: 4,
        [6]: 5,
        [7]: 6,
        [8]: 5,
        [9]: 0,
        [10]: 5,
        [11]: 4,
        [12]: 12,
        [13]: 4,
        [14]: 14,
        [15]: 15, // torse nu
        [16]: 15,
        [17]: 9,
        [18]: 15,
        [19]: 0,
        [20]: 5,
        [21]: 11,
        [22]: 4,
        [23]: 0,
        [24]: 5,
        [25]: 6,
        [26]: 12,
        [27]: 0, // needs pants
        [28]: 15, // under
        [29]: 15, // doomed
        [30]: 2,
        [31]: 5,
        [32]: 4,
        [33]: 4,
        [34]: 6,
        [35]: 5,
        [36]: 4,
        [37]: 4,
        [38]: 2,
        [39]: 5,
        [40]: 2,
        [41]: 5,
        [42]: 3,
        [43]: 3,
        [44]: 3,
        [45]: 3,
        [46]: 3, // need high pants
        [47]: 3, // need high pants
        [48]: 14, // need high pants
        [49]: 0,
        [50]: 3,
        [51]: 15,
        [52]: 15,
        [53]: 5,
        [54]: 5,
        [55]: 5,
        [56]: 14,
        [57]: 6,
        [58]: 5,
        [59]: 0, // pants
        [60]: 3, // maxi pants or doomed
        [61]: 3, // maxi pants or doomed
        [62]: 5, // cheveux (capuche)
        [63]: 0,
        [64]: 6,
        [65]: 6,
        [66]: 6,
        [67]: 2,
        [68]: 0,
        [69]: 5,
        [70]: 0,
        [71]: 0,
        [72]: 0,
        [73]: 14,
        [74]: 15,
        [75]: 9,
        [76]: 2,
        [77]: 0,
        [78]: 5,
        [79]: 0,
        [80]: 0,
        [81]: 0,
        [82]: 15, // nothing
        [83]: 0,
        [84]: 14,
        [85]: 14,
        [86]: 0,
        [87]: 14,
        [88]: 14,
        [89]: 5,
        [90]: 6,
        [91]: 6,
        [92]: 5,
        [93]: 5,
        [94]: 5,
        [95]: 0, // undershirt needed
        [96]: 0,
        [97]: 6,
        [98]: 0,
        [99]: 5,
        [100]: 0, // doomed
        [101]: 15,
        [102]: 14,
        [103]: 3,
        [104]: 5,
        [105]: 15,
        [106]: 6,
        [107]: 15,
        [108]: 5,
        [109]: 0,
        [110]: 1,
        [111]: 15,
        [112]: 4,
        [113]: 4,
        [114]: 4,
        [115]: 4,
        [116]: 4,
        [117]: 11,
        [118]: 4,
        [119]: 0,
        [120]: 6,
        [121]: 3,
        [122]: 3,
        [123]: 0,
        [124]: 14, // with high pants
        [125]: 14,
        [126]: 14,
        [127]: 0,
        [128]: 14,
        [129]: 14,
        [130]: 0,
        [131]: 3,
        [132]: 0,
        [133]: 5,
        [134]: 0, // doomed
        [135]: 3,
        [136]: 3,
        [137]: 7,
        [138]: 6,
        [139]: 5,
        [140]: 0,
        [141]: 0,
        [142]: 14,
        [143]: 5,
        [144]: 3,
        [145]: 3,
        [146]: 7,
        [147]: 0,
        [148]: 5,
        [149]: 0,
        [150]: 0,
        [151]: 0,
        [152]: 7,
        [153]: 5,
        [154]: 15,
        [155]: 15,
        [156]: 15,
        [157]: 15,
        [158]: 0,
        [159]: 4,
        [160]: 15,
        [161]: 9,
        [162]: 0,
        [163]: 5,
        [164]: 5,
        [165]: 0,
        [166]: 5,
        [167]: 15,
        [168]: 4,
        [169]: 4,
        [170]: 4,
        [171]: 4,
        [172]: 3,
        [173]: 4,
        [174]: 5,
        [175]: 15,
        [176]: 1,
        [177]: 4,
        [178]: 4,
        [179]: 11,
        [180]: 1,
        [181]: 15,
        [182]: 4,
        [183]: 5,
        [184]: 3,
        [185]: 6,
        [186]: 1,
        [187]: 5,
        [188]: 1,
        [189]: 1,
        [190]: 1,
        [191]: 5,
        [192]: 0,
        [193]: 5,
        [194]: 6,
        [195]: 4,
        [196]: 3,
        [197]: 1,
        [198]: 0,
        [199]: 0,
        [200]: 1,
        [201]: 1,
        [202]: 4,
        [203]: 8,
        [204]: 11,
        [205]: 2,
        [206]: 1,
        [207]: 11,
        [208]: 11,
        [209]: 11,
        [210]: 11,
        [211]: 11,
        [212]: 14,
        [213]: 1,
        [214]: 1,
        [215]: 1,
        [216]: 5,
        [217]: 4,
        [218]: 4,
        [219]: 4,
        [220]: 15,
        [221]: 4,
        [222]: 4,
        [223]: 4,
        [224]: 14,
        [225]: 4,
        [226]: 11,
        [227]: 1,
        [228]: 1,
        [229]: 11,
        [230]: 1,
        [231]: 1,
        [232]: 0,
        [233]: 11,
        [234]: 7,
        [235]: 1,
        [236]: 1,
        [237]: 3,
        [238]: 3,
        [239]: 3,
        [240]: 5,
        [241]: 3,
        [242]: 6,
        [243]: 6,
        [244]: 0,
        [245]: 0,
        [246]: 0,
        [247]: 4,
        [248]: 5,
        [249]: 14,
        [250]: 14,
        [251]: 3,
        [252]: 1,
        [253]: 1,
        [254]: 8,
        [255]: 11,
        [256]: 9,
        [257]: 6,
        [258]: 0,
        [259]: 3,
        [260]: 15, // nothing
        [261]: 3,
        [262]: 7,
        [263]: 3,
        [264]: 3,
        [265]: 3,
        [266]: 3,
        [267]: 9,
        [268]: 9,
        [269]: 9,
        [270]: 5,
        [271]: 9,
        [272]: 9,
        [273]: 9,
        [274]: 3,
        [275]: 5,
        [276]: 6,
        [277]: 6,
        [278]: 6,
        [279]: 15,
        [280]: 14,
        [281]: 14,
        [282]: 3,
        [283]: 12,
        [284]: 4,
        [285]: 3,
        [286]: 14,
        [287]: 8,
        [288]: 3,
        [289]: 3,
        [290]: 0, // doomed
        [291]: 3,
        [292]: 3,
        [293]: 3,
        [294]: 9,
        [295]: 9,
        [296]: 3, // doomed
        [297]: 3,
        [298]: 3,
        [299]: 3,
        [300]: 8,
        [301]: 1,
        [302]: 11,
        [303]: 11,
        [304]: 9,
        [305]: 6,
        [306]: 6,
        [307]: 3,
        [308]: 3,
        [309]: 3,
        [310]: 9,
        [311]: 3,
        [312]: 3,
        [313]: 3,
        [314]: 5,
        [315]: 5,
        [316]: 3,
        [317]: 3,
        [318]: 9,
        [319]: 3,
        [320]: 5,
        [321]: 4,
        [322]: 11,
        [323]: 11,
        [324]: 0,
        [325]: 3,
        [326]: 3,
        [327]: 3,
        [328]: 3,
        [329]: 0,
        [330]: 0,
        [331]: 3,
        [332]: 3,
        [333]: 3,
        [334]: 11,
        [335]: 14,
        [336]: 3,
        [337]: 14,
        [338]: 14,
        [339]: 5,
        [340]: 6,
        [341]: 9,
        [342]: 11,
        [343]: 3,
        [344]: 3,
        [345]: 3,
        [346]: 3,
        [347]: 3,
        [348]: 0, // doomed
        [349]: 9,
        [350]: 9,
        [351]: 3,
        [352]: 9,
        [353]: 5,
        [354]: 6,
        [355]: 6,
        [356]: 3,
        [357]: 0,
        [358]: 0,
        [359]: 0,
        [360]: 0,
        [361]: 3,
        [362]: 3,
        [363]: 5,
        [364]: 15,
        [365]: 15,
        [366]: 3,
        [367]: 3,
        [368]: 14,
        [369]: 14,
        [370]: 3,
        [371]: 3,
        [372]: 9,
        [373]: 15,
        [374]: 9,
        [375]: 11, // doomed
        [376]: 9,
        [377]: 14,
        [378]: 3,
        [379]: 5,
        [380]: 3,
        [381]: 15,
        [382]: 3,
        [383]: 3, // doomed
        [384]: 11,
        [385]: 15,
        [386]: 11,
        [387]: 9,
        [388]: 11,
        [389]: 6,
        [390]: 3,
        [391]: 8,
        [392]: 3,
        [393]: 9,
        [394]: 3,
        [395]: 14,
        [396]: 9,
        [397]: 3,
        [398]: 3,
        [399]: 5,
        [400]: 14,
        [401]: 14,
        [402]: 3,
        [403]: 5,
        [404]: 11,
        [405]: 11,
        [406]: 7,
        [407]: 3,
        [408]: 3,
        [409]: 3,
        [410]: 3,
        [411]: 6,
        [412]: 6,
        [413]: 14,
        [414]: 14,
        [415]: 11,
        [416]: 9,
        [417]: 11,
        [418]: 9,
        [419]: 11,
        [420]: 3, // doomed
        [421]: 9,
        [422]: 11,
        [423]: 9,
        [424]: 9,
        [425]: 11,
        [426]: 3,
        [427]: 6,
        [428]: 0,
        [429]: 0,
        [430]: 14,
        [431]: 14,
        [432]: 4,
        [433]: 4,
        [434]: 4,
        [435]: 3,
        [436]: 3,
        [437]: 11,
        [438]: 11,
        [439]: 3,
        [440]: 9,
        [441]: 6,
        [442]: 15,
        [443]: 7,
        [444]: 11,
        [445]: 14,
        [446]: 11,
        [447]: 0,
        [448]: 15,
        [449]: 15,
        [450]: 6,
        [451]: 6,
        [452]: 1,
        [453]: 3,
        [454]: 0,
        [455]: 0,
        [456]: 7,
        [457]: 7,
        [458]: 3,
        [459]: 14,
        [460]: 14,
        [461]: 14,
        [462]: 7,
        [463]: 7,
        [464]: 6,
        [465]: 6,
        [466]: 14,
        [467]: 14,
        [468]: 3,
        [469]: 14,
        [470]: 6,
        [471]: 6,
        [472]: 3,
    },
};
