import { Once, OnceStep } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';
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
import { NuiDispatch } from '../../nui/nui.dispatch';
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

    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Once(OnceStep.PlayerLoaded)
    public onPlayerLoaded() {
        if (!isFeatureEnabled(Feature.MyBodySummer)) {
            return;
        }
        const targets: TargetOptions[] = craftProcesses.map(craftProcess => {
            const method: (craft: CraftProcess, icon: string) => TargetOptions = this.craftProcessToTarget.bind(this);
            return method(craftProcess, 'c:/ffs/craft.png');
        });

        craftZones.forEach(zone => {
            this.targetFactory.createForBoxZone(zone.name, zone, targets);
        });

        const luxuryTargets: TargetOptions[] = luxuryCraftProcesses.map(craftProcess => {
            const method: (craft: CraftProcess, icon: string) => TargetOptions = this.craftProcessToTarget.bind(this);
            return method(craftProcess, 'c:/ffs/craft.png');
        });

        luxuryCraftZones.forEach(zone => {
            this.targetFactory.createForBoxZone(zone.name, zone, luxuryTargets);
        });

        const shoesTargets: TargetOptions[] = shoesCraftProcesses.map(craftProcess => {
            const method: (craft: CraftProcess, icon: string) => TargetOptions = this.craftProcessToTarget.bind(this);
            return method(craftProcess, 'c:/ffs/craft_shoes.png');
        });

        shoesTargets.push({
            label: 'Voir le menu',
            color: 'ffs',
            action: () => {
                this.nuiMenu.openMenu(MenuType.FfsRecipeBook);

                this.nuiDispatch.dispatch('ffs_recipe_book', 'ShowFfsRecipeBook', craftProcesses);
            },
        });

        shoesCraftZones.forEach(zone => {
            this.targetFactory.createForBoxZone(zone.name, zone, shoesTargets);
        });
    }

    private craftProcessToTarget(craftProcess: CraftProcess, icon: string): TargetOptions {
        return {
            label: craftProcess.label,
            icon: icon,
            color: 'ffs',
            job: 'ffs',
            blackoutGlobal: true,
            blackoutJob: 'ffs',
            canInteract: () => {
                for (const input of craftProcess.inputs) {
                    if (!this.inventoryManager.hasEnoughItem(input.fabric, input.amount)) {
                        return false;
                    }
                }
                return this.playerService.isOnDuty();
            },
            action: () => {
                TriggerServerEvent(ServerEvent.FFS_CRAFT, craftProcess);
            },
        };
    }
}
