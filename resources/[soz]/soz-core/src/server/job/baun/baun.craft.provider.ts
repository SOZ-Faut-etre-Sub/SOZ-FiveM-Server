import { OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';
import { BaunConfig, BaunCraftProcess } from '../../../shared/job/baun';
import { InventoryManager } from '../../item/inventory.manager';
import { ItemService } from '../../item/item.service';
import { Notifier } from '../../notifier';
import { PlayerService } from '../../player/player.service';
import { ProgressService } from '../../player/progress.service';

@Provider()
export class BaunCraftProvider {
    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(Notifier)
    private notifier: Notifier;

    @OnEvent(ServerEvent.BAUN_CRAFT)
    public async onCraft(source: number, craftProcess: BaunCraftProcess) {
        if (!this.canCraft(source, craftProcess)) {
            this.notifier.notify(source, `Vous n'avez pas les matériaux nécessaires pour confectionner.`, 'error');
        }

        this.notifier.notify(source, 'Vous ~g~commencez~s~ à confectionner.', 'success');

        while (this.canCraft(source, craftProcess)) {
            const hasCrafted = await this.doCraft(source, craftProcess);
            const outputItemLabel = this.itemService.getItem(craftProcess.output.id).label;
            if (hasCrafted) {
                this.notifier.notify(source, `Vous avez confectionné un ~g~${outputItemLabel}~s~.`);
            } else {
                this.notifier.notify(source, 'Vous avez ~r~arrêté~s~ de confectionner.');
                return;
            }
        }
    }

    private async doCraft(source: number, craftProcess: BaunCraftProcess): Promise<boolean> {
        const { completed } = await this.progressService.progress(
            source,
            'baun_craft',
            'Confection en cours...',
            BaunConfig.DURATIONS.CRAFTING,
            {
                dictionary: 'anim@amb@nightclub@mini@drinking@drinking_shots@ped_a@normal',
                name: 'pour_one',
                flags: 0,
            }
        );

        if (!completed) {
            return false;
        }

        for (const input of craftProcess.inputs) {
            this.inventoryManager.removeItemFromInventory(source, input.id, input.amount);
        }
        this.inventoryManager.addItemToInventory(source, craftProcess.output.id, craftProcess.output.amount);
        return true;
    }

    private canCraft(source: number, craftProcess: BaunCraftProcess): boolean {
        for (const input of craftProcess.inputs) {
            const item = this.inventoryManager.getFirstItemInventory(source, input.id);
            if (!item || item.amount < input.amount) {
                return false;
            }
        }
        return true;
    }
}
