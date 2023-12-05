import { Component, Prop } from './cloth';
import { joaat } from './joaat';

export const VanillaComponentDrawableIndexMaxValue: Record<number, Record<Component, number>> = {
    [joaat('mp_m_freemode_01')]: {
        [Component.Mask]: 226,
        [Component.Hair]: 81,
        [Component.Torso]: 211,
        [Component.Legs]: 177,
        [Component.Bag]: 111,
        [Component.Shoes]: 135,
        [Component.Accessories]: 175,
        [Component.Undershirt]: 199,
        [Component.BodyArmor]: 58,
        [Component.Decals]: 174,
        [Component.Tops]: 495,
    },
    [joaat('mp_f_freemode_01')]: {
        [Component.Mask]: 227,
        [Component.Hair]: 85,
        [Component.Torso]: 245,
        [Component.Legs]: 191,
        [Component.Bag]: 111,
        [Component.Shoes]: 142,
        [Component.Accessories]: 145,
        [Component.Undershirt]: 245,
        [Component.BodyArmor]: 58,
        [Component.Decals]: 191,
        [Component.Tops]: 534,
    },
};

export const VanillaPropDrawableIndexMaxValue: Record<number, Record<Prop, number>> = {
    [joaat('mp_m_freemode_01')]: {
        [Prop.Hat]: 195,
        [Prop.Glasses]: 53,
        [Prop.Ear]: 42,
        [Prop.LeftHand]: 47,
        [Prop.RightHand]: 14,
        [Prop.Helmet]: 0,
    },
    [joaat('mp_f_freemode_01')]: {
        [Prop.Hat]: 194,
        [Prop.Glasses]: 55,
        [Prop.Ear]: 23,
        [Prop.LeftHand]: 36,
        [Prop.RightHand]: 21,
        [Prop.Helmet]: 0,
    },
};
