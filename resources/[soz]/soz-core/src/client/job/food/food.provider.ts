import { Once, OnceStep, OnEvent, OnNuiEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { FoodRecipe } from '../../../nui/components/Food/FoodJobMenu';
import { ClientEvent, NuiEvent } from '../../../shared/event';
import { InventoryItem } from '../../../shared/item';
import { FoodConfig, FoodCraftProcess } from '../../../shared/job/food';
import { MenuType } from '../../../shared/nui/menu';
import { BlipFactory } from '../../blip';
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

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    private state = {
        displayMilkBlip: false,
    };

    @OnNuiEvent(NuiEvent.FoodDisplayBlip)
    public async onDisplayBlip({ blip, value }: { blip: string; value: boolean }) {
        this.state[blip] = value;
        this.blipFactory.hide(blip, !value);
    }

    @Once(OnceStep.PlayerLoaded)
    public onPlayerLoaded() {
        this.blipFactory.create('displayMilkBlip', {
            name: 'Point de récolte du lait',
            coords: { x: 2416.01, y: 4993.49, z: 46.22 },
            sprite: 176,
            scale: 0.9,
        });

        this.blipFactory.hide('displayMilkBlip', true);
    }

    @OnEvent(ClientEvent.JOBS_FOOD_OPEN_SOCIETY_MENU)
    public onOpenSocietyMenu() {
        if (this.nuiMenu.isOpen()) {
            this.nuiMenu.closeMenu();
            return;
        }
        const sortFunction = (a, b) => a.output.label.localeCompare(b.output.label);
        const processes = [
            ...this.computeRecipes(FoodConfig.processes.wineProcesses, '🍷').sort(sortFunction),
            ...this.computeRecipes(FoodConfig.processes.juiceProcesses, '🧃').sort(sortFunction),
            ...this.computeRecipes(FoodConfig.processes.cheeseProcesses, '🧀').sort(sortFunction),
            ...this.computeRecipes(FoodConfig.processes.sausageProcesses, '🌭').sort(sortFunction),
        ];
        this.nuiMenu.openMenu(MenuType.FoodJobMenu, {
            recipes: processes,
            state: this.state,
            onDuty: this.playerService.isOnDuty(),
        });
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
