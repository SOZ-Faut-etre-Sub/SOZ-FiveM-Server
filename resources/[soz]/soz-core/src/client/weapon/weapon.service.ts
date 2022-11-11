import { Injectable } from '../../core/decorators/injectable';
import { InventoryItem } from '../../shared/item';
import { GlobalWeaponConfig, WeaponConfig, Weapons } from '../../shared/weapon';

@Injectable()
export class WeaponService {
    private currentWeapon: InventoryItem | null = null;

    getCurrentWeapon(): InventoryItem | null {
        return this.currentWeapon;
    }

    async set(weapon: InventoryItem) {
        const player = PlayerPedId();
        const weaponHash = GetHashKey(weapon.name);
        const ammo = weapon.metadata.ammo >= 0 ? weapon.metadata.ammo : 0;

        this.currentWeapon = weapon;

        GiveWeaponToPed(player, weaponHash, ammo, false, true);
        SetPedAmmo(player, weaponHash, ammo);
        SetCurrentPedWeapon(player, weaponHash, true);

        if (weapon.metadata.attachments) {
            weapon.metadata.attachments.forEach(attachment => {
                GiveWeaponComponentToPed(player, weaponHash, GetHashKey(attachment.component));
            });
        }
    }

    async clear() {
        const player = PlayerPedId();
        this.currentWeapon = null;

        SetCurrentPedWeapon(player, Weapons.WEAPON_UNARMED.hash, true);
        RemoveAllPedWeapons(player, true);
    }

    async recoil() {
        if (!this.currentWeapon) {
            return;
        }
        const recoil = this.getWeaponConfig(this.currentWeapon.name)?.recoil ?? 0;
        const weaponHealth = this.currentWeapon.metadata.health > 0 ? this.currentWeapon.metadata.health : 1;
        const recoilMalus =
            recoil + GlobalWeaponConfig.RecoilOnUsedWeapon * (1 - weaponHealth / GlobalWeaponConfig.MaxHealth);

        const pitch = GetGameplayCamRelativePitch();
        SetGameplayCamRelativePitch(pitch + recoilMalus, 1.0);
    }

    getWeaponConfig(weaponName: string): WeaponConfig | null {
        return Weapons[weaponName.toUpperCase()] ?? null;
    }
}
