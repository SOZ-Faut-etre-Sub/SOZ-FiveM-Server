import { Once, OnceStep, OnEvent, OnNuiEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { FfsRecipe } from '../../../nui/components/FightForStyle/FightForStyleJobMenu';
import { ClientEvent, NuiEvent } from '../../../shared/event';
import { CraftProcess, FfsConfig } from '../../../shared/job/ffs';
import { MenuType } from '../../../shared/nui/menu';
import { BlipFactory } from '../../blip';
import { InventoryManager } from '../../item/inventory.manager';
import { ItemService } from '../../item/item.service';
import { NuiMenu } from '../../nui/nui.menu';
import { PlayerService } from '../../player/player.service';
import { Qbcore } from '../../qbcore';
import { TargetFactory } from '../../target/target.factory';

@Provider()
export class FightForStyleProvider {
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
        ffs_cotton_bale: false,
    };

    @Once(OnceStep.PlayerLoaded)
    public onPlayerLoaded() {
        this.createBlips();

        this.targetFactory.createForBoxZone(
            'ffs:duty',
            {
                center: [707.29, -967.58, 30.41],
                length: 0.35,
                width: 0.4,
                minZ: 30.21,
                maxZ: 30.66,
            },
            [
                {
                    type: 'server',
                    event: 'QBCore:ToggleDuty',
                    icon: 'fas fa-sign-in-alt',
                    label: 'Prise de service',
                    canInteract: () => {
                        return !this.playerService.isOnDuty();
                    },
                    job: 'ffs',
                },
                {
                    type: 'server',
                    event: 'QBCore:ToggleDuty',
                    icon: 'fas fa-sign-in-alt',
                    label: 'Fin de service',
                    canInteract: () => {
                        return this.playerService.isOnDuty();
                    },
                    job: 'ffs',
                },
            ]
        );
        this.targetFactory.createForBoxZone(
            'jobs:ffs:cloakroom',
            {
                center: [706.41, -959.03, 30.4],
                length: 0.5,
                width: 4.25,
                minZ: 29.4,
                maxZ: 31.6,
            },
            [
                {
                    label: 'Se changer',
                    type: 'client',
                    event: 'jobs:client:ffs:OpenCloakroomMenu',
                    icon: 'c:jobs/habiller.png',
                    job: 'ffs',
                    canInteract: () => {
                        return this.playerService.isOnDuty();
                    },
                },
            ]
        );
    }

    @OnNuiEvent(NuiEvent.FfsDisplayBlip)
    public async onDisplayBlip({ blip, value }: { blip: string; value: boolean }) {
        this.state[blip] = value;
        this.blipFactory.hide(blip, !value);
    }

    @OnEvent(ClientEvent.JOBS_FFS_OPEN_SOCIETY_MENU)
    public onOpenSocietyMenu() {
        if (this.nuiMenu.isOpen()) {
            this.nuiMenu.closeMenu();
            return;
        }

        const { craftProcesses, luxuryCraftProcesses, shoesCraftProcesses } = FfsConfig.craft.processes;
        const recipes = [
            ...this.computeRecipes(craftProcesses),
            ...this.computeRecipes(luxuryCraftProcesses),
            ...this.computeRecipes(shoesCraftProcesses),
        ];
        recipes.sort((a, b) => a.label.localeCompare(b.label));
        this.nuiMenu.openMenu(MenuType.FightForStyleJobMenu, {
            recipes,
            state: this.state,
            onDuty: this.playerService.isOnDuty(),
        });
    }

    private createBlips() {
        this.blipFactory.create('jobs:ffs', {
            name: 'Fight For Style',
            coords: { x: 717.72, y: -974.24, z: 24.91 },
            sprite: 808,
            scale: 1.2,
        });
        this.blipFactory.create('ffs_cotton_bale', {
            name: 'Point de récolte de balle de coton',
            coords: { x: 2564.11, y: 4680.59, z: 34.08 },
            sprite: 808,
            scale: 0.9,
        });
        this.blipFactory.hide('ffs_cotton_bale', true);
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
