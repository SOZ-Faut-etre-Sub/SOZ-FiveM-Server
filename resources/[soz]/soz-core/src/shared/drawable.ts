import { Component, Prop } from './cloth';
import { joaat } from './joaat';

export const VanillaComponentDrawableIndexMaxValue: Record<number, Record<Component, number>> = {
    [joaat('mp_m_freemode_01')]: {
        [Component.Mask]: 244,
        [Component.Hair]: 82,
        [Component.Torso]: 214,
        [Component.Legs]: 202,
        [Component.Bag]: 111,
        [Component.Shoes]: 151,
        [Component.Accessories]: 192,
        [Component.Undershirt]: 213,
        [Component.BodyArmor]: 62,
        [Component.Decals]: 207,
        [Component.Tops]: 544,
    },
    [joaat('mp_f_freemode_01')]: {
        [Component.Mask]: 245,
        [Component.Hair]: 86,
        [Component.Torso]: 248,
        [Component.Legs]: 217,
        [Component.Bag]: 111,
        [Component.Shoes]: 159,
        [Component.Accessories]: 162,
        [Component.Undershirt]: 259,
        [Component.BodyArmor]: 62,
        [Component.Decals]: 223,
        [Component.Tops]: 588,
    },
};

export const VanillaPropDrawableIndexMaxValue: Record<number, Record<Prop, number>> = {
    [joaat('mp_m_freemode_01')]: {
        [Prop.Hat]: 221,
        [Prop.Glasses]: 59,
        [Prop.Ear]: 42,
        [Prop.LeftHand]: 49,
        [Prop.RightHand]: 16,
        [Prop.Helmet]: 0,
    },
    [joaat('mp_f_freemode_01')]: {
        [Prop.Hat]: 220,
        [Prop.Glasses]: 61,
        [Prop.Ear]: 23,
        [Prop.LeftHand]: 38,
        [Prop.RightHand]: 23,
        [Prop.Helmet]: 0,
    },
};
