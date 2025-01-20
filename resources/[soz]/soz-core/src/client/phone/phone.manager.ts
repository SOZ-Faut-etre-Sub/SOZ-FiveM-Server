import { Command } from '@core/decorators/command';
import { Once, OnceStep } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { PhoneState } from '@public/client/phone/phone.state';

import { Tick } from '../../core/decorators/tick';
import { Control } from '../../shared/input';
import { HousingFournitureProvider } from '../housing/housing.fourniture.provider';
import { InventoryManager } from '../inventory/inventory.manager';
import { Notifier } from '../notifier';
import { NuiDispatch } from '../nui/nui.dispatch';
import { PropPlacementProvider } from '../object/prop.placement.provider';
import { PlayerService } from '../player/player.service';

@Provider()
export class PhoneManager {
    @Inject(PhoneState)
    private phoneState: PhoneState;

    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    @Inject(InventoryManager)
    private readonly inventoryManager: InventoryManager;

    @Inject(PropPlacementProvider)
    private readonly propPlacementProvider: PropPlacementProvider;

    @Inject(HousingFournitureProvider)
    private readonly housingFournitureProvider: HousingFournitureProvider;

    @Inject(PlayerService)
    private readonly playerService: PlayerService;

    @Inject(Notifier)
    private readonly notifier: Notifier;

    @Once(OnceStep.NuiLoaded)
    async onNuiLoaded() {
        this.nuiDispatch.dispatch('phone', 'SetAvailability', true);
    }

    @Tick()
    async onTick() {
        if (!IsControlJustPressed(0, Control.PhoneSelect)) return;

        this.nuiDispatch.dispatch('phone', 'SetPhoneFreeCamera', false);
    }

    @Command('phone', {
        description: 'Afficher le téléphone',
        passthroughNuiFocus: true,
        keys: [
            {
                mapper: 'keyboard',
                key: 'L',
            },
        ],
    })
    async togglePhone() {
        if (
            this.propPlacementProvider.IsEditorModeActive() ||
            this.housingFournitureProvider.isHousingEditorModeActive()
        ) {
            return;
        }

        if (this.phoneState.isPhoneOpen()) {
            return this.hidePhone();
        }

        const playerState = this.playerService.getState();
        if (!playerState.isDead) {
            if (this.phoneState.isPhoneDrowned()) return;
            if (this.phoneState.isPhoneDisabled()) return;

            if (!this.hasPlayerPhone()) return;
        }

        return this.showPhone();
    }

    private async showPhone() {
        this.phoneState.setPhoneOpen(true);
    }

    private async hidePhone() {
        this.phoneState.setPhoneFrontCameraEnabled(false);
        this.phoneState.setPhoneOpen(false);
    }

    private hasPlayerPhone() {
        if (IsPauseMenuActive()) {
            return false;
        }

        const hasPhone = this.inventoryManager.hasEnoughItem('phone', 1);
        if (!hasPhone) {
            this.notifier.error("Vous n'avez pas de téléphone");
            return false;
        }

        const playerState = this.playerService.getState();
        if (playerState.isInventoryBusy) {
            this.notifier.error('Action en cours');
            return false;
        }

        const player = this.playerService.getPlayer();
        if (player.metadata.inlaststand || player.metadata.ishandcuffed) {
            this.notifier.error('Vous ne pouvez pas accéder à votre téléphone');
            return false;
        }

        return true;
    }
}
