import { Module } from '../../core/decorators/module';
import { InventoryProvider } from './inventory.provider';
import { ItemFuelProvider } from './item.fuel.provider';
import { ItemHealthProvider } from './item.health.provider';
import { ItemNutritionProvider } from './item.nutrition.provider';

@Module({
    providers: [ItemFuelProvider, ItemNutritionProvider, ItemHealthProvider, InventoryProvider],
})
export class ItemModule {}
