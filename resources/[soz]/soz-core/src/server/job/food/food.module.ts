import { Module } from '../../../core/decorators/module';
import { FoodMealsProvider } from './food.meals.provider';

@Module({
    providers: [FoodMealsProvider],
})
export class FoodModule {}
