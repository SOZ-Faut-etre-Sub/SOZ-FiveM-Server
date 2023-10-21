import { PlayerWardrobe } from '@public/client/player/player.wardrobe';
import { OnEvent } from '@public/core/decorators/event';
import { Exportable } from '@public/core/decorators/exports';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Component } from '@public/shared/cloth';
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
            const numberId = Number(id);
            const drawable = GetPedDrawableVariation(ped, Number(numberId));

            // We skip the Torso because it's modified when user wear his own gloves and make this function return false
            // even if he wear the VIP clothes
            if (numberId == Component.Torso) {
                continue;
            }

            if (drawable != component.Drawable) {
                return false;
            }
        }

        return true;
    }
}
