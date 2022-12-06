import { Module } from '../../core/decorators/module';
import { InventoryUsageProvider } from './inventory.usage.provider';

@Module({
    providers: [InventoryUsageProvider],
})
export class InventoryModule {}
