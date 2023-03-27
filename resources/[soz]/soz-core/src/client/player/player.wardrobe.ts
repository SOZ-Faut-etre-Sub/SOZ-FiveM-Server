import { OnEvent, OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Outfit, WardrobeConfig, WardRobeElements } from '../../shared/cloth';
import { ClientEvent, NuiEvent, ServerEvent } from '../../shared/event';
import { MenuType } from '../../shared/nui/menu';
import { Vector3 } from '../../shared/polyzone/vector';
import { ProgressResult } from '../../shared/progress';
import { ClothingService } from '../clothing/clothing.service';
import { NuiMenu } from '../nui/nui.menu';
import { ProgressService } from '../progress.service';
import { PlayerService } from './player.service';

type OutfitSelection = {
    outfit: Outfit | null;
    canceled: boolean;
};

@Provider()
export class PlayerWardrobe {
    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(ClothingService)
    private clothingService: ClothingService;

    private customOutfit: Outfit;

    private currentOutfitResolve: (outfit: OutfitSelection) => void | null;

    public async selectOutfit(
        config: WardrobeConfig,
        nullLabel?: string,
        customLabel?: string
    ): Promise<OutfitSelection | null> {
        const model = GetEntityModel(PlayerPedId());
        const wardrobe = config[model];
        this.customOutfit = {
            Components: {},
            Props: {},
        };

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
                allowCustom: customLabel,
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

    @OnEvent(ClientEvent.PLAYER_SET_JOB_OUTFIT)
    public async onSetJobOutfit(outfit: Outfit, merge: boolean) {
        TriggerServerEvent(ServerEvent.CHARACTER_SET_JOB_CLOTHES, outfit, merge);
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
        if (this.customOutfit) {
            this.playerService.resetClothConfig();
        }

        if (this.currentOutfitResolve) {
            this.currentOutfitResolve({ outfit: null, canceled: true });
        }

        this.currentOutfitResolve = null;
    }

    @OnNuiEvent(NuiEvent.WardrobeElementSelect)
    public async onWardrobeElementSelect({ outfit, wardRobeElementId }: { outfit: Outfit; wardRobeElementId: number }) {
        if (!outfit) {
            return;
        }

        const wardRobeElement = WardRobeElements[wardRobeElementId];

        if (wardRobeElement.componentId) {
            wardRobeElement.componentId.forEach(element => {
                this.customOutfit.Components[element] = outfit.Components[element];
            });
        }
        if (wardRobeElement.propId) {
            wardRobeElement.propId.forEach(element => {
                this.customOutfit.Props[element] = outfit.Props[element];
            });
        }

        this.playerService.setTempClothes(this.customOutfit);
        return;
    }

    @OnNuiEvent(NuiEvent.WardrobeCustomSave)
    public async onCustomWardrobeSabe() {
        if (this.currentOutfitResolve) {
            this.currentOutfitResolve({ outfit: this.customOutfit, canceled: false });
        }

        this.nuiMenu.closeMenu();
        this.currentOutfitResolve = null;

        return;
    }
}
