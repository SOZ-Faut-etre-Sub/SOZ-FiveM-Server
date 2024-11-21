import { Provider } from '@core/decorators/provider';
import { GangProvider } from '@private/server/gang/gang.provider';
import { Inject } from '@public/core/decorators/injectable';
import { Rpc } from '@public/core/decorators/rpc';
import { CraftCategory, Crafts, CraftsList } from '@public/shared/craft/craft';
import { toVector3Object, Vector3 } from '@public/shared/polyzone/vector';
import { getRandomKeyWeighted } from '@public/shared/random';
import { RpcServerEvent } from '@public/shared/rpc';

import { ADD_ERROR_MESSAGE, InventoryItemMetadata } from '../../shared/inventory';
import { FeatureProvider } from '../feature/feature.provider';
import { InventoryFactory } from '../inventory/inventory.factory';
import { ItemService } from '../item/item.service';
import { Monitor } from '../monitor/monitor';
import { Notifier } from '../notifier';
import { PlayerService } from '../player/player.service';
import { ProgressService } from '../player/progress.service';

@Provider()
export class CraftProvider {
    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(InventoryFactory)
    private inventoryFactory: InventoryFactory;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Monitor)
    private monitor: Monitor;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(GangProvider)
    private gangProvider: GangProvider;

    @Inject(FeatureProvider)
    private featureProvider: FeatureProvider;

    private async getCrafts(source: number, type: string): Promise<Record<string, CraftCategory>> {
        if (type == 'gang') {
            return await this.gangProvider.getGangRecipes(source);
        }

        return Crafts[type];
    }

    @Rpc(RpcServerEvent.CRAFT_GET_RECIPES)
    public async getTransformRecipes(source: number, type: string, cancelled?: boolean): Promise<CraftsList> {
        const crafts = { ...(await this.getCrafts(source, type)) };
        const inventory = await this.inventoryFactory.getPlayerInventory(source);

        if (!inventory) {
            return;
        }

        for (const category of Object.keys(crafts)) {
            const categoryList = crafts[category];

            if (categoryList.feature && !this.featureProvider.isFeatureEnabled(categoryList.feature)) {
                delete crafts[category];
                continue;
            }

            for (const [output, recipe] of Object.entries(categoryList.recipes)) {
                if (recipe.feature && !this.featureProvider.isFeatureEnabled(recipe.feature)) {
                    delete categoryList.recipes[output];
                    continue;
                }
                recipe.canCraft = true;

                for (const [inputItem, input] of Object.entries(recipe.inputs)) {
                    input.check = inventory.hasEnoughItem(inputItem, input.count, true, input.metadata);
                    input.checkAmount = inventory.getItemCount(inputItem, false, input.metadata);
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
        const crafts = await this.getCrafts(source, type);
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

        const inventory = await this.inventoryFactory.getPlayerInventory(source);

        if (
            !inventory.canSwapItems(
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
            this.notifier.notify(source, ADD_ERROR_MESSAGE['not_enough_space'], 'error');
            return await this.getTransformRecipes(source, type, true);
        }

        for (const requiredItemId of Object.keys(recipe.inputs)) {
            const input = recipe.inputs[requiredItemId];

            if (!inventory.hasEnoughItem(requiredItemId, input.count, true, input.metadata)) {
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
            {}
        );

        if (!completed) {
            return await this.getTransformRecipes(source, type, true);
        }

        for (const requiredItemId of Object.keys(recipe.inputs)) {
            const input = recipe.inputs[requiredItemId];
            inventory.remove(requiredItemId, input.count, false, input.metadata);
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

        inventory.add(itemId, recipe.amount, metadata);

        this.notifier.notify(source, `Vous avez confectionné ~y~${recipe.amount}~s~ ~g~${item.label}~s~.`, 'success');

        this.monitor.traceEvent(crafts[category].event, {
            item_id: itemId,
            player_source: source,
            item_label: item.label,
            amount: recipe.amount,
            position: toVector3Object(GetEntityCoords(GetPlayerPed(source)) as Vector3),
            type: type,
            category: category,
        });

        return await this.getTransformRecipes(source, type);
    }
}
