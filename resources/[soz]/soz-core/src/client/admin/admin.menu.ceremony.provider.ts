import { OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { NuiEvent, ServerEvent } from '../../shared/event';
import { NuiMenu } from '../nui/nui.menu';

@Provider()
export class AdminMenuCeremonyProvider {
    @Inject(NuiMenu)
    private readonly nuiMenu: NuiMenu;

    @OnNuiEvent(NuiEvent.AdminMenuCeremonyStart)
    public async activateMeteor(): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_CEREMONY_START);

        this.nuiMenu.closeMenu();
    }
}
