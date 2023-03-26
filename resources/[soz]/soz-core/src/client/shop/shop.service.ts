import { Injectable } from '@core/decorators/injectable';
import { Vector4 } from '@public/shared/polyzone/vector';

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
    public getCurrentShopInfo(): ShopInfo {
        return exports['soz-shops'].GetCurrentShop();
    }

    public GetShopPedEntity(shopid: string): ShopPedEntity {
        return exports['soz-shops'].GetShopPedEntity(shopid);
    }
}
