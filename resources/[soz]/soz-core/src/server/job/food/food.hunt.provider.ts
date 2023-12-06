import { OnEvent } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { Monitor } from '@public/client/monitor/monitor';
import { Rpc } from '@public/core/decorators/rpc';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { FoodHuntConfig } from '@public/shared/job/food';
import { RpcServerEvent } from '@public/shared/rpc';

@Provider()
export class FoodHuntProvider {
    @Inject(Monitor)
    public monitor: Monitor;

    private zonesValue: Record<string, number> = {};
    private zonesDespawnTime: Record<string, number> = {};

    @OnEvent(ServerEvent.FOOD_HUNT)
    async onHunt(source: number, zoneId: string) {
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

            this.monitor.publish(
                'food_hunt_no_spawn',
                {
                    zoneId: zoneId,
                },
                {
                    endDate: new Date(this.zonesDespawnTime[zoneId]).toString(),
                }
            );
        }
    }

    @Rpc(RpcServerEvent.FOOD_HUNT_INIT)
    public async handleNoSpawnZone() {
        return this.zonesDespawnTime;
    }
}
