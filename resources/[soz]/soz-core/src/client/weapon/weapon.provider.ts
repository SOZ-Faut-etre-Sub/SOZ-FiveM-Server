import { Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { emitRpc } from '../../core/rpc';
import { wait } from '../../core/utils';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { InventoryItem } from '../../shared/item';
import { RpcEvent } from '../../shared/rpc';
import { WeaponAmmo, WeaponName } from '../../shared/weapon';
import { ProgressService } from '../progress.service';
import { WeaponService } from './weapon.service';

@Provider()
export class WeaponProvider {
    @Inject(WeaponService)
    private weapon: WeaponService;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Once(OnceStep.PlayerLoaded)
    async onPlayerLoaded() {
        SetWeaponsNoAutoswap(true);

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

        const weapon = await emitRpc<InventoryItem | null>(
            RpcEvent.WEAPON_USE_AMMO,
            this.weapon.getCurrentWeapon().slot,
            ammoName
        );
        if (weapon) {
            await this.progressService.progress(
                'weapon_reload',
                "S'équipe d'un chargeur",
                weapon.metadata.ammo === WeaponAmmo[ammoName] ? 8000 : 2000,
                {},
                {
                    canCancel: false,
                    disableCombat: true,
                }
            );

            await this.weapon.set(weapon);
        }
    }

    @Tick(TickInterval.EVERY_FRAME)
    async onTick() {
        const player = PlayerPedId();
        const weapon = this.weapon.getCurrentWeapon();
        if (!weapon) {
            return;
        }

        if (weapon.name.toLowerCase() === WeaponName.UNARMED.toLowerCase()) {
            return;
        }

        if (!IsPedShooting(player)) {
            return;
        }

        emitNet(ServerEvent.WEAPON_SHOOTING, weapon.slot);

        const sleep = GetWeaponTimeBetweenShots(weapon.name);
        await this.weapon.recoil();
        await wait(sleep);
    }
}
