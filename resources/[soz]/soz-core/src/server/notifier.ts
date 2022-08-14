import { Injectable } from '../core/decorators/injectable';

@Injectable()
export class Notifier {
    public notify(source: number, message: string, type: 'error' | 'success' | 'warning' | 'info' = 'success') {
        TriggerClientEvent('hud:client:DrawNotification', source, message, type);
    }
}
