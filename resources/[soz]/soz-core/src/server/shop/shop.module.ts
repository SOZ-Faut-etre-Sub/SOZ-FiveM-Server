import { Module } from '../../core/decorators/module';
import { EasterShopProvider } from './easter.shop.provider';
import { MigrationProvider } from './migration.provider';
import { ShopProvider } from './shop.provider';

@Module({
    providers: [MigrationProvider, ShopProvider, EasterShopProvider],
})
export class ShopModule {}
