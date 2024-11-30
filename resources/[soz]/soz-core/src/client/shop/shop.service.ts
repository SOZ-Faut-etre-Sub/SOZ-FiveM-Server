import { FeatureProvider } from '@public/client/feature/feature.provider';
import { BrandConfig, ShopBrand } from '@public/config/shops';
import { Inject, Injectable } from '@public/core/decorators/injectable';
import { Feature } from '@public/shared/features';

import { PedFactory } from '../factory/ped.factory';

export type ShopInfo = {
    shopId: string;
    shopbrand: string;
    shopPedEntity: number;
};

@Injectable()
export class ShopService {
    @Inject(PedFactory)
    private pedFactory: PedFactory;

    @Inject(FeatureProvider)
    private featureProvider: FeatureProvider;

    private currentShop: string = null;
    private currentShopBrand: ShopBrand = null;

    private shopPeds: Record<string, string> = {};

    public checkTarget(brands: ShopBrand[], entity: number) {
        if (!this.currentShop) {
            return false;
        }

        if (!brands.includes(this.currentShopBrand)) {
            return false;
        }

        const ped = this.pedFactory.findLoadedPed(this.shopPeds[this.currentShop]);
        if (entity != ped.entity) {
            return;
        }

        return !IsEntityPlayingAnim(entity, 'random@robbery', 'robbery_main_female', 3);
    }

    public getBrandPedModel(brandConfig: BrandConfig) {
        return this.featureProvider.isFeatureEnabled(Feature.Halloween) ? 'u_m_y_zombie_01' : brandConfig.pedModel;
    }

    public addShopPed(shop: string, pedId: string) {
        this.shopPeds[shop] = pedId;
    }

    public getCurrentShopInfo(): ShopInfo {
        const pedId = this.shopPeds[this.currentShop];
        return {
            shopId: this.currentShop,
            shopbrand: this.currentShopBrand,
            shopPedEntity: this.pedFactory.findLoadedPed(pedId)?.entity,
        };
    }

    public getShopPedId(shopId: string): string {
        return this.shopPeds[shopId];
    }

    public onLocationEnter(brand: ShopBrand, shop: string) {
        this.currentShop = shop;
        this.currentShopBrand = brand;
    }

    public async onLocationExit() {
        this.currentShop = null;
        this.currentShopBrand = null;
    }
}
