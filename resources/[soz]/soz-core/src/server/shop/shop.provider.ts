import { ShopBrand } from '@public/config/shops';
import { Component, OutfitItem, Prop } from '@public/shared/cloth';
import { InventoryItemMetadata, ItemType } from '@public/shared/item';
import { Skin } from '@public/shared/player';
import { BarberShopItem, ClothingShopItem, JewelryShopItem, ShopProduct, TattooShopItem } from '@public/shared/shop';

import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { PrismaService } from '../database/prisma.service';
import { InventoryManager } from '../inventory/inventory.manager';
import { Monitor } from '../monitor/monitor';
import { Notifier } from '../notifier';
import { PlayerMoneyService } from '../player/player.money.service';
import { PlayerService } from '../player/player.service';
import { QBCore } from '../qbcore';
import { ClothingShopRepository } from '../repository/cloth.shop.repository';

type CartElement = {
    name: string;
    label: string;
    description: string;
    weight: number;
    slot: number;
    useable: boolean;
    unique: boolean;
    type: ItemType;
    amount: number;
    metadata?: InventoryItemMetadata;
    shouldClose?: boolean;
    illustrator?: Record<string, string> | string;
    disabled?: boolean; // added by inventory on the fly
    shortcut?: string | null; // added by inventory on the fly
    price: number;
};

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

    @Inject(QBCore)
    private qbcore: QBCore;

    @Inject(ClothingShopRepository)
    private clothingShopRepository: ClothingShopRepository;

    @Inject(PrismaService)
    private prismaService: PrismaService;

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
                this.shopClothingBuy(source, product as ClothingShopItem, brand);
                break;
            case ShopBrand.Tattoo:
                this.shopTattooBuy(source, product as TattooShopItem);
                break;
            case ShopBrand.Ammunation:
            case ShopBrand.Supermarket247North:
            case ShopBrand.Supermarket247South:
            case ShopBrand.LtdGasolineNorth:
            case ShopBrand.LtdGasolineSouth:
            case ShopBrand.RobsliquorNorth:
            case ShopBrand.RobsliquorSouth:
            case ShopBrand.Zkea:
                this.shopSuperetteBuy(source, product as ShopProduct, quantity);
                break;
            case ShopBrand.Barber:
                this.shopBarberBuy(source, product as BarberShopItem);
                break;
            case ShopBrand.Jewelry:
                this.shopJewelryBuy(source, product as JewelryShopItem);
                break;
            default:
                console.log(`[ShopProvider] shopBuy: Unknown brand ${brand}`);
                return;
        }
    }

    public async shopBarberBuy(source: number, product: BarberShopItem) {
        if (!this.shopPay(source, product.price)) {
            this.notifier.notify(source, `Ah mais t'es pauvre en fait ! Reviens quand t'auras de quoi payer.`, 'error');
            return;
        }
        const player_skin = this.playerService.getPlayer(source).skin;
        const new_skin: Skin = {
            ...player_skin,
            Hair: {
                ...player_skin.Hair,
                ...product.config.Hair,
            },
            Makeup: {
                ...player_skin.Makeup,
                ...product.config.Makeup,
            },
        };
        this.qbcore.getPlayer(source).Functions.SetSkin(new_skin, false);
        const notif =
            product.overlay == 'Hair'
                ? `Vous avez changé de ~b~coiffure~s~ pour ~g~$${product.price}.`
                : `Vous avez changé de ~b~maquillage~s~ pour ~g~$${product.price}.`;
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
            }
        }
        if (product.props) {
            if (product.overlay == 'Helmet') {
                for (const propId of Object.keys(product.props)) {
                    clothConfig.BaseClothSet.Props[Prop.Helmet] = product.props[propId];
                }
            } else {
                for (const propId of Object.keys(product.props)) {
                    clothConfig.BaseClothSet.Props[propId] = product.props[propId];
                }
            }
        }

        // Update player cloth config through QBCore
        this.qbcore.getPlayer(source).Functions.SetClothConfig(clothConfig, false);

        // Notify player
        this.notifier.notify(
            source,
            `Vous avez acheté un.e ~b~${product.label}~s~ pour ~g~$${product.price}.`,
            'success'
        );
    }

    public async shopClothingBuy(source: number, product: ClothingShopItem, brand: string) {
        if (!this.shopPay(source, product.price)) {
            this.notifier.notify(source, `Ah mais t'es pauvre en fait ! Reviens quand t'auras de quoi payer.`, 'error');
            return;
        }
        const repo = await this.clothingShopRepository.get();
        const stock = repo.shops[brand].stocks[product.id];
        if (stock <= 0) {
            this.notifier.notify(source, `Ce produit n'est plus en stock`, 'error');
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
        repo.shops[brand].stocks[product.id] -= 1;
        await this.clothingShopRepository.set(repo);

        // Update player cloth config
        const clothConfig = this.playerService.getPlayer(source).cloth_config;
        if (product.components && product.correspondingDrawables == null) {
            for (const componentId of Object.keys(product.components)) {
                clothConfig.BaseClothSet.Components[componentId] = product.components[componentId];
            }
        }
        if (product.props && product.correspondingDrawables == null) {
            for (const propId of Object.keys(product.props)) {
                clothConfig.BaseClothSet.Props[propId] = product.props[propId];
            }
        }
        if (product.correspondingDrawables) {
            clothConfig.BaseClothSet.Gloves = {};
            for (const baseTorsoDrawable of Object.keys(product.correspondingDrawables)) {
                clothConfig.BaseClothSet.Gloves[baseTorsoDrawable] = {
                    Drawable: product.correspondingDrawables[baseTorsoDrawable],
                    Texture: product.components[Component.Torso].Texture,
                    Palette: 0,
                } as OutfitItem;
            }
        }

        // Update player cloth config through QBCore
        this.qbcore.getPlayer(source).Functions.SetClothConfig(clothConfig, false);

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
        const skin = this.playerService.getPlayer(source).skin;
        skin.Tattoos.push({
            Collection: GetHashKey(product.Collection),
            Overlay: GetHashKey(product[overlayField]),
        });
        this.qbcore.getPlayer(source).Functions.SetSkin(skin, false);
        this.notifier.notify(source, `Vous venez de vous faire tatouer pour ~g~$${product.Price}`, 'success');
    }

    @OnEvent(ServerEvent.SHOP_TATTOO_RESET)
    public async shopTattooReset(source: number) {
        const player = this.playerService.getPlayer(source);
        const skin = player.skin;
        skin.Tattoos = [];
        this.qbcore.getPlayer(source).Functions.SetSkin(skin, false);
        this.notifier.notify(source, `Vous venez de vous faire retirer tous vos tatouages`, 'success');
    }

    public async shopSuperetteBuy(source: number, product: ShopProduct, quantity: number) {
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
        const player = this.qbcore.getPlayer(source);
        return player.Functions.RemoveMoney('money', price);
    }
}
