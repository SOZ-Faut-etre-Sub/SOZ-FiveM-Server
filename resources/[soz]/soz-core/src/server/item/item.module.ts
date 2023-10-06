import { Module } from '../../core/decorators/module';
import { ItemBookProvider } from './item.book.provider';
import { ItemFuelProvider } from './item.fuel.provider';
import { ItemHealthProvider } from './item.health.provider';
import { ItemNewsProvider } from './item.news.provider';
import { ItemNutritionProvider } from './item.nutrition.provider';
import { ItemPanelProvider } from './item.panel.provider';
import { ItemToolsProvider } from './item.tools.provider';
import { ItemVoipProvider } from './item.voip.provider';

@Module({
    providers: [
        ItemFuelProvider,
        ItemNewsProvider,
        ItemNutritionProvider,
        ItemHealthProvider,
        ItemPanelProvider,
        ItemToolsProvider,
        ItemVoipProvider,
        ItemBookProvider,
    ],
})
export class ItemModule {}
