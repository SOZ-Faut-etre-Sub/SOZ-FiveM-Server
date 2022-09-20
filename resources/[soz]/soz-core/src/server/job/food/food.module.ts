import { Module } from '../../../core/decorators/module';
import { FoodCraftProvider } from './food.craft.provider';
import { FoodMealsProvider } from './food.meals.provider';

@Module({
    providers: [FoodCraftProvider, FoodMealsProvider],
})
export class FoodModule {}
