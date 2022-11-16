import { Prisma } from '@prisma/client';

import { Once, OnceStep, OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';
import { FfsConfig, Garment, LuxuryGarment } from '../../../shared/job/ffs';
import { ClothingBrand } from '../../../shared/shop';
import { PrismaService } from '../../database/prisma.service';
import { InventoryManager } from '../../item/inventory.manager';
import { Notifier } from '../../notifier';
import { ProgressService } from '../../player/progress.service';

@Provider()
export class FightForStyleRestockProvider {
    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Once(OnceStep.DatabaseConnected)
    public async onOnceStart() {
        await this.prismaService.$queryRaw(
            Prisma.sql`UPDATE shop_content SET shop_content.stock = CEIL(shop_content.stock * 0.95) WHERE shop_content.shop_id IN (1, 2, 3)`
        );
    }

    @OnEvent(ServerEvent.FFS_RESTOCK)
    public async onRestock(source: number, brand: ClothingBrand, garment: Garment | LuxuryGarment) {
        const item = this.inventoryManager.getFirstItemInventory(source, garment);

        if (!item) {
            return;
        }

        this.notifier.notify(source, 'Vous ~g~commencez~s~ à restocker le magasin de vêtements', 'success');
        const { completed } = await this.progressService.progress(source, 'restock', 'Restockage', 2000 * item.amount, {
            name: 'base',
            dictionary: 'amb@prop_human_bum_bin@base',
            flags: 1,
        });

        if (!completed) {
            return;
        }

        this.inventoryManager.removeItemFromInventory(source, garment, item.amount);

        exports['soz-shops'].RestockShop(brand, garment, item.amount);

        const totalAmount = item.amount * FfsConfig.restock.getRewardFromDeliveredGarment(garment);
        TriggerEvent(ServerEvent.BANKING_TRANSFER_MONEY, 'farm_ffs', 'safe_ffs', totalAmount);

        this.notifier.notify(source, 'Vous avez ~r~terminé~s~ de restocker le magasin de vêtements.', 'success');
    }
}
