import { Inject, Injectable } from '@core/decorators/injectable';
import { Vector4 } from '@public/shared/polyzone/vector';

import { ResourceLoader } from '../resources/resource.loader';
import { ShopProvider } from './shop.provider';

export type ShopInfo = {
    shopId: string;
    shopbrand: string;
    shopPedEntity: number;
};

export type ShopPedEntity = {
    entity: number;
    location: Vector4;
};

@Injectable()
export class ShopService {
    @Inject(ShopProvider)
    private shopProvider: ShopProvider;

    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

    public getCurrentShopInfo(): ShopInfo {
        return this.shopProvider.getCurrentShop();
    }

    public GetShopPedEntity(shopid: string): ShopPedEntity {
        return this.shopProvider.getShopPedEntity(shopid);
    }
}
