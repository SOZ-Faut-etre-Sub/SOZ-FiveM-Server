import { Injectable } from '../core/decorators/injectable';

@Injectable()
export class Notifier {
    public notify(message: string, type: 'error' | 'success' | 'warning' | 'info' = 'success') {
        exports['soz-hud'].DrawNotification(message, type);
    }

    public error(source: number, message: string) {
        this.notify(message, 'error');
    }
}
