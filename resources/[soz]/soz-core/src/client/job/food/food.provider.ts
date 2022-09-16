import { OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { FoodRecipe } from '../../../nui/components/Food/FoodJobMenu';
import { ClientEvent } from '../../../shared/event';
import { InventoryItem } from '../../../shared/item';
import { FoodConfig, FoodCraftProcess } from '../../../shared/job/food';
import { MenuType } from '../../../shared/nui/menu';
import { InventoryManager } from '../../item/inventory.manager';
import { ItemService } from '../../item/item.service';
import { NuiMenu } from '../../nui/nui.menu';
import { PlayerService } from '../../player/player.service';

@Provider()
export class FoodProvider {
    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @OnEvent(ClientEvent.JOBS_FOOD_OPEN_SOCIETY_MENU)
    public onOpenSocietyMenu() {
        if (!this.playerService.isOnDuty()) {
            return;
        }
        const sortFunction = (a, b) => a.output.label.localeCompare(b.output.label);
        const processes = [
            ...this.computeRecipes(FoodConfig.processes.wineProcesses, '🍷').sort(sortFunction),
            ...this.computeRecipes(FoodConfig.processes.juiceProcesses, '🧃').sort(sortFunction),
            ...this.computeRecipes(FoodConfig.processes.cheeseProcesses, '🧀').sort(sortFunction),
            ...this.computeRecipes(FoodConfig.processes.sausageProcesses, '🌭').sort(sortFunction),
        ];
        this.nuiMenu.openMenu(MenuType.FoodJobMenu, { recipes: processes });
    }

    private computeRecipes(craftProcesses: FoodCraftProcess[], prefixIcon: string): FoodRecipe[] {
        return craftProcesses.map(craftProcess => {
            let canCraft = true;
            const inputs = [];
            for (const input of craftProcess.inputs) {
                const item = this.itemService.getItem(input.id);
                const predicate = (item: InventoryItem) => {
                    return item.name === input.id && item.amount >= input.amount && !this.itemService.isExpired(item);
                };
                const hasRequiredAmount = !!this.inventoryManager.findItem(predicate);
                inputs.push({
                    label: input.amount > 1 && item.pluralLabel ? item.pluralLabel : item.label,
                    hasRequiredAmount,
                    amount: input.amount,
                });
                canCraft = canCraft && hasRequiredAmount;
            }
            const outputItem = this.itemService.getItem(craftProcess.output.id);
            return {
                canCraft,
                inputs,
                output: {
                    label:
                        prefixIcon +
                        ' ' +
                        (craftProcess.output.amount > 1 && outputItem.pluralLabel
                            ? outputItem.pluralLabel
                            : outputItem.label),
                    amount: craftProcess.output.amount,
                },
            };
        });
    }
}
