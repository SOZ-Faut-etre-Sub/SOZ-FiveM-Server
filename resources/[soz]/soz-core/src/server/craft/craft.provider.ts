import { Provider } from '@core/decorators/provider';
import { Inject } from '@public/core/decorators/injectable';
import { Rpc } from '@public/core/decorators/rpc';
import { Crafts, CraftsList } from '@public/shared/craft/craft';
import { isFeatureEnabled } from '@public/shared/features';
import { InventoryItemMetadata } from '@public/shared/item';
import { toVector3Object, Vector3 } from '@public/shared/polyzone/vector';
import { getRandomKeyWeighted } from '@public/shared/random';
import { RpcServerEvent } from '@public/shared/rpc';

import { InventoryManager } from '../inventory/inventory.manager';
import { ItemService } from '../item/item.service';
import { Monitor } from '../monitor/monitor';
import { Notifier } from '../notifier';
import { PlayerService } from '../player/player.service';
import { ProgressService } from '../player/progress.service';

@Provider()
export class CraftProvider {
    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Monitor)
    private monitor: Monitor;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Rpc(RpcServerEvent.CRAFT_GET_RECIPES)
    public async getTransformRecipes(source: number, type: string, cancelled?: boolean): Promise<CraftsList> {
        const crafts = { ...Crafts[type] };
        for (const category of Object.keys(crafts)) {
            const categoryList = crafts[category];

            if (categoryList.feature && !isFeatureEnabled(categoryList.feature)) {
                delete crafts[category];
                continue;
            }

            for (const recipe of Object.values(categoryList.recipes)) {
                recipe.canCraft = true;

                for (const [inputItem, input] of Object.entries(recipe.inputs)) {
                    input.check = this.inventoryManager.hasEnoughItem(
                        source,
                        inputItem,
                        input.count,
                        true,
                        input.metadata
                    );
                    recipe.canCraft = recipe.canCraft && input.check;
                }
            }
        }

        return {
            categories: crafts,
            type: type,
            cancelled: cancelled,
        };
    }

    @Rpc(RpcServerEvent.CRAFT_DO_RECIPES)
    public async doCraft(source: number, itemId: string, type: string, category: string): Promise<CraftsList> {
        const crafts = Crafts[type];
        const recipe = crafts[category].recipes[itemId];
        const item = this.itemService.getItem(itemId);
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        if (!recipe) {
            this.notifier.error(source, `Aucune recette associée pour créer "${item.label}".`);
            return await this.getTransformRecipes(source, type, true);
        }

        if (
            !this.inventoryManager.canSwapItems(
                source,
                Object.entries(recipe.inputs).map(([name, input]) => {
                    return {
                        name: name,
                        amount: input.count,
                        metadata: {},
                    };
                }),
                [
                    {
                        name: itemId,
                        amount: recipe.amount,
                        metadata: {},
                    },
                ]
            )
        ) {
            this.notifier.notify(source, "Vous n'avez pas assez de place dans votre inventaire", 'error');
            return await this.getTransformRecipes(source, type, true);
        }

        for (const requiredItemId of Object.keys(recipe.inputs)) {
            const input = recipe.inputs[requiredItemId];

            if (!this.inventoryManager.hasEnoughItem(source, requiredItemId, input.count, true, input.metadata)) {
                const requiredItem = this.itemService.getItem(requiredItemId);

                this.notifier.error(
                    source,
                    `Vous n'avez pas assez de ${requiredItem.label} pour créer "${item.label}".`
                );

                return await this.getTransformRecipes(source, type, true);
            }
        }

        const { completed } = await this.progressService.progress(
            source,
            'craft_transform',
            `Création de "${item.label}"`,
            crafts[category].duration,
            crafts[category].animation || {
                dictionary: 'mp_fm_intro_cut',
                name: 'fixing_a_ped',
                options: {
                    repeat: true,
                },
            },
            {
                useAnimationService: true,
            }
        );

        if (!completed) {
            return await this.getTransformRecipes(source, type, true);
        }

        for (const requiredItemId of Object.keys(recipe.inputs)) {
            const input = recipe.inputs[requiredItemId];
            this.inventoryManager.removeNotExpiredItem(source, requiredItemId, input.count, input.metadata);
        }

        const metadata: InventoryItemMetadata = {};
        if (recipe.rewardTier) {
            const rewiardTier: Record<string, number> = {};
            for (const [name, reward] of Object.entries(recipe.rewardTier)) {
                rewiardTier[name] = reward.chance;
            }

            const rewardName = getRandomKeyWeighted(rewiardTier);

            metadata.tier = recipe.rewardTier[rewardName].id;
            metadata.label = rewardName;
        }

        this.inventoryManager.addItemToInventory(source, itemId, recipe.amount, metadata);

        this.notifier.notify(source, `Vous avez confectionné ~y~${recipe.amount}~s~ ~g~${item.label}~s~.`, 'success');

        this.monitor.publish(
            crafts[category].event,
            {
                item_id: itemId,
                player_source: source,
            },
            {
                item_label: item.label,
                quantity: recipe.amount,
                position: toVector3Object(GetEntityCoords(GetPlayerPed(source)) as Vector3),
                type: type,
                category: category,
            }
        );

        return await this.getTransformRecipes(source, type);
    }
}
