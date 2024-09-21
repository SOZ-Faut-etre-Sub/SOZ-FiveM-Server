import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import { WeaponName } from '../../shared/weapons/weapon';
import { NuiDispatch } from '../nui/nui.dispatch';
import { WeaponService } from '../weapon/weapon.service';

@Provider()
export class HudWeaponProvider {
    @Inject(WeaponService)
    private readonly weapon: WeaponService;

    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    private weaponWithoutHud: string[] = [WeaponName.UNARMED.toLowerCase(), WeaponName.STUNGUN.toLowerCase()];

    private _haveWeapon = false;

    @Tick(200)
    async updateWeaponHud() {
        const player = PlayerPedId();

        const weapon = this.weapon.getCurrentWeapon();
        if (!weapon) {
            this.resetWeaponHud();
            return;
        }

        if (this.weaponWithoutHud.includes(weapon.name.toLowerCase())) {
            this.resetWeaponHud();
            return;
        }

        const maxAmmoInClip = GetMaxAmmoInClip(player, weapon.name, true);
        if (maxAmmoInClip === 0) {
            this.resetWeaponHud();
            return;
        }

        const [hasValue, ammo] = GetAmmoInClip(player, weapon.name);
        if (!hasValue) {
            this.resetWeaponHud();
            return;
        }

        const maxAmmo = GetAmmoInPedWeapon(player, weapon.name);

        this._haveWeapon = true;
        this.nuiDispatch.dispatch('hud', 'UpdateWeaponAmmo', {
            hasWeapon: maxAmmo !== undefined,
            ammo,
            maxAmmo: Math.max(0, maxAmmo - ammo),
        });
    }

    protected resetWeaponHud() {
        if (!this._haveWeapon) return;

        this._haveWeapon = false;
        this.nuiDispatch.dispatch('hud', 'UpdateWeaponAmmo', {
            hasWeapon: false,
            ammo: 0,
            maxAmmo: 0,
        });
    }
}
