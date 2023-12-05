import { ClientEvent } from '@public/shared/event';
import { PlayerData } from '@public/shared/player';

import { Inject, Injectable } from '../core/decorators/injectable';
import { JobType } from '../shared/job';
import { ServerStateService } from './server.state.service';

@Injectable()
export class Notifier {
    @Inject(ServerStateService)
    private serverStateService: ServerStateService;

    public notify(
        source: number,
        message: string,
        type: 'error' | 'success' | 'warning' | 'info' = 'success',
        delay = 10000
    ) {
        TriggerClientEvent(ClientEvent.NOTIFICATION_DRAW, source, message, type, delay);
    }

    public error(source: number, message: string) {
        this.notify(source, message, 'error');
    }

    public advancedNotify(
        source: number,
        title: string,
        subtitle: string,
        message: string,
        image: string,
        type: 'error' | 'success' | 'warning' | 'info' = 'success',
        delay = 10000
    ) {
        TriggerClientEvent(
            ClientEvent.NOTIFICATION_DRAW_ADVANCED,
            source,
            title,
            subtitle,
            message,
            image,
            type,
            delay
        );
    }

    public advancedNotifyOnDutyWorkers(
        title: string,
        subtitle: string,
        message: string,
        image: string,
        type: 'error' | 'success' | 'warning' | 'info' = 'success',
        listJobs: JobType[],
        validate: (player: PlayerData) => boolean = () => true
    ) {
        const players = this.serverStateService.getPlayers();
        for (const player of players) {
            if (listJobs.includes(player.job.id) && player.job.onduty) {
                if (validate(player)) {
                    this.advancedNotify(player.source, title, subtitle, message, image, type);
                }
            }
        }
    }
}
