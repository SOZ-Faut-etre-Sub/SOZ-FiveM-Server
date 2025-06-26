import { AnimationService } from '@public/client/animation/animation.service';
import { CameraService } from '@public/client/camera';
import { InventoryManager } from '@public/client/inventory/inventory.manager';
import { ItemService } from '@public/client/item/item.service';
import { Notifier } from '@public/client/notifier';
import { InputService } from '@public/client/nui/input.service';
import { NuiMenu } from '@public/client/nui/nui.menu';
import { ResourceLoader } from '@public/client/repository/resource.loader';
import { FemaleJewelryItems, MaleJewelryItems, PositionInJewelryShop } from '@public/config/jewelry';
import { ShopBrand } from '@public/config/shops';
import { OnNuiEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { NuiEvent, ServerEvent } from '@public/shared/event';
import { InventoryItem } from '@public/shared/inventory';
import { NotEmptyStringValidator } from '@public/shared/nui/input';
import { MenuType } from '@public/shared/nui/menu';
import { PlayerPedHash } from '@public/shared/player';
import { Vector3 } from '@public/shared/polyzone/vector';
import { JewelryShopItem } from '@public/shared/shop';

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

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(InputService)
    private inputService: InputService;

    public async openShop() {
        const modelHash = GetEntityModel(PlayerPedId());
        const shop_content = modelHash == PlayerPedHash.Male ? MaleJewelryItems : FemaleJewelryItems;

        await this.setupShop();

        for (const elem of Object.values(shop_content)) {
            for (const item of Object.values(elem.items)) {
                for (const subitem of Object.values(item)) {
                    for (const texture of Object.keys(subitem)) {
                        if (!subitem[texture].Localized.length && subitem[texture].GXT) {
                            subitem[texture].Localized = GetLabelText(subitem[texture].GXT);
                        }
                    }
                }
            }
        }

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
            this.cameraService.deleteAllCameras();
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
        await this.cameraService.deleteAllCameras();
        await this.animationService.clearShopAnimations(PlayerPedId());
        FreezeEntityPosition(PlayerPedId(), false);
    }

    public async openEngraveShop() {
        const engravableItems = [];
        for (const inventoryItem of this.inventoryManager.getItems()) {
            const item = this.itemService.getItem(inventoryItem.name);
            if (!item) {
                continue;
            }

            if (item.canEngrave && !inventoryItem.metadata?.label) {
                engravableItems.push({ inventoryItem, item });
            }
        }
        if (!engravableItems.length) {
            return;
        }

        this.notifier.notify(
            "Bienvenue ! Si tu veux graver un objet, tu es au bon endroit. Fait attention, un objet ne peut être graver qu'une seule fois, ne fait pas d'erreur."
        );
        this.nuiMenu.openMenu(
            MenuType.JewelryEngraveShop,
            { engravableItems },
            {
                position: {
                    position: GetEntityCoords(PlayerPedId(), true) as Vector3,
                    distance: 3,
                },
            }
        );
    }

    @OnNuiEvent(NuiEvent.JewelryShopEngraveItem)
    public async onEngraveItemNui(inventoryItem: InventoryItem) {
        this.nuiMenu.closeMenu();
        const engraveText = await this.inputService.askInput(
            {
                title: 'Que voulez vous gravez ?',
            },
            NotEmptyStringValidator
        );
        if (!engraveText) {
            return;
        }

        const confirm = await this.inputService.askInput(
            {
                title: `Vous avez choisi de graver '${engraveText.trim()}', êtes vous sur ? (oui/non)`,
            },
            NotEmptyStringValidator
        );
        if (!confirm || confirm.toLowerCase().trim() !== 'oui') {
            return;
        }

        TriggerServerEvent(ServerEvent.INVENTORY_ENGRAVE_ITEM, inventoryItem.slot, engraveText.trim());
    }
}
