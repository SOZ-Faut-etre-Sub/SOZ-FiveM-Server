import { OnNuiEvent } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { AnimationService } from '@public/client/animation/animation.service';
import { Command } from '@public/core/decorators/command';
import { Animation } from '@public/shared/animation';
import { RankOutfit } from '@public/shared/job/police';

import {
    ClothConfig,
    Component,
    Outfit,
    WardrobeConfig,
    WardRobeElementConfigs,
    WardRobeElements,
} from '../../shared/cloth';
import { NuiEvent } from '../../shared/event';
import { MenuType } from '../../shared/nui/menu';
import { Vector3 } from '../../shared/polyzone/vector';
import { ProgressResult } from '../../shared/progress';
import { ClipboardService } from '../clipboard.service';
import { ClothingService } from '../clothing/clothing.service';
import { Notifier } from '../notifier';
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

    @Inject(AnimationService)
    private animationService: AnimationService;

    @Inject(ClothingService)
    private clothingService: ClothingService;

    @Inject(ClipboardService)
    private clipboard: ClipboardService;

    @Inject(Notifier)
    private notifier: Notifier;

    private customOutfit: Outfit;

    private currentOutfitResolve: (outfit: OutfitSelection) => void | null;

    public async selectOutfit(
        config: WardrobeConfig,
        nullLabel?: string,
        allowCustom?: boolean
    ): Promise<OutfitSelection | null> {
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
                allowCustom,
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
                    enablePlayerControl: true,
                    onlyUpperBody: true,
                },
            },
            {
                disableMovement: true,
                disableCarMovement: true,
                disableMouse: false,
                disableCombat: true,
                canCancel: canCancel,
            }
        );
    }

    public async setClothConfig(key: keyof ClothConfig['Config'], value: boolean, skipAnimation = false) {
        if (this.playerService.getState().isInHub || this.playerService.getState().isInGameHub) {
            return;
        }

        let animation: Animation | null;

        switch (key) {
            case 'ShowHelmet':
                animation = {
                    base: {
                        dictionary: 'veh@common@fp_helmet@',
                        name: value ? 'put_on_helmet' : 'take_off_helmet_stand',
                        duration: 2000,
                        blendInSpeed: 8.0,
                        blendOutSpeed: -8.0,
                        options: {
                            onlyUpperBody: true,
                            enablePlayerControl: true,
                        },
                    },
                };
                break;
            case 'HideHead':
            case 'HideGlasses':
            case 'HideEar':
            case 'HideLeftHand':
            case 'HideRightHand':
                animation = {
                    base: {
                        dictionary: 'mp_masks@on_foot',
                        name: 'put_on_mask',
                        duration: 2000,
                        blendInSpeed: 8.0,
                        blendOutSpeed: -8.0,
                        options: {
                            onlyUpperBody: true,
                            enablePlayerControl: true,
                        },
                    },
                };
                break;
            default:
                animation = {
                    base: {
                        dictionary: 'anim@mp_yacht@shower@male@',
                        name: 'male_shower_towel_dry_to_get_dressed',
                        duration: 3000,
                        blendInSpeed: 8.0,
                        blendOutSpeed: -8.0,
                        options: {
                            onlyUpperBody: true,
                            enablePlayerControl: true,
                        },
                    },
                };
        }

        if (!animation) {
            return;
        }

        if (!skipAnimation) {
            await this.animationService.playAnimation(animation);
        }

        TriggerServerEvent('soz-character:server:UpdateClothConfig', key, value);
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
            this.customOutfit = null;
        }

        if (this.currentOutfitResolve) {
            this.currentOutfitResolve({ outfit: null, canceled: true });
        }

        this.currentOutfitResolve = null;
    }

    @OnNuiEvent(NuiEvent.WardrobeElementSelect)
    public async onWardrobeElementSelect({
        outfit,
        wardRobeElementId,
    }: {
        outfit: Outfit;
        wardRobeElementId: WardRobeElements;
    }) {
        if (!outfit) {
            return;
        }

        const player = this.playerService.getPlayer();

        if (!this.customOutfit) {
            this.customOutfit = {
                Components: {},
                Props: {},
            };
        }

        if (WardRobeElementConfigs[wardRobeElementId].componentId) {
            for (const comp of WardRobeElementConfigs[wardRobeElementId].componentId) {
                if (outfit.Components && outfit.Components[comp]) {
                    this.customOutfit.Components[comp] = outfit.Components[comp];
                } else {
                    delete this.customOutfit.Components[comp];
                }
            }
        }
        if (WardRobeElementConfigs[wardRobeElementId].propId) {
            for (const prop of WardRobeElementConfigs[wardRobeElementId].propId) {
                if (outfit.Props && outfit.Props[prop]) {
                    this.customOutfit.Props[prop] = outfit.Props[prop];
                } else {
                    delete this.customOutfit.Props[prop];
                }
            }
        }

        if (outfit.GlovesID != null) {
            this.customOutfit.GlovesID = outfit.GlovesID;
        } else if (WardRobeElementConfigs[wardRobeElementId].componentId?.includes(Component.Torso)) {
            delete this.customOutfit.GlovesID;
        }

        const model = GetEntityModel(PlayerPedId());
        if (
            RankOutfit[player.job.id] &&
            RankOutfit[player.job.id][model] &&
            WardRobeElementConfigs[wardRobeElementId].componentId?.includes(Component.Decals) &&
            !(outfit.Components && outfit.Components[Component.Decals])
        ) {
            if (
                outfit.rankType &&
                RankOutfit[player.job.id][model][outfit.rankType] &&
                RankOutfit[player.job.id][model][outfit.rankType][player.job.grade]
            ) {
                this.customOutfit.Components[Component.Decals] = {
                    Drawable: RankOutfit[player.job.id][model][outfit.rankType][player.job.grade][0],
                    Texture: RankOutfit[player.job.id][model][outfit.rankType][player.job.grade][1],
                    Palette: 0,
                    Collection: 'soz_bcso',
                };
            } else {
                this.customOutfit.Components[Component.Decals] = {
                    Drawable: 0,
                    Texture: 0,
                    Palette: 0,
                };
            }
        }

        this.playerService.setTempClothes(this.customOutfit);
        return;
    }

    @OnNuiEvent(NuiEvent.WardrobeCustomSave)
    public async onCustomWardrobeSave() {
        if (this.currentOutfitResolve) {
            this.currentOutfitResolve({ outfit: this.customOutfit, canceled: false });
        }
        this.customOutfit = null;

        this.nuiMenu.closeMenu();
        this.currentOutfitResolve = null;

        return;
    }

    @Command('dump_vet')
    public dump_vet() {
        this.clipboard.copy(this.clothingService.getClothSet());
        this.notifier.notify('Tenue copiée dans le presse-papier');
    }
}
