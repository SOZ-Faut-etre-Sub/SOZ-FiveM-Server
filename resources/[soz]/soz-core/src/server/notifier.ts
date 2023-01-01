import { PlayerData } from '@public/shared/player';

import { Inject, Injectable } from '../core/decorators/injectable';
import { JobType } from '../shared/job';
import { PlayerService } from './player/player.service';

@Injectable()
export class Notifier {
    @Inject(PlayerService)
    private playerService: PlayerService;

    public notify(source: number, message: string, type: 'error' | 'success' | 'warning' | 'info' = 'success') {
        TriggerClientEvent('hud:client:DrawNotification', source, message, type);
    }

    public advancedNotify(
        source: number,
        title: string,
        subtitle: string,
        message: string,
        image: string,
        type: 'error' | 'success' | 'warning' | 'info' = 'success'
    ) {
        TriggerClientEvent('hud:client:DrawAdvancedNotification', source, title, subtitle, message, image, type);
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
        const connectedSources = this.playerService.getPlayersSources();
        for (const source of connectedSources) {
            const player = this.playerService.getPlayer(source);
            if (listJobs.includes(player.job.id) && player.job.onduty) {
                if (validate(player)) {
                    this.advancedNotify(player.source, title, subtitle, message, image, type);
                }
            }
        }
    }
}
