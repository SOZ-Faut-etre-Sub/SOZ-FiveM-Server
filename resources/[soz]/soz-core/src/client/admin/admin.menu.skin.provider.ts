import { OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClothComponent, ClothProp, ComponentIndex, PropIndex } from '../../shared/clothing';
import { NuiEvent } from '../../shared/event';
import { Err, Ok } from '../../shared/result';
import { ClothingService } from '../clothing/clothing.service';
import { Notifier } from '../notifier';
import { InputService } from '../nui/input.service';
import { NuiDispatch } from '../nui/nui.dispatch';
import { SkinService } from '../skin/skin.service';

@Provider()
export class AdminMenuSkinProvider {
    @Inject(InputService)
    private inputService: InputService;

    @Inject(SkinService)
    private skinService: SkinService;

    @Inject(ClothingService)
    private clothingService: ClothingService;

    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    @Inject(Notifier)
    private notifier: Notifier;

    @OnNuiEvent(NuiEvent.AdminMenuSkinChangeAppearance)
    public async onSkinChangeAppearance(model?: string) {
        const value =
            model ||
            (await this.inputService.askInput(
                {
                    title: 'Modèle du personnage:',
                    maxCharacters: 32,
                    defaultValue: '',
                },
                input => {
                    if (!input) {
                        return Ok(true);
                    }
                    const hash = GetHashKey(input);
                    if (IsModelInCdimage(hash) && IsModelValid(hash)) {
                        return Ok(true);
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
        index: ComponentIndex | PropIndex;
        isComponent: boolean;
    }) {
        const formattedIndex = Number(index);

        const maxDrawable = isComponent
            ? GetNumberOfPedDrawableVariations(PlayerPedId(), formattedIndex)
            : GetNumberOfPedPropDrawableVariations(PlayerPedId(), formattedIndex);
        const value = await this.inputService.askInput(
            {
                title: `Drawable id [0-${maxDrawable}] :`,
                defaultValue: '',
                maxCharacters: 5,
            },
            value => {
                if (!value) {
                    return Ok(true);
                }
                if (isNaN(Number(value))) {
                    return Err('Le drawable id doit être un nombre.');
                }
                if (Number(value) < 0 || Number(value) > maxDrawable) {
                    return Err(`Le drawable id doit être compris entre 0 et ${maxDrawable}.`);
                }
                return Ok(true);
            }
        );

        if (value !== null) {
            this.nuiDispatch.dispatch('admin_skin_submenu', 'SetComponentDrawable', {
                index: index,
                drawable: Number(value),
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
        componentIndex: ComponentIndex;
        component: ClothComponent;
    }) {
        this.clothingService.applyComponent(componentIndex, component);

        return Ok(true);
    }
    @OnNuiEvent(NuiEvent.AdminMenuSkinChangeProp)
    public async onSkinChangeProp({ propIndex, prop }: { propIndex: PropIndex; prop: ClothProp }) {
        this.clothingService.applyProp(propIndex, prop);

        return Ok(true);
    }

    @OnNuiEvent(NuiEvent.AdminMenuSkinCopy)
    public async onSkinCopy() {
        exports['soz-utils'].CopyToClipboard(JSON.stringify(this.clothingService.getClothSet()));
        this.notifier.notify('Tenue copié dans le presse-papier');
    }

    @OnNuiEvent(NuiEvent.AdminMenuSkinSave)
    public async onSkinSave() {
        const clothSet = this.clothingService.getClothSet();
        console.log('Save cloth set: ', JSON.stringify(clothSet));

        const Components: ClothComponent[] = Object.entries(clothSet.Components)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([componentIndex, component]) => ({
                ...component,
                component: componentIndex,
            }));

        const Props = Object.fromEntries(
            Object.entries(clothSet.Props)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([propIndex, prop], index) => [propIndex, { ...prop, Index: index }] as [string, ClothProp])
        ) as Record<PropIndex, ClothProp>;

        TriggerServerEvent('admin:skin:UpdateClothes', { Components, Props });
    }
}
