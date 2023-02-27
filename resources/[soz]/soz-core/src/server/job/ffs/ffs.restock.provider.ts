import { Prisma } from '@prisma/client';
import { ClothingShopRepository } from '@public/server/repository/cloth.shop.repository';

import { Once, OnceStep, OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';
import { FfsConfig, Garment, LuxuryGarment } from '../../../shared/job/ffs';
import { toVector3Object, Vector3 } from '../../../shared/polyzone/vector';
import { ClothingBrand } from '../../../shared/shop';
import { PrismaService } from '../../database/prisma.service';
import { InventoryManager } from '../../inventory/inventory.manager';
import { Monitor } from '../../monitor/monitor';
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

    @Inject(Monitor)
    private monitor: Monitor;

    @Inject(ClothingShopRepository)
    private clothingShopRepository: ClothingShopRepository;

    @Once(OnceStep.DatabaseConnected)
    public async onOnceStart() {
        await this.prismaService.$queryRaw(
            Prisma.sql`UPDATE shop_content SET shop_content.stock = CEIL(shop_content.stock * 0.95) WHERE shop_content.shop_id IN (1, 2, 3)`
        );
    }

    public garmentToCategory(garment: Garment | LuxuryGarment): number {
        switch (garment) {
            case 'garment_top' || 'luxury_garment_top':
                return 1;
            case 'garment_pant' || 'luxury_garment_pant':
                return 6;
            case 'garment_shoes' || 'luxury_garment_shoes':
                return 10;
            case 'garment_underwear' || 'luxury_garment_underwear':
                return 19;
        }
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

        // Restock shops
        await this.restockLoop(brand, garment, item.amount);

        const totalAmount = item.amount * FfsConfig.restock.getRewardFromDeliveredGarment(garment);
        TriggerEvent(ServerEvent.BANKING_TRANSFER_MONEY, 'farm_ffs', 'safe_ffs', totalAmount);

        this.monitor.publish(
            'job_ffs_restock',
            {
                item_id: item.metadata.id,
                player_source: source,
            },
            {
                item_label: item.label,
                quantity: item.amount,
                position: toVector3Object(GetEntityCoords(GetPlayerPed(source)) as Vector3),
            }
        );

        this.notifier.notify(source, 'Vous avez ~r~terminé~s~ de restocker le magasin de vêtements.', 'success');
    }

    public async restockLoop(brand: ClothingBrand, garment: Garment | LuxuryGarment, amount: number) {
        const sexes = [1885233650, -1667301416];
        const category = this.garmentToCategory(garment);
        const repo = await this.clothingShopRepository.get();
        const categoryItems = Object.values(repo.shops[brand].products).filter(
            product => product.categoryId === category || repo.categories[product.categoryId].parentId === category
        );
        let amountLeft = amount;

        while (amountLeft > 0) {
            const loopAmount = Math.min(10, amountLeft);
            amountLeft -= loopAmount;
            const loopSex = sexes[Math.floor(Math.random() * 2)];
            const loopItems = categoryItems.filter(item => item.modelHash === loopSex);
            const randomItem = loopItems[Math.floor(Math.random() * loopItems.length)];
            if (!randomItem || !loopItems) {
                return;
            }

            // Clothes with same drawable
            const sameDrawableItems = loopItems.filter(item => {
                for (const [componentId, component] of Object.entries(randomItem.components)) {
                    if (
                        componentId != '8' && // <---- This will prevent undershirt from being correctly updated
                        componentId != '3' && // <---- This will prevent gloves from being correctly updated
                        item.components[componentId] != null &&
                        item.components[componentId].Drawable === component.Drawable
                    ) {
                        return true;
                    }
                }
            });
            const sameDrawableIds = sameDrawableItems.map(item => item.id);

            // Update SQL database
            await this.prismaService.shop_content.updateMany({
                where: {
                    id: {
                        in: sameDrawableIds,
                    },
                },
                data: {
                    stock: {
                        increment: loopAmount,
                    },
                },
            });

            // Update repository
            Object.values(sameDrawableIds).forEach(id => {
                repo.shops[brand].stocks[id] += loopAmount;
            });
        }
        await this.clothingShopRepository.set(repo);
    }
}
