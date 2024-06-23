import { MonitorEvent } from '@public/shared/monitor';

import { Exportable } from '../../core/decorators/exports';
import { Provider } from '../../core/decorators/provider';
import { LogLevel } from '../../core/logger';
import { ServerEvent } from '../../shared/event';

@Provider()
export class Monitor {
    @Exportable('Log')
    public log(logLevel: LogLevel, message: string, content: Record<string, any> = {}) {
        TriggerServerEvent(ServerEvent.MONITOR_LOG, logLevel, message, content);
    }

    public traceEvent(type: string, event: MonitorEvent, addPlayerData = true) {
        TriggerServerEvent(ServerEvent.MONITOR_TRACE_EVENT, type, event, addPlayerData);
    }
}
