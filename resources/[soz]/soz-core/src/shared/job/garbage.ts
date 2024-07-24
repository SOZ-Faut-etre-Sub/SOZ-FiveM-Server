import { WardrobeConfig } from '../cloth';
import { getLocationHash } from '../locationhash';
import { Vector3 } from '../polyzone/vector';

export const GarbageCloakroom: WardrobeConfig = {
    [GetHashKey('mp_m_freemode_01')]: {
        ['Essai']: {
            Components: {
                [3]: { Drawable: 39, Texture: 0, Palette: 0 },
                [4]: { Drawable: 98, Texture: 11, Palette: 0 },
                [5]: { Drawable: 82, Texture: 0, Palette: 0 },
                [6]: { Drawable: 71, Texture: 11, Palette: 0 },
                [8]: { Drawable: 15, Texture: 0, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 251, Texture: 11, Palette: 0 },
            },
            Props: {},
        },
        ['Junior']: {
            Components: {
                [3]: { Drawable: 39, Texture: 0, Palette: 0 },
                [4]: { Drawable: 98, Texture: 8, Palette: 0 },
                [5]: { Drawable: 82, Texture: 0, Palette: 0 },
                [6]: { Drawable: 71, Texture: 8, Palette: 0 },
                [8]: { Drawable: 15, Texture: 0, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 251, Texture: 8, Palette: 0 },
            },
            Props: {},
        },
        ['Senior']: {
            Components: {
                [3]: { Drawable: 39, Texture: 0, Palette: 0 },
                [4]: { Drawable: 98, Texture: 8, Palette: 0 },
                [5]: { Drawable: 82, Texture: 0, Palette: 0 },
                [6]: { Drawable: 71, Texture: 8, Palette: 0 },
                [8]: { Drawable: 15, Texture: 0, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 248, Texture: 4, Palette: 0 },
            },
            Props: {},
        },
        ['Référent']: {
            Components: {
                [3]: { Drawable: 39, Texture: 0, Palette: 0 },
                [4]: { Drawable: 86, Texture: 0, Palette: 0 },
                [5]: { Drawable: 82, Texture: 0, Palette: 0 },
                [6]: { Drawable: 82, Texture: 0, Palette: 0 },
                [8]: { Drawable: 0, Texture: 24, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 220, Texture: 0, Palette: 0 },
            },
            Props: {},
        },
        ['BurnBird']: {
            Components: {
                [1]: { Drawable: 107, Texture: 10, Palette: 0 },
                [3]: { Drawable: 5, Texture: 0, Palette: 0 },
                [4]: { Drawable: 88, Texture: 10, Palette: 0 },
                [5]: { Drawable: 82, Texture: 1, Palette: 0 },
                [6]: { Drawable: 32, Texture: 8, Palette: 0 },
                [8]: { Drawable: 14, Texture: 0, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 247, Texture: 13, Palette: 0 },
            },
            Props: {
                Helmet: { Drawable: 75, Texture: 13, Palette: 0 },
            },
            GlovesID: 56032,
        },
    },
    [GetHashKey('mp_f_freemode_01')]: {
        ['Essai']: {
            Components: {
                [3]: { Drawable: 33, Texture: 0, Palette: 0 },
                [4]: { Drawable: 101, Texture: 11, Palette: 0 },
                [5]: { Drawable: 82, Texture: 0, Palette: 0 },
                [6]: { Drawable: 74, Texture: 11, Palette: 0 },
                [8]: { Drawable: 0, Texture: 0, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 259, Texture: 11, Palette: 0 },
            },
            Props: {},
        },
        ['Junior']: {
            Components: {
                [3]: { Drawable: 33, Texture: 0, Palette: 0 },
                [4]: { Drawable: 101, Texture: 8, Palette: 0 },
                [5]: { Drawable: 82, Texture: 0, Palette: 0 },
                [6]: { Drawable: 74, Texture: 8, Palette: 0 },
                [8]: { Drawable: 0, Texture: 0, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 259, Texture: 8, Palette: 0 },
            },
            Props: {},
        },
        ['Senior']: {
            Components: {
                [3]: { Drawable: 33, Texture: 0, Palette: 0 },
                [4]: { Drawable: 101, Texture: 8, Palette: 0 },
                [5]: { Drawable: 82, Texture: 0, Palette: 0 },
                [6]: { Drawable: 74, Texture: 8, Palette: 0 },
                [8]: { Drawable: 2, Texture: 0, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 256, Texture: 4, Palette: 0 },
            },
            Props: {},
        },
        ['Référent']: {
            Components: {
                [3]: { Drawable: 33, Texture: 0, Palette: 0 },
                [4]: { Drawable: 89, Texture: 0, Palette: 0 },
                [5]: { Drawable: 82, Texture: 0, Palette: 0 },
                [6]: { Drawable: 25, Texture: 0, Palette: 0 },
                [8]: { Drawable: 0, Texture: 24, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 230, Texture: 0, Palette: 0 },
            },
            Props: {},
        },
        ['BurnBird']: {
            Components: {
                [1]: { Drawable: 107, Texture: 10, Palette: 0 },
                [3]: { Drawable: 11, Texture: 0, Palette: 0 },
                [4]: { Drawable: 91, Texture: 10, Palette: 0 },
                [5]: { Drawable: 82, Texture: 1, Palette: 0 },
                [6]: { Drawable: 60, Texture: 2, Palette: 0 },
                [8]: { Drawable: 14, Texture: 0, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 255, Texture: 13, Palette: 0 },
            },
            Props: {
                Helmet: { Drawable: 74, Texture: 13, Palette: 0 },
            },
            GlovesID: 55032,
        },
    },
};

export function computeBinId(entity: number) {
    const coords = GetEntityCoords(entity) as Vector3;
    const coordsHash = getLocationHash(coords);
    const id = 'bin_' + coordsHash;

    return id;
}
