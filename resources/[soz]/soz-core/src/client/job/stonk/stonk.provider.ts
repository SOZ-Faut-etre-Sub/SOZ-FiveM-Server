import { Once, OnceStep, OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ClientEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
import { BlipFactory } from '../../blip';
import { NuiMenu } from '../../nui/nui.menu';
import { PlayerService } from '../../player/player.service';

@Provider()
export class StonkProvider {
    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Once(OnceStep.PlayerLoaded)
    public onPlayerLoaded() {
        this.blipFactory.create('societyStonkSecurity', {
            name: 'STONK Security',
            coords: { x: 6.25, y: -709.11, z: 46.22 },
            sprite: 605,
            scale: 0.9,
        });
    }

    @OnEvent(ClientEvent.JOBS_STONK_OPEN_SOCIETY_MENU)
    public onOpenSocietyMenu() {
        if (this.nuiMenu.isOpen()) {
            this.nuiMenu.closeMenu();
            return;
        }

        // this.nuiMenu.openMenu(MenuType.FoodJobMenu, {
        //     state: this.state,
        //     onDuty: this.playerService.isOnDuty(),
        // });
    }
}
