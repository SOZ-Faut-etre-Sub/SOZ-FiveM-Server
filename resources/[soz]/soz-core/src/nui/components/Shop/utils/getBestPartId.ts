import { Component, OutfitItem, Prop } from '@public/shared/cloth';

type PartialClothes = Partial<Record<Component, OutfitItem>> | Partial<Record<Prop, OutfitItem>>;

export const getBestClothesPartId = (config: PartialClothes) =>
    Object.keys(config)
        .sort((a, b) => Number(b) - Number(a))
        .at(0);
