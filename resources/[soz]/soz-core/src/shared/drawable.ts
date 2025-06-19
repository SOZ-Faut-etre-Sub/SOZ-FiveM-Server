import { Component, Prop } from './cloth';
import { joaat } from './joaat';

export const VanillaComponentDrawableIndexMaxValue: Record<number, Record<Component, number>> = {
    [joaat('mp_m_freemode_01')]: {
        [Component.Mask]: 247,
        [Component.Hair]: 83,
        [Component.Torso]: 215,
        [Component.Legs]: 222,
        [Component.Bag]: 111,
        [Component.Shoes]: 160,
        [Component.Accessories]: 201,
        [Component.Undershirt]: 216,
        [Component.BodyArmor]: 62,
        [Component.Decals]: 258,
        [Component.Tops]: 589,
    },
    [joaat('mp_f_freemode_01')]: {
        [Component.Mask]: 248,
        [Component.Hair]: 87,
        [Component.Torso]: 249,
        [Component.Legs]: 235,
        [Component.Bag]: 111,
        [Component.Shoes]: 168,
        [Component.Accessories]: 171,
        [Component.Undershirt]: 262,
        [Component.BodyArmor]: 62,
        [Component.Decals]: 275,
        [Component.Tops]: 632,
    },
};

export const VanillaPropDrawableIndexMaxValue: Record<number, Record<Prop, number>> = {
    [joaat('mp_m_freemode_01')]: {
        [Prop.Hat]: 247,
        [Prop.Glasses]: 59,
        [Prop.Ear]: 42,
        [Prop.LeftHand]: 49,
        [Prop.RightHand]: 16,
        [Prop.Helmet]: 0,
    },
    [joaat('mp_f_freemode_01')]: {
        [Prop.Hat]: 246,
        [Prop.Glasses]: 61,
        [Prop.Ear]: 23,
        [Prop.LeftHand]: 38,
        [Prop.RightHand]: 23,
        [Prop.Helmet]: 0,
    },
};
