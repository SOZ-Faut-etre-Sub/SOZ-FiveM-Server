import { OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { InventoryFactory } from '@public/server/inventory/inventory.factory';
import { ObjectProvider } from '@public/server/object/object.provider';
import { PlayerService } from '@public/server/player/player.service';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { FDO } from '@public/shared/job';
import { getLocationHash } from '@public/shared/locationhash';
import { Vector4 } from '@public/shared/polyzone/vector';

import { Notifier } from '../../notifier';

const roadSignModel = GetHashKey('prop_trafficdiv_02');
const speedzoneItemName = 'speed_speed_sign';
const LANE_RADIUS = 5.0;

@Provider()
export class PoliceSpeedZoneProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(InventoryFactory)
    private inventoryFactory: InventoryFactory;

    @Inject(ObjectProvider)
    private objectProvider: ObjectProvider;

    @Inject(Notifier)
    private notifier: Notifier;

    private zones: { [id: string]: { position: Vector4; radius: number; speed: number } } = {};

    @OnEvent(ServerEvent.POLICE_PLACE_SPEEDZONE)
    public async onPlaceSpeedZone(source: number, distance: number, speed: number) {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }
        if (!FDO.includes(player.job.id)) {
            return;
        }
        if (distance < 1 || distance > 5) {
            this.notifier.notify(source, `La distance doit être entre 1 et 5.`, 'error');
            return;
        }

        const inventory = await this.inventoryFactory.getPlayerInventory(source);

        if (inventory.remove(speedzoneItemName, 1)) {
            TriggerClientEvent(ClientEvent.POLICE_REQUEST_ADD_SPEEDZONE, player.source, LANE_RADIUS * distance, speed);
        } else {
            this.notifier.notify(source, `Vous ne possédez pas cet objet.`, 'error');
        }
    }

    @OnEvent(ServerEvent.POLICE_ADD_SPEEDZONE)
    public async addSpeedZone(source: number, position: Vector4, radius: number, speed: number) {
        const id = `speedzone_${getLocationHash(position)}`;

        this.objectProvider.createObject({
            id: id,
            model: roadSignModel,
            position: position,
        });

        this.zones[id] = { position, radius, speed };
        TriggerClientEvent(ClientEvent.POLICE_SYNC_SPEEDZONE, -1, this.zones);
    }

    @OnEvent(ServerEvent.POLICE_REMOVE_SPEEDZONE)
    public async removeSpeedZone(source: number, id: string) {
        if (this.zones[id]) {
            this.objectProvider.deleteObject(id);
            delete this.zones[id];
            TriggerClientEvent(ClientEvent.POLICE_SYNC_SPEEDZONE, -1, this.zones);
        }
    }

    @OnEvent(ServerEvent.POLICE_INIT_SPEEDZONE)
    public async loadSpeedZone(source: number) {
        TriggerClientEvent(ClientEvent.POLICE_SYNC_SPEEDZONE, source, this.zones);
    }
}
