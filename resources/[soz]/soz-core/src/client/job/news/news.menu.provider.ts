import { OnEvent, OnNuiEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { uuidv4 } from '../../../core/utils';
import { ClientEvent, NuiEvent, ServerEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
import { toVector3Object, Vector3 } from '../../../shared/polyzone/vector';
import { Monitor } from '../../monitor/monitor';
import { InputService } from '../../nui/input.service';
import { NuiMenu } from '../../nui/nui.menu';
import { getProperGroundPositionForObject } from '../../object/object.utils';
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
    public onOpenSocietyMenu() {
        if (this.nuiMenu.getOpened() === MenuType.JobTwitchNews) {
            this.nuiMenu.closeMenu();

            return;
        }

        this.nuiMenu.openMenu(MenuType.JobTwitchNews);
    }

    @OnNuiEvent(NuiEvent.NewsCreateAnnounce)
    public async onCreateAnnounce({ type }: { type: string }) {
        const player = this.playerService.getPlayer();

        if (!player) {
            return;
        }

        const message = await this.inputService.askInput({
            title: 'Message de la communication',
            maxCharacters: 235,
            defaultValue: '',
        });

        if (!message || message === '') {
            return;
        }

        TriggerServerEvent(
            ServerEvent.PHONE_APP_NEWS_CREATE_BROADCAST,
            'phone:app:news:createNewsBroadcast:' + uuidv4(),
            {
                type,
                message,
                reporter: player.charinfo.firstname + ' ' + player.charinfo.lastname,
                reporterId: player.citizenid,
            }
        );

        this.monitor.publish(
            'job_news_create_flash',
            {
                flash_type: type,
            },
            {
                message,
                position: toVector3Object(GetEntityCoords(PlayerPedId(), false) as Vector3),
            }
        );
    }

    @OnNuiEvent(NuiEvent.NewsPlaceObject)
    public async onPlaceObject({ item, props, rotation }: { item: string; props: string; rotation?: number }) {
        const ped = PlayerPedId();
        const position = GetOffsetFromEntityInWorldCoords(ped, 0.0, 1.0, 0.0) as Vector3;
        const heading = GetEntityHeading(ped) + (rotation || 0);
        const groundPosition = getProperGroundPositionForObject(GetHashKey(props), position, heading);

        TriggerServerEvent(ServerEvent.NEWS_PLACE_OBJECT, item, props, groundPosition);
    }
}
