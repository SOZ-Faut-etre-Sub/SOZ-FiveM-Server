import { Component, Prop } from './cloth';
import { joaat } from './joaat';

export const VanillaComponentDrawableIndexMaxValue: Record<number, Record<Component, number>> = {
    [joaat('mp_m_freemode_01')]: {
        [Component.Mask]: 238,
        [Component.Hair]: 82,
        [Component.Torso]: 214,
        [Component.Legs]: 193,
        [Component.Bag]: 111,
        [Component.Shoes]: 145,
        [Component.Accessories]: 178,
        [Component.Undershirt]: 207,
        [Component.BodyArmor]: 62,
        [Component.Decals]: 193,
        [Component.Tops]: 524,
    },
    [joaat('mp_f_freemode_01')]: {
        [Component.Mask]: 238,
        [Component.Hair]: 86,
        [Component.Torso]: 248,
        [Component.Legs]: 207,
        [Component.Bag]: 111,
        [Component.Shoes]: 154,
        [Component.Accessories]: 148,
        [Component.Undershirt]: 253,
        [Component.BodyArmor]: 62,
        [Component.Decals]: 209,
        [Component.Tops]: 565,
    },
};

export const VanillaPropDrawableIndexMaxValue: Record<number, Record<Prop, number>> = {
    [joaat('mp_m_freemode_01')]: {
        [Prop.Hat]: 214,
        [Prop.Glasses]: 56,
        [Prop.Ear]: 42,
        [Prop.LeftHand]: 47,
        [Prop.RightHand]: 14,
        [Prop.Helmet]: 0,
    },
    [joaat('mp_f_freemode_01')]: {
        [Prop.Hat]: 213,
        [Prop.Glasses]: 58,
        [Prop.Ear]: 23,
        [Prop.LeftHand]: 36,
        [Prop.RightHand]: 21,
        [Prop.Helmet]: 0,
    },
};
