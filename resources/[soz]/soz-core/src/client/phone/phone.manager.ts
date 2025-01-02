import { Command } from '../../core/decorators/command';
import { Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { HousingFournitureProvider } from '../housing/housing.fourniture.provider';
import { InventoryManager } from '../inventory/inventory.manager';
import { Notifier } from '../notifier';
import { NuiDispatch } from '../nui/nui.dispatch';
import { PropPlacementProvider } from '../object/prop.placement.provider';
import { PlayerService } from '../player/player.service';
import { StateSelector } from '../store/store';

@Provider()
export class PhoneManager {
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

    private phoneDisabled = false;
    private phoneOpen = false;
    private phoneDrowned = false;
    private cityIsInBlackOut = false;

    @Once(OnceStep.NuiLoaded)
    async onNuiLoaded() {
        this.nuiDispatch.dispatch('phone', 'SetAvailability', true);
    }

    @StateSelector(state => state.global.blackout, state => state.global.blackoutLevel)
    async onBlackout(blackout: boolean, blackoutLevel: number) {
        this.cityIsInBlackOut = blackout || blackoutLevel >= 3;
    }

    @Command('phone', {
        description: 'Afficher le téléphone',
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

        if (this.phoneOpen) {
            return this.hidePhone();
        }

        const playerState = this.playerService.getState();
        if (!playerState.isDead) {
            if (this.phoneDrowned) return;
            if (this.phoneDisabled) return;
            if (this.cityIsInBlackOut) return;

            if (!this.hasPlayerPhone()) return;
        }

        return this.showPhone();
    }

    private async showPhone() {
        this.phoneOpen = true;
        this.nuiDispatch.dispatch('phone', 'SetVisibility', this.phoneOpen);
    }

    private async hidePhone() {
        this.phoneOpen = false;
        this.nuiDispatch.dispatch('phone', 'SetVisibility', this.phoneOpen);
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
