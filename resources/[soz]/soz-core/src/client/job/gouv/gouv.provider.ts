import { Once, OnceStep, OnEvent, OnNuiEvent } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { InputService } from '@public/client/nui/input.service';
import { uuidv4 } from '@public/core/utils';
import { ClientEvent, NuiEvent, ServerEvent } from '@public/shared/event';
import { MenuType } from '@public/shared/nui/menu';

import { BlipFactory } from '../../blip';
import { NuiMenu } from '../../nui/nui.menu';
import { PlayerService } from '../../player/player.service';

@Provider()
export class GouvProvider {
    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Inject(InputService)
    private inputService: InputService;

    @Once(OnceStep.PlayerLoaded)
    public setupMdrJob() {
        this.createBlips();
    }

    @OnEvent(ClientEvent.JOBS_GOUV_OPEN_SOCIETY_MENU)
    public onOpenSocietyMenu() {
        if (this.nuiMenu.getOpened() === MenuType.GouvJobMenu) {
            this.nuiMenu.closeMenu();
            return;
        }

        this.nuiMenu.openMenu(MenuType.GouvJobMenu, {
            onDuty: this.playerService.isOnDuty(),
        });
    }

    private createBlips() {
        this.blipFactory.create('jobs:gouv', {
            name: 'Gouvernement',
            coords: { x: -555.66, y: -599.36, z: 34.68 },
            sprite: 76,
            scale: 1.1,
        });
    }

    @OnNuiEvent(NuiEvent.GouvAnnoncement)
    public async annoncement() {
        const msg = await this.inputService.askInput({
            title: 'Message de la communication',
            maxCharacters: 235,
            defaultValue: '',
        });

        const player = this.playerService.getPlayer();

        if (msg) {
            TriggerServerEvent(
                ServerEvent.PHONE_APP_NEWS_CREATE_BROADCAST,
                'phone:app:news:createNewsBroadcast:' + uuidv4(),
                {
                    type: player.job.id,
                    message: msg,
                    reporter: player.charinfo.firstname + ' ' + player.charinfo.lastname,
                    reporterId: player.citizenid,
                    job: player.job.id,
                }
            );
        }
    }
}
