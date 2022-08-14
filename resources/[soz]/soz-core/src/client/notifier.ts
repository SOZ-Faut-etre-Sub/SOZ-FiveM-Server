import { Injectable } from '../core/decorators/injectable';

@Injectable()
export class Notifier {
    public notify(message: string, type: 'error' | 'success' | 'warning' | 'info' = 'success') {
        exports['soz-hud'].DrawNotification(message, type);
    }
}
