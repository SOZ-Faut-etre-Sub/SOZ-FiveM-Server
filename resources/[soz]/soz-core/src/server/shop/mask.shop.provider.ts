import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { ServerEvent } from '../../shared/event';
import { RpcEvent } from '../../shared/rpc';
import { PrismaService } from '../database/prisma.service';
import { Notifier } from '../notifier';

@Provider()
export class MaskShopProvider {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Rpc(RpcEvent.SHOP_MASK_GET_CATEGORIES)
    public async onShopMaskGetCategories() {
        return await this.prismaService.shop.findFirst({
            where: {
                name: 'mask',
            },
            select: {
                id: true,
                name: true,
                shop_categories: {
                    include: {
                        category: true,
                    },
                    orderBy: {
                        category: {
                            name: 'asc',
                        },
                    },
                },
            },
        });
    }

    @Rpc(RpcEvent.SHOP_MASK_GET_ITEMS)
    public async onShopMaskGetItems(source: number, categoryId: number) {
        return await this.prismaService.shop_content.findMany({
            where: {
                category_id: categoryId,
            },
            select: {
                id: true,
                label: true,
                price: true,
                stock: true,
                data: true,
            },
            orderBy: {
                label: 'asc',
            },
        });
    }

    @OnEvent(ServerEvent.SHOP_MASK_BUY)
    public async onShopMaskBuy(source: number, itemId: number) {
        console.log('onShopMaskBuy', source, itemId);
        this.notifier.notify(source, `Merci pour votre achat !`);

        // Remove the price from the player's wallet

        // Update the stock in the shop_content table

        // Retrieve the components to apply from the shop_content table

        // Apply the components to the player
    }
}
