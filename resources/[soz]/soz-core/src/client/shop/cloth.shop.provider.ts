import { Logger } from '@core/logger';
import { Notifier } from '@public/client/notifier';
import { GloveShopRepository } from '@public/client/repository/glove.shop.repository';
import { UnderTypesShopRepository } from '@public/client/repository/under_types.shop.repository';
import { ProperTorsos, ShopBrand, ShopsConfig, UndershirtCategoryNeedingReplacementTorso } from '@public/config/shops';
import { On, OnEvent, OnNuiEvent } from '@public/core/decorators/event';
import { Exportable } from '@public/core/decorators/exports';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { CAYO } from '@public/shared/cayo';
import { Component, GlovesItem } from '@public/shared/cloth';
import { ClientEvent, NuiEvent, ServerEvent } from '@public/shared/event';
import { MenuType } from '@public/shared/nui/menu';
import { Vector3, Vector4 } from '@public/shared/polyzone/vector';
import { ClothingShopID, ClothingShopItem } from '@public/shared/shop';

import { AnimationService } from '../animation/animation.service';
import { CameraService } from '../camera';
import { ClothingService } from '../clothing/clothing.service';
import { NuiDispatch } from '../nui/nui.dispatch';
import { NuiMenu } from '../nui/nui.menu';
import { PlayerService } from '../player/player.service';
import { ResourceLoader } from '../repository/resource.loader';
import { ClothingShopRepository } from '../repository/shop.repository';

@Provider()
export class ClothingShopProvider {
    @Inject(ClothingShopRepository)
    private clothingShopRepository: ClothingShopRepository;

    @Inject(GloveShopRepository)
    private gloveShopRepository: GloveShopRepository;

    @Inject(UnderTypesShopRepository)
    private underTypesShopRepository: UnderTypesShopRepository;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(CameraService)
    private cameraService: CameraService;

    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    @Inject(AnimationService)
    private animationService: AnimationService;

    @Inject(ClothingService)
    private clothingService: ClothingService;

    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

    @Inject(AnimationService)
    private animation: AnimationService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(Logger)
    private logger: Logger;

    private currentShop: string = undefined;

    @On(ClientEvent.SHOP_OPEN_MENU)
    public async openShop(brand: ShopBrand, shop: string) {
        if (
            brand != ShopBrand.Ponsonbys &&
            brand != ShopBrand.Suburban &&
            brand != ShopBrand.Binco &&
            brand != ShopBrand.Mask
        ) {
            return;
        }

        const { shop: shop_content, content: shop_categories } = await this.clothingShopRepository.getShopContent(
            brand
        );

        if (!shop_content) {
            this.logger.error(`Shop ${brand} not initialized`);
            this.notifier.notify(`Ce magasin n'est pas encore ouvert. Merci de patienter.`, 'error');

            return;
        }
        const isInCayo = CAYO.isPointInside(GetEntityCoords(PlayerPedId(), false) as Vector3);
        const under_types = this.underTypesShopRepository.getAllUnderTypes();
        this.currentShop = shop;
        await this.setupShop();
        this.nuiMenu.openMenu(MenuType.ClothShop, {
            brand,
            shop_content,
            shop_categories,
            under_types,
            isInCayo,
        });
    }

    public async setupShop(skipIntro = false) {
        const ped = PlayerPedId();
        const [x, y, z, w] = ShopsConfig[this.currentShop].positionInShop;
        // binco4 and binco7 and binco2 are bugged on walkToCoordsAvoidObstacles. Use waltkToCoords instead
        if (!skipIntro) {
            if (this.currentShop == 'binco4' || this.currentShop == 'binco7' || this.currentShop == 'binco2') {
                await this.animationService.walkToCoords([x, y, z, w] as Vector4, 3000);
            } else {
                await this.animationService.walkToCoordsAvoidObstacles([x, y, z] as Vector3, 7000);
            }
        }
        // TP and setup cam
        SetPedCoordsKeepVehicle(ped, x, y, z - 1);
        SetEntityHeading(ped, w);
        FreezeEntityPosition(ped, true);
        const target = (ShopsConfig[this.currentShop].cameraTarget || [x, y, z]) as Vector3;
        this.cameraService.setupCamera(ShopsConfig[this.currentShop].cameraInShop as Vector3, target);

        // Play idle animation
        const animDict = 'anim@heists@heist_corona@team_idles@male_c';
        this.resourceLoader.loadAnimationDictionary(animDict);

        ClearPedTasksImmediately(ped);
        TaskPlayAnim(ped, animDict, 'idle', 1.0, 1.0, -1, 1, 1, false, false, false);

        this.playerService.updateState({ isInventoryBusy: true });
    }

    @OnNuiEvent(NuiEvent.ClothShopToggleCamera)
    public async onToggleCamera(check: boolean) {
        if (check) {
            await this.cameraService.deleteCamera();
        } else {
            await this.setupShop(true);
        }
    }

