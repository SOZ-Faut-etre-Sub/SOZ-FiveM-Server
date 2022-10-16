import { Once, OnceStep, OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { emitRpc } from '../../core/rpc';
import { Component, OutfitItem } from '../../shared/cloth';
import { NuiEvent, ServerEvent } from '../../shared/event';
import { Feature, isFeatureEnabled } from '../../shared/features';
import { MenuType } from '../../shared/nui/menu';
import { Ok, Result } from '../../shared/result';
import { RpcEvent } from '../../shared/rpc';
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

    @OnNuiEvent(NuiEvent.ShopMaskPreview)
    public async previewOutfitComponents(components: Partial<Record<Component, OutfitItem>>) {
        for (const [componentIndex, component] of Object.entries(components)) {
            this.clothingService.applyComponent(Number(componentIndex), component);
        }
        return Ok(true);
    }

    @OnNuiEvent(NuiEvent.MenuClosed)
    public async resetSkin() {
        TriggerEvent('soz-character:Client:ApplyCurrentClothConfig');
        TriggerEvent('soz-character:Client:ApplyCurrentSkin');
    }

    public async onShopMaskOpenMenu() {
        const categories = await emitRpc(RpcEvent.SHOP_MASK_GET_CATEGORIES);

        this.nuiMenu.openMenu(MenuType.MaskShop, categories);
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
        if (!isFeatureEnabled(Feature.Halloween)) {
            return;
        }

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
                        await this.onShopMaskOpenMenu();
                    },
                },
            ]
        );
    }
}
