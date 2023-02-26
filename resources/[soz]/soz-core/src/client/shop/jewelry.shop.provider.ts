import { FemaleJewelryItems, MaleJewelryItems } from '@public/config/jewelry';
import { ShopBrand } from '@public/config/shops';
import { OnNuiEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { wait } from '@public/core/utils';
import { Component, Prop } from '@public/shared/cloth';
import { NuiEvent, ServerEvent } from '@public/shared/event';
import { MenuType } from '@public/shared/nui/menu';
import { Vector3 } from '@public/shared/polyzone/vector';
import { JewelryShopItem } from '@public/shared/shop';

import { CameraService } from '../camera';
import { ClothingService } from '../clothing/clothing.service';
import { NuiMenu } from '../nui/nui.menu';
import { PlayerService } from '../player/player.service';
import { ClothingShopRepository } from '../resources/shop.repository';

@Provider()
export class JewelryShopProvider {
    @Inject(ClothingShopRepository)
    private clothingShopRepository: ClothingShopRepository;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(CameraService)
    private cameraService: CameraService;

    @Inject(ClothingService)
    private clothingService: ClothingService;

    public async openShop() {
        const modelHash = GetEntityModel(PlayerPedId());
        const shop_content = modelHash == 1885233650 ? MaleJewelryItems : FemaleJewelryItems;

        await this.setupShop();

        this.nuiMenu.openMenu(MenuType.JewelryShop, { shop_content });
    }

    public async setupShop() {
        const ped = PlayerPedId();
        SetEntityHeading(ped, 199.156);
        FreezeEntityPosition(ped, true);

        // Setup cam
        const [x, y, z] = GetEntityCoords(ped);
        await this.cameraService.setupCamera([x, y - 0.5, z + 0.7] as Vector3, [x, y, z + 0.6] as Vector3);

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

    @OnNuiEvent(NuiEvent.JewelryShopToggleCamera)
    public async onToggleCamera(check: boolean) {
        if (check) {
            await this.cameraService.deleteCamera();
        } else {
            await this.setupShop();
        }
    }

    @OnNuiEvent(NuiEvent.JewelryShopPreview)
    public async onPreviewJewelry(data: { propId: number; drawable: number; texture: number; componentId: number }) {
        console.log(data);
        const ped = PlayerPedId();
        if (data.propId != null) {
            SetPedPropIndex(ped, data.propId, data.drawable, data.texture, true);
        }
        if (data.componentId != null) {
            SetPedComponentVariation(ped, data.componentId, data.drawable, data.texture, 0);
        }
    }

    @OnNuiEvent(NuiEvent.JewelryShopBuy)
    public async onBuyJewelry(product: JewelryShopItem) {
        console.log(product);
        TriggerServerEvent(ServerEvent.SHOP_BUY, product, ShopBrand.Jewelry);
    }

    @OnNuiEvent(NuiEvent.JewelryShopBackspace)
    public async onBackspaceJewelry() {
        TriggerEvent('soz-character:Client:ApplyCurrentSkin');
        TriggerEvent('soz-character:Client:ApplyCurrentClothConfig');
    }

    @OnNuiEvent<{ menuType: MenuType }>(NuiEvent.MenuClosed)
    public async onMenuClose({ menuType }) {
        if (menuType !== MenuType.JewelryShop) {
            return;
        }
        TriggerEvent('soz-character:Client:ApplyCurrentSkin');
        TriggerEvent('soz-character:Client:ApplyCurrentClothConfig');
        await this.cameraService.deleteCamera();
        await this.clearAllAnimations();
        FreezeEntityPosition(PlayerPedId(), false);
    }
}
