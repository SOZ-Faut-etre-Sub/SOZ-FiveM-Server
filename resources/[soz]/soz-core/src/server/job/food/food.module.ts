import { Module } from '../../../core/decorators/module';
import { FoodHarvestProvider } from './food.harvest.provider';
import { FoodHuntProvider } from './food.hunt.provider';
import { FoodMealsProvider } from './food.meals.provider';

@Module({
    providers: [FoodMealsProvider, FoodHarvestProvider, FoodHuntProvider],
})
export class FoodModule {}
