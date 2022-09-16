import { Once, OnceStep, OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ClientEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
import { NuiMenu } from '../../nui/nui.menu';
import { PlayerService } from '../../player/player.service';
import { Qbcore } from '../../qbcore';

@Provider()
export class BaunProvider {
    @Inject(Qbcore)
    private QBCore: Qbcore;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    private state = {
        displayLiquorBlip: false,
        displayFlavorBlip: false,
        displayFurnitureBlip: false,
        displayResellBlip: false,
    };

    @Once(OnceStep.PlayerLoaded)
    public onPlayerLoaded() {
        this.createBlips();
    }

    @OnEvent(ClientEvent.JOBS_BAUN_OPEN_SOCIETY_MENU)
    public onOpenSocietyMenu() {
        if (!this.playerService.isOnDuty()) {
            return;
        }

        this.nuiMenu.openMenu(MenuType.BahamaUnicornJobMenu, { recipes: [], state: this.state });
    }

    private createBlips() {
        this.QBCore.createBlip('displayLiquorBlip', {
            name: "Point de récolte d'alcools",
            coords: { x: 1410.96, y: 1147.6, z: 114.33 },
            sprite: 478,
            color: 28,
            scale: 0.9,
        });
        this.QBCore.hideBlip('displayLiquorBlip', true);

        this.QBCore.createBlip('displayFlavorBlip', {
            name: 'Point de récolte de saveurs',
            coords: { x: 867.17, y: -1628.59, z: 30.2 },
            sprite: 478,
            color: 28,
            scale: 0.9,
        });
        this.QBCore.hideBlip('displayFlavorBlip', true);

        this.QBCore.createBlip('displayFurnitureBlip', {
            name: 'Point de récolte de fournitures',
            coords: { x: 44.98, y: -1749.42, z: 29.59 },
            sprite: 478,
            color: 28,
            scale: 0.9,
        });
        this.QBCore.hideBlip('displayFurnitureBlip', true);

        this.QBCore.createBlip('displayResellBlip', {
            name: 'Point de vente des cocktails',
            coords: { x: 393.02, y: 177.3, z: 103.86 },
            sprite: 478,
            color: 28,
            scale: 0.9,
        });
        this.QBCore.hideBlip('displayResellBlip', true);
    }
}
