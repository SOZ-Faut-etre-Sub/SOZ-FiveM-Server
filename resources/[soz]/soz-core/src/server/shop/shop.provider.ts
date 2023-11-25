import { ShopBrand, UndershirtCategoryNeedingReplacementTorso } from '@public/config/shops';
import { Component, OutfitItem, Prop } from '@public/shared/cloth';
import { TenueIdToHide } from '@public/shared/player';
import {
    BarberShopItem,
    ClothingCategoryID,
    ClothingShopItem,
    JewelryShopItem,
    ShopProduct,
    TattooShopItem,
} from '@public/shared/shop';
import { CartElement } from '@public/shared/shop/superette';

import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Logger } from '../../core/logger';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { PrismaService } from '../database/prisma.service';
import { InventoryManager } from '../inventory/inventory.manager';
import { Monitor } from '../monitor/monitor';
import { Notifier } from '../notifier';
import { PlayerMoneyService } from '../player/player.money.service';
import { PlayerService } from '../player/player.service';
import { ClothingShopRepository } from '../repository/cloth.shop.repository';

@Provider()
export class ShopProvider {
    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(PlayerMoneyService)
    private playerMoneyService: PlayerMoneyService;

    @Inject(Monitor)
    private monitor: Monitor;

    @Inject(ClothingShopRepository)
    private clothingShopRepository: ClothingShopRepository;

    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(Logger)
    private logger: Logger;

    @OnEvent(ServerEvent.SHOP_VALIDATE_CART)
    public async onShopMaskBuy(source: number, cartContent: CartElement[]) {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        let cartAmount = 0;
        let cartWeight = 0;

        cartContent.map(item => {
            cartAmount = cartAmount + item.amount * item.price;
            cartWeight = cartWeight + item.amount * item.weight;
        });

        const canCarryCart = this.inventoryManager.canCarryItems(source, cartContent);
        TriggerClientEvent(ClientEvent.ANIMATION_GIVE, source);

        if (!canCarryCart) {
            this.notifier.notify(source, 'Vous ne pouvez pas porter cette quantité...', 'error');
            return;
        }

        if (!this.playerMoneyService.remove(source, cartAmount, 'money')) {
            this.notifier.notify(source, "Vous n'avez pas assez d'argent", 'error');
            return;
        }

        cartContent.map(item => {
            if (!item.unique) {
                this.inventoryManager.addItemToInventory(source, item.name, item.amount, item.metadata);
            } else {
                for (let i = 0; i < item.amount; i++) {
                    this.inventoryManager.addItemToInventory(source, item.name, 1, item.metadata);
                }
            }
        });

        this.notifier.notify(source, `Votre achat a bien été validé ! Merci. Prix : ~g~$${cartAmount}`, 'success');

        this.monitor.publish(
            'Shop Buy',
            { player_source: source },
            { cartContent: cartContent, cartPrice: cartAmount }
        );
    }

    @OnEvent(ServerEvent.SHOP_BUY)
    public async shopBuy(
        source: number,
        product: ClothingShopItem | TattooShopItem | ShopProduct | JewelryShopItem | BarberShopItem,
        brand: string,
        quantity = 1
    ) {
        switch (brand) {
            case ShopBrand.Binco:
            case ShopBrand.Ponsonbys:
            case ShopBrand.Suburban:
            case ShopBrand.Mask:
                this.shopClothingBuy(source, product as ClothingShopItem, brand);
                break;
            case ShopBrand.Tattoo:
                this.shopTattooBuy(source, product as TattooShopItem);
                break;
            case ShopBrand.Supermarket247North:
            case ShopBrand.Supermarket247South:
            case ShopBrand.Supermarket247Cayo:
            case ShopBrand.LtdGasolineNorth:
            case ShopBrand.LtdGasolineSouth:
            case ShopBrand.RobsliquorNorth:
            case ShopBrand.RobsliquorSouth:
                this.logger.error(`[ShopProvider] shopBuy: Not implemented shop ${brand}`);
                break;
            case ShopBrand.Ammunation:
            case ShopBrand.Zkea:
                this.shopGeneralBuy(source, product as ShopProduct, quantity);
                break;
            case ShopBrand.Barber:
                this.shopBarberBuy(source, product as BarberShopItem);
                break;
            case ShopBrand.Jewelry:
                this.shopJewelryBuy(source, product as JewelryShopItem);
                break;
            default:
                this.logger.warn(`[ShopProvider] shopBuy: Unknown brand ${brand}`);
                return;
        }
    }

    @OnEvent(ServerEvent.ZKEA_CHECK_STOCK)
    public async zkeaCheckStock(source: number) {
        const amount = this.inventoryManager.getItemCount('cabinet_storage', 'cabinet_zkea');
        this.notifier.notify(source, `Il reste ${amount} ~b~meubles Zkea~s~ en stock.`, 'info');
    }

