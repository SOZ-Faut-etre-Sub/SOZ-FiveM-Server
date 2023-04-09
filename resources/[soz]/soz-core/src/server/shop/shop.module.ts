import { Module } from '../../core/decorators/module';
import { BossShopProvider } from './boss.shop.provider';
import { EasterShopProvider } from './easter.shop.provider';
import { MaskShopProvider } from './mask.shop.provider';
import { MigrationProvider } from './migration.provider';

@Module({
    providers: [MaskShopProvider, BossShopProvider, MigrationProvider, EasterShopProvider],
})
export class ShopModule {}
