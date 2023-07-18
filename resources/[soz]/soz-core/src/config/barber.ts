import { PlayerPedHash } from '@public/shared/player';
import { BarberShopContent } from '@public/shared/shop';

export const PositionInBarberShop = {
    PLAYER_HEADING: 199.156,
    CAMERA_OFFSET_X: 0.0,
    CAMERA_OFFSET_Y: -0.5,
    CAMERA_OFFSET_Z: 0.7,
    CAMERA_TARGET_Z: 0.7,
};

export const BarberShopItems: BarberShopContent = {
    [PlayerPedHash.Male]: [
        {
            price: 30,
            category: 'Hair',
            label: 'Cheveux',
            overlay: 'Hair',
            components: { ['HairType']: true, ['HairColor']: true, ['HairSecondaryColor']: true },
            items: undefined,
        },
        {
            price: 15,
            category: 'Beard',
            label: 'Barbe',
            overlay: 'Hair',
            components: { ['BeardType']: true, ['BeardColor']: true, ['BeardOpacity']: true },
            items: undefined,
        },
        {
            price: 20,
            category: 'Makeup',
            label: 'Maquillage',
            overlay: 'Makeup',
            components: {
                ['FullMakeupType']: true,
                ['FullMakeupDefaultColor']: true,
                ['FullMakeupPrimaryColor']: true,
                ['FullMakeupSecondaryColor']: true,
                ['FullMakeupOpacity']: true,
            },
            items: undefined,
        },
    ],
    [PlayerPedHash.Female]: [
        {
            price: 30,
            category: 'Hair',
            label: 'Cheveux',
            overlay: 'Hair',
            components: { ['HairType']: true, ['HairColor']: true, ['HairSecondaryColor']: true },
            items: undefined,
        },
        {
            price: 15,
            category: 'Blush',
            label: 'Blush',
            overlay: 'Makeup',
            components: { ['BlushType']: true, ['BlushColor']: true, ['BlushOpacity']: true },
            items: undefined,
        },
        {
            price: 15,
            category: 'Lipstick',
            label: 'Rouge à lèvre',
            overlay: 'Makeup',
            components: { ['LipstickType']: true, ['LipstickColor']: true, ['LipstickOpacity']: true },
            items: undefined,
        },
        {
            price: 20,
            category: 'Makeup',
            label: 'Maquillage',
            overlay: 'Makeup',
            components: {
                ['FullMakeupType']: true,
                ['FullMakeupDefaultColor']: true,
                ['FullMakeupPrimaryColor']: true,
                ['FullMakeupSecondaryColor']: true,
                ['FullMakeupOpacity']: true,
            },
            items: undefined,
        },
    ],
};
