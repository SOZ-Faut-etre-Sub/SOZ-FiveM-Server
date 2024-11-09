import { Once } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { ItemService } from '@public/server/item/item.service';
import { PoliceSpikeProvider } from '@public/server/job/police/police.spike.provider';
import { Notifier } from '@public/server/notifier';
import { PlayerService } from '@public/server/player/player.service';
import { ClientEvent } from '@public/shared/event';
import { FDO, JobType } from '@public/shared/job';

@Provider()
export class ItemJobsProvider {
    @Inject(ItemService)
    private item: ItemService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(PoliceSpikeProvider)
    private policeSpikeProvider: PoliceSpikeProvider;

    private items = {
        cone: {
            jobs: [JobType.LSMC, JobType.CashTransfer, JobType.Bennys, ...FDO],
        },
        police_barrier: {
            jobs: FDO,
            prop: 'prop_barrier_work05',
        },
        spike: {
            jobs: FDO,
        },
        speed_speed_sign: {
            jobs: FDO,
        },
        n_fix_greenscreen: {
            jobs: [JobType.YouNews, JobType.News],
            prop: 'prop_ld_greenscreen_01',
        },
        n_fix_camera: {
            jobs: [JobType.YouNews, JobType.News],
            prop: 'prop_tv_cam_02',
            rotation: 180,
        },
        n_fix_light: {
            jobs: [JobType.YouNews, JobType.News],
            prop: 'prop_kino_light_01',
            rotation: 180,
        },
        n_fix_mic: {
            jobs: [JobType.YouNews, JobType.News],
            prop: 'v_ilev_fos_mic',
        },
    };

    @Once()
    public async onInit() {
        this.item.setItemUseCallback('cone', this.useJobsCone.bind(this));
        this.item.setItemUseCallback('police_barrier', this.useJobsItem.bind(this, 'police_barrier'));
        this.item.setItemUseCallback('spike', this.useJobsSpike.bind(this));
        this.item.setItemUseCallback('speed_speed_sign', this.useJobsSpeedSign.bind(this));

        this.item.setItemUseCallback('n_fix_greenscreen', this.useJobsItem.bind(this, 'n_fix_greenscreen'));
        this.item.setItemUseCallback('n_fix_camera', this.useJobsItem.bind(this, 'n_fix_camera'));
        this.item.setItemUseCallback('n_fix_light', this.useJobsItem.bind(this, 'n_fix_light'));
        this.item.setItemUseCallback('n_fix_mic', this.useJobsItem.bind(this, 'n_fix_mic'));
    }

    private useJobsItem(source: number, itemName: string) {
        if (!this.checkJob(source, itemName)) {
            this.notifier.error(source, "Vous n'êtes pas habilité à utiliser cet objet");

            return;
        }

        TriggerClientEvent(ClientEvent.OBJECT_PLACE_JOB, source, {
            item: itemName,
            props: this.items[itemName].prop,
            rotation: this.items[itemName].rotation,
        });
    }

    private useJobsCone(source: number) {
        if (!this.checkJob(source, 'cone')) {
            this.notify(source);
            return;
        }

        const player = this.playerService.getPlayer(source);

        TriggerClientEvent(ClientEvent.OBJECT_PLACE_JOB, source, {
            item: 'cone',
            props: FDO.includes(player.job.id) ? 'prop_air_conelight' : 'prop_roadcone02a',
        });
    }

    private async useJobsSpike(source: number) {
        if (!this.checkJob(source, 'spike')) {
            this.notify(source);
            return;
        }

        await this.policeSpikeProvider.placeSpike(source, 'spike');
    }

    private useJobsSpeedSign(source: number) {
        if (!this.checkJob(source, 'speed_speed_sign')) {
            this.notify(source);
            return;
        }

        TriggerClientEvent(ClientEvent.POLICE_PLACE_SPEED_ZONE, source);
    }

    private checkJob(source: number, itemName: string) {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return false;
        }

        const item = this.items[itemName];
        if (!item) {
            return false;
        }

        return item.jobs.includes(player.job.id) && player.job.onduty;
    }

    private notify(source: number) {
        this.notifier.error(source, "Vous n'êtes pas habilité à utiliser cet objet");
    }
}
