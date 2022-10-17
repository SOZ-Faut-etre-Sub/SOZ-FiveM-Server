import { Once, OnceStep, OnEvent, OnNuiEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { BaunRecipe } from '../../../nui/components/BahamaUnicorn/BahamaUnicornJobMenu';
import { ClientEvent, NuiEvent } from '../../../shared/event';
import { BaunCraftProcess, baunCraftProcesses } from '../../../shared/job/baun';
import { MenuType } from '../../../shared/nui/menu';
import { BlipFactory } from '../../blip';
import { InventoryManager } from '../../item/inventory.manager';
import { ItemService } from '../../item/item.service';
import { NuiMenu } from '../../nui/nui.menu';
import { PlayerService } from '../../player/player.service';
import { TargetFactory } from '../../target/target.factory';

@Provider()
export class BaunProvider {
    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    private state = {
        displayLiquorBlip: false,
        displayFlavorBlip: false,
        displayFurnitureBlip: false,
        displayResellBlip: false,
    };

    @Once(OnceStep.PlayerLoaded)
    public onPlayerLoaded() {
        this.createBlips();
    }

    @OnNuiEvent(NuiEvent.BaunDisplayBlip)
    public async onDisplayBlip({ blip, value }: { blip: string; value: boolean }) {
        this.state[blip] = value;
        this.blipFactory.hide(blip, !value);
    }

    @OnEvent(ClientEvent.JOBS_BAUN_OPEN_SOCIETY_MENU)
    public onOpenSocietyMenu() {
        if (this.nuiMenu.getOpened() === MenuType.BahamaUnicornJobMenu) {
            this.nuiMenu.closeMenu();

            return;
        }

        const recipes = this.computeRecipes(baunCraftProcesses);
        recipes.sort((a, b) => a.output.label.localeCompare(b.output.label));
        this.nuiMenu.openMenu(MenuType.BahamaUnicornJobMenu, {
            recipes,
            state: this.state,
            onDuty: this.playerService.isOnDuty(),
        });
    }

    private createBlips() {
        this.blipFactory.create('displayLiquorBlip', {
            name: "Point de récolte d'alcools",
            coords: { x: 1410.96, y: 1147.6, z: 114.33 },
            sprite: 478,
            color: 28,
            scale: 0.9,
        });
        this.blipFactory.hide('displayLiquorBlip', true);

        this.blipFactory.create('displayFlavorBlip', {
            name: 'Point de récolte de saveurs',
            coords: { x: 867.17, y: -1628.59, z: 30.2 },
            sprite: 478,
            color: 28,
            scale: 0.9,
        });
        this.blipFactory.hide('displayFlavorBlip', true);

        this.blipFactory.create('displayFurnitureBlip', {
            name: 'Point de récolte de fournitures',
            coords: { x: 44.98, y: -1749.42, z: 29.59 },
            sprite: 478,
            color: 28,
            scale: 0.9,
        });
        this.blipFactory.hide('displayFurnitureBlip', true);

        this.blipFactory.create('displayResellBlip', {
            name: 'Point de vente des cocktails',
            coords: { x: 393.02, y: 177.3, z: 103.86 },
            sprite: 478,
            color: 28,
            scale: 0.9,
        });
        this.blipFactory.hide('displayResellBlip', true);
    }

    private computeRecipes(craftProcesses: BaunCraftProcess[]): BaunRecipe[] {
        return craftProcesses.map(craftProcess => {
            let canCraft = true;
            const inputs = [];
            for (const input of craftProcess.inputs) {
                const hasRequiredAmount = this.inventoryManager.hasEnoughItem(input.id, input.amount);
                const inputItem = this.itemService.getItem(input.id);
                inputs.push({
                    label: inputItem.pluralLabel || inputItem.label,
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
                    label: outputItem.pluralLabel || outputItem.label,
                    amount: craftProcess.output.amount,
                },
            };
        });
    }
}
