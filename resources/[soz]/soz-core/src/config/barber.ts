import { BarberShopContent } from '@public/shared/shop';

export const BarberShopItems: BarberShopContent = {
    [1885233650]: [
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
    [-1667301416]: [
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
