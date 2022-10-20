import { TargetFactory } from '../../../client/target/target.factory';
import { OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';
import { FabricMaterial, FfsConfig } from '../../../shared/job/ffs';
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

        const transformationProcess = FfsConfig.transform.processes[fabricMaterial];

        this.inventoryManager.removeItemFromInventory(
            source,
            transformationProcess.inputs[0].id,
            transformationProcess.inputs[0].amount
        );

        this.inventoryManager.addItemToInventory(
            source,
            transformationProcess.output.id,
            transformationProcess.output.amount
        );

        return true;
    }

    private canProcess(source: number, fabricMaterial: FabricMaterial): boolean {
        const transformProcess = FfsConfig.transform.processes[fabricMaterial];
        return this.inventoryManager.canSwapItem(
            source,
            transformProcess.inputs[0].id,
            transformProcess.inputs[0].amount,
            transformProcess.output.id,
            transformProcess.output.amount
        );
    }

    @OnEvent(ServerEvent.FFS_TRANSFORM)
    public async onTransform(source: number, fabricMaterial: FabricMaterial) {
        if (!this.canProcess(source, fabricMaterial)) {
            this.notifier.notify(source, 'Vos poches sont pleines.', 'error');
            return;
        }
        this.notifier.notify(source, 'Vous ~g~commencez~s~ vos procédés chimiques et mécaniques.');
        const transformProcess = FfsConfig.transform.processes[fabricMaterial];
        while (
            this.inventoryManager.canSwapItem(
                source,
                transformProcess.inputs[0].id,
                transformProcess.inputs[0].amount,
                transformProcess.output.id,
                transformProcess.output.amount
            )
        ) {
            const item = this.inventoryManager.getFirstItemInventory(source, transformProcess.inputs[0].id);
            if (!item || item.amount < transformProcess.inputs[0].amount) {
                break;
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
