import { NuiMenu } from '@public/client/nui/nui.menu';
import { OnNuiEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { NuiEvent, ServerEvent } from '@public/shared/event';

@Provider()
export class PoliceSearchWarrantProvider {
    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @OnNuiEvent(NuiEvent.HousingSearchWarrantUse)
    public async onSearchWarrantUse({ apartmentId, propertyId }: { apartmentId: number; propertyId: number }) {
        TriggerServerEvent(ServerEvent.FDO_USE_SEARCH_WARRANT, apartmentId, propertyId);

        this.nuiMenu.closeMenu();
    }
}
