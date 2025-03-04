import { NuiMenu } from '@public/client/nui/nui.menu';
import { ProgressService } from '@public/client/progress.service';
import { OnNuiEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { NuiEvent, ServerEvent } from '@public/shared/event';

@Provider()
export class PoliceSearchWarrantProvider {
    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @OnNuiEvent(NuiEvent.HousingSearchWarrantUse)
    public async onSearchWarrantUse({ apartmentId, propertyId }: { apartmentId: number; propertyId: number }) {
        this.nuiMenu.closeMenu();

        const { completed } = await this.progressService.progress(
            'force_house_with_search_warrant',
            "Vous forcez l'accès de l'habitation...",
            20000,
            {
                dictionary: 'anim@amb@clubhouse@tutorial@bkr_tut_ig3@',
                name: 'machinic_loop_mechandplayer',
                options: {
                    repeat: true,
                    onlyUpperBody: true,
                },
            }
        );
        if (!completed) {
            return;
        }
        TriggerServerEvent(ServerEvent.FDO_USE_SEARCH_WARRANT, apartmentId, propertyId);
    }

    @OnNuiEvent(NuiEvent.HousingSearchWarrantClose)
    public async onCloseWarrantUse({ apartmentId, propertyId }: { apartmentId: number; propertyId: number }) {
        this.nuiMenu.closeMenu();

        const { completed } = await this.progressService.progress(
            'force_house_with_search_warrant',
            "Vous fermez l'accès de l'habitation...",
            30000,
            {
                dictionary: 'anim@amb@clubhouse@tutorial@bkr_tut_ig3@',
                name: 'machinic_loop_mechandplayer',
                options: {
                    repeat: true,
                    onlyUpperBody: true,
                },
            }
        );
        if (!completed) {
            return;
        }
        TriggerServerEvent(ServerEvent.FDO_CLOSE_SEARCH_WARRANT, apartmentId, propertyId);
    }
}
