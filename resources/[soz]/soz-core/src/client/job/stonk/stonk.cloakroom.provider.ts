import { PlayerWardrobe } from '@public/client/player/player.wardrobe';
import { OnEvent } from '@public/core/decorators/event';
import { Exportable } from '@public/core/decorators/exports';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { DUTY_OUTFIT_NAME, StonkCloakroom } from '@public/shared/job/stonk';

@Provider()
export class StonkCloakRoomProvider {
    @Inject(PlayerWardrobe)
    private playerWardrobe: PlayerWardrobe;

    @OnEvent(ClientEvent.STONK_APPLY_OUTFIT)
    public async applyDutyClothing() {
        const model = GetEntityModel(PlayerPedId());

        const outfit = StonkCloakroom[model][DUTY_OUTFIT_NAME];
        const { completed } = await this.playerWardrobe.waitProgress(false);
        if (completed) {
            TriggerServerEvent(ServerEvent.CHARACTER_SET_JOB_CLOTHES, outfit);
        }
    }

    @Exportable('WearVIPClothes')
    public wearVIPClothes() {
        const ped = PlayerPedId();

        for (const [id, component] of Object.entries(StonkCloakroom[GetEntityModel(ped)]['Tenue VIP'].Components)) {
            const drawable = GetPedDrawableVariation(ped, Number(id));

            if (drawable != component.Drawable) {
                return false;
            }
        }

        return true;
    }
}
