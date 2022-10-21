import { Once, OnceStep, OnEvent, OnNuiEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ClientEvent, NuiEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
import { BlipFactory } from '../../blip';
import { NuiMenu } from '../../nui/nui.menu';
import { PlayerService } from '../../player/player.service';

@Provider()
export class StonkProvider {
    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    private state = {
        displaySecureContainerTake: false,
        displayResellJewelbagBlip: false,
        displayResellBigBagBlip: false,
        displayResellMediumBagBlip: false,
        displayResellSmallBagBlip: false,
    };

    @OnNuiEvent(NuiEvent.StonkDisplayBlip)
    public async onDisplayBlip({ blip, value }: { blip: string; value: boolean }) {
        this.state[blip] = value;
        this.blipFactory.hide(blip, !value);
    }

    @Once(OnceStep.PlayerLoaded)
    public onPlayerLoaded() {
        this.blipFactory.create('societyStonkSecurity', {
            name: 'STONK Security',
            coords: { x: 6.25, y: -709.11, z: 46.22 },
            sprite: 605,
            scale: 0.9,
        });

        this.blipFactory.create('displayResellJewelbagBlip', {
            name: 'Point de vente des sacs de bijoux',
            coords: { x: 301.56, y: -884.64, z: 29.24 },
            sprite: 605,
            scale: 0.6,
        });
        this.blipFactory.hide('displayResellJewelbagBlip', true);

        this.blipFactory.create('displayResellBigBagBlip', {
            name: "Point de vente des gros sacs d'argent",
            coords: { x: -693.44, y: -581.7, z: 31.55 },
            sprite: 605,
            scale: 0.6,
        });
        this.blipFactory.hide('displayResellBigBagBlip', true);

        this.blipFactory.create('displayResellMediumBagBlip', {
            name: "Point de vente des sacs d'argent moyen",
            coords: { x: -1381.23, y: -498.95, z: 33.16 },
            sprite: 605,
            scale: 0.6,
        });
        this.blipFactory.hide('displayResellMediumBagBlip', true);

        this.blipFactory.create('displayResellSmallBagBlip', {
            name: "Point de vente des petit sacs d'argent",
            coords: { x: -864.59, y: -192.82, z: 37.7 },
            sprite: 605,
            scale: 0.6,
        });
        this.blipFactory.hide('displayResellSmallBagBlip', true);

        this.blipFactory.create('displaySecureContainerTake', {
            name: 'Secure Unit',
            coords: { x: 914.39, y: -1269.36, z: 24.57 },
            sprite: 605,
            scale: 0.6,
        });
        this.blipFactory.hide('displaySecureContainerTake', true);
    }

    @OnEvent(ClientEvent.JOBS_STONK_OPEN_SOCIETY_MENU)
    public onOpenSocietyMenu() {
        if (this.nuiMenu.isOpen()) {
            this.nuiMenu.closeMenu();
            return;
        }

        this.nuiMenu.openMenu(MenuType.StonkJobMenu, {
            state: this.state,
            onDuty: this.playerService.isOnDuty(),
        });
    }
}