    @OnEvent(ServerEvent.LSC_CHECK_STOCK)
    public async lscCheckStock(source: number) {
        const amount = this.inventoryManager.getItemCount('ls_custom_storage', 'ls_custom_upgrade_part');
        this.notifier.notify(
            source,
            `Il reste ${amount || 0} ~b~Pièces d'amélioration certifiées~s~ en stock.`,
            'info'
        );
    }

    public async shopBarberBuy(source: number, product: BarberShopItem) {
        if (!this.shopPay(source, product.price)) {
            this.notifier.notify(source, `Ah mais t'es pauvre en fait ! Reviens quand t'auras de quoi payer.`, 'error');
            return;
        }
        this.playerService.updateSkin(
            source,
            skin => {
                return {
                    ...skin,
                    Hair: {
                        ...skin.Hair,
                        ...product.config.Hair,
                    },
                    Makeup: {
                        ...skin.Makeup,
                        ...product.config.Makeup,
                    },
                    FaceTrait: {
                        ...skin.FaceTrait,
                        ...product.config.FaceTraits,
                    },
                };
            },
            false
        );

        let label = 'coiffure';
        switch (product.overlay) {
            case 'Hair':
                break;
            case 'Makeup':
                label = 'maquillage';
                break;
            case 'FaceTraits':
                label = 'lentilles';
                break;

            default:
                break;
        }

        const notif = `Vous avez changé de ~b~${label}~s~ pour ~g~$${product.price}.`;

        this.notifier.notify(source, notif, 'success');
    }

    public async shopJewelryBuy(source: number, product: JewelryShopItem) {
        if (!this.shopPay(source, product.price)) {
            this.notifier.notify(source, `Ah mais t'es pauvre en fait ! Reviens quand t'auras de quoi payer.`, 'error');
            return;
        }

        // Update player cloth config
        const clothConfig = this.playerService.getPlayer(source).cloth_config;
        if (product.components) {
            for (const componentId of Object.keys(product.components)) {
                clothConfig.BaseClothSet.Components[componentId] = product.components[componentId];
                const HideToReset = TenueIdToHide.Components[componentId];
                if (HideToReset) {
                    clothConfig.Config[HideToReset] = false;
                }
            }
        }
        if (product.props) {
            if (product.overlay == 'Helmet') {
                for (const propId of Object.keys(product.props)) {
                    clothConfig.BaseClothSet.Props[Prop.Helmet] = product.props[propId];
                    clothConfig.Config.ShowHelmet = true;
                }
            } else {
                for (const propId of Object.keys(product.props)) {
                    clothConfig.BaseClothSet.Props[propId] = product.props[propId];
                    const HideToReset = TenueIdToHide.Props[propId];
                    if (HideToReset) {
                        clothConfig.Config[HideToReset] = false;
                    }
                }
            }
        }

        // BaseClothSet.Props needs to be an object for soz-character
        clothConfig.BaseClothSet.Props = Object.assign({}, clothConfig.BaseClothSet.Props);

        // Update player cloth config through playerService
        this.playerService.updateClothConfig(source, 'BaseClothSet', clothConfig.BaseClothSet, false);
        this.playerService.updateClothConfig(source, 'Config', clothConfig.Config, false);

        // Notify player
        this.notifier.notify(
            source,
            `Vous avez acheté un.e ~b~${product.label}~s~ pour ~g~$${product.price}.`,
            'success'
        );
    }

