import { TargetFactory } from '../../../client/target/target.factory';
import { OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';
import { FfsConfig, Process } from '../../../shared/job/ffs';
import { InventoryManager } from '../../item/inventory.manager';
import { ItemService } from '../../item/item.service';
import { Notifier } from '../../notifier';
import { PlayerService } from '../../player/player.service';
import { ProgressService } from '../../player/progress.service';

@Provider()
export class FightForStyleCraftProvider {
    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(ItemService)
    private itemService: ItemService;

    @OnEvent(ServerEvent.FFS_CRAFT)
    public async onCraft(source: number, craftProcess: Process) {
        if (!this.canCraft(source, craftProcess)) {
            this.notifier.notify(source, `Vous n'avez pas les matériaux nécessaires pour confectionner.`, 'error');
            return;
        }

        this.notifier.notify(source, 'Vous ~g~commencez~s~ à confectionner.', 'success');

        while (this.canCraft(source, craftProcess)) {
            const hasCrafted = await this.doCraft(source, craftProcess);
            const outputItemLabel = this.itemService.getItem(craftProcess.output.id).label;
            if (hasCrafted) {
                this.notifier.notify(source, `Vous avez confectionné un·e ~g~${outputItemLabel}~s~.`);
            } else {
                this.notifier.notify(source, 'Vous avez ~r~arrêté~s~ de confectionner.');
                return;
            }
        }
        this.notifier.notify(source, `Vous n'avez pas les matériaux nécessaires pour confectionner.`);
    }

    private canCraft(source: number, craftProcess: Process): boolean {
        for (const input of craftProcess.inputs) {
            const item = this.inventoryManager.getFirstItemInventory(source, input.id);
            if (!item || item.amount < input.amount) {
                return false;
            }
        }
        return true;
    }

    private async doCraft(source: number, craftProcess: Process) {
        const { completed } = await this.progressService.progress(
            source,
            'ffs_craft',
            'Confection en cours',
            FfsConfig.craft.duration,
            {
                name: 'base',
                dictionary: 'amb@prop_human_seat_sewing@female@base',
                flags: 16,
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
}
