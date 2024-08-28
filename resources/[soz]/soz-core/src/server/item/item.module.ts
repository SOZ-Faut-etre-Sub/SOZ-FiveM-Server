import { Module } from '../../core/decorators/module';
import { ItemBookProvider } from './item.book.provider';
import { ItemFoodProvider } from './item.food.provider';
import { ItemFuelProvider } from './item.fuel.provider';
import { ItemGouvProvider } from './item.gouv.provider';
import { ItemHalloweenProvider } from './item.halloween.provider';
import { ItemHealthProvider } from './item.health.provider';
import { ItemHudProvider } from './item.hud.provider';
import { ItemNewsProvider } from './item.news.provider';
import { ItemNutritionProvider } from './item.nutrition.provider';
import { ItemPanelProvider } from './item.panel.provider';
import { ItemToolsProvider } from './item.tools.provider';
import { ItemVoipProvider } from './item.voip.provider';

@Module({
    providers: [
        ItemBookProvider,
        ItemFoodProvider,
        ItemFuelProvider,
        ItemGouvProvider,
        ItemNewsProvider,
        ItemNutritionProvider,
        ItemHealthProvider,
        ItemPanelProvider,
        ItemToolsProvider,
        ItemVoipProvider,
        ItemHalloweenProvider,
        ItemHudProvider,
    ],
})
export class ItemModule {}
