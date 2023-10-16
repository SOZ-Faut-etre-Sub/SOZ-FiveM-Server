import { Prisma } from '@prisma/client';
import { ClothingShopRepository } from '@public/server/repository/cloth.shop.repository';
import { PlayerPedHash } from '@public/shared/player';

import { Once, OnceStep, OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { Logger } from '../../../core/logger';
import { ServerEvent } from '../../../shared/event';
import { FfsConfig, Garment, LuxuryGarment } from '../../../shared/job/ffs';
import { toVector3Object, Vector3 } from '../../../shared/polyzone/vector';
import { ClothingBrand, ClothingShopItem } from '../../../shared/shop';
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

    @Inject(Logger)
    private logger: Logger;

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
            case Garment.TOP:
            case LuxuryGarment.TOP:
                return 1;
            case Garment.PANT:
            case LuxuryGarment.PANT:
                return 15;
            case Garment.SHOES:
            case LuxuryGarment.SHOES:
                return 25;
            case Garment.UNDERWEAR:
            case LuxuryGarment.UNDERWEAR:
                return 21;
            case Garment.BAG:
            case LuxuryGarment.BAG:
                return 52;
            case Garment.GLOVES:
            case LuxuryGarment.GLOVES:
                return 50;
            case Garment.UNDERWEAR_TOP:
            case LuxuryGarment.UNDERWEAR_TOP:
                return 60;
            case Garment.MASK:
                return 41;
            default:
                return -1;
        }
    }

    @OnEvent(ServerEvent.FFS_RESTOCK)
    public async onRestock(source: number, brand: ClothingBrand, garment: Garment | LuxuryGarment) {
        const item = this.inventoryManager.getFirstItemInventory(source, garment);
        const maxItemsToRestockInLoop = 5;

        if (!item) {
            return;
        }

        this.notifier.notify(source, 'Vous ~g~commencez~s~ à restocker le magasin de vêtements', 'success');

        let amountLeft = item.amount;
        do {
            const loopAmount = Math.min(maxItemsToRestockInLoop, amountLeft);

            const { completed } = await this.progressService.progress(source, 'restock', 'Restockage', 2000 * maxItemsToRestockInLoop, {
                name: 'base',
                dictionary: 'amb@prop_human_bum_bin@base',
                flags: 1,
            });

            if (!completed) {
                return;
            }

            this.inventoryManager.removeItemFromInventory(source, garment, loopAmount);

            // Restock shops
            await this.restockLoop(source, brand, garment, loopAmount);

            amountLeft -= loopAmount;
        } while (amountLeft > 0);

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

    public async restockLoop(source: number, brand: ClothingBrand, garment: Garment | LuxuryGarment, amount: number) {
        const sexes = [PlayerPedHash.Male, PlayerPedHash.Female];
        const category = this.garmentToCategory(garment);

        if (category == -1) {
            this.logger.error('Invalid category for item ', garment);
            return;
        }

        const repo = await this.clothingShopRepository.get();
        const shopId = repo.shops[brand].id;

        // Fetch all items from this category
        const allItemsByGender: Record<number, ClothingShopItem[]> = {
            [PlayerPedHash.Male]: [],
            [PlayerPedHash.Female]: [],
        };
        const allItems: ClothingShopItem[] = [];

        for (const [genderHash, shop_content] of Object.entries(repo.categories)) {
            for (const shop_category of Object.values(shop_content[shopId])) {
                if (
                    (shop_category.content != null &&
                        (shop_category.id == category || shop_category.parentId == category)) ||
                    (category === 41 && [33, 34, 35, 36, 37, 38, 39, 40].includes(shop_category.id)) // Masks don't have a parent category
                ) {
                    Object.values(shop_category.content).forEach(items => {
                        items.forEach(item => allItemsByGender[parseInt(genderHash)].push(item));
                    });
                    Object.values(shop_category.content).forEach(items => {
                        items.forEach(item => allItems.push(item));
                    });
                }
            }
        }

        let allItemsSortedByStock: ClothingShopItem[] = allItems.sort((a,b) => (a.stock > b.stock) ? 1 : -1);
        let itemToRestock = allItemsSortedByStock[0];

        // Update SQL database
        await this.prismaService.shop_content.updateMany({
            where: {
                id: itemToRestock.id,
            },
            data: {
                stock: {
                    increment: amount,
                },
            },
        });

        itemToRestock.stock += amount;
        this.notifier.notify(source, `Vous avez restock ~o~${amount}~s~ ~g~${itemToRestock.modelLabel} ${itemToRestock.colorLabel}~s~. Il y en a désormais ~o~${itemToRestock.stock}~s~ en stock.`, 'success');
        
        // Update repository
        await this.clothingShopRepository.init();
    }
}
