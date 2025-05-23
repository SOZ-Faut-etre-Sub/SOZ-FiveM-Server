import { Component, Prop } from './cloth';
import { joaat } from './joaat';

export const VanillaComponentDrawableIndexMaxValue: Record<number, Record<Component, number>> = {
    [joaat('mp_m_freemode_01')]: {
        [Component.Mask]: 245,
        [Component.Hair]: 83,
        [Component.Torso]: 214,
        [Component.Legs]: 216,
        [Component.Bag]: 111,
        [Component.Shoes]: 156,
        [Component.Accessories]: 199,
        [Component.Undershirt]: 215,
        [Component.BodyArmor]: 62,
        [Component.Decals]: 245,
        [Component.Tops]: 575,
    },
    [joaat('mp_f_freemode_01')]: {
        [Component.Mask]: 246,
        [Component.Hair]: 87,
        [Component.Torso]: 248,
        [Component.Legs]: 229,
        [Component.Bag]: 111,
        [Component.Shoes]: 164,
        [Component.Accessories]: 169,
        [Component.Undershirt]: 261,
        [Component.BodyArmor]: 62,
        [Component.Decals]: 261,
        [Component.Tops]: 618,
    },
};

export const VanillaPropDrawableIndexMaxValue: Record<number, Record<Prop, number>> = {
    [joaat('mp_m_freemode_01')]: {
        [Prop.Hat]: 238,
        [Prop.Glasses]: 59,
        [Prop.Ear]: 42,
        [Prop.LeftHand]: 49,
        [Prop.RightHand]: 16,
        [Prop.Helmet]: 0,
    },
    [joaat('mp_f_freemode_01')]: {
        [Prop.Hat]: 237,
        [Prop.Glasses]: 61,
        [Prop.Ear]: 23,
        [Prop.LeftHand]: 38,
        [Prop.RightHand]: 23,
        [Prop.Helmet]: 0,
    },
};
