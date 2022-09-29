import { OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClothComponent, ComponentIndex } from '../../shared/clothing';
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

    @OnNuiEvent(NuiEvent.AdminMenuSkinChangeComponent)
    public async onSkinChangeComponent({
        componentIndex,
        component,
    }: {
        componentIndex: ComponentIndex;
        component: ClothComponent;
    }) {
        const componentId = Number(ComponentIndex[componentIndex]);
        SetPedComponentVariation(
            PlayerPedId(),
            componentId,
            component.drawableId || 0,
            component.textureId || 0,
            component.paletteId || 0
        );

        const maxDrawable = GetNumberOfPedDrawableVariations(PlayerPedId(), componentId);
        const maxTexture = GetNumberOfPedTextureVariations(PlayerPedId(), componentId, component.drawableId || 0);
        const maxPalette = GetPedPaletteVariation(PlayerPedId(), componentId);

        this.nuiDispatch.dispatch('admin_skin_submenu', 'SetMaxOptions', {
            drawables: maxDrawable,
            textures: maxTexture,
            palettes: maxPalette,
        });
        return Ok(true);
    }

    @OnNuiEvent(NuiEvent.AdminMenuSkinCopy)
    public async onSkinCopy() {
        exports['soz-utils'].CopyToClipboard(JSON.stringify(this.clothingService.getClothing()));
        this.notifier.notify('Tenue copié dans le presse-papier');
    }

    @OnNuiEvent(NuiEvent.AdminMenuVehicleSave)
    public async onSkinSave() {
        TriggerServerEvent('admin:skin:UpdateClothes', this.clothingService.getClothing());
    }
}
