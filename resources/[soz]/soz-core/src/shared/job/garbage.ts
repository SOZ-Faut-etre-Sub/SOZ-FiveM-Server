import { joaat } from '@public/shared/joaat';

import { WardrobeConfig } from '../cloth';
import { getLocationHash } from '../locationhash';
import { Vector3 } from '../polyzone/vector';

export const BIN_MODELS = [joaat('soz_prop_bb_bin'), joaat('soz_prop_bb_bin_hs2'), joaat('soz_prop_bb_bin_hs3')];

export const GarbageCloakroom: WardrobeConfig = {
    [GetHashKey('mp_m_freemode_01')]: {
        ['Poussin']: {
            Components: {
                [3]: { Drawable: 4, Texture: 0, Palette: 0 },
                [4]: { Drawable: 98, Texture: 0, Palette: 0 },
                [5]: { Drawable: 82, Texture: 2, Palette: 0 },
                [6]: { Drawable: 71, Texture: 0, Palette: 0 },
                [8]: { Drawable: 15, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 251, Texture: 0, Palette: 0 },
            },
            Props: {},
            GlovesID: 56048,
        },
        ['Apprenti Collecteur']: {
            Components: {
                [3]: { Drawable: 4, Texture: 0, Palette: 0 },
                [4]: { Drawable: 98, Texture: 12, Palette: 0 },
                [5]: { Drawable: 44, Texture: 0, Palette: 0 },
                [6]: { Drawable: 71, Texture: 13, Palette: 0 },
                [8]: { Drawable: 15, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 251, Texture: 12, Palette: 0 },
            },
            Props: {},
            GlovesID: 56048,
        },
        ['Technicien en Salubrité']: {
            Components: {
                [3]: { Drawable: 39, Texture: 0, Palette: 0 },
                [4]: { Drawable: 98, Texture: 8, Palette: 0 },
                [5]: { Drawable: 82, Texture: 0, Palette: 0 },
                [6]: { Drawable: 71, Texture: 8, Palette: 0 },
                [8]: { Drawable: 15, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 251, Texture: 8, Palette: 0 },
            },
            Props: {},
        },
        ['Éboueur Chevronné']: {
            Components: {
                [3]: { Drawable: 39, Texture: 0, Palette: 0 },
                [4]: { Drawable: 98, Texture: 8, Palette: 0 },
                [5]: { Drawable: 82, Texture: 0, Palette: 0 },
                [6]: { Drawable: 71, Texture: 8, Palette: 0 },
                [8]: { Drawable: 15, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 248, Texture: 4, Palette: 0 },
            },
            Props: {},
        },
        ['Expert Recycleur']: {
            Components: {
                [3]: { Drawable: 39, Texture: 0, Palette: 0 },
                [4]: { Drawable: 86, Texture: 0, Palette: 0 },
                [5]: { Drawable: 82, Texture: 0, Palette: 0 },
                [6]: { Drawable: 82, Texture: 0, Palette: 0 },
                [8]: { Drawable: 0, Texture: 24, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 220, Texture: 0, Palette: 0 },
            },
            Props: {},
        },
        ['Opérateur des Déchets']: {
            Components: {
                [3]: { Drawable: 4, Texture: 0, Palette: 0 },
                [4]: { Drawable: 86, Texture: 10, Palette: 0 },
                [5]: { Drawable: 44, Texture: 0, Palette: 0 },
                [6]: { Drawable: 71, Texture: 19, Palette: 0 },
                [8]: { Drawable: 15, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 324, Texture: 10, Palette: 0 },
            },
            Props: {},
            GlovesID: 56048,
        },
        ['Direction']: {
            Components: {
                [3]: { Drawable: 5, Texture: 0, Palette: 0 },
                [4]: { Drawable: 98, Texture: 19, Palette: 0 },
                [5]: { Drawable: 44, Texture: 0, Palette: 0 },
                [6]: { Drawable: 71, Texture: 19, Palette: 0 },
                [8]: { Drawable: 15, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 244, Texture: 3, Palette: 0 },
            },
            Props: {},
            GlovesID: 56048,
        },
        ['Été']: {
            Components: {
                [1]: { Drawable: 107, Texture: 10, Palette: 0 },
                [3]: { Drawable: 5, Texture: 0, Palette: 0 },
                [4]: { Drawable: 88, Texture: 10, Palette: 0 },
                [5]: { Drawable: 44, Texture: 0, Palette: 0 },
                [6]: { Drawable: 59, Texture: 10, Palette: 0 },
                [8]: { Drawable: 15, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 239, Texture: 10, Palette: 0 },
            },
            Props: {},
            GlovesID: 56032,
        },
    },
    [GetHashKey('mp_f_freemode_01')]: {
        ['Poussinne']: {
            Components: {
                [3]: { Drawable: 3, Texture: 0, Palette: 0 },
                [4]: { Drawable: 101, Texture: 0, Palette: 0 },
                [5]: { Drawable: 82, Texture: 2, Palette: 0 },
                [6]: { Drawable: 74, Texture: 0, Palette: 0 },
                [8]: { Drawable: 14, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 259, Texture: 0, Palette: 0 },
            },
            Props: {},
            GlovesID: 55048,
        },
        ['Apprentie Collectrice']: {
            Components: {
                [3]: { Drawable: 3, Texture: 0, Palette: 0 },
                [4]: { Drawable: 101, Texture: 12, Palette: 0 },
                [5]: { Drawable: 44, Texture: 0, Palette: 0 },
                [6]: { Drawable: 74, Texture: 13, Palette: 0 },
                [8]: { Drawable: 14, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 259, Texture: 13, Palette: 0 },
            },
            Props: {},
            GlovesID: 55048,
        },
        ['Technicienne en Salubrité']: {
            Components: {
                [3]: { Drawable: 33, Texture: 0, Palette: 0 },
                [4]: { Drawable: 101, Texture: 8, Palette: 0 },
                [5]: { Drawable: 82, Texture: 0, Palette: 0 },
                [6]: { Drawable: 74, Texture: 8, Palette: 0 },
                [8]: { Drawable: 14, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 259, Texture: 8, Palette: 0 },
            },
            Props: {},
        },
        ['Éboueuse Chevronnée']: {
            Components: {
                [3]: { Drawable: 33, Texture: 0, Palette: 0 },
                [4]: { Drawable: 101, Texture: 8, Palette: 0 },
                [5]: { Drawable: 82, Texture: 0, Palette: 0 },
                [6]: { Drawable: 74, Texture: 8, Palette: 0 },
                [8]: { Drawable: 14, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 256, Texture: 4, Palette: 0 },
            },
            Props: {},
        },
        ['Experte Recycleuse']: {
            Components: {
                [3]: { Drawable: 33, Texture: 0, Palette: 0 },
                [4]: { Drawable: 89, Texture: 0, Palette: 0 },
                [5]: { Drawable: 82, Texture: 0, Palette: 0 },
                [6]: { Drawable: 25, Texture: 0, Palette: 0 },
                [8]: { Drawable: 14, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 230, Texture: 0, Palette: 0 },
            },
            Props: {},
        },
        ['Opératrice des Déchets']: {
            Components: {
                [3]: { Drawable: 3, Texture: 0, Palette: 0 },
                [4]: { Drawable: 89, Texture: 10, Palette: 0 },
                [5]: { Drawable: 44, Texture: 0, Palette: 0 },
                [6]: { Drawable: 74, Texture: 19, Palette: 0 },
                [8]: { Drawable: 14, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 336, Texture: 10, Palette: 0 },
            },
            Props: {},
            GlovesID: 55048,
        },
        ['Direction']: {
            Components: {
                [3]: { Drawable: 1, Texture: 0, Palette: 0 },
                [4]: { Drawable: 101, Texture: 19, Palette: 0 },
                [5]: { Drawable: 44, Texture: 0, Palette: 0 },
                [6]: { Drawable: 74, Texture: 19, Palette: 0 },
                [8]: { Drawable: 14, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 252, Texture: 3, Palette: 0 },
            },
            Props: {},
            GlovesID: 55048,
        },
        ['Été']: {
            Components: {
                [1]: { Drawable: 107, Texture: 16, Palette: 0 },
                [3]: { Drawable: 11, Texture: 0, Palette: 0 },
                [4]: { Drawable: 91, Texture: 10, Palette: 0 },
                [5]: { Drawable: 44, Texture: 0, Palette: 0 },
                [6]: { Drawable: 62, Texture: 10, Palette: 0 },
                [8]: { Drawable: 14, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 226, Texture: 10, Palette: 0 },
            },
            Props: {},
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
