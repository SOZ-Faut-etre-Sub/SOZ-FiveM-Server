import { Injectable } from '../../core/decorators/injectable';
import { Component, Outfit, OutfitItem, Prop } from '../../shared/cloth';

@Injectable()
export class ClothingService {
    public applyComponent(component: Component, outfitItem: OutfitItem) {
        SetPedComponentVariation(
            PlayerPedId(),
            Number(component),
            Number(outfitItem.Drawable),
            Number(outfitItem.Texture),
            Number(outfitItem.Palette)
        );
    }

    public applyProp(prop: Prop, outfitItem: OutfitItem) {
        SetPedPropIndex(PlayerPedId(), Number(prop), outfitItem.Drawable || 0, outfitItem.Texture || 0, true);
    }

    public applyOutfit(outfit: Outfit) {
        for (const [componentIndex, component] of Object.entries(outfit.Components)) {
            this.applyComponent(Number(componentIndex), component);
        }

        for (const [propIndex, prop] of Object.entries(outfit.Props)) {
            this.applyProp(Number(propIndex), prop);
        }
    }

    public getClothSet(): Outfit {
        const components: Outfit['Components'] = {};

        for (const componentIndex of Object.keys(Component).filter(key => !isNaN(Number(key)))) {
            const componentId = Number(componentIndex);
            const drawableId = GetPedDrawableVariation(PlayerPedId(), componentId);
            const textureId = GetPedTextureVariation(PlayerPedId(), componentId);

            components[componentIndex] = {
                Drawable: drawableId,
                Texture: textureId,
                Palette: 0,
            };
        }

        const props: Outfit['Props'] = {};
        for (const propIndex of Object.values(Prop).filter(key => !isNaN(Number(key)))) {
            const propId = Number(propIndex);
            const drawableId = GetPedPropIndex(PlayerPedId(), propId);
            const textureId = GetPedPropTextureIndex(PlayerPedId(), propId);

            props[propIndex] = {
                Drawable: drawableId,
                Texture: textureId,
            };
        }

        return {
            Components: components,
            Props: props,
        };
    }

    public getMaxOptions() {
        const maxOptions = [];
        for (const componentIndex of Object.values(Component).filter(key => !isNaN(Number(key)) && key !== '7')) {
            const componentId = Number(componentIndex);
            const maxDrawable = GetNumberOfPedDrawableVariations(PlayerPedId(), componentId);
            maxOptions.push({
                componentIndex: componentIndex,
                maxDrawables: maxDrawable,
            });
        }

        for (const propIndex of Object.values(Prop).filter(key => !isNaN(Number(key)))) {
            const propId = Number(propIndex);
            const maxDrawable = GetNumberOfPedPropDrawableVariations(PlayerPedId(), propId);
            maxOptions.push({
                propIndex: propIndex,
                maxDrawables: maxDrawable,
            });
        }

        return maxOptions;
    }
}
