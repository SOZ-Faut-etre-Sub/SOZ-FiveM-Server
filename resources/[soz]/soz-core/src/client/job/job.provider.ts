import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { emitRpc } from '../../core/rpc';
import { ClientEvent } from '../../shared/event';
import { RpcEvent } from '../../shared/rpc';
import { InventoryManager } from '../item/inventory.manager';
import { Notifier } from '../notifier';
import { PlayerService } from '../player/player.service';

@Provider()
export class JobProvider {
    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @OnEvent(ClientEvent.JOBS_TRY_OPEN_CLOAKROOM)
    public async onTryOpenCloakroom(storageId: string, event: string) {
        const result = await emitRpc(RpcEvent.INVENTORY_SEARCH, storageId, 'work_clothes');
        if (!result) {
            this.notifier.notify(`Il n'y a pas de tenue de travail dans le vestiaire.`, 'error');
            return;
        }

        // Keep propagating the storageId as we need to remove a work_clothes item
        // from it only when selecting the appropriate button on the cloakroom menu.
        TriggerEvent(event, storageId);
    }
}
