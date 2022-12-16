import { Module } from '../../core/decorators/module';
import { ItemFuelProvider } from './item.fuel.provider';
import { ItemHealthProvider } from './item.health.provider';
import { ItemNutritionProvider } from './item.nutrition.provider';
import { ItemPanelProvider } from './item.panel.provider';

@Module({
    providers: [ItemFuelProvider, ItemNutritionProvider, ItemHealthProvider, ItemPanelProvider],
})
export class ItemModule {}
