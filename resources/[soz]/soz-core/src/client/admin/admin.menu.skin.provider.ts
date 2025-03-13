import { OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import {
    ClothCollectionSubMenuState,
    ClothingFields,
    CollectionInfo,
    Component,
    OutfitItem,
    Prop,
} from '../../shared/cloth';
import { NuiEvent, ServerEvent } from '../../shared/event';
import { Err, Ok } from '../../shared/result';
import { ClipboardService } from '../clipboard.service';
import { ClothingService } from '../clothing/clothing.service';
import { Notifier } from '../notifier';
import { InputService } from '../nui/input.service';
import { NuiDispatch } from '../nui/nui.dispatch';
import { SkinService } from '../skin/skin.service';

@Provider()
export class AdminMenuSkinProvider {
    @Inject(ClipboardService)
    private clipboard: ClipboardService;

    @Inject(ClothingService)
    private clothingService: ClothingService;

    @Inject(InputService)
    private inputService: InputService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    @Inject(SkinService)
    private skinService: SkinService;

    @OnNuiEvent(NuiEvent.AdminMenuSkinChangeAppearance)
    public async onSkinChangeAppearance(model?: string) {
        const value =
            model ||
            (await this.inputService.askInput(
                {
                    title: 'Modèle du personnage:',
                    maxCharacters: 32,
                },
                input => {
                    if (!input) {
                        return Ok(input);
                    }
                    const hash = GetHashKey(input);
                    if (IsModelInCdimage(hash) && IsModelValid(hash)) {
                        return Ok(input);
                    }

                    return Err('Le modèle du personnage est invalide.');
                }
            ));

        if (value !== null) {
            await this.skinService.setModel(value);
        }

        return Ok(true);
    }

    @OnNuiEvent(NuiEvent.AdminMenuSkinLookAtDrawable)
    public async onSkinLookAtComponentDrawable({
        index,
        isComponent,
    }: {
        index: Component | Prop;
        isComponent: boolean;
    }) {
        const formattedIndex = Number(index);

        const maxDrawable = isComponent
            ? GetNumberOfPedDrawableVariations(PlayerPedId(), formattedIndex)
            : GetNumberOfPedPropDrawableVariations(PlayerPedId(), formattedIndex);
        const drawable = await this.inputService.askInput<number>(
            {
                title: `Drawable id [0-${maxDrawable}] :`,
                defaultValue: '',
                maxCharacters: 5,
            },
            value => {
                if (!value) {
                    return Ok(null);
                }
                if (isNaN(Number(value))) {
                    return Err('Le drawable id doit être un nombre.');
                }
                if (Number(value) < 0 || Number(value) > maxDrawable) {
                    return Err(`Le drawable id doit être compris entre 0 et ${maxDrawable}.`);
                }
                return Ok(Number(value));
            }
        );

        if (drawable !== null) {
            this.nuiDispatch.dispatch('admin_skin_submenu', 'SetComponentDrawable', {
                index: index,
                drawable,
                isComponent,
            });
        }

        return Ok(true);
    }

    @OnNuiEvent(NuiEvent.AdminMenuSkinChangeComponent)
    public async onSkinChangeComponent({
        componentIndex,
        component,
    }: {
        componentIndex: Component;
        component: OutfitItem;
    }) {
        this.clothingService.applyComponent(componentIndex, component);

        return Ok(true);
    }

    @OnNuiEvent(NuiEvent.AdminMenuSkinChangeProp)
    public async onSkinChangeProp({ propIndex, prop }: { propIndex: Prop; prop: OutfitItem }) {
        this.clothingService.applyProp(propIndex, prop);

        return Ok(true);
    }

    @OnNuiEvent(NuiEvent.AdminMenuSkinCopy)
    public async onSkinCopy() {
        this.clipboard.copy(this.clothingService.getClothSet());
        this.notifier.notify('Tenue copiée dans le presse-papier');
    }

    @OnNuiEvent(NuiEvent.AdminMenuSkinSave)
    public async onSkinSave() {
        const clothSet = this.clothingService.getClothSet();

        const Components: Record<Component, OutfitItem> = Object.fromEntries(
            Object.entries(clothSet.Components)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(
                    ([componentIndex, component]) =>
                        [componentIndex, { ...component, Index: Number(componentIndex) }] as [string, OutfitItem]
                )
        ) as Record<Component, OutfitItem>;

        const Props = Object.fromEntries(
            Object.entries(clothSet.Props)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([propIndex, prop], index) => [propIndex, { ...prop, Index: index }] as [string, OutfitItem])
        ) as Record<Prop, OutfitItem>;

        TriggerServerEvent(ServerEvent.ADMIN_SET_CLOTHES, { Components, Props });
    }

    @OnNuiEvent(NuiEvent.AdminMenuClothCollectionFetch)
    public async collectionData(): Promise<CollectionInfo> {
        const ped = PlayerPedId();
        const ret: CollectionInfo = {
            data: {},
            dlc: [],
            current: [],
        };
        const nbCollection = GetPedCollectionsCount(ped);
        for (let dlcIndex = 0; dlcIndex < nbCollection; dlcIndex++) {
            const name = GetPedCollectionName(ped, dlcIndex);
            ret.dlc.push(name);
            ret.data[dlcIndex] = {};

            ClothingFields.forEach((field, index) => {
                const max =
                    field.type == 'comp'
                        ? GetNumberOfPedCollectionDrawableVariations(ped, field.componentId, name)
                        : GetNumberOfPedCollectionPropDrawableVariations(ped, field.propId, name);
                ret.data[dlcIndex][index] = {};
                for (let u = 0; u < max; u++) {
                    const isGen9 =
                        field.type == 'comp' &&
                        IsPedCollectionComponentVariationGen9Exclusive(ped, field.componentId, name, u);
                    if (isGen9) {
                        continue;
                    }

                    ret.data[dlcIndex][index][u] =
                        field.type == 'comp'
                            ? GetNumberOfPedCollectionTextureVariations(ped, field.componentId, name, u)
                            : GetNumberOfPedCollectionPropTextureVariations(ped, field.propId, name, u);
                }
            });
        }

        ClothingFields.forEach((field, index) => {
            if (field.type == 'comp') {
                ret.current.push({
                    fieldIndex: index,
                    dlcIndex: ret.dlc.indexOf(GetPedDrawableVariationCollectionName(ped, field.componentId)),
                    drawable: GetPedDrawableVariationCollectionLocalIndex(ped, field.componentId),
                    texture: GetPedTextureVariation(ped, field.componentId),
                });
            } else {
                const elem = {
                    fieldIndex: index,
                    dlcIndex: ret.dlc.indexOf(GetPedPropCollectionName(ped, field.propId)),
                    drawable: GetPedPropCollectionLocalIndex(ped, field.propId),
                    texture: GetPedPropTextureIndex(ped, field.propId),
                };
                elem.dlcIndex = elem.dlcIndex >= 0 ? elem.dlcIndex : 0;
                elem.drawable = elem.drawable >= 0 ? elem.drawable : 0;
                ret.current.push(elem);
            }
        });

        return ret;
    }

    @OnNuiEvent(NuiEvent.AdminMenuClothCollectionPreview)
    public async collectionPreview(data: ClothCollectionSubMenuState) {
        if (!data == null) {
            return;
        }

        const ped = PlayerPedId();
        if (ClothingFields[data.fieldIndex].type == 'comp') {
            SetPedCollectionComponentVariation(
                ped,
                ClothingFields[data.fieldIndex].componentId,
                GetPedCollectionName(PlayerPedId(), data.dlcIndex),
                data.drawable,
                data.texture,
                0
            );
        } else {
            SetPedCollectionPropIndex(
                ped,
                ClothingFields[data.fieldIndex].propId,
                GetPedCollectionName(PlayerPedId(), data.dlcIndex),
                data.drawable,
                data.texture,
                true
            );
        }
    }
}
