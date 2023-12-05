import { Once, OnEvent } from '../../core/decorators/event';
import { Exportable } from '../../core/decorators/exports';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import { LogChainHandler, Logger, LogLevel } from '../../core/logger';
import { ServerEvent } from '../../shared/event';
import { Vector3 } from '../../shared/polyzone/vector';
import { PlayerService } from '../player/player.service';
import { ServerStateService } from '../server.state.service';
import { LokiLoggerHandler } from './loki.logger.handler';
import { Monitor } from './monitor';

@Provider()
export class MonitorLokiProvider {
    @Inject(Logger)
    private logger: Logger;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(ServerStateService)
    private serverStateService: ServerStateService;

    @Inject(LogChainHandler)
    private logChainHandler: LogChainHandler;

    @Inject(LokiLoggerHandler)
    private lokiLoggerHandler: LokiLoggerHandler;

    @Inject(Monitor)
    private monitor: Monitor;

    @Once()
    onLokiProviderStart() {
        this.logChainHandler.addHandler(this.lokiLoggerHandler);
    }

    @Tick(5000)
    public async sendLokiBuffer() {
        await this.monitor.flush();
    }

    @Tick(5000)
    public async addPlayerPositionToLoki() {
        const players = this.serverStateService.getPlayers();

        for (const player of players) {
            const ped = GetPlayerPed(player.source);
            const position = GetEntityCoords(ped) as Vector3;
            const vehicle = GetVehiclePedIsIn(ped, false);

            this.monitor.publish(
                'player_position',
                {
                    player_citizen_id: player.citizenid,
                    player_name: player.charinfo.firstname + ' ' + player.charinfo.lastname,
                    player_job: player.job.id,
                    vehicle_type: vehicle ? GetVehicleType(vehicle) : null,
                },
                {
                    vehicle_plate: vehicle ? GetVehicleNumberPlateText(vehicle) : null,
                    x: position[0],
                    y: position[1],
                    z: position[2],
                }
            );
        }
    }

    @OnEvent(ServerEvent.MONITOR_ADD_EVENT)
    public onAddEvent(
        source: number,
        name: string,
        indexed: Record<string, any>,
        content: Record<string, any>,
        addPlayerData = false
    ) {
        if (addPlayerData) {
            indexed.player_source = source;
        }

        this.monitor.publish(name, indexed, content);
    }

    @OnEvent(ServerEvent.MONITOR_LOG)
    public onAddLog(source: number, level: LogLevel, message: string, content: Record<string, any> = {}) {
        const player = this.playerService.getPlayer(source);

        if (player) {
            content = {
                ...content,
                player: {
                    citizen_id: player.citizenid,
                    name: player.charinfo.firstname + ' ' + player.charinfo.lastname,
                    job: player.job.id,
                    license: player.license,
                },
            };

            message = `[Player ${player.citizenid}] ${message}`;
        }

        this.handleLog(level, message, content);
    }

    @Exportable('Log')
    private handleLog(level: LogLevel, message: string, content: Record<string, any> = {}) {
        this.logger.log(level, message, JSON.stringify(content));
    }

    @Exportable('Event')
    private handleEvent(name: string, indexes: Record<string, string>, content: Record<string, any>) {
        this.monitor.publish(name, indexes, content);
    }
}
