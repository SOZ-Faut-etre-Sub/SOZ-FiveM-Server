import { Module } from '../../../core/decorators/module';
import { FoodCraftProvider } from './food.craft.provider';
import { FoodHarvestProvider } from './food.harvest.provider';
import { FoodMealsProvider } from './food.meals.provider';

@Module({
    providers: [FoodCraftProvider, FoodMealsProvider, FoodHarvestProvider],
})
export class FoodModule {}
