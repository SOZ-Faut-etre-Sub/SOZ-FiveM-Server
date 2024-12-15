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
        };
        const nbCollection = GetPedCollectionsCount(ped);
        for (let i = 0; i < nbCollection; i++) {
            const name = GetPedCollectionName(ped, i);
            ret.dlc.push(name);
            ret.data[i] = {};

            ClothingFields.forEach((field, index) => {
                const max =
                    field.type == 'comp'
                        ? GetNumberOfPedCollectionDrawableVariations(ped, field.index, name)
                        : GetNumberOfPedCollectionPropDrawableVariations(ped, field.index, name);
                ret.data[i][index] = {};
                for (let u = 0; u < max; u++) {
                    const isGen9 =
                        field.type == 'comp' &&
                        IsPedCollectionComponentVariationGen9Exclusive(ped, field.index, name, u);
                    if (isGen9) {
                        continue;
                    }

                    ret.data[i][index][u] =
                        field.type == 'comp'
                            ? GetNumberOfPedCollectionTextureVariations(ped, field.index, name, u)
                            : GetNumberOfPedCollectionPropTextureVariations(ped, field.index, name, u);
                }
            });
        }

        return ret;
    }

    @OnNuiEvent(NuiEvent.AdminMenuClothCollectionCurrent)
    public async collectionCurrent(): Promise<ClothCollectionSubMenuState[]> {
        const clothSet = this.clothingService.getClothSet();
        const ret: ClothCollectionSubMenuState[] = [];
        const collections: Record<string, number> = {};

        const ped = PlayerPedId();
        const nbCollection = GetPedCollectionsCount(ped);
        for (let i = 0; i < nbCollection; i++) {
            collections[GetPedCollectionName(ped, i)] = i;
        }

        ClothingFields.forEach((elem, index) => {
            if (elem.type == 'comp') {
                const comp = elem.index as Component;
                ret.push({
                    field: index,
                    dlc: collections[clothSet.Components[comp].Collection],
                    drawable: clothSet.Components[comp].Drawable,
                    texture: clothSet.Components[comp].Texture,
                });
            } else {
                const prop = elem.index as Prop;
                ret.push({
                    field: index,
                    dlc: collections[clothSet.Props[prop].Collection],
                    drawable: clothSet.Props[prop].Drawable,
                    texture: clothSet.Props[prop].Texture,
                });
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
        if (ClothingFields[data.field].type == 'comp') {
            SetPedCollectionComponentVariation(
                ped,
                ClothingFields[data.field].index,
                GetPedCollectionName(PlayerPedId(), data.dlc),
                data.drawable,
                data.texture,
                0
            );
        } else {
            SetPedCollectionPropIndex(
                ped,
                ClothingFields[data.field].index,
                GetPedCollectionName(PlayerPedId(), data.dlc),
                data.drawable,
                data.texture,
                true
            );
        }
    }
}
