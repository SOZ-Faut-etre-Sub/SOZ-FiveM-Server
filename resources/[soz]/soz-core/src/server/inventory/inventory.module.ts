import { Module } from '../../core/decorators/module';
import { InventoryProvider } from './inventory.provider';
import { InventoryUsageProvider } from './inventory.usage.provider';

@Module({
    providers: [InventoryUsageProvider, InventoryProvider],
})
export class InventoryModule {}
