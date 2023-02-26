import { Module } from '../../core/decorators/module';
import { BarberShopProvider } from './barber.shop.provider';
import { BossShopProvider } from './boss.shop.provider';
import { ClothingShopProvider } from './cloth.shop.provider';
import { EasterShopProvider } from './easter.shop.provider';
import { JewelryShopProvider } from './jewelry.shop.provider';
import { MaskShopProvider } from './mask.shop.provider';
import { ShopProvider } from './shop.provider';
import { SuperetteShopProvider } from './superette.shop.provider';
import { TattooShopProvider } from './tattoo.shop.provider';

@Module({
    providers: [
        MaskShopProvider,
        BossShopProvider,
        ClothingShopProvider,
        ShopProvider,
        SuperetteShopProvider,
        TattooShopProvider,
        JewelryShopProvider,
        BarberShopProvider,
        EasterShopProvider,
    ],
})
export class ShopModule {}
