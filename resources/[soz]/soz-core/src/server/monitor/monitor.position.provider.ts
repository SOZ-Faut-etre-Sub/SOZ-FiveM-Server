import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import { Vector3 } from '../../shared/polyzone/vector';
import { ClickhouseService } from '../clickhouse/clickhouse.service';
import { PlayerPositionProvider } from '../player/player.position.provider';
import { ServerStateService } from '../server.state.service';

@Provider()
export class MonitorPositionProvider {
    @Inject(ServerStateService)
    private serverStateService: ServerStateService;

    @Inject(ClickhouseService)
    private clickhouseService: ClickhouseService;

    @Inject(PlayerPositionProvider)
    private playerPositionProvider: PlayerPositionProvider;

    @Tick(5000)
    public async logPlayerPositions() {
        const players = this.serverStateService.getPlayers();
        const values = [];

        for (const player of players) {
            const ped = GetPlayerPed(player.source);
            const position = GetEntityCoords(ped) as Vector3;
            const vehicle = GetVehiclePedIsIn(ped, false);

            this.playerPositionProvider.updatePosition(player.source, position);

            values.push({
                citizen_id: player.citizenid,
                player_name: player.charinfo.firstname + ' ' + player.charinfo.lastname,
                player_job: player.job.id,
                vehicle_type: vehicle ? GetVehicleType(vehicle) : null,
                vehicle_plate: vehicle ? GetVehicleNumberPlateText(vehicle) : null,
                position: [position[0], position[1]],
                orientation: GetEntityHeading(ped),
                z: position[2],
            });
        }

        await this.clickhouseService.insert({
            table: 'player_position',
            values,
            format: 'JSONEachRow',
        });
    }
}
