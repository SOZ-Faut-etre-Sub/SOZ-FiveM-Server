import { ShopBrand, ShopsConfig, UndershirtCategoryNeedingReplacementTorso } from '@public/config/shops';
import { On, OnEvent, OnNuiEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { wait } from '@public/core/utils';
import { Component } from '@public/shared/cloth';
import { ClientEvent, NuiEvent, ServerEvent } from '@public/shared/event';
import { MenuType } from '@public/shared/nui/menu';
import { Vector3 } from '@public/shared/polyzone/vector';
import { ClothingShopItem } from '@public/shared/shop';

import { CameraService } from '../camera';
import { NuiDispatch } from '../nui/nui.dispatch';
import { NuiMenu } from '../nui/nui.menu';
import { PlayerService } from '../player/player.service';
import { ClothingShopRepository } from '../resources/shop.repository';

@Provider()
export class ClothingShopProvider {
    @Inject(ClothingShopRepository)
    private clothingShopRepository: ClothingShopRepository;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(CameraService)
    private cameraService: CameraService;

    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    @On(ClientEvent.SHOP_OPEN_MENU)
    public async openShop(brand: ShopBrand, shop: string) {
        if (brand != ShopBrand.Ponsonbys && brand != ShopBrand.Suburban && brand != ShopBrand.Binco) {
            return;
        }

        await this.clothingShopRepository.updateShopStock(brand);
        const shop_content = this.clothingShopRepository.getShop(brand);
        const modelHash = GetEntityModel(PlayerPedId());
        const shop_categories = this.clothingShopRepository.getModelCategoriesOfShop(brand, modelHash);
        const player_data = this.playerService.getPlayer();
        if (!shop_content) {
            console.error(`Shop ${brand} not found`);
            return;
        }
        await this.setupShop(brand, shop);
        this.nuiMenu.openMenu(MenuType.ClothShop, { brand, shop_content, shop_categories, player_data });
    }

    public async setupShop(brand: ShopBrand, shop: string, skipIntro = false) {
        const ped = PlayerPedId();
        const [x, y, z, w] = ShopsConfig[shop].positionInShop;
        if (!skipIntro) {
            TaskGoToCoordAnyMeans(ped, x, y, z, 1.0, 0, false, 786603, 0xbf800000);
            brand == ShopBrand.Binco ? await wait(4000) : await wait(7000);
        }
        // TP and setup cam
        SetPedCoordsKeepVehicle(ped, x, y, z - 1);
        SetEntityHeading(ped, w);
        FreezeEntityPosition(ped, true);
        this.cameraService.setupCamera(ShopsConfig[shop].cameraInShop as Vector3, [x, y, z] as Vector3);

        // Play idle animation
        const animDict = 'anim@heists@heist_corona@team_idles@male_c';

        while (!HasAnimDictLoaded(animDict)) {
            RequestAnimDict(animDict);
            await wait(100);
        }
        ClearPedTasksImmediately(ped);
        TaskPlayAnim(ped, animDict, 'idle', 1.0, 1.0, -1, 1, 1, false, false, false);
    }

    public async clearAllAnimations() {
        const ped = PlayerPedId();
        ClearPedTasks(ped);
        if (HasAnimDictLoaded('anim@heists@heist_corona@team_idles@male_c')) {
            RemoveAnimDict('anim@heists@heist_corona@team_idles@male_c');
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
            }
        }
        if (product.props) {
            for (const [propId, prop] of Object.entries(product.props)) {
                const drawable = prop.Drawable;
                const texture = prop.Texture;
                SetPedPropIndex(ped, parseInt(propId), drawable, texture, true);
            }
        }
        // This is for gloves
        const baseTorsoDrawable =
            this.playerService.getPlayer().cloth_config.BaseClothSet.Components[Component.Torso].Drawable;
        if (product.correspondingDrawables) {
            const correspondingGloveDrawable = product.correspondingDrawables[baseTorsoDrawable];
            SetPedComponentVariation(
                ped,
                Component.Torso,
                correspondingGloveDrawable,
                product.components[Component.Torso].Texture,
                0
            );
        }
        // Adapt the torso to the undershirt
        const playerModel = GetEntityModel(ped);
        if (product.undershirtType != null) {
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
    }

    @OnNuiEvent(NuiEvent.ClothingShopBuy)
    public async onBuyCloth(product: ClothingShopItem) {
        TriggerServerEvent(ServerEvent.SHOP_BUY, product, this.clothingShopRepository.getShopNameById(product.shopId));
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
        await this.clearAllAnimations();
        FreezeEntityPosition(PlayerPedId(), false);
    }

    @OnEvent(ClientEvent.SHOP_UPDATE_STOCKS)
    public async onUpdateStocks(brand: ShopBrand) {
        if (brand != ShopBrand.Ponsonbys && brand != ShopBrand.Suburban && brand != ShopBrand.Binco) {
            return;
        }
        await this.clothingShopRepository.updateShopStock(brand);
        this.nuiDispatch.dispatch('cloth_shop', 'SetStocks', this.clothingShopRepository.getShop(brand).stocks);
        // Also update player data in case the player changed clothes
        const playerData = this.playerService.getPlayer();
        this.nuiDispatch.dispatch('cloth_shop', 'SetPlayerData', playerData);
    }
}
