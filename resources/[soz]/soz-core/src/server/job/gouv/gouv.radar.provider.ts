import { OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event/server';
import { JobPermission, JobType } from '../../../shared/job';
import { Vector4 } from '../../../shared/polyzone/vector';
import { InventoryManager } from '../../inventory/inventory.manager';
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

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @OnEvent(ServerEvent.GOUV_RADAR_ADD)
    public async addRadar(source: number, position: Vector4) {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        if (!(await this.jobService.hasPermission(player, JobType.Gouv, JobPermission.GouvManageRadar))) {
            return;
        }

        if (!this.inventoryManager.removeNotExpiredItem(source, 'radar')) {
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
}
