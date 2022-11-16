import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { StonkConfig } from '../../shared/job/stonk';
import { InventoryManager } from '../item/inventory.manager';
import { PlayerService } from '../player/player.service';

const MONEY_CASE_TRIGGER = 5000;
const MONEY_CASE_HASH = GetHashKey('WEAPON_BRIEFCASE');

@Provider()
export class BankMoneyCaseProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    private shouldDisplayMoneyCase(): boolean {
        if (this.playerService.getPlayer() === null) {
            return false;
        }

        if (LocalPlayer.state.adminDisableMoneyCase) {
            return false;
        }

        if (this.inventoryManager.hasEnoughItem(StonkConfig.delivery.item, 1)) {
            return true;
        }

        const player = PlayerPedId();
        const isPhoneVisible = exports['soz-phone'].isPhoneVisible();
        const getVehicleTryingToEnter = GetVehiclePedIsTryingToEnter(player);
        const isInsideVehicle = IsPedInVehicle(player, GetVehiclePedIsIn(player, false), true);

        if (isPhoneVisible || isInsideVehicle) {
            return false;
        }

        if (getVehicleTryingToEnter !== 0) {
            TriggerEvent('inventory:client:StoreWeapon');
            return false;
        }

        return Object.values(this.playerService.getPlayer().money).reduce((a, b) => a + b) >= MONEY_CASE_TRIGGER;
    }

    private hasMoneyCase(): boolean {
        return GetSelectedPedWeapon(PlayerPedId()) == MONEY_CASE_HASH;
    }

    private addMoneyCase(): void {
        GiveWeaponToPed(PlayerPedId(), MONEY_CASE_HASH, 1, false, true);
        SetCurrentPedWeapon(PlayerPedId(), MONEY_CASE_HASH, true);
    }

    private removeMoneyCase(): void {
        TriggerEvent('inventory:client:StoreWeapon');
        RemoveWeaponFromPed(PlayerPedId(), MONEY_CASE_HASH);
    }

    @Tick(TickInterval.EVERY_SECOND)
    public async onCheckTick() {
        if (this.shouldDisplayMoneyCase()) {
            if (!this.hasMoneyCase()) {
                this.addMoneyCase();
            }
        } else {
            if (this.hasMoneyCase()) {
                this.removeMoneyCase();
            }
        }
    }

    @Tick(TickInterval.EVERY_FRAME)
    public async onTick() {
        if (!this.hasMoneyCase()) {
            return;
        }

        DisableControlAction(0, 24, true); // Attack
        DisableControlAction(0, 257, true); // Attack 2
        DisableControlAction(0, 25, true); // Aim
        DisableControlAction(0, 263, true); // Melee Attack 1
        DisableControlAction(0, 45, true); // Reload
        DisableControlAction(0, 44, true); // Cover
        DisableControlAction(0, 37, true); // Select Weapon
        DisableControlAction(2, 36, true); // Disable going stealth
        DisableControlAction(0, 47, true); // Disable weapon
        DisableControlAction(0, 264, true); // Disable melee
        DisableControlAction(0, 257, true); // Disable melee
        DisableControlAction(0, 140, true); // Disable melee
        DisableControlAction(0, 141, true); // Disable melee
        DisableControlAction(0, 142, true); // Disable melee
        DisableControlAction(0, 143, true); // Disable melee
    }
}
