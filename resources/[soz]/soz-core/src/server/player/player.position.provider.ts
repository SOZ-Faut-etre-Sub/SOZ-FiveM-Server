import { Once } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Rpc } from '@public/core/decorators/rpc';
import { ClientEvent } from '@public/shared/event/client';
import { getDistance, Vector3, Vector4 } from '@public/shared/polyzone/vector';
import { RpcServerEvent } from '@public/shared/rpc';

import { Monitor } from '../monitor/monitor';
import { PermissionService } from '../permission.service';

@Provider()
export class PlayerPositionProvider {
    @Inject(Monitor)
    private monitor: Monitor;

    @Inject(PermissionService)
    private permissionService: PermissionService;

    public AIRPORT = 'airport';

    private players: Record<number, Vector3> = {};
    private zones = new Map<string, Vector4>();

    @Once()
    public onStart() {
        this.registerZone(this.AIRPORT, [-1037.47, -2737.59, 20.17, 330.0]);
    }

    public updatePosition(source: number, coord: Vector3) {
        const prevCoord = this.players[source];
        this.players[source] = coord;

        if (!prevCoord) {
            return;
        }

        if (getDistance(coord, [0, 0, 0]) < 5 || getDistance(prevCoord, [0, 0, 0]) < 5) {
            return;
        }

        if (getDistance(coord, prevCoord) > 1000.0) {
            if (this.permissionService.isHelper(source)) {
                return;
            }

            this.monitor.publish(
                'anti_cheat',
                {
                    type: 'teleportation',
                    player_source: source,
                },
                {
                    prev_coord: prevCoord,
                    new_coord: coord,
                }
            );
        }
    }

    public teleportToCoords(source: number, coord: Vector4) {
        const zoneId = 'temp_' + source;
        this.zones.set(zoneId, coord);
        TriggerClientEvent(ClientEvent.PLAYER_TELEPORT, source, zoneId);
    }

    public teleportToZone(source: number, zoneId: string) {
        TriggerClientEvent(ClientEvent.PLAYER_TELEPORT, source, zoneId);
    }

    @Rpc(RpcServerEvent.PLAYER_TELEPORT)
    public async onTeleport(source: number, zone: string) {
        const target = this.zones.get(zone);
        if (!target) {
            return;
        }

        const ped = GetPlayerPed(source);
        this.players[source] = [target[0], target[1], target[2]];
        SetEntityCoords(ped, target[0], target[1], target[2], false, false, false, false);
        SetEntityHeading(ped, target[3] || 0.0);
    }

    //Register allowed teleportation, to detect sinful ones
    public registerZone(id: string, coords: Vector4) {
        this.zones.set(id, coords);
    }
}
