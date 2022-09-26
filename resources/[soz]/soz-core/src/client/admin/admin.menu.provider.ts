import { Command } from '../../core/decorators/command';
import { OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { AdminMenuStateProps } from '../../nui/components/Admin/AdminMenu';
import { NuiEvent } from '../../shared/event';
import { MenuType } from '../../shared/nui/menu';
import { NuiMenu } from '../nui/nui.menu';

@Provider()
export class AdminMenuProvider {
    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

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
        developer: {
            noClip: false,
            displayCoords: false,
        },
    };

    @OnNuiEvent(NuiEvent.AdminUpdateState)
    public async updateState(data: { namespace: string; key: string; value: any }): Promise<void> {
        this.menuState[data.namespace][data.key] = data.value;
    }

    // @Command('admin', {role: 'admin'})
    @Command('admin')
    public openAdminMenu() {
        if (this.nuiMenu.isOpen()) {
            this.nuiMenu.closeMenu();
            return;
        }
        this.nuiMenu.openMenu<MenuType.AdminMenu>(MenuType.AdminMenu, {
            state: this.menuState,
        });
    }
}
