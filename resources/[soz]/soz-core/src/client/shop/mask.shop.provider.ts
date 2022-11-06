import { Once, OnceStep, OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { emitRpc } from '../../core/rpc';
import { Outfit } from '../../shared/cloth';
import { NuiEvent, ServerEvent } from '../../shared/event';
import { MenuType } from '../../shared/nui/menu';
import { Vector3 } from '../../shared/polyzone/vector';
import { Ok, Result } from '../../shared/result';
import { RpcEvent } from '../../shared/rpc';
import { CameraService } from '../camera';
import { ClothingService } from '../clothing/clothing.service';
import { NuiDispatch } from '../nui/nui.dispatch';
import { NuiMenu } from '../nui/nui.menu';
import { PlayerService } from '../player/player.service';
import { Qbcore } from '../qbcore';
import { TargetFactory } from '../target/target.factory';

@Provider()
export class MaskShopProvider {
    @Inject(Qbcore)
    private qbCore: Qbcore;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(ClothingService)
    private clothingService: ClothingService;

    @Inject(CameraService)
    private cameraService: CameraService;

    private readonly PLAYER_POSITION: Vector3 = [-1337.08, -1279.66, 3.85];

    private readonly CAMERA_TARGET: Vector3 = [-1337.08, -1279.66, 5.05];

    private readonly CAMERA_POSITION: Vector3 = [-1336.26, -1278.35, 5.65];

    private hasMenuBeenOpenedAtLeastOnce = false;

    @OnNuiEvent(NuiEvent.ShopMaskPreview)
    public async previewOutfit(outfit: Outfit) {
        for (const [componentIndex, component] of Object.entries(outfit.Components)) {
            this.clothingService.applyComponent(Number(componentIndex), component);
        }
        return Ok(true);
    }

    @OnNuiEvent(NuiEvent.MenuClosed)
    public async resetSkin() {
        if (!this.hasMenuBeenOpenedAtLeastOnce) {
            return;
        }
        this.cameraService.deleteCamera();
        TriggerEvent('soz-character:Client:ApplyCurrentClothConfig');
        TriggerEvent('soz-character:Client:ApplyCurrentSkin');
        FreezeEntityPosition(PlayerPedId(), false);
    }

    public async onShopMaskOpenMenu() {
        const categories = await emitRpc(RpcEvent.SHOP_MASK_GET_CATEGORIES);

        this.nuiMenu.openMenu(MenuType.MaskShop, categories);
        this.hasMenuBeenOpenedAtLeastOnce = true;
        FreezeEntityPosition(PlayerPedId(), true);
    }

    @OnNuiEvent(NuiEvent.ShopMaskSelectCategory)
    public async onShopMaskSelectCategory(categoryId: number): Promise<Result<any, never>> {
        const items = await emitRpc(RpcEvent.SHOP_MASK_GET_ITEMS, categoryId);

        return Ok(items);
    }

    @OnNuiEvent(NuiEvent.ShopMaskBuy)
    public async onShopMaskBuy(itemId: number) {
        TriggerServerEvent(ServerEvent.SHOP_MASK_BUY, itemId);
    }

    @Once(OnceStep.PlayerLoaded)
    onPlayerLoaded() {
        this.qbCore.createBlip('shops:mask', {
            name: 'Magasin de masques',
            coords: { x: -1336.88, y: -1279.65, z: 4.85 },
            sprite: 362,
        });

        this.targetFactory.createForBoxZone(
            'shops:mask',
            {
                center: [-1335.76, -1278.67, 4.86],
                length: 1.6,
                width: 0.8,
                minZ: 3.86,
                maxZ: 5.26,
                heading: 20,
            },
            [
                {
                    label: 'Acheter un masque',
                    icon: 'c:shop/mask.png',
                    blackoutGlobal: true,
                    action: async () => {
                        SetEntityCoords(
                            PlayerPedId(),
                            this.PLAYER_POSITION[0],
                            this.PLAYER_POSITION[1],
                            this.PLAYER_POSITION[2],
                            false,
                            false,
                            false,
                            false
                        );
                        SetEntityHeading(PlayerPedId(), 316.75);
                        this.cameraService.setupCamera(this.CAMERA_POSITION, this.CAMERA_TARGET);
                        await this.onShopMaskOpenMenu();
                    },
                },
            ]
        );
    }
}
