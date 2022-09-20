import { Module } from '../../../core/decorators/module';
import { FoodCraftProvider } from './food.craft.provider';
import { FoodMealsProvider } from './food.meals.provider';
import { FoodProvider } from './food.provider';

@Module({
    providers: [FoodProvider, FoodCraftProvider, FoodMealsProvider],
})
export class FoodModule {}
