import { Once, OnceStep } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';
import { FoodConfig, FoodCraftProcess } from '../../../shared/job/food';
import { InventoryManager } from '../../item/inventory.manager';
import { ItemService } from '../../item/item.service';
import { PlayerService } from '../../player/player.service';
import { TargetFactory, TargetOptions } from '../../target/target.factory';

@Provider()
export class FoodCraftProvider {
    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Once(OnceStep.PlayerLoaded)
    public onPlayerLoaded() {
        // 3 craft zones
        const wineTargets: TargetOptions[] = FoodConfig.processes.wineProcesses.map(craftProcess => {
            const method: (craft: FoodCraftProcess, icon: string, duration: number) => TargetOptions =
                this.craftProcessToTarget.bind(this);
            return method(craftProcess, 'c:/food/craft_wine.png', FoodConfig.duration.craftWine);
        });

        const juiceTargets: TargetOptions[] = FoodConfig.processes.juiceProcesses.map(craftProcess => {
            const method: (craft: FoodCraftProcess, icon: string, duration: number) => TargetOptions =
                this.craftProcessToTarget.bind(this);
            return method(craftProcess, 'c:/food/craft_wine.png', FoodConfig.duration.craftJuice);
        });

        FoodConfig.zones.wineCraftZones.forEach(zone => {
            this.targetFactory.createForBoxZone(zone.name, zone, [...wineTargets, ...juiceTargets]);
        });

        const sausageTargets: TargetOptions[] = FoodConfig.processes.sausageProcesses.map(craftProcess => {
            const method: (craft: FoodCraftProcess, icon: string, duration: number) => TargetOptions =
                this.craftProcessToTarget.bind(this);
            return method(craftProcess, 'c:/food/craft_sausage.png', FoodConfig.duration.craftSausage);
        });

        FoodConfig.zones.sausageCraftZones.forEach(zone => {
            this.targetFactory.createForBoxZone(zone.name, zone, sausageTargets);
        });

        const cheeseTargets: TargetOptions[] = FoodConfig.processes.cheeseProcesses.map(craftProcess => {
            const method: (craft: FoodCraftProcess, icon: string, duration: number) => TargetOptions =
                this.craftProcessToTarget.bind(this);
            return method(craftProcess, 'c:/food/craft_cheese.png', FoodConfig.duration.craftCheese);
        });

        FoodConfig.zones.cheeseCraftZones.forEach(zone => {
            this.targetFactory.createForBoxZone(zone.name, zone, cheeseTargets);
        });
    }

    private craftProcessToTarget(craftProcess: FoodCraftProcess, icon: string, duration: number): TargetOptions {
        const outputItem = this.itemService.getItem(craftProcess.output.id);
        return {
            label: outputItem.label,
            icon,
            color: 'food',
            job: 'food',
            blackoutGlobal: true,
            blackoutJob: 'food',
            canInteract: () => {
                const items = this.inventoryManager.getItems();

                for (const input of craftProcess.inputs) {
                    let totalAmount = 0;
                    for (const item of items) {
                        if (totalAmount >= input.amount) {
                            break;
                        }
                        if (item.name === input.id && !this.itemService.isExpired(item)) {
                            totalAmount += item.amount;
                        }
                    }
                    if (totalAmount < input.amount) {
                        return false;
                    }
                }
                return this.playerService.isOnDuty();
            },
            action: () => {
                TriggerServerEvent(ServerEvent.FOOD_CRAFT, craftProcess, duration);
            },
        };
    }
}
