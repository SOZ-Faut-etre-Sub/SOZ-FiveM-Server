import { OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { InventoryFactory } from '@public/server/inventory/inventory.factory';
import { ServerEvent } from '@public/shared/event';

import { Rpc } from '../../../core/decorators/rpc';
import { RpcServerEvent } from '../../../shared/rpc';
import { FieldProvider } from '../../field/field.provider';
import { Monitor } from '../../monitor/monitor';
import { Notifier } from '../../notifier';

@Provider()
export class PawlHarvestProvider {
    @Inject(InventoryFactory)
    private inventoryFactory: InventoryFactory;

    @Inject(FieldProvider)
    private fieldProvider: FieldProvider;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(Monitor)
    private monitor: Monitor;

    @OnEvent(ServerEvent.PAWL_DECREASE_CHAINSAW_FUEL)
    public async decreaseFuel(source, data) {
        const inventory = await this.inventoryFactory.getPlayerInventory(source);

        if (!inventory) {
            return;
        }

        inventory.updateMetadataAtSlot(data.slot, { fuel: data.fuel - 1 });
    }

    @Rpc(RpcServerEvent.PAWL_HARVEST_TREE)
    public async harvestTree(source: number, fieldId: string, treeId: string) {
        const inventory = await this.inventoryFactory.getPlayerInventory(source);

        if (!inventory) {
            return false;
        }

        if (!inventory.canCarryItem('tree_trunk', 1)) {
            this.notifier.error(source, "Vous ne pouvez pas recevoir d'objet !");

            return false;
        }

        const treeHarvest = await this.fieldProvider.harvestTree(fieldId, treeId);

        if (!treeHarvest) {
            this.notifier.error(source, 'Impossible de récolter cet arbre !');

            return false;
        }

        inventory.add('tree_trunk', 1);

        this.monitor.traceEvent('job_pawl_harvest_tree', {
            player_source: source,
            field: fieldId,
            amount: 1,
        });

        return true;
    }

    @Rpc(RpcServerEvent.PAWL_HARVEST_TREE_SAP)
    public async harvestTreeSap(source: number, fieldId: string, treeId: string) {
        const inventory = await this.inventoryFactory.getPlayerInventory(source);

        if (!inventory) {
            return false;
        }

        if (!inventory.canCarryItem('sap', 20)) {
            this.notifier.error(source, "Vous ne pouvez pas recevoir d'objet !");

            return false;
        }

        const tree = await this.fieldProvider.getTree(fieldId, treeId);

        if (!tree) {
            this.notifier.error(source, 'Impossible de récolter cet arbre !');

            return false;
        }

        inventory.add('sap', 20);

        this.monitor.traceEvent('job_pawl_sap_tree', {
            player_source: source,
            field: fieldId,
            amount: 1,
        });

        return true;
    }
}
