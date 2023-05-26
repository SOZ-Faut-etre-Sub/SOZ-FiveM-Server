import { Module } from '../../core/decorators/module';
import { ItemFuelProvider } from './item.fuel.provider';
import { ItemHealthProvider } from './item.health.provider';
import { ItemNutritionProvider } from './item.nutrition.provider';
import { ItemPanelProvider } from './item.panel.provider';
import { ItemToolsProvider } from './item.tools.provider';
import { ItemVoipProvider } from './item.voip.provider';

@Module({
    providers: [
        ItemFuelProvider,
        ItemNutritionProvider,
        ItemHealthProvider,
        ItemPanelProvider,
        ItemToolsProvider,
        ItemVoipProvider,
    ],
})
export class ItemModule {}
