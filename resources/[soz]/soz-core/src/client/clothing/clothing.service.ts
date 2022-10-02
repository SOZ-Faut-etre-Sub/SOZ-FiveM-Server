import { Injectable } from '../../core/decorators/injectable';
import { ClothComponent, ClothProp, ClothSet, ComponentIndex, PropIndex } from '../../shared/clothing';

@Injectable()
export class ClothingService {
    public applyComponent(componentIndex: ComponentIndex, component: ClothComponent) {
        let componentId = Number(componentIndex);
        if (isNaN(componentId)) {
            componentId = Number(ComponentIndex[componentIndex]);
        }

        SetPedComponentVariation(
            PlayerPedId(),
            componentId,
            component.Drawable || 0,
            component.Texture || 0,
            component.Palette || 0
        );
    }

    public applyProp(propIndex: PropIndex, prop: ClothProp) {
        let propId = Number(propIndex);
        if (isNaN(propId)) {
            propId = Number(PropIndex[propIndex]);
        }

        SetPedPropIndex(PlayerPedId(), propId, prop.Drawable || 0, prop.Texture || 0, prop.Attached || true);
    }

    public applyClothes(skin: ClothSet) {
        for (const [componentIndex, component] of Object.entries(skin.Components)) {
            this.applyComponent(Number(componentIndex), component);
        }

        for (const [propIndex, prop] of Object.entries(skin.Props)) {
            this.applyProp(Number(propIndex), prop);
        }
    }

    public getClothSet(): ClothSet {
        const components: ClothSet['Components'] = {};

        for (const componentIndex of Object.keys(ComponentIndex).filter(key => !isNaN(Number(key)))) {
            const componentId = Number(componentIndex);
            const drawableId = GetPedDrawableVariation(PlayerPedId(), componentId);
            const textureId = GetPedTextureVariation(PlayerPedId(), componentId);

            components[componentIndex] = {
                Drawable: drawableId,
                Texture: textureId,
                Palette: 0,
            };
        }

        const props: ClothSet['Props'] = {};
        for (const propIndex of Object.values(PropIndex).filter(key => !isNaN(Number(key)))) {
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
        for (const componentIndex of Object.values(ComponentIndex).filter(key => !isNaN(Number(key)) && key !== '7')) {
            const componentId = Number(componentIndex);
            const maxDrawable = GetNumberOfPedDrawableVariations(PlayerPedId(), componentId);
            maxOptions.push({
                componentIndex: componentIndex,
                maxDrawables: maxDrawable,
            });
        }

        for (const propIndex of Object.values(PropIndex).filter(key => !isNaN(Number(key)))) {
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
