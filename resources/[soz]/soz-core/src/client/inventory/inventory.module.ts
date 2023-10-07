import { Module } from '../../core/decorators/module';
import { InventoryOpenProvider } from './inventory.open.provider';
import { InventoryOverloadProvider } from './inventory.overloaded.provider';
import { InventoryUsageProvider } from './inventory.usage.provider';

@Module({
    providers: [InventoryUsageProvider, InventoryOpenProvider, InventoryOverloadProvider],
})
export class InventoryModule {}
