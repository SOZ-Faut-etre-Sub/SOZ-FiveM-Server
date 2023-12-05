import { Inject, Injectable } from '@core/decorators/injectable';
import { Logger } from '@core/logger';
import axios from 'axios';
import { Counter, Histogram } from 'prom-client';

import { LokiEvent } from '../../shared/monitor';
import { PlayerService } from '../player/player.service';
import { LokiLoggerHandler } from './loki.logger.handler';

export const flattenObject = (obj: any, parentKey?: string) => {
    let result = {};

    if (obj === null || obj === undefined) {
        return obj;
    }

    Object.keys(obj).forEach(key => {
        const value = obj[key];
        const _key = parentKey ? parentKey + '_' + key : key;

        if (value === null || value === undefined) {
            return;
        }

        if (typeof value === 'object') {
            result = { ...result, ...flattenObject(value, _key) };
        } else {
            result[_key] = value;
        }
    });

    return result;
};

@Injectable()
export class Monitor {
    @Inject(LokiLoggerHandler)
    private lokiLoggerHandler: LokiLoggerHandler;

    @Inject(Logger)
    private logger: Logger;

    @Inject(PlayerService)
    private playerService: PlayerService;

    private buffer: LokiEvent[] = [];

    private lokiEndpoint: string = GetConvar('log_handler_loki', '');

    private callDurationHistogram: Histogram<string> = new Histogram({
        name: 'soz_core_call',
        help: 'Specific call execution histogram',
        labelNames: ['name'],
    });

    private lokiEventSent: Counter<string> = new Counter({
        name: 'soz_core_event_sent',
        help: 'Number of loki event sents',
    });

    public async doCall<T>(name: string, callback: () => T | Promise<T>): Promise<T> {
        const end = this.callDurationHistogram.startTimer({
            name,
        });
        const result = await callback();

        end();

        return result;
    }

    public async flush() {
        if (this.lokiEndpoint === '') {
            return;
        }

        const buffer = this.buffer;
        this.buffer = [];

        const logBuffer = this.lokiLoggerHandler.flush();

        if (logBuffer.length > 0) {
            buffer.push(...logBuffer);
        }

        this.lokiEventSent.inc(buffer.length);

        if (buffer.length === 0) {
            return;
        }

        const json = await this.doCall('monitor_flush_json', () =>
            JSON.stringify({
                streams: buffer,
            })
        );

        const response = await this.doCall(
            'monitor_flush_http_call',
            async () =>
                await axios.post(this.lokiEndpoint, json, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    validateStatus: () => true,
                })
        );

        if (response.status !== 204) {
            this.logger.error('failed to send logs to Loki', response.data);
        }
    }

    public publish(name: string, indexed: Record<string, any>, data: Record<string, any>): void {
        if (this.lokiEndpoint === '') {
            return;
        }

        const event = this.formatLokiEvent(name, this.filterAndReplace(indexed), this.filterAndReplace(data));
        this.buffer.push(event);
    }

    private formatLokiEvent(
        name: string,
        indexes: Record<string, string>,
        content: Record<string, any> = {}
    ): LokiEvent {
        const flatten = flattenObject(content || {});
        const timestamp = Date.now() * 1_000_000;

        return {
            stream: {
                ...indexes,
                emitter: GetInvokingResource() || 'soz-core',
                agent: 'fivem',
                type: 'event',
                event: name,
            },
            values: [[String(timestamp), JSON.stringify(flatten)]],
        };
    }

    private filterAndReplace(content: Record<string, any>): Record<string, any> {
        if (content.target_source) {
            const player = this.playerService.getPlayer(content.target_source);

            if (player) {
                content.target_citizen_id = player.citizenid;
                content.target_name = player.charinfo.firstname + ' ' + player.charinfo.lastname;
                content.target_job = player.job.id;

                delete content.target_source;
            }
        }

        if (content.player_source) {
            const player = this.playerService.getPlayer(content.player_source);

            if (player) {
                content.player_citizen_id = player.citizenid;
                content.player_name = player.charinfo.firstname + ' ' + player.charinfo.lastname;
                content.player_job = player.job.id;

                delete content.player_source;
            }
        }

        return content;
    }
}
