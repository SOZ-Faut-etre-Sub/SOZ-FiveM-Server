import { Inject, Injectable } from '../../core/decorators/injectable';
import { Component, ComponentEnum, FfsComponent, KeepHairWithMask, Outfit, OutfitItem, Prop } from '../../shared/cloth';
import { ffsClothConfig } from '../../shared/FightForStyleShowRoom/ffsClothConfig';
import { PlayerService } from '../player/player.service';

@Injectable()
export class ClothingService {
    @Inject(PlayerService)
    public playerService: PlayerService;

    public applyComponentToPed(pedId: number, component: Component, outfitItem: OutfitItem) {
        SetPedComponentVariation(
            pedId,
            Number(component),
            Number(outfitItem.Drawable),
            Number(outfitItem.Texture),
            Number(outfitItem.Palette)
        );
    }

    public applyComponent(component: Component, outfitItem: OutfitItem) {
        this.applyComponentToPed(PlayerPedId(), component, outfitItem);
    }

    public displayHairWithMask(maskDrawable: number): boolean {
        return maskDrawable < 103 || KeepHairWithMask[maskDrawable];
    }

    public applyPropToPed(pedId: number, prop: Prop, outfitItem: OutfitItem) {
        if (outfitItem.Clear) {
            ClearPedProp(pedId, Number(prop));
        } else {
            SetPedPropIndex(pedId, Number(prop), outfitItem.Drawable || 0, outfitItem.Texture || 0, true);
        }
    }

    public applyProp(prop: Prop, outfitItem: OutfitItem) {
        this.applyPropToPed(PlayerPedId(), prop, outfitItem);
    }

    public applyOutfit(outfit: Outfit) {
        for (const [componentIndex, component] of Object.entries(outfit.Components)) {
            this.applyComponent(Number(componentIndex), component);

            if (Number(componentIndex) == Component.Mask) {
                let hair = 0;
                if (this.displayHairWithMask(component.Drawable)) {
                    hair = this.playerService.getPlayer().skin.Hair.HairType;
                }
                SetPedComponentVariation(PlayerPedId(), Component.Hair, hair, 0, 0);
            }
        }

        for (const [propIndex, prop] of Object.entries(outfit.Props)) {
            this.applyProp(Number(propIndex), prop);
        }
    }

    public getClothSet(): Outfit {
        return this.getClothSetForComponentAndProp(Component, Prop, PlayerPedId());
    }

    public getMaxOptions() {
        return this.getMaxOptionsForComponentAndProp(Component, Prop, PlayerPedId());
    }

    public getFfsClothSet(pedId: number): Outfit {
        const ffsClothSet = this.getClothSetForComponentAndProp(FfsComponent, Prop, pedId);
        for (const propIndex in ffsClothSet.Props) {
            ffsClothSet.Props[propIndex].Drawable = Math.max(ffsClothSet.Props[propIndex].Drawable, 0);
        }

        return ffsClothSet;
    }

    public getFfsOptions(model: string) {
        return ffsClothConfig[model];
    }

    private getClothSetForComponentAndProp(component: ComponentEnum, prop: ComponentEnum, pedId: number): Outfit {
        const components: Outfit['Components'] = {};

        for (const componentIndex of Object.keys(component).filter(key => !isNaN(Number(key)))) {
            const componentId = Number(componentIndex);
            const drawableId = GetPedDrawableVariation(pedId, componentId);
            const textureId = GetPedTextureVariation(pedId, componentId);

            components[componentIndex] = {
                Drawable: drawableId,
                Texture: textureId,
                Palette: 0,
            };
        }

        const props: Outfit['Props'] = {};
        for (const propIndex of Object.values(prop).filter(key => !isNaN(Number(key)))) {
            const propId = Number(propIndex);
            const drawableId = GetPedPropIndex(pedId, propId);
            const textureId = GetPedPropTextureIndex(pedId, propId);

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

    public getMaxOptionsForComponentAndProp(component: ComponentEnum, prop: ComponentEnum, pedId: number) {
        const maxOptions = [];
        for (const componentIndex of Object.values(component).filter(key => !isNaN(Number(key)) && key !== '7')) {
            const componentId = Number(componentIndex);
            const maxDrawable = GetNumberOfPedDrawableVariations(pedId, componentId);
            const maxOptionObject = {
                componentIndex: componentIndex,
                maxDrawables: maxDrawable,
                maxTextures: 0,
            };
            for (let drawableIndex = 0; drawableIndex < maxDrawable; drawableIndex++) {
                const maxTextureForDrawable = GetNumberOfPedTextureVariations(pedId, componentId, drawableIndex);
                maxOptionObject.maxTextures = Math.max(maxTextureForDrawable, maxOptionObject.maxTextures);
            }

            maxOptions.push(maxOptionObject);
        }

        for (const propIndex of Object.values(prop).filter(key => !isNaN(Number(key)))) {
            const propId = Number(propIndex);
            const maxDrawable = GetNumberOfPedPropDrawableVariations(pedId, propId);
            const maxOptionObject = {
                propIndex: propIndex,
                maxDrawables: maxDrawable,
                maxTextures: 0,
            };

            for (let drawableIndex = 0; drawableIndex < maxDrawable; drawableIndex++) {
                const maxTextureForDrawable = GetNumberOfPedPropTextureVariations(pedId, propId, drawableIndex);
                maxOptionObject.maxTextures = Math.max(maxTextureForDrawable, maxOptionObject.maxTextures);
            }
            maxOptions.push(maxOptionObject);
        }

        return maxOptions;
    }
}
