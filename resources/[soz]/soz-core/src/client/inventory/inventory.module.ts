import { Module } from '../../core/decorators/module';
import { InventoryOpenProvider } from './inventory.open.provider';
import { InventoryUsageProvider } from './inventory.usage.provider';

@Module({
    providers: [InventoryUsageProvider, InventoryOpenProvider],
})
export class InventoryModule {}
