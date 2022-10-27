import { BankService } from '../../client/bank/bank.service';
import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { ClothConfig, Outfit } from '../../shared/cloth';
import { ServerEvent } from '../../shared/event';
import { RpcEvent } from '../../shared/rpc';
import { PrismaService } from '../database/prisma.service';
import { Notifier } from '../notifier';
import { QBCore } from '../qbcore';

@Provider()
export class MaskShopProvider {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(BankService)
    private bankService: BankService;

    @Inject(QBCore)
    private qbcore: QBCore;

    @Rpc(RpcEvent.SHOP_MASK_GET_CATEGORIES)
    async getMasks(): Promise<any> {
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
    async getMaskItems(source: number, categoryId: number): Promise<any> {
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
        // Remove the price from the player's wallet
        const item = await this.prismaService.shop_content.findFirst({
            where: {
                id: itemId,
            },
        });
        if (!item) {
            return;
        }

        const player = this.qbcore.getPlayer(source);
        if (!player) {
            return;
        }

        if (!player.Functions.RemoveMoney('money', item.price)) {
            this.notifier.notify(source, `Ah mais t'es pauvre en fait ! Reviens quand t'auras de quoi payer.`, 'error');
            return;
        }

        // Update the stock in the shop_content table
        await this.prismaService.shop_content.update({
            where: {
                id: itemId,
            },
            data: {
                stock: {
                    decrement: 1,
                },
            },
        });

        // Merge the item's outfit to the cloth config.
        const clothConfigKey = item.category_id == 19 ? 'NakedClothSet' : 'BaseClothSet';
        const clothConfig: ClothConfig = player.PlayerData.cloth_config;
        const currentOutfit: Outfit = clothConfig[clothConfigKey];
        const outfit: Outfit = JSON.parse(item.data);

        if (outfit.Components) {
            for (const [component, outfitItem] of Object.entries(outfit.Components)) {
                currentOutfit.Components[component] = {
                    Drawable: outfitItem.Drawable || 0,
                    Texture: outfitItem.Texture || 0,
                    Palette: outfitItem.Palette || 0,
                    Index: Number(component),
                };
            }
        }

        if (outfit.Props) {
            for (const [prop, outfitItem] of Object.entries(outfit.Props)) {
                currentOutfit.Props[prop] = {
                    Drawable: outfitItem.Drawable || 0,
                    Texture: outfitItem.Texture || 0,
                    Palette: outfitItem.Palette || 0,
                    Index: Number(prop),
                };
            }
        }

        clothConfig[clothConfigKey] = currentOutfit;

        player.Functions.SetClothConfig(clothConfig, false);

        this.notifier.notify(source, `Merci pour votre achat !`);
    }
}
