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

    public publish(
        event: string,
        content: Record<string, any> = {},
        data: Record<string, any> = {},
        addPlayerData = true
    ) {
        TriggerServerEvent(ServerEvent.MONITOR_ADD_EVENT, event, content, data, addPlayerData);
    }
}
