import { Once, OnceStep, OnNuiEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { FfsRecipe } from '../../../nui/components/FfsRecipeBook/FfsRecipeBookApp';
import { NuiEvent, ServerEvent } from '../../../shared/event';
import { Feature, isFeatureEnabled } from '../../../shared/features';
import {
    CraftProcess,
    craftProcesses,
    craftZones,
    luxuryCraftProcesses,
    luxuryCraftZones,
    shoesCraftProcesses,
    shoesCraftZones,
} from '../../../shared/job/ffs';
import { MenuType } from '../../../shared/nui/menu';
import { InventoryManager } from '../../item/inventory.manager';
import { ItemService } from '../../item/item.service';
import { NuiMenu } from '../../nui/nui.menu';
import { PlayerService } from '../../player/player.service';
import { TargetFactory, TargetOptions } from '../../target/target.factory';

@Provider()
export class FightForStyleCraftProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Once(OnceStep.PlayerLoaded)
    public onPlayerLoaded() {
        if (!isFeatureEnabled(Feature.MyBodySummer)) {
            return;
        }

        craftZones.forEach(zone => {
            this.targetFactory.createForBoxZone(zone.name, zone, [
                this.createTargetOptions(craftProcesses, 'c:/ffs/craft.png'),
            ]);
        });

        luxuryCraftZones.forEach(zone => {
            this.targetFactory.createForBoxZone(zone.name, zone, [
                this.createTargetOptions(luxuryCraftProcesses, 'c:/ffs/craft.png'),
            ]);
        });

        shoesCraftZones.forEach(zone => {
            this.targetFactory.createForBoxZone(zone.name, zone, [
                this.createTargetOptions(shoesCraftProcesses, 'c:/ffs/craft_shoes.png'),
            ]);
        });
    }

    @OnNuiEvent(NuiEvent.FfsCraft)
    public async onCraft(craftProcess: CraftProcess) {
        TriggerServerEvent(ServerEvent.FFS_CRAFT, craftProcess);
        this.nuiMenu.closeMenu();
    }

    private createTargetOptions(craftProcesses: CraftProcess[], icon: string): TargetOptions {
        return {
            label: 'Confectionner',
            icon,
            color: 'ffs',
            job: 'ffs',
            canInteract: () => {
                return this.playerService.isOnDuty();
            },
            action: () => {
                const recipes = this.computeRecipes(craftProcesses);
                this.nuiMenu.openMenu(MenuType.FfsRecipeBook, recipes);
            },
        };
    }

    private computeRecipes(craftProcesses: CraftProcess[]): FfsRecipe[] {
        return craftProcesses.map(craftProcess => {
            let canCraft = true;
            const inputs = [];
            for (const input of craftProcess.inputs) {
                const hasRequiredAmount = this.inventoryManager.hasEnoughItem(input.fabric, input.amount);
                inputs.push({
                    label: this.itemService.getItem(input.fabric).label,
                    hasRequiredAmount,
                    amount: input.amount,
                });
                canCraft = canCraft && hasRequiredAmount;
            }
            return {
                canCraft: canCraft,
                craftProcess,
                label: craftProcess.label,
                inputs: inputs,
                output: {
                    label: this.itemService.getItem(craftProcess.output).label,
                    amount: craftProcess.outputAmount,
                },
            };
        });
    }
}
