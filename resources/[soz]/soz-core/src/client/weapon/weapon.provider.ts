import { uuidv4 } from '@public/core/utils';
import { getRandomItem } from '@public/shared/random';

import { Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { emitRpc } from '../../core/rpc';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { InventoryItem } from '../../shared/item';
import { RpcServerEvent } from '../../shared/rpc';
import { ExplosionMessage, GlobalWeaponConfig, GunShotMessage, WeaponName } from '../../shared/weapons/weapon';
import { PhoneService } from '../phone/phone.service';
import { ProgressService } from '../progress.service';
import { TalkService } from '../talk.service';
import { WeaponDrawingProvider } from './weapon.drawing.provider';
import { WeaponHolsterProvider } from './weapon.holster.provider';
import { WeaponService } from './weapon.service';

const messageExcludeGroups = [
    GetHashKey('GROUP_FIREEXTINGUISHER'),
    GetHashKey('GROUP_THROWN'),
    GetHashKey('GROUP_STUNGUN'),
];

const messageExclude = [GetHashKey('weapon_musket')];

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

    @Inject(WeaponHolsterProvider)
    private weaponHolsterProvider: WeaponHolsterProvider;

    private lastPoliceCall = 0;

    @Once(OnceStep.PlayerLoaded)
    async onPlayerLoaded() {
        SetWeaponsNoAutoswap(true);

        await this.weapon.clear();

        SetWeaponDamageModifier(WeaponName.BAT, 0.2);
        SetWeaponDamageModifier(WeaponName.CROWBAR, 0.2);
        SetWeaponDamageModifier(WeaponName.GOLFCLUB, 0.2);
        SetWeaponDamageModifier(WeaponName.HAMMER, 0.2);
        SetWeaponDamageModifier(WeaponName.NIGHTSTICK, 0.2);
        SetWeaponDamageModifier(WeaponName.WRENCH, 0.2);
        SetWeaponDamageModifier(WeaponName.KNUCKLE, 0.2);
        SetWeaponDamageModifier(WeaponName.POOLCUE, 0.2);

        SetWeaponDamageModifier('AMMO_SNOWBALL', 0.0);
        SetWeaponDamageModifier('AMMO_FIREWORK', 0.0);
        SetWeaponDamageModifier(WeaponName.SMOKEGRENADE, 0.0);
        SetWeaponDamageModifier(WeaponName.BZGAS, 0.1);

        SetWeaponDamageModifier(WeaponName.MUSKET, 0.5);
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
            RpcServerEvent.WEAPON_USE_AMMO,
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

        const weaponGroup = GetWeapontypeGroup(weapon.name);
        emitNet(ServerEvent.WEAPON_SHOOTING, weapon.slot, weaponGroup, GetAmmoInClip(player, weapon.name)[1]);

        if (
            !messageExclude.includes(GetHashKey(weapon.name)) &&
            !messageExcludeGroups.includes(weaponGroup) &&
            Math.random() < 0.6 &&
            Date.now() - this.lastPoliceCall > 120000
        ) {
            const coords = GetEntityCoords(player);
            const [street, street2] = GetStreetNameAtCoord(coords[0], coords[1], coords[2]);
            let name = GetStreetNameFromHashKey(street);
            if (street2) {
                name += ' et ' + GetStreetNameFromHashKey(street2);
            }

            const zoneID = GetNameOfZone(coords[0], coords[1], coords[2]);

            if ('ARMYB' != zoneID) {
                const zone = GetLabelText(zoneID);
                this.lastPoliceCall = Date.now();

                TriggerServerEvent('phone:sendSocietyMessage', 'phone:sendSocietyMessage:' + uuidv4(), {
                    anonymous: true,
                    number: '555-POLICE',
                    message: `${zone}: ${getRandomItem(GunShotMessage).replace('${0}', name)}`,
                    position: true,
                    overrideIdentifier: 'System',
                });
            }
        }
        await this.weapon.recoil();
    }

    @OnEvent(ClientEvent.WEAPON_EXPLOSION)
    async onExplosion(x: number, y: number, z: number) {
        const zone = GetLabelText(GetNameOfZone(x, y, z));

        TriggerServerEvent('phone:sendSocietyMessage', 'phone:sendSocietyMessage:' + uuidv4(), {
            anonymous: true,
            number: '555-POLICE',
            message: getRandomItem(ExplosionMessage).replace('${0}', zone),
            position: false,
            overrideIdentifier: 'System',
            pedPosition: JSON.stringify({ x: x, y: y, z: z }),
        });
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

        if (this.weaponHolsterProvider.isInAnimation()) {
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
