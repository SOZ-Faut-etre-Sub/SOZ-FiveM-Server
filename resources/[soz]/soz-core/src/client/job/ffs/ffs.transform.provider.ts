import { Once } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';
import { Feature, isFeatureEnabled } from '../../../shared/features';
import { SewingRawMaterialItem } from '../../../shared/item';
import { FabricMaterial, TransformProcess, TransformProcesses } from '../../../shared/job/ffs';
import { InventoryManager } from '../../item/inventory.manager';
import { ItemService } from '../../item/item.service';
import { PlayerService } from '../../player/player.service';
import { TargetFactory, TargetOptions } from '../../target/target.factory';

@Provider()
export class FightForStyleTransformProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Once()
    public onStart() {
        if (!isFeatureEnabled(Feature.MyBodySummer)) {
            return;
        }

        const targets: TargetOptions[] = Object.keys(FabricMaterial).map(key => {
            const fabricMaterial: string = FabricMaterial[key];
            const item = this.itemService.getItem<SewingRawMaterialItem>(fabricMaterial);
            const transformProcess: TransformProcess = TransformProcesses[fabricMaterial];

            return {
                label: `Transformer: ${item.label}`,
                color: 'ffs',
                job: 'ffs',
                canInteract: () => {
                    return (
                        this.playerService.isOnDuty() &&
                        this.inventoryManager.hasEnoughItem(transformProcess.input, transformProcess.inputAmount)
                    );
                },
                action: () => {
                    TriggerServerEvent(ServerEvent.FFS_TRANSFORM, fabricMaterial);
                },
            };
        });

        this.targetFactory.createForBoxZone(
            'ffs_transform_zone',
            {
                center: [712.9, -974.66, 30.4],
                length: 0.75,
                width: 3.0,
                minZ: 29.4,
                maxZ: 30.85,
                heading: 0,
                debugPoly: true,
            },
            targets
        );
    }
}
