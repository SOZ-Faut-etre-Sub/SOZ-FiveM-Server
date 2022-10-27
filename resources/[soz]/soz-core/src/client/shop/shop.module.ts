import { Module } from '../../core/decorators/module';
import { MaskShopProvider } from './mask.shop.provider';

@Module({
    providers: [MaskShopProvider],
})
export class ShopModule {}
