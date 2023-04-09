import { Once, OnceStep, OnEvent, OnNuiEvent } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { TargetFactory } from '@public/client/target/target.factory';
import { ClientEvent, NuiEvent, ServerEvent } from '@public/shared/event';
import { Feature, isFeatureEnabled } from '@public/shared/features';
import { FoodConfig, FoodCraftProcess, FoodRecipe } from '@public/shared/job/food';
import { MenuType } from '@public/shared/nui/menu';

import { BlipFactory } from '../../blip';
import { InventoryManager } from '../../inventory/inventory.manager';
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

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    private state = {
        displayMilkBlip: false,
        displayEasterEggBlip: false,
        easterEnabled: false,
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

        if (isFeatureEnabled(Feature.Easter)) {
            this.state.easterEnabled = true;

            this.blipFactory.create('displayEasterEggBlip', {
                name: 'Point de collecte des oeufs',
                coords: { x: 2253.42, y: 4835.86, z: 40.66 },
                sprite: 809,
                scale: 0.9,
            });

            this.blipFactory.hide('displayEasterEggBlip', true);

            this.targetFactory.createForBoxZone(
                'food:easter_harvest',
                {
                    center: [2253.42, 4835.86, 40.66],
                    length: 33.2,
                    width: 8.4,
                    minZ: 38.66,
                    maxZ: 40.66,
                    heading: 45,
                },
                [
                    {
                        label: 'Récolter',
                        icon: 'c:food/collecter.png',
                        color: 'food',
                        job: 'food',
                        canInteract: () => {
                            return this.playerService.isOnDuty();
                        },
                        action: () => {
                            TriggerServerEvent(ServerEvent.FOOD_EASTER_HARVEST);
                        },
                    },
                ]
            );
        }
    }

    @OnEvent(ClientEvent.JOBS_FOOD_OPEN_SOCIETY_MENU)
    public onOpenSocietyMenu() {
        if (this.nuiMenu.getOpened() === MenuType.FoodJobMenu) {
            this.nuiMenu.closeMenu();
            return;
        }
        const sortFunction = (a, b) => a.output.label.localeCompare(b.output.label);
        let processes = [
            ...this.computeRecipes(FoodConfig.processes.wineProcesses, '🍷').sort(sortFunction),
            ...this.computeRecipes(FoodConfig.processes.juiceProcesses, '🧃').sort(sortFunction),
            ...this.computeRecipes(FoodConfig.processes.cheeseProcesses, '🧀').sort(sortFunction),
            ...this.computeRecipes(FoodConfig.processes.sausageProcesses, '🌭').sort(sortFunction),
        ];

        if (isFeatureEnabled(Feature.Easter)) {
            processes = [
                ...this.computeRecipes(FoodConfig.processes.easterProcesses, '🥚').sort(sortFunction),
                ...processes,
            ];
        }

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
                const hasRequiredAmount = !!this.inventoryManager.hasEnoughItem(input.id, input.amount, true);
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
