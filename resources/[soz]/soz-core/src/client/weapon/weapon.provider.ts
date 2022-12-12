import { Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { emitRpc } from '../../core/rpc';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { InventoryItem } from '../../shared/item';
import { RpcEvent } from '../../shared/rpc';
import { GlobalWeaponConfig, WeaponName } from '../../shared/weapons/weapon';
import { Notifier } from '../notifier';
import { PhoneService } from '../phone/phone.service';
import { ProgressService } from '../progress.service';
import { TalkService } from '../talk.service';
import { WeaponDrawingProvider } from './weapon.drawing.provider';
import { WeaponService } from './weapon.service';

@Provider()
export class WeaponProvider {
    @Inject(WeaponService)
    private weapon: WeaponService;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(WeaponDrawingProvider)
    private weaponDrawingProvider: WeaponDrawingProvider;

    @Inject(PhoneService)
    private phoneService: PhoneService;

    @Inject(TalkService)
    private talkService: TalkService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Once(OnceStep.PlayerLoaded)
    async onPlayerLoaded() {
        SetWeaponsNoAutoswap(true);

        await this.weapon.clear();
    }

    @OnEvent(ClientEvent.PLAYER_ON_DEATH)
    async clearCurrentWeapon() {
        await this.weapon.clear();
    }

    @OnEvent(ClientEvent.WEAPON_USE_WEAPON)
    async onUseWeapon(weapon: InventoryItem | null) {
        if (weapon.name.toLowerCase() === this.weapon.getCurrentWeapon()?.name.toLowerCase()) {
            await this.weapon.clear();
            return;
        }
        await this.weapon.set(weapon);
    }

    @OnEvent(ClientEvent.WEAPON_USE_AMMO)
    async onUseAmmo(ammoName: string) {
        if (!this.weapon.getCurrentWeapon()) {
            return;
        }

        if (LocalPlayer.state.inv_busy === true) {
            return;
        }

        LocalPlayer.state.set('inv_busy', true, true);

        const weapon = await emitRpc<InventoryItem | null>(
            RpcEvent.WEAPON_USE_AMMO,
            this.weapon.getCurrentWeapon().slot,
            ammoName,
            this.weapon.getMaxAmmoInClip()
        );

        if (!weapon) {
            LocalPlayer.state.set('inv_busy', false, true);
            return;
        }

        const player = PlayerPedId();
        const weaponHash = GetHashKey(weapon.name);

        const isFirstClip = GetPedAmmoTypeFromWeapon(player, weaponHash) <= this.weapon.getMaxAmmoInClip();

        await this.progressService.progress(
            'weapon_reload',
            "S'équipe d'un chargeur",
            isFirstClip ? 8000 : 2000,
            {},
            {
                canCancel: false,
                disableCombat: true,
            }
        );

        TaskReloadWeapon(PlayerPedId(), true);

        if (weapon) {
            await this.weapon.set(weapon);
        }
        LocalPlayer.state.set('inv_busy', false, true);

        if (weapon.metadata.ammo < this.weapon.getMaxAmmoInClip() * GlobalWeaponConfig.MaxAmmoRefill(weapon.name)) {
            await this.onUseAmmo(ammoName);
        }
    }

    @Tick(TickInterval.EVERY_FRAME)
    async onTick() {
        const player = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(player, false);

        const weapon = this.weapon.getCurrentWeapon();
        if (!weapon) {
            return;
        }

        if (weapon.name.toLowerCase() === WeaponName.UNARMED.toLowerCase()) {
            return;
        }

        if (IsPedArmed(player, 7) && IsPedRagdoll(player)) {
            DisableControlAction(0, 24, true);
            return;
        }

        if (
            IsPedArmed(player, 7) &&
            GetPedInVehicleSeat(vehicle, -1) === player &&
            GetEntitySpeed(vehicle) * 3.6 > 50
        ) {
            DisableControlAction(0, 24, true);
            await this.weapon.clear();

            return;
        }

        if (!IsPedShooting(player)) {
            return;
        }

        emitNet(ServerEvent.WEAPON_SHOOTING, weapon.slot);
        await this.weapon.recoil();
    }

    @Tick(TickInterval.EVERY_SECOND)
    async onCheck() {
        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);
        const weapon = this.weapon.getCurrentWeapon()?.name || '';
        const weaponDrawable = !!this.weapon.getWeaponConfig(weapon)?.drawPosition;

        if (this.phoneService.isPhoneVisible()) {
            await this.weapon.clear();
            await this.weaponDrawingProvider.refreshDrawWeapons();
        }

        if (this.talkService.isRadioOpen()) {
            await this.weapon.clear();
            await this.weaponDrawingProvider.refreshDrawWeapons();
        }

        if (IsEntityPlayingAnim(ped, 'missfbi4prepp1', '_idle_garbage_man', 3)) {
            await this.weapon.clear();
            await this.weaponDrawingProvider.refreshDrawWeapons();
        }

        if (GetPedInVehicleSeat(vehicle, -1) === ped && weaponDrawable) {
            await this.weapon.clear();
            await this.weaponDrawingProvider.refreshDrawWeapons();
        }

        if (LocalPlayer.state.weapon_animation === true) {
            return;
        }

        if (this.weapon.getCurrentWeapon()) {
            const hash = GetHashKey(this.weapon.getCurrentWeapon().name);
            let [, weaponHash] = GetCurrentPedWeapon(ped, true);

            if (weaponHash === GetHashKey('WEAPON_UNARMED')) {
                const [, h] = GetCurrentPedWeapon(ped, true);
                weaponHash = h;
            }
            if (weaponHash !== hash) {
                await this.weapon.clear();
                await this.weaponDrawingProvider.refreshDrawWeapons();
            }
        }
    }
}