    public async shopClothingBuy(source: number, product: ClothingShopItem, brand: string) {
        const repo = await this.clothingShopRepository.get();
        const shopCategories = repo.categories[this.playerService.getPlayer(source).skin.Model.Hash][product.shopId];
        const shopItem = shopCategories[product.categoryId].content[product.modelLabel].find(
            item => item.id == product.id
        );
        const stock = shopItem.stock;
        if (stock <= 0) {
            this.notifier.notify(source, `Ce produit n'est plus en stock`, 'error');
            return;
        }

        if (!this.shopPay(source, product.price)) {
            this.notifier.notify(source, `Ah mais t'es pauvre en fait ! Reviens quand t'auras de quoi payer.`, 'error');
            return;
        }

        // Update BDD
        await this.prismaService.shop_content.update({
            where: {
                id: product.id,
            },
            data: {
                stock: {
                    decrement: 1,
                },
            },
        });

        // Update repository
        shopItem.stock -= 1;
        await this.clothingShopRepository.set(repo);

        const clothSet = product.categoryId == ClothingCategoryID.UNDERWEARS ? 'NakedClothSet' : 'BaseClothSet';

        // Update player cloth config
        const clothConfig = this.playerService.getPlayer(source).cloth_config;
        if (product.components && product.correspondingDrawables == null) {
            for (const componentId of Object.keys(product.components)) {
                clothConfig[clothSet].Components[componentId] = product.components[componentId];
                const HideToReset = TenueIdToHide.Components[componentId];
                if (HideToReset) {
                    clothConfig.Config[HideToReset] = false;
                }
            }
        }
        if (product.props && product.correspondingDrawables == null) {
            for (const propId of Object.keys(product.props)) {
                clothConfig[clothSet].Props[propId] = product.props[propId];
                const HideToReset = TenueIdToHide.Props[propId];
                if (HideToReset) {
                    clothConfig.Config[HideToReset] = false;
                }
            }
        }

        if (product.correspondingDrawables) {
            clothConfig.BaseClothSet.GlovesID = product.id;
            clothConfig.Config.HideGloves = false;
        }

        if (product.underTypes) {
            clothConfig.BaseClothSet.TopID = product.id;
        }

        // Adapt torso to undershirt
        const playerModel = this.playerService.getPlayer(source).skin.Model.Hash;
        if (product.undershirtType && UndershirtCategoryNeedingReplacementTorso[playerModel][product.undershirtType]) {
            const baseTorsoDrawable = clothConfig.BaseClothSet.Components[Component.Torso].Drawable;
            const replacementTorsoDrawable =
                UndershirtCategoryNeedingReplacementTorso[playerModel][product.undershirtType][baseTorsoDrawable];
            if (replacementTorsoDrawable) {
                clothConfig.BaseClothSet.Components[Component.Torso] = {
                    Drawable: replacementTorsoDrawable,
                    Texture: 0,
                    Palette: 0,
                } as OutfitItem;
            }
        }

        // Update player cloth config through playerService
        this.playerService.updateClothConfig(source, 'BaseClothSet', clothConfig.BaseClothSet, false);
        this.playerService.updateClothConfig(source, 'Config', clothConfig.Config, false);
        this.playerService.updateClothConfig(source, 'NakedClothSet', clothConfig.NakedClothSet, false);

        // Update player stocks
        TriggerClientEvent(ClientEvent.SHOP_UPDATE_STOCKS, source, brand);

        // Notify player
        this.notifier.notify(
            source,
            `Vous avez acheté un.e ~b~${product.label}~s~ pour ~g~$${product.price}.`,
            'success'
        );
    }

    public async shopTattooBuy(source: number, product: TattooShopItem) {
        const modelHash = this.playerService.getPlayer(source).skin.Model.Hash;
        const overlayField = modelHash === GetHashKey('mp_m_freemode_01') ? 'HashNameMale' : 'HashNameFemale';
        if (!product || !product.Collection || !product[overlayField] || !product[overlayField].length) {
            this.notifier.notify(source, `Une erreur s'est produite, désolé.`, 'error');
            return;
        }
        if (!this.shopPay(source, product.Price)) {
            this.notifier.notify(source, `Ah mais t'es pauvre en fait ! Reviens quand t'auras de quoi payer.`, 'error');
            return;
        }
        this.playerService.updateSkin(
            source,
            skin => {
                return {
                    ...skin,
                    Tattoos: [
                        ...skin.Tattoos,
                        {
                            Collection: GetHashKey(product.Collection),
                            Overlay: GetHashKey(product[overlayField]),
                        },
                    ],
                };
            },
            false
        );
        this.notifier.notify(source, `Vous venez de vous faire tatouer pour ~g~$${product.Price}`, 'success');
    }

    @OnEvent(ServerEvent.SHOP_TATTOO_RESET)
    public async shopTattooReset(source: number) {
        const player = this.playerService.getPlayer(source);
        const skin = player.skin;
        skin.Tattoos = [];
        this.playerService.updateSkin(
            source,
            skin => {
                return {
                    ...skin,
                    Tattoos: [],
                };
            },
            false
        );
        this.notifier.notify(source, `Vous venez de vous faire retirer tous vos tatouages`, 'success');
    }

    public async shopGeneralBuy(source: number, product: ShopProduct, quantity: number) {
        if (quantity < 1) {
            return;
        }
        const player = this.playerService.getPlayer(source);
        if (product.requiredLicense && !player.metadata.licences[product.requiredLicense]) {
            this.notifier.notify(source, "Vous n'avez pas le permis nécessaire", 'error');
            return;
        }
        if (!this.inventoryManager.canCarryItem(source, product.id, quantity)) {
            this.notifier.notify(source, `Vous n'avez pas assez de place dans votre inventaire`, 'error');
            return;
        }
        if (!this.shopPay(source, product.price * quantity)) {
            this.notifier.notify(source, `Ah mais t'es pauvre en fait ! Reviens quand t'auras de quoi payer.`, 'error');
            return;
        }
        if (this.inventoryManager.addItemToInventory(source, product.id, quantity, product.metadata)) {
            this.notifier.notify(
                source,
                `Vous avez acheté ~b~${quantity} ${product.item.label}~s~ pour ~g~$${product.price * quantity}`
            );
        } else {
            this.notifier.notify(source, `Oups, une erreur est survenue... Réessaye !`, 'error');
        }
    }

    public shopPay(source: number, price: number): boolean {
        return this.playerMoneyService.remove(source, price, 'money');
    }
}
