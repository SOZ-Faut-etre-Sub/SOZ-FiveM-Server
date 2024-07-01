import { Once, OnEvent } from '../../core/decorators/event';
import { Exportable } from '../../core/decorators/exports';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import { LogChainHandler, Logger, LogLevel } from '../../core/logger';
import { ServerEvent } from '../../shared/event';
import { LogEvent, MonitorEvent } from '../../shared/monitor';
import { PlayerService } from '../player/player.service';
import { ClickhouseLoggerHandler } from './clickhouse.logger.handler';
import { Monitor } from './monitor';

@Provider()
export class MonitorClickhouseProvider {
    @Inject(Logger)
    private logger: Logger;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(LogChainHandler)
    private logChainHandler: LogChainHandler;

    @Inject(ClickhouseLoggerHandler)
    private clickhouseLoggerHandler: ClickhouseLoggerHandler;

    @Inject(Monitor)
    private monitor: Monitor;

    @Once()
    onClickhouseProviderStart() {
        this.logChainHandler.addHandler(this.clickhouseLoggerHandler);
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
    public onAddLog(source: number, level: LogLevel, message: string, extra: Partial<LogEvent>) {
        const player = this.playerService.getPlayer(source);

        if (player) {
            extra = {
                citizen_id: player.citizenid,
                player_name: player.charinfo.firstname + ' ' + player.charinfo.lastname,
                player_job: player.job.id,
                player_on_duty: player.job.onduty,
                ...extra,
            };
        }

        extra = {
            player_source: source,
            ...extra,
            origin: 'client',
        };

        this.handleLog(level, message, extra);
    }

    @Exportable('Log')
    private handleLog(level: LogLevel, message: string, content: Partial<LogEvent>) {
        this.logger.log(level, message, content);
    }

    @Exportable('TraceEvent')
    private handleEvent(type: string, event: MonitorEvent) {
        this.monitor.traceEvent(type, event);
    }
}
