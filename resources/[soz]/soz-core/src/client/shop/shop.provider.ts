import { BrandsConfig, ShopBrand, ShopsConfig } from '@public/config/shops';
import { Once, OnceStep, OnEvent } from '@public/core/decorators/event';
import { Exportable } from '@public/core/decorators/exports';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { JobType } from '@public/shared/job';
import { Vector3, Vector4 } from '@public/shared/polyzone/vector';

import { BlipFactory } from '../blip';
import { PedFactory } from '../factory/ped.factory';
import { InventoryManager } from '../inventory/inventory.manager';
import { StonkCollectProvider } from '../job/stonk/stonk.collect.provider';
import { PlayerService } from '../player/player.service';
import { TargetFactory, TargetOptions } from '../target/target.factory';
import { BarberShopProvider } from './barber.shop.provider';
import { ClothingShopProvider } from './cloth.shop.provider';
import { JewelryShopProvider } from './jewelry.shop.provider';
import { ShopInfo, ShopPedEntity } from './shop.service';
import { SuperetteShopProvider } from './superette.shop.provider';
import { TattooShopProvider } from './tattoo.shop.provider';

type shopPedData = {
    entity: number;
    location: number[];
};

@Provider()
export class ShopProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Inject(PedFactory)
    private pedFactory: PedFactory;

    @Inject(SuperetteShopProvider)
    private superetteShopProvider: SuperetteShopProvider;

    @Inject(ClothingShopProvider)
    private clothingShopProvider: ClothingShopProvider;

    @Inject(StonkCollectProvider)
    private stonkCollectProvider: StonkCollectProvider;

    @Inject(TattooShopProvider)
    private tattooShopProvider: TattooShopProvider;

    @Inject(JewelryShopProvider)
    private jewelryShopProvider: JewelryShopProvider;

    @Inject(BarberShopProvider)
    private barberShopProvider: BarberShopProvider;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    private currentShop: string = null;
    private currentShopBrand: ShopBrand = null;

    private shopsPedEntity: Record<string, shopPedData> = {};

    public shopActions: TargetOptions[] = [
        {
            icon: 'fas fa-shopping-cart',
            label: 'Accéder au magasin',
            canInteract: entity => {
                return (
                    this.currentShop !== null &&
                    !IsEntityPlayingAnim(entity, 'random@robbery', 'robbery_main_female', 3)
                );
            },
            blackoutGlobal: true,
            action: this.openShop.bind(this),
        },
        {
            icon: 'fas fa-store',
            event: 'soz-core:client:weapon:open-gunsmith',
            label: 'Accéder au GunSmith',
            canInteract: () => {
                return this.currentShop !== null && this.currentShopBrand === ShopBrand.Ammunation;
            },
        },
        {
            icon: 'c:stonk/collecter.png',
            label: 'Collecter',
            canInteract: () => {
                return this.stonkCollectProvider.canBagsBeCollected(this.currentShopBrand);
            },
            blackoutGlobal: true,
            blackoutJob: JobType.CashTransfer,
            action: () => {
                TriggerServerEvent(ServerEvent.STONK_COLLECT, this.currentShopBrand, this.currentShop);
            },
        },
        {
            icon: 'fas fa-store',
            label: 'Vérfier le stock',
            canInteract: () => {
                return this.currentShop !== null && this.currentShopBrand === ShopBrand.Zkea;
            },
            blackoutGlobal: true,
            action: () => {
                TriggerServerEvent(ServerEvent.ZKEA_CHECK_STOCK);
            },
        },
        {
            event: ClientEvent.HOUSING_OPEN_UPGRADES_MENU,
            icon: 'fas fa-store',
            label: 'Améliorations',
            blackoutGlobal: true,
            canInteract: () => {
                const player = this.playerService.getPlayer();
                if (!player.apartment || !player.apartment.owner) {
                    return false;
                }
                if (player.apartment.owner !== player.citizenid) {
                    return false;
                }
                return this.currentShop !== null && this.currentShopBrand === ShopBrand.Zkea;
            },
        },
        {
            event: ClientEvent.CRIMI_REMOVE_CLOTH,
            label: 'Enlever la tenue temporaire',
            color: 'crimi',
            canInteract: () => {
                const player = this.playerService.getPlayer();
                if (player.cloth_config.TemporaryClothSet == null) {
                    return false;
                }
                return (
                    this.currentShop !== null &&
                    (this.currentShopBrand === ShopBrand.Ponsonbys ||
                        this.currentShopBrand === ShopBrand.Suburban ||
                        this.currentShopBrand === ShopBrand.Binco)
                );
            },
        },
    ];

    @Once(OnceStep.PlayerLoaded)
    public async onPlayerLoaded() {
        for (const shop in ShopsConfig) {
            const config = ShopsConfig[shop];
            const brandConfig = BrandsConfig[config.brand];
            if (brandConfig.blipSprite) {
                this.blipFactory.create('shops_' + shop, {
                    name: brandConfig.label,
                    coords: { x: config.location[0], y: config.location[1], z: config.location[2] },
                    sprite: brandConfig.blipSprite,
                    color: brandConfig.blipColor,
                });
            }
            if (brandConfig.pedModel) {
                const pedId = await this.pedFactory.createPed({
                    model: brandConfig.pedModel,
                    coords: {
                        x: config.location[0],
                        y: config.location[1],
                        z: config.location[2] - 1,
                        w: config.location[3],
                    },
                    freeze: true,
                    invincible: true,
                    blockevents: true,
                    scenario: 'WORLD_HUMAN_STAND_IMPATIENT',
                });
                this.shopsPedEntity[shop] = { entity: pedId, location: config.location } as shopPedData;
            }
        }
        // Special for mask shop
        this.targetFactory.createForBoxZone(
            'shops:mask',
            {
                center: ShopsConfig[ShopBrand.Mask].location as Vector3,
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
                    action: () => {
                        this.currentShopBrand = ShopBrand.Mask;
                        this.openShop();
                    },
                },
                {
                    label: 'Restock: Masques',
                    icon: 'c:/ffs/restock.png',
                    color: 'ffs',
                    job: 'ffs',
                    blackoutGlobal: true,
                    blackoutJob: 'ffs',
                    canInteract: () => {
                        return this.playerService.isOnDuty() && this.inventoryManager.hasEnoughItem('garment_mask', 1);
                    },
                    action: () => {
                        TriggerServerEvent(ServerEvent.FFS_RESTOCK, ShopBrand.Mask, 'garment_mask');
                    },
                },
            ]
        );
        TriggerEvent('shops:client:shop:PedSpawned');
    }

    @Once(OnceStep.Stop)
    public async onPlayerStop() {
        for (const shop in ShopsConfig) {
            if (
                !this.shopsPedEntity[shop] == null &&
                this.shopsPedEntity[shop].entity != null &&
                DoesEntityExist(this.shopsPedEntity[shop].entity)
            ) {
                DeleteEntity(this.shopsPedEntity[shop].entity);
            }
        }
    }

    @OnEvent(ClientEvent.LOCATION_ENTER)
    public onLocationEnter(brand: ShopBrand, shop: string) {
        this.currentShop = shop;
        this.currentShopBrand = brand;
        this.addTargetModel();

        if (brand == ShopBrand.Ponsonbys || brand == ShopBrand.Suburban || brand == ShopBrand.Binco) {
            TriggerEvent(ClientEvent.FFS_ENTER_CLOTHING_SHOP, brand);
        }
    }

    @OnEvent(ClientEvent.LOCATION_EXIT)
    public async onLocationExit(brand) {
        await this.removeTargetModel();
        this.currentShop = null;
        this.currentShopBrand = null;

        if (brand == ShopBrand.Ponsonbys || brand == ShopBrand.Suburban || brand == ShopBrand.Binco) {
            TriggerEvent(ClientEvent.FFS_EXIT_CLOTHING_SHOP, brand);
        }
    }

    public async addTargetModel() {
        if (
            this.currentShopBrand &&
            BrandsConfig[this.currentShopBrand] &&
            BrandsConfig[this.currentShopBrand].pedModel
        ) {
            this.targetFactory.createForModel(BrandsConfig[this.currentShopBrand].pedModel, this.shopActions);
        }
    }

    public async removeTargetModel() {
        if (
            this.currentShopBrand &&
            BrandsConfig[this.currentShopBrand] &&
            BrandsConfig[this.currentShopBrand].pedModel
        ) {
            this.targetFactory.removeTargetModel([BrandsConfig[this.currentShopBrand].pedModel], []);
        }
    }

    public async openShop() {
        switch (this.currentShopBrand) {
            case ShopBrand.Supermarket247North:
            case ShopBrand.Supermarket247South:
            case ShopBrand.LtdGasolineNorth:
            case ShopBrand.LtdGasolineSouth:
            case ShopBrand.RobsliquorNorth:
            case ShopBrand.RobsliquorSouth:
            case ShopBrand.Ammunation:
            case ShopBrand.Zkea:
                this.superetteShopProvider.openShop(this.currentShopBrand);
                break;
            case ShopBrand.Ponsonbys:
            case ShopBrand.Suburban:
            case ShopBrand.Binco:
                this.clothingShopProvider.openShop(this.currentShopBrand, this.currentShop);
                break;
            case ShopBrand.Mask:
                this.clothingShopProvider.openShop(ShopBrand.Mask, 'mask');
                break;
            case ShopBrand.Tattoo:
                this.tattooShopProvider.openShop(this.currentShopBrand, this.currentShop);
                break;
            case ShopBrand.Jewelry:
                this.jewelryShopProvider.openShop();
                break;
            case ShopBrand.Barber:
                this.barberShopProvider.openShop();
        }
    }

    @Exportable('GetCurrentShop')
    public getCurrentShop(): ShopInfo {
        const entity =
            this.currentShop && this.shopsPedEntity[this.currentShop]
                ? this.shopsPedEntity[this.currentShop].entity
                : 0;
        return { shopId: this.currentShop, shopbrand: this.currentShopBrand, shopPedEntity: entity } as ShopInfo;
    }

    @Exportable('GetShopPedEntity')
    public getShopPedEntity(shopId: string): ShopPedEntity {
        const entity = shopId && this.shopsPedEntity[shopId] ? this.shopsPedEntity[shopId].entity : 0;
        const location = shopId && this.shopsPedEntity[shopId] ? this.shopsPedEntity[shopId].location : [0, 0, 0, 0];
        return { entity: entity, location: location as Vector4 } as ShopPedEntity;
    }
}
