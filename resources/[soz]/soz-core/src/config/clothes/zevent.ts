import { WardrobeConfig } from '../../shared/cloth';
import { PlayerPedHash } from '../../shared/player';

export const ZEventClothes: WardrobeConfig = {
    [PlayerPedHash.Male]: {
        zevent2022_tshirt: {
            Components: {
                [3]: { Drawable: 0, Texture: 0, Palette: 0 },
                [8]: { Drawable: 15, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 44, Texture: 1, Palette: 0 },
            },
            Props: {},
        },
        zevent2024_tshirt: {
            Components: {
                [3]: { Drawable: 0, Texture: 0, Palette: 0 },
                [8]: { Drawable: 15, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: {
                    Drawable: 0,
                    Texture: 0,
                    Palette: 0,
                    Collection: 'soz_custom',
                },
            },
            Props: {},
        },
        zevent2024_tshirt_collector: {
            Components: {
                [3]: { Drawable: 0, Texture: 0, Palette: 0 },
                [8]: { Drawable: 15, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: {
                    Drawable: 0,
                    Texture: 2,
                    Palette: 0,
                    Collection: 'soz_custom',
                },
            },
            Props: {},
        },
        zevent2025_tshirt: {
            Components: {
                [3]: { Drawable: 0, Texture: 0, Palette: 0 },
                [8]: { Drawable: 15, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: {
                    Drawable: 0,
                    Texture: 3,
                    Palette: 0,
                    Collection: 'soz_custom',
                },
            },
            Props: {},
        },
        zevent2025_tshirt_collector: {
            Components: {
                [3]: { Drawable: 0, Texture: 0, Palette: 0 },
                [8]: { Drawable: 15, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: {
                    Drawable: 0,
                    Texture: 4,
                    Palette: 0,
                    Collection: 'soz_custom',
                },
            },
            Props: {},
        },
    },
    [PlayerPedHash.Female]: {
        zevent2022_tshirt: {
            Components: {
                [3]: { Drawable: 14, Texture: 0, Palette: 0 },
                [8]: { Drawable: 14, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 335, Texture: 19, Palette: 0 },
            },
            Props: {},
        },
        zevent2024_tshirt: {
            Components: {
                [3]: { Drawable: 14, Texture: 0, Palette: 0 },
                [8]: { Drawable: 14, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: {
                    Drawable: 10,
                    Texture: 0,
                    Palette: 0,
                    Collection: 'soz_custom',
                },
            },
            Props: {},
        },
        zevent2024_tshirt_collector: {
            Components: {
                [3]: { Drawable: 14, Texture: 0, Palette: 0 },
                [8]: { Drawable: 14, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: {
                    Drawable: 10,
                    Texture: 2,
                    Palette: 0,
                    Collection: 'soz_custom',
                },
            },
            Props: {},
        },
        zevent2025_tshirt: {
            Components: {
                [3]: { Drawable: 14, Texture: 0, Palette: 0 },
                [8]: { Drawable: 14, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: {
                    Drawable: 10,
                    Texture: 3,
                    Palette: 0,
                    Collection: 'soz_custom',
                },
            },
            Props: {},
        },
        zevent2025_tshirt_collector: {
            Components: {
                [3]: { Drawable: 14, Texture: 0, Palette: 0 },
                [8]: { Drawable: 14, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: {
                    Drawable: 10,
                    Texture: 4,
                    Palette: 0,
                    Collection: 'soz_custom',
                },
            },
            Props: {},
        },
    },
};
