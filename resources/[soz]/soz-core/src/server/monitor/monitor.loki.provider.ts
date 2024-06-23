import { Once, OnEvent } from '../../core/decorators/event';
import { Exportable } from '../../core/decorators/exports';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import { LogChainHandler, Logger, LogLevel } from '../../core/logger';
import { ServerEvent } from '../../shared/event';
import { MonitorEvent } from '../../shared/monitor';
import { PlayerService } from '../player/player.service';
import { LokiLoggerHandler } from './loki.logger.handler';
import { Monitor } from './monitor';

@Provider()
export class MonitorLokiProvider {
    @Inject(Logger)
    private logger: Logger;

    @Inject(PlayerService)
    private playerService: PlayerService;

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

    @OnEvent(ServerEvent.MONITOR_TRACE_EVENT)
    public onTraceEvent(source: number, type: string, event: MonitorEvent, addPlayerData = true) {
        if (addPlayerData) {
            event.player_source = source;
        }

        this.monitor.traceEvent(type, event);
    }

    @Tick(1000)
    public async onTick() {
        await this.monitor.flush();
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

    @Exportable('TraceEvent')
    private handleEvent(type: string, event: MonitorEvent) {
        this.monitor.traceEvent(type, event);
    }
}
