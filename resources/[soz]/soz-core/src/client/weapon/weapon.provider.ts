import { Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { emitRpc } from '../../core/rpc';
import { wait } from '../../core/utils';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { InventoryItem } from '../../shared/item';
import { RpcEvent } from '../../shared/rpc';
import { WeaponAmmo, WeaponName } from '../../shared/weapons/weapon';
import { Notifier } from '../notifier';
import { PhoneService } from '../phone/phone.service';
import { ProgressService } from '../progress.service';
import { TalkService } from '../talk.service';
import { WeaponService } from './weapon.service';

@Provider()
export class WeaponProvider {
    @Inject(WeaponService)
    private weapon: WeaponService;

    @Inject(ProgressService)
    private progressService: ProgressService;

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

        LocalPlayer.state.set('inv_busy', true, true);

        const weapon = await emitRpc<InventoryItem | null>(
            RpcEvent.WEAPON_USE_AMMO,
            this.weapon.getCurrentWeapon().slot,
            ammoName
        );

        if (!weapon) {
            LocalPlayer.state.set('inv_busy', false, true);
            return;
        }

        console.log(weapon.metadata.ammo, WeaponAmmo[ammoName]);

        await this.progressService.progress(
            'weapon_reload',
            "S'équipe d'un chargeur",
            weapon.metadata.ammo <= WeaponAmmo[ammoName] ? 8000 : 2000,
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
        }

        if (!IsPedShooting(player)) {
            return;
        }

        if (GetPedInVehicleSeat(vehicle, -1) === player && GetEntitySpeed(vehicle) * 3.6 > 50) {
            this.notifier.notify('Vous allez trop vite pour faire ça.', 'error');
            DisableControlAction(0, 24, true);
            await this.weapon.clear();

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
        }

        if (this.talkService.isRadioOpen()) {
            await this.weapon.clear();
        }

        if (IsEntityPlayingAnim(ped, 'missfbi4prepp1', '_idle_garbage_man', 3)) {
            await this.weapon.clear();
        }

        if (GetPedInVehicleSeat(vehicle, -1) === ped && weaponDrawable) {
            await this.weapon.clear();
        }

        if (this.weapon.getCurrentWeapon()) {
            const hash = GetHashKey(this.weapon.getCurrentWeapon().name);
            let [, weaponHash] = GetCurrentPedWeapon(ped, true);

            if (weaponHash === GetHashKey('WEAPON_UNARMED')) {
                await wait(5000); // wait animations
                const [, h] = GetCurrentPedWeapon(ped, true);
                weaponHash = h;
            }
            if (weaponHash !== hash) {
                await this.weapon.clear();
            }
        }
    }
}
