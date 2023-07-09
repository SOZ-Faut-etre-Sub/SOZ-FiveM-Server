import { Module } from '../../core/decorators/module';
import { EasterShopProvider } from './easter.shop.provider';
import { MaskShopProvider } from './mask.shop.provider';
import { MigrationProvider } from './migration.provider';
import { ShopProvider } from './shop.provider';

@Module({
    providers: [MaskShopProvider, MigrationProvider, EasterShopProvider, ShopProvider],
})
export class ShopModule {}
