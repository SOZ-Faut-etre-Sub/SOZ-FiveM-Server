import { NoClipProvider } from '@public/client/utils/noclip.provider';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Apartment, hasSearchWarrantAccessInApartment } from '@public/shared/housing/housing';
import { PlayerData } from '@public/shared/player';

@Provider()
export class HousingService {
    @Inject(NoClipProvider)
    private noClipProvider: NoClipProvider;

    public canAccessTargetInApartment(player: PlayerData, apartment: Apartment): boolean {
        if (!player) {
            return false;
        }

        if (this.noClipProvider.IsNoClipMode()) {
            return true;
        }

        if (apartment.tenant === null && apartment.roommate === null && apartment.senatePartyId === null) {
            return false;
        }

        const hasWarrantAccess = hasSearchWarrantAccessInApartment(apartment, player);
        if (hasWarrantAccess) {
            return true;
        }

        return player.metadata.inside?.apartment === apartment.id;
    }
}
