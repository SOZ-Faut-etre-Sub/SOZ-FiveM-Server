import { Module } from '../../core/decorators/module';
import { BossShopProvider } from './boss.shop.provider';
import { MaskShopProvider } from './mask.shop.provider';
import { MigrationProvider } from './migration.provider';
import { ShopProvider } from './shop.provider';

@Module({
    providers: [MaskShopProvider, BossShopProvider, MigrationProvider, ShopProvider],
})
export class ShopModule {}
