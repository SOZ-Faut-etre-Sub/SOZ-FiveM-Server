import { Component, Prop } from './cloth';
import { joaat } from './joaat';

export const VanillaComponentDrawableIndexMaxValue: Record<number, Record<Component, number>> = {
    [joaat('mp_m_freemode_01')]: {
        [Component.Mask]: 216,
        [Component.Hair]: 79,
        [Component.Torso]: 210,
        [Component.Legs]: 160,
        [Component.Bag]: 111,
        [Component.Shoes]: 126,
        [Component.Accessories]: 167,
        [Component.Undershirt]: 193,
        [Component.BodyArmor]: 57,
        [Component.Decals]: 146,
        [Component.Tops]: 442,
    },
    [joaat('mp_f_freemode_01')]: {
        [Component.Mask]: 217,
        [Component.Hair]: 84,
        [Component.Torso]: 244,
        [Component.Legs]: 169,
        [Component.Bag]: 111,
        [Component.Shoes]: 130,
        [Component.Accessories]: 136,
        [Component.Undershirt]: 238,
        [Component.BodyArmor]: 57,
        [Component.Decals]: 158,
        [Component.Tops]: 473,
    },
};

export const VanillaPropDrawableIndexMaxValue: Record<number, Record<Prop, number>> = {
    [joaat('mp_m_freemode_01')]: {
        [Prop.Hat]: 187,
        [Prop.Glasses]: 47,
        [Prop.Ear]: 42,
        [Prop.LeftHand]: 47,
        [Prop.RightHand]: 13,
        [Prop.Helmet]: 0,
    },
    [joaat('mp_f_freemode_01')]: {
        [Prop.Hat]: 186,
        [Prop.Glasses]: 49,
        [Prop.Ear]: 23,
        [Prop.LeftHand]: 36,
        [Prop.RightHand]: 20,
        [Prop.Helmet]: 0,
    },
};
