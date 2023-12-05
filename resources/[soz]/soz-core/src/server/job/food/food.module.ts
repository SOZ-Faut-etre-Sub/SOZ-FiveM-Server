import { Module } from '../../../core/decorators/module';
import { FoodHarvestProvider } from './food.harvest.provider';
import { FoodMealsProvider } from './food.meals.provider';

@Module({
    providers: [FoodMealsProvider, FoodHarvestProvider],
})
export class FoodModule {}
