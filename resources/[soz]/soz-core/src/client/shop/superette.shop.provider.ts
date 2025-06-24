import { InventoryManager } from '@public/client/inventory/inventory.manager';
import { NoZoneShopBrand, ShopBrand } from '@public/config/shops';
import { OnNuiEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { NuiEvent, ServerEvent } from '@public/shared/event';
import { PositiveNumberValidator } from '@public/shared/nui/input';
import { ShopProduct } from '@public/shared/shop';
import { ShopItem, ShopsContent, WhatIfSuperetteContent } from '@public/shared/shop/superette';
import { TaxType } from '@public/shared/tax';

import { Feature } from '../../shared/features';
import { FeatureProvider } from '../feature/feature.provider';
import { ItemService } from '../item/item.service';
import { InputService } from '../nui/input.service';
import { NuiMenu } from '../nui/nui.menu';
import { PlayerService } from '../player/player.service';

const SOUVENIR_BRAND = [
    ShopBrand.SouvenirJewel,
    ShopBrand.SouvenirMemory,
    ShopBrand.SouvenirOther,
    ShopBrand.SouvenirPlush,
    NoZoneShopBrand.SouvenirFIB,
];

const FOOD_BRAND: (ShopBrand | NoZoneShopBrand)[] = [
    ShopBrand.LtdGasolineNorth,
    ShopBrand.LtdGasolineSouth,
    ShopBrand.RobsliquorNorth,
    ShopBrand.RobsliquorSouth,
    ShopBrand.Supermarket247North,
    ShopBrand.Supermarket247South,
    ShopBrand.Supermarket247Cayo,
];

const EXTRA_FOOD_WHATIF = [
    'wine1',
    'grapejuice1',
    'cheese1',
    'sausage1',
    'beef_symfony_truffle',
    'crunchy_lamp_chop',
    'rosmarino_veal_filet',
    'spicy_sichuan_duck_breast',
    'scallops_goldn_corn',
    'deep_sea_turbot',
    'herbarium_cod',
    'ocean_awakening',
    'tropical_goat_curry',
    'tikka_royal',
    'sand_tagine',
    'end_world_tataki',
    'popcorn',
    'fruit_salad',
    'lemon_cheesecake',
    'creamed_corn',
    'vegetable_festival',
    'cabbage_salad',
    'stuffed_tomatoes',
    'veggie_gathering',
    'country_feast',
    'fried_potatoes',
    'vegetable_dance',
    'autumn_symphony',
    'pumpkin_potage',
    'smoothie_fruity',
    'apple_juice_drink',
    'tomato_juice',
    'orange_juice_drink',
    'multifruit',
    'pumpkin_lemonade',
    'lemonade_bottle',
    'tomato_tonic',
    'cabbage_chaos',
    'fresh_tomachou',
];

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

    @Inject(FeatureProvider)
    private featureProvider: FeatureProvider;

    public openShop(brand: ShopBrand | NoZoneShopBrand, shop: string, shopLabel: string = 'Boutique') {
        const superetteContent: ShopItem[] = [];

        let rawProducts = ShopsContent[brand];

        if (brand === ShopBrand.Ammunation) {
            const licences = this.playerService.getPlayer().metadata.licences;
            rawProducts = rawProducts.filter(product => !product.requiredLicense || licences[product.requiredLicense]);
        }

        for (let i = 0; i < rawProducts.length; i++) {
            const sharedItem = {
                ...this.itemService.getItem(rawProducts[i].id),
                price: rawProducts[i].price,
                metadata: rawProducts[i].metadata,
            } as ShopItem;
            superetteContent.push(sharedItem);
        }

        if (this.featureProvider.isFeatureEnabled(Feature.WhatIfFirstEpisode) && FOOD_BRAND.includes(brand)) {
            for (const item of EXTRA_FOOD_WHATIF) {
                const sharedItem = {
                    ...this.itemService.getItem(item),
                    price: 5,
                    metadata: {},
                } as ShopItem;
                superetteContent.push(sharedItem);
            }

            superetteContent.push(
                ...WhatIfSuperetteContent.map(elem => ({
                    ...this.itemService.getItem(elem.id),
                    price: elem.price,
                    metadata: elem.metadata,
                }))
            );
        }

        let taxes = null;
        if (brand === ShopBrand.Zkea) {
            taxes = TaxType.SERVICE;
        } else if (SOUVENIR_BRAND.includes(brand)) {
            taxes = TaxType.SUPPLY;
        } else if (brand !== ShopBrand.Supermarket247Cayo) {
            taxes = TaxType.FOOD;
        }

        this.inventoryManager.openShopInventory(superetteContent, shopLabel, taxes);
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
