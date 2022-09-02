import { TargetFactory } from '../../../client/target/target.factory';
import { OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';
import { CraftProcess } from '../../../shared/job/ffs';
import { InventoryManager } from '../../item/inventory.manager';
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

    @OnEvent(ServerEvent.FFS_CRAFT)
    public async onCraft(source: number, craftProcess: CraftProcess) {
        this.notifier.notify(source, 'Vous ~g~commencez~s~ à confectionner.', 'success');
        for (const input of craftProcess.inputs) {
            const item = this.inventoryManager.getFirstItemInventory(source, input.fabric);
            if (!item || item.amount < input.amount) {
                return;
            }
        }
        const hasCrafted = await this.doCraft(source, craftProcess);
        let label = 'Vous avez ~r~fini~s~ de confectionner.';
        if (!hasCrafted) {
            label = 'Vous avez ~r~arrêté~s~ de confectionner.';
        }
        this.notifier.notify(source, label);
    }

    private async doCraft(source: number, craftProcess: CraftProcess) {
        const { completed } = await this.progressService.progress(source, 'ffs_craft', 'Confection en cours', 5000, {
            name: 'base',
            dictionary: 'amb@prop_human_seat_sewing@female@base',
            flags: 16,
        });

        if (!completed) {
            return false;
        }

        for (const input of craftProcess.inputs) {
            this.inventoryManager.removeItemFromInventory(source, input.fabric, input.amount);
        }
        this.inventoryManager.addItemToInventory(source, craftProcess.output, craftProcess.outputAmount);
        return true;
    }
}