    @OnNuiEvent(NuiEvent.ClothingShopPreview)
    public async onPreviewCloth(product: ClothingShopItem) {
        const ped = PlayerPedId();
        if (!product) {
            return;
        }
        if (product.components && !product.correspondingDrawables) {
            for (const [compId, comp] of Object.entries(product.components)) {
                const drawable = comp.Drawable;
                const texture = comp.Texture;
                SetPedComponentVariation(ped, parseInt(compId), drawable, texture, 0);
                if (Number(compId) == Component.Mask) {
                    const hair = this.clothingService.displayHairWithMask(drawable)
                        ? this.playerService.getPlayer().skin.Hair.HairType
                        : 0;
                    SetPedComponentVariation(ped, Component.Hair, hair, 0, 0);
                }
            }
        }
        if (product.props) {
            for (const [propId, prop] of Object.entries(product.props)) {
                const drawable = prop.Drawable;
                const texture = prop.Texture;
                SetPedPropIndex(ped, parseInt(propId), drawable, texture, true);
            }
        }
        // Adapt the torso to the undershirt if selected
        const playerModel = GetEntityModel(ped);
        const player = this.playerService.getPlayer();
        const baseTorsoDrawable =
            ProperTorsos[playerModel][player.cloth_config.BaseClothSet.Components[Component.Tops].Drawable];
        const nakedTorsoDrawable = player.cloth_config.NakedClothSet.Components[Component.Torso].Drawable;
        if (baseTorsoDrawable == null) {
            return;
        }
        if (product.undershirtType) {
            // show the current top of the player to avoid a naked torso
            SetPedComponentVariation(
                ped,
                Component.Tops,
                player.cloth_config.BaseClothSet.Components[Component.Tops].Drawable,
                player.cloth_config.BaseClothSet.Components[Component.Tops].Texture,
                0
            );
            if (UndershirtCategoryNeedingReplacementTorso[playerModel][product.undershirtType] != null) {
                SetPedComponentVariation(
                    ped,
                    Component.Torso,
                    UndershirtCategoryNeedingReplacementTorso[playerModel][product.undershirtType][baseTorsoDrawable],
                    0,
                    0
                );
            } else {
                SetPedComponentVariation(ped, Component.Torso, baseTorsoDrawable, 0, 0);
            }
        }
        // Preview gloves if selected
        if (product.correspondingDrawables) {
            const correspondingGloveDrawable = player.cloth_config.Config.HideTop
                ? product.correspondingDrawables[nakedTorsoDrawable]
                : product.correspondingDrawables[baseTorsoDrawable];
            SetPedComponentVariation(
                ped,
                Component.Torso,
                correspondingGloveDrawable,
                product.components[Component.Torso].Texture,
                0
            );
        } else {
            // Else preview current gloves of the player
            if (player.cloth_config.BaseClothSet.GlovesID == null || player.cloth_config.Config.HideGloves) {
                return;
            }
            const gloves = await this.gloveShopRepository.getGloves(player.cloth_config.BaseClothSet.GlovesID);
            if (gloves && gloves.correspondingDrawables) {
                const currentTorso = GetPedDrawableVariation(ped, Component.Torso);
                if (!gloves.correspondingDrawables[currentTorso]) {
                    return;
                }
                SetPedComponentVariation(
                    ped,
                    Component.Torso,
                    gloves.correspondingDrawables[currentTorso],
                    gloves.texture,
                    0
                );
            }
        }
    }

    @OnNuiEvent(NuiEvent.ClothingShopBuy)
    public async onBuyCloth(product: ClothingShopItem) {
        const shopName = Object.entries(ClothingShopID)
            .find(([, value]) => value == product.shopId)[0]
            .toLowerCase();

        TriggerServerEvent(ServerEvent.SHOP_BUY, product, shopName);
    }

    @OnNuiEvent(NuiEvent.ClothingShopBackspace)
    public async onBackspaceCloth() {
        TriggerEvent('soz-character:Client:ApplyCurrentSkin');
        TriggerEvent('soz-character:Client:ApplyCurrentClothConfig');
    }

    @OnNuiEvent<{ menuType: MenuType }>(NuiEvent.MenuClosed)
    public async onMenuClose({ menuType }) {
        if (menuType !== MenuType.ClothShop) {
            return;
        }
        TriggerEvent('soz-character:Client:ApplyCurrentSkin');
        TriggerEvent('soz-character:Client:ApplyCurrentClothConfig');
        await this.cameraService.deleteCamera();
        await this.animationService.clearShopAnimations(PlayerPedId());
        this.currentShop = undefined;
        FreezeEntityPosition(PlayerPedId(), false);

        this.playerService.updateState({ isInventoryBusy: false });
    }

    @OnEvent(ClientEvent.SHOP_UPDATE_STOCKS)
    public async onUpdateStocks(brand: ShopBrand) {
        if (
            brand != ShopBrand.Ponsonbys &&
            brand != ShopBrand.Suburban &&
            brand != ShopBrand.Binco &&
            brand != ShopBrand.Mask
        ) {
            return;
        }
    }

    @Exportable('DisplayHairWithMask')
    displayHairWithMask(maskDrawable: number): boolean {
        return this.clothingService.displayHairWithMask(maskDrawable);
    }

    @Exportable('GetGloves')
    async getGloves(glovesId: number): Promise<GlovesItem> {
        return await this.gloveShopRepository.getGloves(glovesId);
    }
}
