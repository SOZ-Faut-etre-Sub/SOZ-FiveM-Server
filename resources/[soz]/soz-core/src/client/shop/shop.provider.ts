import { InventoryDragAndDropProvider } from '@public/client/inventory/inventory.draganddrop.provider';
import { InventoryManager } from '@public/client/inventory/inventory.manager';
import { ItemService } from '@public/client/item/item.service';
import { HousingRepository } from '@public/client/repository/housing.repository';
import { BrandsConfig, NoZoneShopBrand, NoZonesShopConfig, ShopBrand, ShopsConfig } from '@public/config/shops';
import { Once, OnceStep, OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { InventoryItem } from '@public/shared/inventory';
import { JobPermission, JobType } from '@public/shared/job';
import { StonkConfig } from '@public/shared/job/stonk';
import { MenuType } from '@public/shared/nui/menu';
import { BoxZone } from '@public/shared/polyzone/box.zone';
import { Vector3, Vector4 } from '@public/shared/polyzone/vector';
import { TargetOption } from '@public/shared/target';

import { BlipFactory } from '../blip';
import { FeatureProvider } from '../feature/feature.provider';
import { FightForStyleRestockService } from '../job/ffs/ffs.restock.service';
import { JobService } from '../job/job.service';
import { NuiMenu } from '../nui/nui.menu';
import { PlayerService } from '../player/player.service';
import { TargetFactory } from '../target/target.factory';
import { BarberShopProvider } from './barber.shop.provider';
import { ClothingShopProvider } from './cloth.shop.provider';
import { JewelryShopProvider } from './jewelry.shop.provider';
import { ShopService } from './shop.service';
import { SuperetteShopProvider } from './superette.shop.provider';
import { TattooShopProvider } from './tattoo.shop.provider';
import { ZkeaFournitureShopProvider } from './zkea.fourniture.shop.provider';

export type ShopInfo = {
    shopId: string;
    shopbrand: string;
    shopPedEntity: number;
};

@Provider()
export class ShopProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Inject(SuperetteShopProvider)
    private superetteShopProvider: SuperetteShopProvider;

    @Inject(ClothingShopProvider)
    private clothingShopProvider: ClothingShopProvider;

    @Inject(TattooShopProvider)
    private tattooShopProvider: TattooShopProvider;

    @Inject(JewelryShopProvider)
    private jewelryShopProvider: JewelryShopProvider;

    @Inject(BarberShopProvider)
    private barberShopProvider: BarberShopProvider;

    @Inject(ZkeaFournitureShopProvider)
    private zkeaFournitureShopProvider: ZkeaFournitureShopProvider;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(JobService)
    private jobService: JobService;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(InventoryDragAndDropProvider)
    private inventoryDragAndDropProvider: InventoryDragAndDropProvider;

    @Inject(FightForStyleRestockService)
    private fightForStyleRestockService: FightForStyleRestockService;
    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(ShopService)
    private shopService: ShopService;

    @Inject(FeatureProvider)
    private featureProvider: FeatureProvider;

    @Inject(HousingRepository)
    private housingRepository: HousingRepository;

    public getShopActions(): TargetOption[] {
        return [
            {
                icon: 'magasin/cart',
                label: 'Accéder au magasin',
                category: 'citizen',
                canInteract: entity =>
                    this.shopService.checkTarget(
                        Object.values(ShopBrand).filter(elem => elem != ShopBrand.LsCustom),
                        entity
                    ),
                blackoutGlobal: true,
                action: this.openShop.bind(this),
            },
            {
                icon: 'magasin/acheter',
                label: 'Service de gravure',
                category: 'citizen',
                canInteract: entity => {
                    if (!this.shopService.checkTarget([ShopBrand.Jewelry], entity)) {
                        return false;
                    }

                    const inventoryItems = this.inventoryManager.getItems();

                    return inventoryItems.some(inventoryItem => {
                        const item = this.itemService.getItem(inventoryItem.name);
                        if (!item) {
                            return false;
                        }

                        return item.canEngrave && !inventoryItem.metadata?.label;
                    });
                },
                blackoutGlobal: true,
                action: async () => await this.jewelryShopProvider.openEngraveShop(),
            },
            {
                icon: 'shop/store',
                label: 'Accéder au GunSmith',
                category: 'citizen',
                canInteract: entity => this.shopService.checkTarget([ShopBrand.Ammunation], entity),
                action: () => TriggerEvent(ClientEvent.WEAPON_OPEN_GUNSMITH),
            },
            {
                icon: 'stonk/collecter',
                label: 'Collecter',
                job: JobType.CashTransfer,
                category: 'society',
                canInteract: () => {
                    const currentShop = this.shopService.getCurrentShopInfo();
                    return Object.values(StonkConfig.collection).some(item =>
                        item.takeInAvailableIn.includes(currentShop.shopbrand)
                    );
                },
                blackoutGlobal: true,
                blackoutJob: JobType.CashTransfer,
                action: () => {
                    const currentShop = this.shopService.getCurrentShopInfo();
                    TriggerServerEvent(ServerEvent.STONK_COLLECT, currentShop.shopbrand, currentShop.shopId);
                },
            },
            {
                icon: 'shop/store',
                label: 'Vérifier le stock',
                category: 'citizen',
                canInteract: entity => this.shopService.checkTarget([ShopBrand.LsCustom, ShopBrand.Zkea], entity),
                blackoutGlobal: true,
                action: () => {
                    const currentShop = this.shopService.getCurrentShopInfo();
                    switch (currentShop.shopbrand) {
                        case ShopBrand.Zkea:
                            TriggerServerEvent(ServerEvent.ZKEA_CHECK_STOCK);
                            break;
                        case ShopBrand.LsCustom:
                            TriggerServerEvent(ServerEvent.LSC_CHECK_STOCK);
                            break;
                    }
                },
            },
            {
                icon: 'magasin/cart',
                label: "Accéder à l'entrepôt",
                category: 'citizen',
                canInteract: entity => this.shopService.checkTarget([ShopBrand.Zkea], entity),
                blackoutGlobal: true,
                action: async () => await this.zkeaFournitureShopProvider.openShop(),
            },
            {
                label: 'Location de camion de déménagement',
                icon: 'vehicle/truck',
                category: 'citizen',
                blackoutGlobal: true,
                canInteract: entity => this.shopService.checkTarget([ShopBrand.Zkea], entity),
                action: async () => {
                    this.nuiMenu.openMenu(MenuType.RentMule, null, {
                        position: {
                            position: ShopsConfig['zkea'].location as Vector4,
                            distance: 2.5,
                        },
                    });
                },
            },
            {
                icon: 'mechanic/reparer',
                label: 'Prix Pit Stop',
                category: 'citizen',
                canInteract: entity =>
                    this.shopService.checkTarget([ShopBrand.LsCustom], entity) &&
                    this.jobService.hasPermission(JobType.Bennys, JobPermission.BennysPitStopPrice),
                blackoutGlobal: true,
                action: async () => {
                    this.nuiMenu.openMenu(MenuType.PitStopPriceMenu);
                },
            },
            {
                icon: 'shop/store',
                label: 'Améliorations',
                category: 'citizen',
                blackoutGlobal: true,
                canInteract: entity => {
                    const player = this.playerService.getPlayer();
                    const properties = this.housingRepository.get();
                    const ownedAnyApartment = properties.some(property =>
                        property.apartments.some(apartment => apartment.owner === player.citizenid)
                    );
                    return ownedAnyApartment && this.shopService.checkTarget([ShopBrand.Zkea], entity);
                },
                action: () => TriggerEvent(ClientEvent.HOUSING_SELECT_UPGRADES_MENU),
            },
            {
                label: 'Enlever la tenue temporaire',
                category: 'criminal',
                canInteract: entity => {
                    const player = this.playerService.getPlayer();
                    if (player.cloth_config.TemporaryClothSet == null) {
                        return false;
                    }
                    this.shopService.checkTarget([ShopBrand.Ponsonbys, ShopBrand.Suburban, ShopBrand.Binco], entity);
                },
                action: () => TriggerEvent(ClientEvent.CRIMI_REMOVE_CLOTH),
            },
            {
                label: 'Restock: Pièces d’Améliorations Certifiées',
                icon: 'ffs/restock',
                job: JobType.DMC,
                blackoutGlobal: true,
                blackoutJob: JobType.DMC,
                category: 'society',
                canInteract: entity => this.shopService.checkTarget([ShopBrand.LsCustom], entity),
                action: () => {
                    TriggerServerEvent(ServerEvent.DMC_RESTOCK);
                },
                item: 'ls_custom_upgrade_part',
            },
            ...this.fightForStyleRestockService.getStockTargets(),
        ];
    }

    @Once(OnceStep.PlayerLoaded)
    public async setupShopConfig() {
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
                const pedId = await this.targetFactory.createForPed({
                    model: this.shopService.getBrandPedModel(brandConfig),
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
                    target: {
                        options: this.getShopActions(),
                        distance: 2.5,
                    },
                });

                if (config.brand === ShopBrand.Zkea) {
                    this.inventoryDragAndDropProvider.registerZoneTarget(
                        'zkea_' + shop,
                        BoxZone.fromZone({
                            center: [config.location[0], config.location[1], config.location[2] - 1],
                            heading: config.location[3],
                            width: 0.8,
                            length: 0.8,
                            minZ: config.location[2] - 2,
                            maxZ: config.location[2] + 2,
                        }),
                        [
                            async (invItem: InventoryItem) => {
                                const player = this.playerService.getPlayer();

                                TriggerServerEvent(
                                    ServerEvent.JOB_RESELL_ITEM,
                                    `player_${player.citizenid}`,
                                    invItem,
                                    invItem.amount,
                                    'Resell:Zkea'
                                );

                                return true;
                            },
                        ]
                    );
                }

                this.shopService.addShopPed(shop, pedId);
            }
        }

        for (const shop of NoZonesShopConfig) {
            if (shop.feature && !this.featureProvider.isFeatureEnabled(shop.feature)) {
                continue;
            }

            if (shop.blipSprite) {
                this.blipFactory.create('shops_' + shop, {
                    name: shop.label,
                    coords: { x: shop.ped.coords.x, y: shop.ped.coords.y, z: shop.ped.coords.z },
                    sprite: shop.blipSprite,
                    color: shop.blipColor,
                });
            }
            await this.targetFactory.createForPed({
                ...shop.ped,
                target: {
                    options: [
                        {
                            icon: shop.targetIcon || 'magasin/cart',
                            label: shop.targetLabel || 'Accéder au magasin',
                            category: 'citizen',
                            blackoutGlobal: true,
                            action: () => {
                                this.openNoZoneShop(shop.brand, shop.shopLabel);
                            },
                        },
                    ],
                    distance: shop.distance,
                },
            });
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
                    icon: 'shop/mask',
                    category: 'citizen',
                    blackoutGlobal: true,
                    action: () => {
                        this.clothingShopProvider.openShop(ShopBrand.Mask, 'mask');
                    },
                },
                {
                    label: 'Restock: Masques',
                    icon: 'ffs/restock',
                    job: JobType.Ffs,
                    blackoutGlobal: true,
                    blackoutJob: JobType.Ffs,
                    item: 'garment_mask',
                    category: 'society',
                    action: () => {
                        TriggerServerEvent(ServerEvent.FFS_RESTOCK, ShopBrand.Mask, 'garment_mask');
                    },
                },
            ]
        );
        TriggerEvent('shops:client:shop:PedSpawned');
    }

    @OnEvent(ClientEvent.LOCATION_ENTER)
    public onLocationEnter(brand: ShopBrand, shop: string) {
        this.shopService.onLocationEnter(brand, shop);
    }

    @OnEvent(ClientEvent.LOCATION_EXIT)
    public async onLocationExit() {
        this.shopService.onLocationExit();
    }

    public async openShop() {
        const currentShop = this.shopService.getCurrentShopInfo();
        switch (currentShop.shopbrand) {
            case ShopBrand.Supermarket247North:
            case ShopBrand.Supermarket247South:
            case ShopBrand.Supermarket247Cayo:
            case ShopBrand.LtdGasolineNorth:
            case ShopBrand.LtdGasolineSouth:
            case ShopBrand.RobsliquorNorth:
            case ShopBrand.RobsliquorSouth:
            case ShopBrand.Ammunation:
            case ShopBrand.Zkea:
            case ShopBrand.SouvenirJewel:
            case ShopBrand.SouvenirMemory:
            case ShopBrand.SouvenirOther:
            case ShopBrand.SouvenirPlush:
                this.superetteShopProvider.openShop(currentShop.shopbrand, currentShop.shopId);
                break;
            case ShopBrand.Ponsonbys:
            case ShopBrand.Suburban:
            case ShopBrand.Binco:
                this.clothingShopProvider.openShop(currentShop.shopbrand, currentShop.shopId);
                break;
            case ShopBrand.Mask:
                this.clothingShopProvider.openShop(ShopBrand.Mask, 'mask');
                break;
            case ShopBrand.Tattoo:
                this.tattooShopProvider.openShop(currentShop.shopbrand, currentShop.shopId);
                break;
            case ShopBrand.Jewelry:
                this.jewelryShopProvider.openShop();
                break;
            case ShopBrand.Barber:
                this.barberShopProvider.openShop();
        }
    }

    public async openNoZoneShop(brand: string, shopLabel: string) {
        switch (brand) {
            case NoZoneShopBrand.SouvenirFIB:
                this.superetteShopProvider.openShop(brand, brand, shopLabel);
                break;
        }
    }
}
