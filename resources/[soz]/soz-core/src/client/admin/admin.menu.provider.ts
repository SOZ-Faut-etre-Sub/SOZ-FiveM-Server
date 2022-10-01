import { Command } from '../../core/decorators/command';
import { OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { emitRpc } from '../../core/rpc';
import { AdminMenuStateProps } from '../../nui/components/Admin/AdminMenu';
import { NuiEvent } from '../../shared/event';
import { MenuType } from '../../shared/nui/menu';
import { RpcEvent } from '../../shared/rpc';
import { ClothingService } from '../clothing/clothing.service';
import { NuiMenu } from '../nui/nui.menu';

@Provider()
export class AdminMenuProvider {
    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(ClothingService)
    private clothingService: ClothingService;

    private menuState: AdminMenuStateProps['data']['state'] = {
        gameMaster: {
            godMode: false,
            invisible: false,
            invincible: false,
            moneyCase: true,
        },
        interactive: {
            displayOwners: false,
            displayPlayerNames: false,
            displayPlayersOnMap: false,
        },
        job: {
            currentJobIndex: undefined,
            currentJobGradeIndex: undefined,
            isOnDuty: false,
        },
        skin: {
            clothConfig: undefined,
            maxOptions: [],
        },
        developer: {
            noClip: false,
            displayCoords: false,
        },
    };

    @OnNuiEvent(NuiEvent.AdminUpdateState)
    public async updateState({ namespace, key, value }: { namespace: string; key: string; value: any }): Promise<void> {
        this.menuState[namespace][key] = value;
    }

    @Command('admin')
    public async openAdminMenu() {
        const [isAllowed, permission] = await emitRpc<[boolean, string]>(RpcEvent.ADMIN_IS_ALLOWED);
        if (!isAllowed) {
            return;
        }
        if (this.nuiMenu.isOpen()) {
            this.nuiMenu.closeMenu();
            return;
        }

        const banner = 'https://nui-img/soz/menu_admin_' + permission;
        this.menuState.skin.clothConfig = this.clothingService.getClothSet();
        this.menuState.skin.maxOptions = this.clothingService.getMaxOptions();

        this.nuiMenu.openMenu<MenuType.AdminMenu>(MenuType.AdminMenu, {
            banner,
            state: this.menuState,
        });
    }
}
