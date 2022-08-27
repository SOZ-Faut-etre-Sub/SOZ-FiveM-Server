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

    private async doTransform(source: number, fabricMaterial: FabricMaterial) {
        const label = 'Vous commencez vos procédés chimiques et mécaniques.';
        const { completed } = await this.progressService.progress(source, 'ffs_transform', label, 2000, {
            name: 'base',
            dictionary: 'amb@prop_human_seat_sewing@female@base',
            flags: 16,
        });

        if (!completed) {
            return;
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
    }

    @OnEvent(ServerEvent.FFS_TRANSFORM)
    public async onTransform(source: number, fabricMaterial: FabricMaterial) {
        const transformProcess = TransformProcesses[fabricMaterial];
        const item = this.inventoryManager.getFirstItemInventory(source, transformProcess.input);
        if (!item || item.amount < transformProcess.inputAmount) {
            return;
        }

        await this.doTransform(source, fabricMaterial);

        this.notifier.notify(source, `Vous avez ~r~terminé~s~ vos procédés chimiques et mécaniques.`);
    }
}
