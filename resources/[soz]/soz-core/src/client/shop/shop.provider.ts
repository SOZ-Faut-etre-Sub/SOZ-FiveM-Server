import { BrandsConfig, ShopBrand, ShopsConfig } from '@public/config/shops';
import { Once, OnceStep, OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { JobType } from '@public/shared/job';

import { BlipFactory } from '../blip';
import { PedFactory } from '../factory/ped.factory';
import { StonkCollectProvider } from '../job/stonk/stonk.collect.provider';
import { TargetFactory, TargetOptions } from '../target/target.factory';
import { BarberShopProvider } from './barber.shop.provider';
import { ClothingShopProvider } from './cloth.shop.provider';
import { JewelryShopProvider } from './jewelry.shop.provider';
import { SuperetteShopProvider } from './superette.shop.provider';
import { TattooShopProvider } from './tattoo.shop.provider';

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

    private currentShop: string = null;
    private currentShopBrand: ShopBrand = null;

    public shopActions: TargetOptions[] = [
        {
            icon: 'fas fa-shopping-cart',
            label: 'Accéder au magasin',
            canInteract: () => {
                return this.currentShop !== null;
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
    ];

    @Once(OnceStep.PlayerLoaded)
    public async onPlayerLoaded() {
        for (const shop in ShopsConfig) {
            const config = ShopsConfig[shop];
            const brandConfig = BrandsConfig[config.brand];
            this.blipFactory.create('shops_' + shop, {
                name: brandConfig.label,
                coords: { x: config.location[0], y: config.location[1], z: config.location[2] },
                sprite: brandConfig.blipSprite,
                color: brandConfig.blipColor,
            });
            this.pedFactory.createPed({
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
        if (this.currentShopBrand != null && BrandsConfig[this.currentShopBrand].pedModel) {
            this.targetFactory.createForModel(BrandsConfig[this.currentShopBrand].pedModel, this.shopActions);
        }
    }

    public async removeTargetModel() {
        if (this.currentShopBrand != null && BrandsConfig[this.currentShopBrand].pedModel) {
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
}
