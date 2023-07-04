import { FemaleJewelryItems, MaleJewelryItems, PositionInJewelryShop } from '@public/config/jewelry';
import { ShopBrand } from '@public/config/shops';
import { OnNuiEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { NuiEvent, ServerEvent } from '@public/shared/event';
import { MenuType } from '@public/shared/nui/menu';
import { PlayerPedHash } from '@public/shared/player';
import { Vector3 } from '@public/shared/polyzone/vector';
import { JewelryShopItem } from '@public/shared/shop';

import { AnimationService } from '../animation/animation.service';
import { CameraService } from '../camera';
import { NuiMenu } from '../nui/nui.menu';
import { ResourceLoader } from '../resources/resource.loader';

@Provider()
export class JewelryShopProvider {
    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(CameraService)
    private cameraService: CameraService;

    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

    @Inject(AnimationService)
    private animationService: AnimationService;

    public async openShop() {
        const modelHash = GetEntityModel(PlayerPedId());
        const shop_content = modelHash == PlayerPedHash.Male ? MaleJewelryItems : FemaleJewelryItems;

        await this.setupShop();

        this.nuiMenu.openMenu(MenuType.JewelryShop, { shop_content });
    }

    public async setupShop() {
        const ped = PlayerPedId();
        SetEntityHeading(ped, PositionInJewelryShop.PLAYER_HEADING);
        FreezeEntityPosition(ped, true);

        // Setup cam
        const [x, y, z] = GetEntityCoords(ped);
        await this.cameraService.setupCamera(
            [
                x + PositionInJewelryShop.CAMERA_OFFSET_X,
                y + PositionInJewelryShop.CAMERA_OFFSET_Y,
                z + PositionInJewelryShop.CAMERA_OFFSET_Z,
            ] as Vector3,
            [x, y, z + PositionInJewelryShop.CAMERA_TARGET_Z] as Vector3
        );

        // Play idle animation
        const animDict = 'anim@heists@heist_corona@team_idles@male_c';
        this.resourceLoader.loadAnimationDictionary(animDict);

        ClearPedTasksImmediately(ped);
        TaskPlayAnim(ped, animDict, 'idle', 1.0, 1.0, -1, 1, 1, false, false, false);
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
        await this.animationService.clearShopAnimations(PlayerPedId());
        FreezeEntityPosition(PlayerPedId(), false);
    }
}
