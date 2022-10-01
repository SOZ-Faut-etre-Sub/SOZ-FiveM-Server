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
        const Components: ClothComponent[] = Object.entries(clothSet.Components)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([componentIndex, component]) => ({
                ...component,
                component: componentIndex,
            }));
        const Props: ClothProp[] = Object.entries(clothSet.Props)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([propIndex, prop]) => ({
                ...prop,
                prop: propIndex,
            }));

        TriggerServerEvent('admin:skin:UpdateClothes', { Components, Props });
    }
}
