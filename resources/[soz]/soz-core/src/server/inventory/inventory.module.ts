import { Module } from '../../core/decorators/module';
import { InventoryCommandProvider } from './inventory.command.provider';
import { InventoryExportProvider } from './inventory.export.provider';
import { InventoryOpenProvider } from './inventory.open.provider';
import { InventoryProvider } from './inventory.provider';
import { InventoryUsageProvider } from './inventory.usage.provider';

@Module({
    providers: [
        InventoryCommandProvider,
        InventoryExportProvider,
        InventoryOpenProvider,
        InventoryProvider,
        InventoryUsageProvider,
    ],
})
export class InventoryModule {}
