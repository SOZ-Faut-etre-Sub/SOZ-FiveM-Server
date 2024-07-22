import { Logger } from '@core/logger';
import { InventoryManager } from '@public/client/inventory/inventory.manager';
import { ShopBrand, ShopsConfig } from '@public/config/shops';
import { OnNuiEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { TaxType } from '@public/shared/bank';
import { NuiEvent, ServerEvent } from '@public/shared/event';
import { PositiveNumberValidator } from '@public/shared/nui/input';
import { MenuType } from '@public/shared/nui/menu';
import { Vector4 } from '@public/shared/polyzone/vector';
import { ShopProduct } from '@public/shared/shop';
import { ShopItem, ShopsContent } from '@public/shared/shop/superette';

import { ItemService } from '../item/item.service';
import { InputService } from '../nui/input.service';
import { NuiMenu } from '../nui/nui.menu';
import { PlayerService } from '../player/player.service';

@Provider()
export class SuperetteShopProvider {
    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(InputService)
    private inputService: InputService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(Logger)
    private logger: Logger;

    public openShop(brand: ShopBrand, shop: string) {
        if (brand != ShopBrand.Ammunation) {
            const superetteContent: ShopItem[] = [];
            for (let i = 0; i < ShopsContent[brand].length; i++) {
                const sharedItem = {
                    ...this.itemService.getItem(ShopsContent[brand][i].id),
                    price: ShopsContent[brand][i].price,
                } as ShopItem;
                superetteContent.push(sharedItem);
            }

            let taxes = null;
            if (brand === ShopBrand.Zkea) {
                taxes = TaxType.SERVICE;
            } else if (brand !== ShopBrand.Supermarket247Cayo) {
                taxes = TaxType.FOOD;
            }
            this.inventoryManager.openShopInventory(superetteContent, 'menu_shop_supermarket', taxes);
        } else {
            // Ammunation are handled by soz-core here
            const licences = this.playerService.getPlayer().metadata.licences;
            const products = ShopsContent[brand]
                .filter(product => !product.requiredLicense || licences[product.requiredLicense])
                .map(product => ({
                    ...product,
                    item: this.itemService.getItem(product.id),
                }));

            if (!products) {
                this.logger.error(`Shop ${brand} not found`);
                return;
            }

            this.nuiMenu.openMenu(
                MenuType.SuperetteShop,
                { brand, products },
                {
                    position: {
                        position: ShopsConfig[shop].location as Vector4,
                        distance: 6.0,
                    },
                }
            );
        }
    }

    @OnNuiEvent(NuiEvent.SuperetteShopBuy)
    public async onBuySuperette(product: ShopProduct) {
        let quantity = 1;

        if (product.type !== 'weapon') {
            const value = await this.inputService.askInput(
                {
                    title: 'Quantité à acheter',
                    defaultValue: '1',
                    maxCharacters: 3,
                },
                PositiveNumberValidator
            );

            if (!value) {
                return;
            }

            quantity = value;
        }

        TriggerServerEvent(
            ServerEvent.SHOP_BUY,
            product,
            product.type === 'weapon' || product.type === 'weapon_ammo' ? ShopBrand.Ammunation : ShopBrand.Zkea,
            quantity
        );
    }
}
