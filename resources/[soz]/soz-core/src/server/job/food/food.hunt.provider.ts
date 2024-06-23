import { OnEvent } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { Rpc } from '@public/core/decorators/rpc';
import { Monitor } from '@public/server/monitor/monitor';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { FoodHuntConfig } from '@public/shared/job/food';
import { RpcServerEvent } from '@public/shared/rpc';

import { toVector3Object, Vector3 } from '../../../shared/polyzone/vector';
import { InventoryManager } from '../../inventory/inventory.manager';
import { ItemService } from '../../item/item.service';
import { Notifier } from '../../notifier';
import { PlayerService } from '../../player/player.service';
import { ProgressService } from '../../player/progress.service';

export const HUNTING_REWARD: Record<string, { min: number; max: number }> = {
    peau: { min: 0, max: 2 },
    os: { min: 0, max: 2 },
    viscere: { min: 0, max: 2 },
    tripe: { min: 1, max: 4 },
    viande: { min: 2, max: 5 },
    langue: { min: 1, max: 3 },
    abat: { min: 1, max: 3 },
    rognon: { min: 1, max: 3 },
};

@Provider()
export class FoodHuntProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(Monitor)
    public monitor: Monitor;

    private zonesValue: Record<string, number> = {};
    private zonesDespawnTime: Record<string, number> = {};

    @OnEvent(ServerEvent.FOOD_HUNT)
    public async onHunt(source: number, zoneId: string, entityNetId: number) {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        const entity = NetworkGetEntityFromNetworkId(entityNetId);

        const { completed } = await this.progressService.progress(source, 'food_hunt', 'Dépeçage en cours...', 5000, {
            dictionary: 'anim@gangops@facility@servers@bodysearch@',
            name: 'player_search',
            options: {
                enablePlayerControl: true,
                onlyUpperBody: true,
            },
        });

        if (!completed) {
            return;
        }

        if (!DoesEntityExist(entity)) {
            this.notifier.notify(source, "L'animal ne respire plus...", 'info');

            return;
        }

        const position = toVector3Object(GetEntityCoords(entity) as Vector3);
        let rewardSuccess = false;

        for (const itemId of Object.keys(HUNTING_REWARD)) {
            const item = this.itemService.getItem(itemId);

            if (!item) {
                continue;
            }

            const reward = HUNTING_REWARD[itemId];
            const quantity = Math.floor(Math.random() * (reward.max - reward.min + 1)) + reward.min;

            if (quantity > 0) {
                if (this.inventoryManager.addItemToInventory(source, itemId, quantity)) {
                    rewardSuccess = true;

                    this.notifier.notify(source, `Vous avez récupéré ${quantity} ${item.label}`, 'success');

                    this.monitor.traceEvent('job_cm_food_hunting', {
                        player_source: source,
                        item_id: itemId,
                        amount: quantity,
                        item_label: item.label,
                        position,
                    });
                }
            }
        }

        if (!rewardSuccess) {
            this.notifier.notify(source, 'Vos poches sont pleines...', 'error');

            return;
        }

        DeleteEntity(entity);

        this.handleZoneRespawn(source, zoneId);
    }

    @OnEvent(ServerEvent.FOOD_HUNT_RESPAWN)
    public handleZoneRespawn(source: number, zoneId: string) {
        const prevTime = this.zonesDespawnTime[zoneId];

        if (prevTime && Date.now() < prevTime) {
            return;
        }

        if (!this.zonesValue[zoneId]) {
            this.zonesValue[zoneId] = 0;
        }

        this.zonesValue[zoneId]++;

        if (this.zonesValue[zoneId] >= FoodHuntConfig.noSpawnHarvestCount) {
            this.zonesValue[zoneId] = 0;
            this.zonesDespawnTime[zoneId] = Date.now() + FoodHuntConfig.noSpawnDelay;
            TriggerClientEvent(ClientEvent.FOOD_HUNT_SYNC, -1, zoneId, this.zonesDespawnTime[zoneId]);

            this.monitor.traceEvent('food_hunt_no_spawn', {
                zone_id: zoneId,
                end_date: new Date(this.zonesDespawnTime[zoneId]).getTime(),
            });
        }
    }

    @Rpc(RpcServerEvent.FOOD_HUNT_INIT)
    public async handleNoSpawnZone() {
        return this.zonesDespawnTime;
    }
}
