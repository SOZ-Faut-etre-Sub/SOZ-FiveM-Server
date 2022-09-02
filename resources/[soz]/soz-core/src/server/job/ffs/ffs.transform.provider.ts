import { TargetFactory } from '../../../client/target/target.factory';
import { OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';
import { FabricMaterial, TransformProcesses } from '../../../shared/job/ffs';
import { InventoryManager } from '../../item/inventory.manager';
import { Notifier } from '../../notifier';
import { PlayerService } from '../../player/player.service';
import { ProgressService } from '../../player/progress.service';

@Provider()
export class FightForStyleTransformProvider {
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

    private async doTransform(source: number, fabricMaterial: FabricMaterial): Promise<boolean> {
        const { completed } = await this.progressService.progress(source, 'ffs_transform', 'Transformation', 2000, {
            name: 'base',
            dictionary: 'amb@prop_human_seat_sewing@female@base',
            flags: 16,
        });

        if (!completed) {
            return false;
        }

        const transformationProcess = TransformProcesses[fabricMaterial];

        this.inventoryManager.removeItemFromInventory(
            source,
            transformationProcess.input,
            transformationProcess.inputAmount
        );

        this.inventoryManager.addItemToInventory(
            source,
            transformationProcess.output,
            transformationProcess.outputAmount
        );

        return true;
    }

    @OnEvent(ServerEvent.FFS_TRANSFORM)
    public async onTransform(source: number, fabricMaterial: FabricMaterial) {
        this.notifier.notify(source, 'Vous ~g~commencez~s~ vos procédés chimiques et mécaniques.');
        const transformProcess = TransformProcesses[fabricMaterial];
        while (this.inventoryManager.canCarryItem(source, transformProcess.output, transformProcess.outputAmount, {})) {
            const item = this.inventoryManager.getFirstItemInventory(source, transformProcess.input);
            if (!item || item.amount < transformProcess.inputAmount) {
                return;
            }

            const hasTransformed = await this.doTransform(source, fabricMaterial);
            if (!hasTransformed) {
                this.notifier.notify(source, `Vous avez ~r~arrêté~s~ vos procédés chimiques et mécaniques.`, 'error');
                return;
            }
        }

        this.notifier.notify(source, `Vous avez ~r~terminé~s~ vos procédés chimiques et mécaniques.`);
    }
}
