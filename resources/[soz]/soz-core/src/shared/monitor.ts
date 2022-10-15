import { Injectable } from '../core/decorators/injectable';
import { SOZ_CORE_IS_SERVER } from '../globals';

export type LogLevels = 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';

@Injectable()
export class Monitor {
    public publish(
        name: string,
        indexed: Record<string, any>,
        data: Record<string, any>,
        add_player_data = true
    ): void {
        if (SOZ_CORE_IS_SERVER) {
            TriggerEvent('monitor:server:event', name, indexed, data);
        } else {
            TriggerServerEvent('monitor:server:event', name, indexed, data, add_player_data);
        }
    }

    public log(level: LogLevels, message: string, data: Record<string, any> = {}): void {
        if (SOZ_CORE_IS_SERVER) {
            TriggerEvent('monitor:server:Log', level, message, data);
        } else {
            TriggerServerEvent('monitor:server:Log', level, message, data);
        }
    }
}
