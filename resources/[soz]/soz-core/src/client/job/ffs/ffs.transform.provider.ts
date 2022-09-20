import { Once, OnceStep } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';
import { SewingRawMaterialItem } from '../../../shared/item';
import { FabricMaterial, FfsConfig, TransformProcess } from '../../../shared/job/ffs';
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

    @Once(OnceStep.PlayerLoaded)
    public onPlayerLoaded() {
        const targets: TargetOptions[] = Object.keys(FabricMaterial).map(key => {
            const fabricMaterial: string = FabricMaterial[key];
            const item = this.itemService.getItem<SewingRawMaterialItem>(fabricMaterial);
            const transformProcess: TransformProcess = FfsConfig.transform.processes[fabricMaterial];

            return {
                label: `Transformer: ${item.label}`,
                icon: `c:/ffs/transform.png`,
                color: 'ffs',
                job: 'ffs',
                blackoutGlobal: true,
                blackoutJob: 'ffs',
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
            },
            targets
        );
    }
}
