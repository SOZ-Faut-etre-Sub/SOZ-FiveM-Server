import { PlayerPedHash } from '@public/shared/player';

import { Inject, Injectable } from '../../core/decorators/injectable';
import { Component, KeepHairWithMask, Outfit, OutfitItem, Prop } from '../../shared/cloth';
import { PlayerService } from '../player/player.service';

@Injectable()
export class ClothingService {
    @Inject(PlayerService)
    public playerService: PlayerService;

    public applyPedComponent(ped: number, component: Component, outfitItem: OutfitItem) {
        if (outfitItem.Collection) {
            SetPedCollectionComponentVariation(
                ped,
                Number(component),
                outfitItem.Collection,
                Number(outfitItem.Drawable),
                Number(outfitItem.Texture),
                Number(outfitItem.Palette)
            );
        } else {
            SetPedComponentVariation(
                ped,
                Number(component),
                Number(outfitItem.Drawable),
                Number(outfitItem.Texture),
                Number(outfitItem.Palette)
            );
        }
    }

    public applyComponent(component: Component, outfitItem: OutfitItem) {
        this.applyPedComponent(PlayerPedId(), component, outfitItem);
    }

    public applyPedComponentWithFix(ped: number, component: Component, outfitItem: OutfitItem) {
        if (outfitItem.Collection) {
            SetPedCollectionComponentVariation(
                ped,
                Number(component),
                outfitItem.Collection,
                Number(outfitItem.Drawable),
                Number(outfitItem.Texture),
                Number(outfitItem.Palette)
            );
        } else {
            let drawable = Number(outfitItem.Drawable);

            if (Number(component) == Component.Mask && drawable >= 190 && GetEntityModel(ped) == PlayerPedHash.Female) {
                drawable = drawable + 1;
            }

            SetPedComponentVariation(
                ped,
                Number(component),
                drawable,
                Number(outfitItem.Texture),
                Number(outfitItem.Palette)
            );
        }

        if (Number(component) == Component.Mask) {
            let hair = 0;
            let collection = '';
            if (this.displayHairWithMask(outfitItem.Drawable, outfitItem.Collection)) {
                hair = this.playerService.getPlayer().skin.Hair.HairType;
                collection = this.playerService.getPlayer().skin.Hair.Collection;
            }
            if (collection) {
                SetPedCollectionComponentVariation(ped, Component.Hair, collection, hair, 0, 0);
            } else {
                SetPedComponentVariation(ped, Component.Hair, hair, 0, 0);
            }
        }
    }

    public applyComponentWithFix(component: Component, outfitItem: OutfitItem) {
        this.applyPedComponentWithFix(PlayerPedId(), component, outfitItem);
    }

    public displayHairWithMask(maskDrawable: number, collection: string): boolean {
        return KeepHairWithMask[(collection ?? 'base').replace('Female', 'Male').replace('_f_', '_m_')][maskDrawable];
    }

    public applyPedProp(ped: number, prop: Prop, outfitItem: OutfitItem) {
        const propFix = prop == Prop.Helmet ? Prop.Hat : Number(prop);
        if (outfitItem.Clear) {
            ClearPedProp(ped, propFix);
        } else if (outfitItem.Collection) {
            SetPedCollectionPropIndex(
                ped,
                propFix,
                outfitItem.Collection,
                outfitItem.Drawable || 0,
                outfitItem.Texture || 0,
                true
            );
        } else {
            SetPedPropIndex(ped, propFix, outfitItem.Drawable || 0, outfitItem.Texture || 0, true);
        }
    }
    public applyProp(prop: Prop, outfitItem: OutfitItem) {
        this.applyPedProp(PlayerPedId(), prop, outfitItem);
    }

    public applyPedOutfit(ped: number, outfit: Outfit) {
        for (const [componentIndex, component] of Object.entries(outfit.Components)) {
            this.applyPedComponentWithFix(ped, Number(componentIndex), component);
        }

        for (const [propIndex, prop] of Object.entries(outfit.Props)) {
            this.applyPedProp(ped, Number(propIndex), prop);
        }
    }

    public applyOutfit(outfit: Outfit) {
        this.applyPedOutfit(PlayerPedId(), outfit);
    }

    public getClothSet(ped?: number, forceGlobal?: boolean): Outfit {
        if (ped == null) {
            ped = PlayerPedId();
        }

        const components: Outfit['Components'] = {};

        for (const componentIndex of Object.keys(Component).filter(key => !isNaN(Number(key)))) {
            const componentId = Number(componentIndex) as Component;

            const collection = forceGlobal ? undefined : GetPedDrawableVariationCollectionName(ped, componentId);
            const drawableId = forceGlobal
                ? GetPedDrawableVariation(ped, componentId)
                : GetPedDrawableVariationCollectionLocalIndex(ped, componentId);
            const textureId = GetPedTextureVariation(ped, componentId);

            components[componentId] = {
                Collection: collection,
                Drawable: drawableId,
                Texture: textureId,
                Palette: 0,
            };
        }

        const props: Outfit['Props'] = {};
        for (const propIndex of Object.values(Prop).filter(key => !isNaN(Number(key)))) {
            const propId = Number(propIndex);

            const collection = forceGlobal ? undefined : GetPedDrawableVariationCollectionName(ped, propId);
            let drawableId = GetPedPropIndex(ped, propId);
            if (!forceGlobal) {
                drawableId = GetPedCollectionLocalIndexFromProp(ped, propId, drawableId);
            }
            const textureId = GetPedPropTextureIndex(ped, propId);

            props[propIndex] = {
                Collection: collection,
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

    public checkWearingGloves(): boolean {
        const ped = PlayerPedId();
        const armIndex = GetPedDrawableVariation(ped, 3);
        const model = GetEntityModel(ped);
        if (model == GetHashKey('mp_m_freemode_01')) {
            if (
                armIndex < 16 ||
                armIndex == 18 ||
                (armIndex >= 52 && armIndex <= 62) ||
                armIndex == 97 ||
                armIndex == 98 ||
                armIndex == 112 ||
                armIndex == 113 ||
                armIndex == 114 ||
                armIndex == 118 ||
                armIndex == 125 ||
                armIndex == 132 ||
                armIndex == 164 ||
                armIndex == 169 ||
                armIndex == 184 ||
                armIndex == 188 ||
                armIndex == 196 ||
                armIndex == 197 ||
                armIndex == 198 ||
                armIndex == 202
            ) {
                return false;
            } else {
                return true;
            }
        } else {
            if (
                armIndex < 16 ||
                armIndex == 19 ||
                (armIndex >= 59 && armIndex <= 71) ||
                armIndex == 112 ||
                armIndex == 113 ||
                armIndex == 129 ||
                armIndex == 130 ||
                armIndex == 131 ||
                armIndex == 135 ||
                armIndex == 142 ||
                armIndex == 149 ||
                armIndex == 153 ||
                armIndex == 157 ||
                armIndex == 161 ||
                armIndex == 165 ||
                armIndex == 205 ||
                armIndex == 210 ||
                armIndex == 229 ||
                armIndex == 233 ||
                armIndex == 241 ||
                armIndex == 242
            ) {
                return false;
            } else {
                return true;
            }
        }
    }
}
