import { OnEvent } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { Rpc } from '@public/core/decorators/rpc';
import { InventoryManager } from '@public/server/inventory/inventory.manager';
import { ItemService } from '@public/server/item/item.service';
import { Monitor } from '@public/server/monitor/monitor';
import { Notifier } from '@public/server/notifier';
import { ServerEvent } from '@public/shared/event';
import { canTreeBeHarvest, canTreeBeWater, FDFConfig, TreeStatus } from '@public/shared/job/fdf';
import { toVector3Object, Vector3 } from '@public/shared/polyzone/vector';
import { getRandomInt } from '@public/shared/random';
import { RpcServerEvent } from '@public/shared/rpc';

@Provider()
export class FDFTreeProvider {
    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(Monitor)
    private monitor: Monitor;

    private treeStatus: Map<number, TreeStatus> = new Map();

    @OnEvent(ServerEvent.FDF_TREE_CUT)
    public onCutTree(source: number, id: number, item: string) {
        const tree = this.treeStatus.get(id);
        if (tree) {
            return;
        }

        this.treeStatus.set(id, {
            cutDate: Date.now(),
            nbWater: 0,
            objectRemaining: 40,
            lastWater: 0,
            item: item,
        });

        this.notifier.notify(
            source,
            `Vous avez ~g~taillé~s~ cet arbre, ses fruits seront prêts à être récoltés d'ici à deux heures.`
        );

        this.monitor.publish(
            'job_fdf_cut_tree',
            {
                player_source: source,
                type: item,
            },
            {
                id: id,
                position: toVector3Object(GetEntityCoords(GetPlayerPed(source)) as Vector3),
            }
        );
    }

    @OnEvent(ServerEvent.FDF_TREE_WATER)
    public onWaterTree(source: number, id: number) {
        const tree = this.treeStatus.get(id);
        if (!canTreeBeWater(tree)) {
            return;
        }

        tree.nbWater++;
        tree.lastWater = Date.now();

        this.notifier.notify(
            source,
            `Vous avez ~g~arrosé~s~ cet arbre, ses fruits seront prêts à être récoltés un peu plus tôt.`
        );

        this.monitor.publish(
            'job_fdf_water_tree',
            {
                player_source: source,
                type: tree.item,
            },
            {
                id: id,
                position: toVector3Object(GetEntityCoords(GetPlayerPed(source)) as Vector3),
            }
        );
    }

    @Rpc(RpcServerEvent.FDF_TREE_HARVEST)
    public onHarvestTree(source: number, id: number): number {
        const tree = this.treeStatus.get(id);
        if (!canTreeBeHarvest(tree)) {
            this.notifier.notify(source, `Il n'y a plus de fruit mûr sur l'arbre.`);
            return 0;
        }

        const nbItem = Math.min(
            getRandomInt(FDFConfig.treeHarvestItemCount[0], FDFConfig.treeHarvestItemCount[1]),
            tree.objectRemaining
        );
        if (!this.inventoryManager.canCarryItem(source, tree.item, nbItem)) {
            this.notifier.notify(
                source,
                `Vous ne possédez pas suffisamment de place dans votre inventaire pour récolter.`,
                'error'
            );
            return 0;
        }

        this.inventoryManager.addItemToInventory(source, tree.item, nbItem);

        this.notifier.notify(
            source,
            `Vous avez récolté ~y~${nbItem}~s~ ~g~${this.itemService.getItem(tree.item).label}~s~.`
        );

        tree.objectRemaining -= nbItem;

        if (tree.objectRemaining == 0) {
            this.notifier.notify(source, `Il n'y a plus de fruit mûr sur l'arbre.`);
            this.treeStatus.delete(id);
        }

        this.monitor.publish(
            'job_fdf_harvest_tree',
            {
                player_source: source,
                type: tree.item,
            },
            {
                id: id,
                count: nbItem,
                position: toVector3Object(GetEntityCoords(GetPlayerPed(source)) as Vector3),
            }
        );

        return tree.objectRemaining;
    }

    @Rpc(RpcServerEvent.FDF_TREE_GET)
    public onHarvestGet(source: number, id: number): TreeStatus {
        return this.treeStatus.get(id);
    }
}
