import { Control } from '@public/shared/input';

import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { StonkConfig } from '../../shared/job/stonk';
import { InventoryManager } from '../inventory/inventory.manager';
import { PhoneService } from '../phone/phone.service';
import { PlayerService } from '../player/player.service';
import { VampireGameStateProvider } from '../story/vampire.game.state.provider';
import { WeaponHolsterProvider } from '../weapon/weapon.holster.provider';

const MONEY_CASE_TRIGGER = 5000;
const MONEY_CASE_HASH = GetHashKey('WEAPON_BRIEFCASE');

@Provider()
export class BankMoneyCaseProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(PhoneService)
    private phoneService: PhoneService;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(WeaponHolsterProvider)
    private weaponHolsterProvider: WeaponHolsterProvider;

    @Inject(VampireGameStateProvider)
    private readonly vampireGameStateProvider: VampireGameStateProvider;

    private disableAttack = false;

    private shouldDisplayMoneyCase(): boolean {
        const player = this.playerService.getPlayer();

        if (this.vampireGameStateProvider.isGameRunning()) {
            this.disableAttack = false;
            return false;
        }

        this.disableAttack =
            player !== null &&
            !this.playerService.getState().disableMoneyCase &&
            !this.weaponHolsterProvider.isInAnimation() &&
            !this.playerService.getState().isInShop &&
            (this.inventoryManager.hasEnoughItem(StonkConfig.delivery.item) ||
                this.inventoryManager.hasEnoughItem('crypto_destroyer') ||
                Object.values(player.money).reduce((a, b) => a + b) >= MONEY_CASE_TRIGGER);

        if (!this.disableAttack) {
            return false;
        }

        const playerPed = PlayerPedId();
        const isInsideVehicle = IsPedInAnyVehicle(playerPed, true);

        return !(this.phoneService.isPhoneVisible() || isInsideVehicle);
    }

    private hasMoneyCase(): boolean {
        return GetCurrentPedWeapon(PlayerPedId(), true)[1] == MONEY_CASE_HASH;
    }

    private addMoneyCase(): void {
        GiveWeaponToPed(PlayerPedId(), MONEY_CASE_HASH, 1, false, true);
        SetCurrentPedWeapon(PlayerPedId(), MONEY_CASE_HASH, true);
    }

    private removeMoneyCase(): void {
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
        if (!this.disableAttack) {
            return;
        }

        DisableControlAction(0, Control.Attack, true);
        DisableControlAction(0, Control.Attack2, true);
        DisableControlAction(0, Control.Aim, true);
        DisableControlAction(0, Control.MeleeAttack1, true);
        DisableControlAction(0, Control.MeleeAttack2, true);
        DisableControlAction(0, Control.Reload, true);
        DisableControlAction(0, Control.Cover, true);
        DisableControlAction(0, Control.SelectWeapon, true);
        DisableControlAction(0, Control.Duck, true);
        DisableControlAction(0, Control.Detonate, true);
        DisableControlAction(0, Control.MeleeAttackLight, true);
        DisableControlAction(0, Control.MeleeAttackHeavy, true);
        DisableControlAction(0, Control.MeleeAttackAlternate, true);
        DisableControlAction(0, Control.MeleeBlock, true);
        DisableControlAction(0, Control.VehicleAim, true);
        DisableControlAction(0, Control.VehicleAttack, true);
        DisableControlAction(0, Control.VehicleAttack2, true);
        DisableControlAction(0, Control.VehiclePassengerAim, true);
        DisableControlAction(0, Control.VehiclePassengerAttack, true);
    }
}
