import { Injectable } from '../../core/decorators/injectable';
import { ClothComponent, ClothConfig, ClothProp, ComponentIndex, PropIndex } from '../../shared/clothing';

@Injectable()
export class ClothingService {
    public applyComponent(componentIndex: ComponentIndex, component: ClothComponent) {
        SetPedComponentVariation(
            PlayerPedId(),
            componentIndex,
            component.drawableId,
            component.textureId,
            component.paletteId
        );
    }

    public applyProp(propIndex: PropIndex, prop: ClothProp) {
        SetPedPropIndex(PlayerPedId(), propIndex, prop.drawableId, prop.textureId, prop.attach || true);
    }

    public applyClothes(skin: ClothConfig) {
        for (const [componentIndex, component] of Object.entries(skin.components)) {
            this.applyComponent(Number(componentIndex), component);
        }

        for (const [propIndex, prop] of Object.entries(skin.props)) {
            this.applyProp(Number(propIndex), prop);
        }
    }

    public getClothing(): ClothConfig {
        const components: ClothConfig['components'] = {};

        for (const componentIndex of Object.keys(ComponentIndex).filter(key => !isNaN(Number(key)) && key !== '7')) {
            const componentId = Number(ComponentIndex[componentIndex]);
            const drawableId = GetPedDrawableVariation(PlayerPedId(), componentId);
            const textureId = GetPedTextureVariation(PlayerPedId(), componentId);
            const paletteId = GetPedPaletteVariation(PlayerPedId(), componentId);

            components[componentIndex] = {
                drawableId,
                textureId,
                paletteId,
            };
        }

        const props: ClothConfig['props'] = {};
        for (const propIndex of Object.values(PropIndex)) {
            const propId = PropIndex[propIndex];
            const drawableId = GetPedPropIndex(PlayerPedId(), propId);
            const textureId = GetPedPropTextureIndex(PlayerPedId(), propId);

            props[propIndex] = {
                drawableId,
                textureId,
            };
        }

        return {
            components,
            props,
        };
    }
}
