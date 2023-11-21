import { OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { InventoryManager } from '@public/server/inventory/inventory.manager';
import { PlayerService } from '@public/server/player/player.service';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { JobType } from '@public/shared/job';
import { Vector4 } from '@public/shared/polyzone/vector';

const allowedJobInteraction = [JobType.BCSO, JobType.FBI, JobType.SASP, JobType.LSPD];
const spike_prop = GetHashKey('p_ld_stinger_s');

@Provider()
export class PoliceSpikeProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    private spikes: { [id: string]: Vector4 } = {};

    @OnEvent(ServerEvent.POLICE_PLACE_SPIKE)
    public async placeSpike(source: number, item: string) {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }
        if (!allowedJobInteraction.includes(player.job.id)) {
            return;
        }
        if (this.inventoryManager.getItemCount(player.source, item) >= 1) {
            this.inventoryManager.removeItemFromInventory(player.source, item, 1);
            TriggerClientEvent(ClientEvent.POLICE_REQUEST_ADD_SPIKE, player.source);
        } else {
            TriggerClientEvent(
                ClientEvent.NOTIFICATION_DRAW,
                player.source,
                'Vous ne possédez pas cet objet.',
                'error'
            );
        }
    }

    @OnEvent(ServerEvent.POLICE_ADD_SPIKE)
    public async addSpike(source: number, position: Vector4) {
        const spike = CreateObjectNoOffset(spike_prop, position[0], position[1], position[2], true, true, false);
        SetEntityHeading(spike, position[3]);
        FreezeEntityPosition(spike, true);

        this.spikes[NetworkGetNetworkIdFromEntity(spike)] = position;
        TriggerClientEvent(ClientEvent.POLICE_SYNC_SPIKE, -1, this.spikes);
    }

    @OnEvent(ServerEvent.POLICE_REMOVE_SPIKE)
    public async removeSpike(source: number, id: number) {
        if (this.spikes[id]) {
            DeleteEntity(NetworkGetEntityFromNetworkId(id));
            delete this.spikes[id];
            TriggerClientEvent(ClientEvent.POLICE_SYNC_SPIKE, -1, this.spikes);
        }
    }

    @OnEvent(ServerEvent.POLICE_INIT_SPIKE)
    public async loadSpike(source: number) {
        TriggerClientEvent(ClientEvent.POLICE_SYNC_SPIKE, source, this.spikes);
    }
}
