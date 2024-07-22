import { Module } from '../../core/decorators/module';
import { InventoryDragAndDropProvider } from './inventory.draganddrop.provider';
import { InventoryKeyProvider } from './inventory.key.provider';
import { InventoryManager } from './inventory.manager';
import { InventoryOpenProvider } from './inventory.open.provider';
import { InventoryOverloadProvider } from './inventory.overloaded.provider';
import { InventoryPlayerProvider } from './inventory.player.provider';
import { InventoryProvider } from './inventory.provider';
import { InventorySmugglingBoxProvider } from './inventory.smuglingbox.provider';
import { InventoryUsageProvider } from './inventory.usage.provider';

@Module({
    providers: [
        InventoryDragAndDropProvider,
        InventoryKeyProvider,
        InventoryManager,
        InventoryOpenProvider,
        InventoryOverloadProvider,
        InventoryPlayerProvider,
        InventoryProvider,
        InventorySmugglingBoxProvider,
        InventoryUsageProvider,
    ],
})
export class InventoryModule {}
