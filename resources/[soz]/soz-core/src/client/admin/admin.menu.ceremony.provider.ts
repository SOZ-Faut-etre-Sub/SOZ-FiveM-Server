import { OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { NuiEvent, ServerEvent } from '../../shared/event';
import { NuiMenu } from '../nui/nui.menu';

@Provider()
export class AdminMenuCeremonyProvider {
    @Inject(NuiMenu)
    private readonly nuiMenu: NuiMenu;

    @OnNuiEvent(NuiEvent.AdminMenuPublicCeremonyStart)
    public async activatePublicCeremony(): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_CEREMONY_PUBLIC_PART_START);

        this.nuiMenu.closeMenu();
    }

    @OnNuiEvent(NuiEvent.AdminMenuFinalCeremonyStart)
    public async activateFinalCeremony(): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_CEREMONY_FINAL_PART_START);

        this.nuiMenu.closeMenu();
    }

    @OnNuiEvent(NuiEvent.AdminMenuCeremonyParadeStart)
    public async activateParade(value: boolean): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_PARADE_START, value);

        this.nuiMenu.closeMenu();
    }

    @OnNuiEvent(NuiEvent.AdminMenuCeremonyTime)
    public async setForcedTime({ value }: { value: number }): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_CEREMONY_TIME, value);
    }
}
