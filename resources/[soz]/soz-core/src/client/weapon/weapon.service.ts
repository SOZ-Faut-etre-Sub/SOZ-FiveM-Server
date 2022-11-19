import { Inject, Injectable } from '../../core/decorators/injectable';
import { InventoryItem } from '../../shared/item';
import { GlobalWeaponConfig, WeaponConfig, WeaponName, Weapons } from '../../shared/weapons/weapon';
import { PlayerService } from '../player/player.service';

@Injectable()
export class WeaponService {
    private currentWeapon: InventoryItem | null = null;

    @Inject(PlayerService)
    private playerService: PlayerService;

    getWeaponFromSlot(slot: number): InventoryItem | null {
        return Object.values(this.playerService.getPlayer().items).find(
            item => item.type === 'weapon' && item.slot === slot
        );
    }

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

        if (weapon.metadata.tint) {
            SetPedWeaponTintIndex(player, weaponHash, weapon.metadata.tint);
        }

        if (weapon.metadata.attachments) {
            Object.values(weapon.metadata.attachments).forEach(attachment => {
                GiveWeaponComponentToPed(player, weaponHash, GetHashKey(attachment));
            });
        }
    }

    async clear() {
        const player = PlayerPedId();
        this.currentWeapon = null;

        SetCurrentPedWeapon(player, GetHashKey(WeaponName.UNARMED), true);
        RemoveAllPedWeapons(player, true);
    }

    async recoil() {
        if (!this.currentWeapon) {
            return;
        }
        const recoil = this.getWeaponConfig(this.currentWeapon.name)?.recoil ?? 0;
        const recoilHorizontal = Math.random() * 0.5 * (Math.round(Math.random()) ? 1 : -1);
        const weaponHealth = this.currentWeapon.metadata.health > 0 ? this.currentWeapon.metadata.health : 1;

        const recoilY =
            recoil + GlobalWeaponConfig.RecoilOnUsedWeapon * (1 - weaponHealth / GlobalWeaponConfig.MaxHealth);
        const recoilX =
            recoilHorizontal +
            GlobalWeaponConfig.RecoilOnUsedWeapon * (1 - weaponHealth / GlobalWeaponConfig.MaxHealth);

        const pitch = GetGameplayCamRelativePitch();
        const heading = GetGameplayCamRelativeHeading();

        SetGameplayCamRelativePitch(pitch + recoilY, 1.0);
        SetGameplayCamRelativeHeading(heading + recoilX);
    }

    getWeaponConfig(weaponName: string): WeaponConfig | null {
        return Weapons[weaponName.toUpperCase()] ?? null;
    }
}
