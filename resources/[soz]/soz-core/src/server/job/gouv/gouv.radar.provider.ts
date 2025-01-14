import { ClickhouseService } from '@public/server/clickhouse/clickhouse.service';
import { InventoryFactory } from '@public/server/inventory/inventory.factory';

import { OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event/server';
import { JobPermission, JobType } from '../../../shared/job';
import { Vector4 } from '../../../shared/polyzone/vector';
import { JobService } from '../../job.service';
import { Notifier } from '../../notifier';
import { PlayerService } from '../../player/player.service';
import { ProgressService } from '../../player/progress.service';
import { RadarRepository } from '../../repository/radar.repository';

@Provider()
export class GouvRadarProvider {
    @Inject(RadarRepository)
    private radarRepository: RadarRepository;

    @Inject(JobService)
    private jobService: JobService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(InventoryFactory)
    private inventoryFactory: InventoryFactory;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(ClickhouseService)
    private clickhouseService: ClickhouseService;

    @OnEvent(ServerEvent.GOUV_RADAR_ADD)
    public async addRadar(source: number, position: Vector4) {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        if (!(await this.jobService.hasPermission(player, JobType.Gouv, JobPermission.GouvManageRadar))) {
            return;
        }

        const inventory = await this.inventoryFactory.getPlayerInventory(source);

        if (!inventory.remove('radar', 1, false)) {
            this.notifier.notify(source, `Vous n'avez pas de radar sur vous.`);

            return;
        }

        await this.radarRepository.add(position);

        this.notifier.notify(source, `Le radar a été ~b~placé~s~ avec succès.`);
    }

    @OnEvent(ServerEvent.GOUV_RADAR_SET_DISABLED)
    public async setRadarDisabled(source: number, id: number, disabled: boolean) {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        if (!(await this.jobService.hasPermission(player, JobType.Gouv, JobPermission.GouvManageRadar))) {
            return;
        }

        await this.radarRepository.setEnabled(id, !disabled);

        this.notifier.notify(source, `Le radar a été ${disabled ? '~r~désactivé~s~' : '~g~activé~s~'} avec succès.`);
    }

    @OnEvent(ServerEvent.GOUV_RADAR_SET_SPEED)
    public async setRadarSpeed(source: number, id: number, speed: number) {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        if (!(await this.jobService.hasPermission(player, JobType.Gouv, JobPermission.GouvManageRadar))) {
            return;
        }

        await this.radarRepository.setSpeed(id, speed);

        this.notifier.notify(source, `La vitesse a été définit à ~g~${speed}~s~ km/h avec succès.`);
    }

    @OnEvent(ServerEvent.GOUV_RADAR_REMOVE)
    public async removeRadar(source: number, id: number) {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        if (!(await this.jobService.hasPermission(player, JobType.Gouv, JobPermission.GouvManageRadar))) {
            return;
        }

        const { completed } = await this.progressService.progress(
            source,
            'remove_radar',
            'Suppression du radar en cours...',
            60000,
            {
                task: 'world_human_const_drill',
            },
            {}
        );

        if (!completed) {
            return;
        }

        await this.radarRepository.remove(id);

        this.notifier.notify(source, `Le radar a été ~r~détruit~s~ avec succès.`);
    }

    @OnEvent(ServerEvent.GOUV_RADAR_STATS)
    public async stats(source: number, radarId: number) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const week = new Date();
        week.setDate(week.getDate() - 7);

        const month = new Date();
        month.setMonth(month.getMonth() - 1);
        month.setDate(month.getDate() - 1);
        console.log(month);

        const info = {
            'Dernières 24h': yesterday,
            'Dernière semaine': week,
            'Dernier mois': month,
        };

        let msg = '';
        for (const [label, data] of Object.entries(info)) {
            const clickhouseData = await this.clickhouseService.query({
                query: 'SELECT sum(money), count() FROM trace_events WHERE event = {event: String} AND id = {id: String} AND timestamp > {timestamp: timestamp}',
                query_params: {
                    event: 'radar_flash',
                    id: radarId.toString(),
                    timestamp: Math.round(data.getTime() / 1000),
                },
            });

            console.log(clickhouseData);

            const result = (await clickhouseData.json()).data[0];
            const count = result['count()'];
            const sum = result['sum(money)'] ?? 0;
            msg += `<span style="text-decoration: underline;">${label} :</span>~n~~b~${count}~s~ flashs pour ~g~${sum}$~s~.~n~`;
        }

        this.notifier.notify(source, msg);
    }
}
