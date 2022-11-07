import { Command } from '../../core/decorators/command';
import { OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { SozRole } from '../../core/permissions';
import { emitRpc } from '../../core/rpc';
import { AdminMenuData } from '../../shared/admin/admin';
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

    private menuState: AdminMenuData['state'] = {
        gameMaster: {
            godMode: false,
            invisible: false,
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

    @Command('admin', {
        keys: [
            {
                mapper: 'keyboard',
                key: 'F9',
            },
        ],
    })
    public async openAdminMenu(subMenuId?: string): Promise<void> {
        const [isAllowed, permission] = await emitRpc<[boolean, string]>(RpcEvent.ADMIN_IS_ALLOWED);
        if (!isAllowed) {
            return;
        }

        if (this.nuiMenu.getOpened() === MenuType.AdminMenu) {
            this.nuiMenu.closeMenu();

            return;
        }

        const banner = 'https://nui-img/soz/menu_admin_' + permission;
        this.menuState.skin.clothConfig = this.clothingService.getClothSet();
        this.menuState.skin.maxOptions = this.clothingService.getMaxOptions();

        this.nuiMenu.openMenu<MenuType.AdminMenu>(
            MenuType.AdminMenu,
            {
                banner,
                permission: permission as SozRole,
                state: this.menuState,
            },
            { subMenuId }
        );
    }
}
