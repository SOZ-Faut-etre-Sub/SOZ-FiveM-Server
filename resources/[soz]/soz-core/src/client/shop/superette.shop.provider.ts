import { ShopBrand } from '@public/config/shops';
import { OnNuiEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { NuiEvent, ServerEvent } from '@public/shared/event';
import { MenuType } from '@public/shared/nui/menu';
import { Err, Ok } from '@public/shared/result';
import { ShopProduct } from '@public/shared/shop';
import { ShopsContent, SuperetteItem } from '@public/shared/shop/superette';

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

    public openShop(brand: ShopBrand) {
        if (brand != ShopBrand.Zkea && brand != ShopBrand.Ammunation) {
            const superetteContent: SuperetteItem[] = [];
            for (let i = 0; i < ShopsContent[brand].length; i++) {
                const sharedItem = {
                    ...this.itemService.getItem(ShopsContent[brand][i].id),
                    price: ShopsContent[brand][i].price,
                    amount: 2000,
                    slot: i,
                } as SuperetteItem;
                superetteContent.push(sharedItem);
            }
            exports['soz-inventory'].openShop(superetteContent); // Superettes are handled by soz-inventory
        } else {
            // Zkea and Ammunation are handled by soz-core here
            const licences = this.playerService.getPlayer().metadata.licences;
            const products = ShopsContent[brand]
                .filter(product => !product.requiredLicense || licences[product.requiredLicense])
                .map(product => ({
                    ...product,
                    item: this.itemService.getItem(product.id),
                }));
            if (!products) {
                console.error(`Shop ${brand} not found`);
                return;
            }
            this.nuiMenu.openMenu(MenuType.SuperetteShop, { brand, products });
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
                (input: string) => {
                    const value = parseInt(input);
                    if (isNaN(value) || value < 0) {
                        return Err('Quantité invalide');
                    }
                    return Ok(true);
                }
            );
            if (!value) {
                return;
            }
            quantity = parseInt(value);
        }

        TriggerServerEvent(ServerEvent.SHOP_BUY, product, ShopBrand.Zkea, quantity);
    }
}
