import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import { WeaponName } from '../../shared/weapons/weapon';
import { WEAPON_DIGISCANNER } from '../job/police/police.provider';
import { NuiDispatch } from '../nui/nui.dispatch';
import { WeaponService } from '../weapon/weapon.service';

@Provider()
export class HudWeaponProvider {
    @Inject(WeaponService)
    private readonly weapon: WeaponService;

    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    private weaponWithoutHud: number[] = [
        GetHashKey(WeaponName.UNARMED),
        GetHashKey(WeaponName.STUNGUN),
        WEAPON_DIGISCANNER,
    ];

    private _haveWeapon = false;

    @Tick(200)
    async updateWeaponHud() {
        const player = PlayerPedId();

        const weaponHash = GetSelectedPedWeapon(player);
        if (!weaponHash || weaponHash === 0) {
            this.resetWeaponHud();
            return;
        }

        if (this.weaponWithoutHud.includes(weaponHash)) {
            this.resetWeaponHud();
            return;
        }

        const maxAmmoInClip = GetMaxAmmoInClip(player, weaponHash, true);
        if (maxAmmoInClip === 0) {
            this.resetWeaponHud();
            return;
        }

        const [hasValue, ammo] = GetAmmoInClip(player, weaponHash);
        if (!hasValue) {
            this.resetWeaponHud();
            return;
        }

        const maxAmmo = GetAmmoInPedWeapon(player, weaponHash);

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
