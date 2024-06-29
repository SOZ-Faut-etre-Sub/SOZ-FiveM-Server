import { Inject, Injectable } from '@core/decorators/injectable';
import { Tick } from '@core/decorators/tick';
import { ClickhouseService } from '@public/server/clickhouse/clickhouse.service';
import { ClickhouseLoggerHandler } from '@public/server/monitor/clickhouse.logger.handler';
import { Vector3 } from '@public/shared/polyzone/vector';

import { MonitorEvent, MonitorTraceEvent } from '../../shared/monitor';
import { PlayerService } from '../player/player.service';

@Injectable()
export class Monitor {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(ClickhouseService)
    private clickhouse: ClickhouseService;

    @Inject(ClickhouseLoggerHandler)
    private clickhouseLoggerHandler: ClickhouseLoggerHandler;

    private eventBuffer: MonitorTraceEvent[] = [];

    public async flush() {
        const events = this.eventBuffer.splice(0, this.eventBuffer.length);

        if (events.length > 0) {
            await this.clickhouse.insert({
                table: 'trace_events',
                values: events,
                format: 'JSONEachRow',
            });
        }

        const logs = this.clickhouseLoggerHandler.flush();

        if (logs.length > 0) {
            await this.clickhouse.insert({
                table: 'logs',
                values: logs,
                format: 'JSONEachRow',
            });
        }
    }

    public traceEvent(type: string, event: MonitorEvent): void {
        const filteredEvent = this.createTraceEvent(type, event);

        if (!filteredEvent) {
            return;
        }

        this.eventBuffer.push(filteredEvent);
    }

    private createTraceEvent(type: string, event: MonitorEvent): MonitorTraceEvent | null {
        const traceEvent = {
            citizen_id: '',
            ...event,
            event: type,
            timestamp: Date.now(),
            position: null,
        } as MonitorTraceEvent;

        if (event.position) {
            if (Array.isArray(event.position)) {
                traceEvent.position = [event.position[0], event.position[1]];
                traceEvent.z = event.position[2];
            } else {
                traceEvent.position = [event.position.x, event.position.y];
                traceEvent.z = event.position.z;
            }
        }

        if (event.player_source) {
            const player = this.playerService.getPlayer(event.player_source);

            if (player) {
                traceEvent.citizen_id = player.citizenid;
                traceEvent.player_name = player.charinfo.firstname + ' ' + player.charinfo.lastname;
                traceEvent.player_job = player.job.id;
                traceEvent.player_on_duty = player.job.onduty;
            }

            if (!event.position) {
                const position = GetEntityCoords(GetPlayerPed(event.player_source)) as Vector3;

                traceEvent.position = [position[0], position[1]];
                traceEvent.z = position[2];
            }

            if (!event.heading) {
                traceEvent.heading = GetEntityHeading(GetPlayerPed(event.player_source));
            }
        }

        if (event.target_source) {
            const target = this.playerService.getPlayer(event.target_source);

            if (target) {
                traceEvent.target_citizen_id = target.citizenid;
                traceEvent.target_name = target.charinfo.firstname + ' ' + target.charinfo.lastname;
                traceEvent.target_job = target.job.id;
                traceEvent.target_on_duty = target.job.onduty;
            }
        }

        return traceEvent as MonitorTraceEvent;
    }
}
