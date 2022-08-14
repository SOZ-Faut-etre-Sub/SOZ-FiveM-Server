import { Module } from '../../core/decorators/module';
import { ItemHealthProvider } from './item.health.provider';
import { ItemNutritionProvider } from './item.nutrition.provider';

@Module({
    providers: [ItemNutritionProvider, ItemHealthProvider],
})
export class ItemModule {}
