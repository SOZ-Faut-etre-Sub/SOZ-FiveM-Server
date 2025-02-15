import { OnEvent, OnNuiEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { emitRpc } from '../../../core/rpc';
import { ClientEvent, NuiEvent } from '../../../shared/event';
import { JobType } from '../../../shared/job';
import { MenuType } from '../../../shared/nui/menu';
import { toVector3Object, Vector3 } from '../../../shared/polyzone/vector';
import { RpcServerEvent } from '../../../shared/rpc';
import { Monitor } from '../../monitor/monitor';
import { InputService } from '../../nui/input.service';
import { NuiMenu } from '../../nui/nui.menu';
import { PlayerService } from '../../player/player.service';

@Provider()
export class NewsMenuProvider {
    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(InputService)
    private inputService: InputService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Monitor)
    private monitor: Monitor;

    @OnEvent(ClientEvent.JOBS_TWITCH_NEWS_OPEN_SOCIETY_MENU)
    public onOpenTwitchNewsMenu() {
        this.toggleSocietyMenu(JobType.News);
    }

    @OnEvent(ClientEvent.JOBS_YOU_NEWS_OPEN_SOCIETY_MENU)
    public onOpenYouNewsMenu() {
        this.toggleSocietyMenu(JobType.YouNews);
    }

    private toggleSocietyMenu(job: JobType) {
        if (this.nuiMenu.getOpened() === MenuType.JobNews) {
            this.nuiMenu.closeMenu();

            return;
        }

        this.nuiMenu.openMenu(MenuType.JobNews, { job });
    }

    @OnNuiEvent(NuiEvent.NewsCreateAnnounce)
    public async onCreateAnnounce({ type, title }: { type: string; title: string }) {
        const player = this.playerService.getPlayer();

        if (!player) {
            return;
        }

        const message = await this.inputService.askInput({
            title,
            maxCharacters: 235,
        });

        if (!message || message === '') {
            return;
        }

        await emitRpc(RpcServerEvent.PHONE_APP_NEWS_CREATE, {
            type,
            message,
            reporter: player.charinfo.firstname + ' ' + player.charinfo.lastname,
            reporterId: player.citizenid,
            job: player.job.id,
        });

        this.monitor.traceEvent('job_news_create_flash', {
            flash_type: type,
            message,
            position: toVector3Object(GetEntityCoords(PlayerPedId(), false) as Vector3),
        });
    }
}
