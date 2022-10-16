import { Module } from '../../core/decorators/module';
import { InventoryProvider } from './inventory.provider';
import { ItemHealthProvider } from './item.health.provider';
import { ItemNutritionProvider } from './item.nutrition.provider';

@Module({
    providers: [ItemNutritionProvider, ItemHealthProvider, InventoryProvider],
})
export class ItemModule {}
