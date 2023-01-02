import { OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Outfit, WardrobeConfig } from '../../shared/cloth';
import { NuiEvent } from '../../shared/event';
import { MenuType } from '../../shared/nui/menu';
import { Vector3 } from '../../shared/polyzone/vector';
import { ProgressResult } from '../../shared/progress';
import { NuiMenu } from '../nui/nui.menu';
import { ProgressService } from '../progress.service';

type OutfitSelection = {
    outfit: Outfit | null;
    canceled: boolean;
};

@Provider()
export class PlayerWardrobe {
    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(ProgressService)
    private progressService: ProgressService;

    private currentOutfitResolve: (outfit: OutfitSelection) => void | null;

    public async selectOutfit(config: WardrobeConfig, nullLabel?: string): Promise<OutfitSelection | null> {
        const model = GetEntityModel(PlayerPedId());
        const wardrobe = config[model];

        if (!wardrobe) {
            return null;
        }

        const promise = new Promise<OutfitSelection>(resolve => {
            this.currentOutfitResolve = resolve;
        });

        this.nuiMenu.openMenu(
            MenuType.Wardrobe,
            {
                wardrobe,
                allowNullLabel: nullLabel,
            },
            {
                position: {
                    position: GetEntityCoords(PlayerPedId()) as Vector3,
                    distance: 5.0,
                },
            }
        );

        return promise;
    }

    public async waitProgress(canCancel: boolean): Promise<ProgressResult> {
        return await this.progressService.progress(
            'switch_clothes',
            "Changement d'habits...",
            5000,
            {
                name: 'male_shower_towel_dry_to_get_dressed',
                dictionary: 'anim@mp_yacht@shower@male@',
                options: {
                    cancellable: false,
                    enablePlayerControl: false,
                },
            },
            {
                disableCombat: true,
                disableMovement: true,
                canCancel: canCancel,
            }
        );
    }

    @OnNuiEvent<Outfit>(NuiEvent.SetWardrobeOutfit)
    public async onSetWardRobeOutfit(outfit: Outfit | null) {
        if (this.currentOutfitResolve) {
            this.currentOutfitResolve({ outfit: outfit, canceled: false });
        }

        this.nuiMenu.closeMenu();
        this.currentOutfitResolve = null;

        return true;
    }

    @OnNuiEvent(NuiEvent.MenuClosed)
    public async onCloseMenu() {
        if (this.currentOutfitResolve) {
            this.currentOutfitResolve({ outfit: null, canceled: true });
        }

        this.currentOutfitResolve = null;
    }
}
