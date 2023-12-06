import { Once, OnceStep, OnEvent, OnGameEvent } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { Tick, TickInterval } from '@core/decorators/tick';
import { emitRpc } from '@core/rpc';
import { uuidv4, wait } from '@public/core/utils';
import { Control } from '@public/shared/input';
import { Vector3 } from '@public/shared/polyzone/vector';
import { getRandomItem } from '@public/shared/random';

import { ClientEvent, GameEvent, ServerEvent } from '../../shared/event';
import { InventoryItem } from '../../shared/item';
import { RpcServerEvent } from '../../shared/rpc';
import { VehicleSeat } from '../../shared/vehicle/vehicle';
import { ExplosionMessage, GlobalWeaponConfig, GunShotMessage, WeaponName } from '../../shared/weapons/weapon';
import { InventoryManager } from '../inventory/inventory.manager';
import { PhoneService } from '../phone/phone.service';
import { PlayerService } from '../player/player.service';
import { ProgressService } from '../progress.service';
import { VoipRadioProvider } from '../voip/voip.radio.provider';
import { WeaponDrawingProvider } from './weapon.drawing.provider';
import { WeaponHolsterProvider } from './weapon.holster.provider';
import { WeaponService } from './weapon.service';

const messageExcludeGroups = [
    GetHashKey('GROUP_FIREEXTINGUISHER'),
    GetHashKey('GROUP_THROWN'),
    GetHashKey('GROUP_STUNGUN'),
];

const weaponUnarmed = GetHashKey('WEAPON_UNARMED');
const weaponPetrolCan = GetHashKey('WEAPON_PETROLCAN');

const messageExclude = [GetHashKey('weapon_musket'), GetHashKey('weapon_raypistol'), GetHashKey('weapon_pumpshotgun')];
const NonLethalWeapons = [GetHashKey('weapon_pumpshotgun')];

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

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(VoipRadioProvider)
    private voipRadioProvider: VoipRadioProvider;

    @Inject(WeaponHolsterProvider)
    private weaponHolsterProvider: WeaponHolsterProvider;

    @Inject(PlayerService)
    private playerService: PlayerService;

    private lastPoliceCall = 0;

    @Once(OnceStep.PlayerLoaded)
    async setupWeaponDamageModifier() {
        SetWeaponsNoAutoswap(true);

        await this.weapon.clear();

        SetWeaponDamageModifier(WeaponName.UNARMED, 0.5);
        SetWeaponDamageModifier(WeaponName.BAT, 0.2);
        SetWeaponDamageModifier(WeaponName.PICKAXE, 0.2);
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

    @OnEvent(ClientEvent.WEAPON_USE_WEAPON_NAME)
    async onUseWeaponName(name: string | null) {
        const item = this.inventoryManager.getItems().find(i => i.name == name && i.type == 'weapon');

        this.onUseWeapon(item);
        this.weaponDrawingProvider.onUseWeapon(item);
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
        if (this.playerService.getState().isInventoryBusy) {
            return;
        }

        this.playerService.updateState({ isInventoryBusy: true });
        await this.onUseAmmoLoop(ammoName);

        this.playerService.updateState({ isInventoryBusy: false });
    }

    @OnEvent(ClientEvent.WEAPON_CLEAR_WEAPON)
    async onClearWeapon() {
        await this.weapon.clear();
    }

    private async onUseAmmoLoop(ammoName: string) {
        if (!this.weapon.getCurrentWeapon()) {
            return;
        }

        const weapon = await emitRpc<InventoryItem | null>(
            RpcServerEvent.WEAPON_USE_AMMO,
            this.weapon.getCurrentWeapon().slot,
            ammoName,
            this.weapon.getMaxAmmoInClip()
        );

        if (!weapon) {
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
                allowExistingAnimation: true,
            }
        );

        TaskReloadWeapon(PlayerPedId(), true);

        if (weapon) {
            await this.weapon.set(weapon);
        }

        if (weapon.metadata.ammo < this.weapon.getMaxAmmoInClip() * GlobalWeaponConfig.MaxAmmoRefill(weapon.name)) {
            await this.onUseAmmoLoop(ammoName);
        }
    }

    @Tick(TickInterval.EVERY_FRAME)
    async onTick() {
        const player = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(player, false);

        DisableControlAction(0, Control.SelectWeaponUnarmed, true);
        DisableControlAction(0, Control.SelectWeaponMelee, true);
        DisableControlAction(0, Control.SelectWeaponHandgun, true);
        DisableControlAction(0, Control.SelectWeaponShotgun, true);
        DisableControlAction(0, Control.SelectWeaponSmg, true);
        DisableControlAction(0, Control.SelectWeaponAutoRifle, true);
        DisableControlAction(0, Control.SelectWeaponSniper, true);
        DisableControlAction(0, Control.SelectWeaponHeavy, true);
        DisableControlAction(0, Control.SelectWeaponSpecial, true);

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
            GetPedInVehicleSeat(vehicle, VehicleSeat.Driver) === player &&
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
            Date.now() - this.lastPoliceCall > 60000
        ) {
            const coords = GetEntityCoords(player);

            const zoneID = GetNameOfZone(coords[0], coords[1], coords[2]);

            if ('ARMYB' != zoneID && 'ISHEIST' != zoneID) {
                const zone = GetLabelText(zoneID);
                const [street, street2] = GetStreetNameAtCoord(coords[0], coords[1], coords[2]);

                const name = `${GetStreetNameFromHashKey(street)}${
                    street2 ? ` et ${GetStreetNameFromHashKey(street2)}` : ''
                }`;
                const nameHtml = `<span {class}>${GetStreetNameFromHashKey(street)}</span>${
                    street2 ? ` et <span {class}>${GetStreetNameFromHashKey(street2)}</span>` : ''
                }`;

                this.lastPoliceCall = Date.now();

                const message = getRandomItem(GunShotMessage);

                TriggerServerEvent('phone:sendSocietyMessage', 'phone:sendSocietyMessage:' + uuidv4(), {
                    anonymous: true,
                    number: '555-POLICE',
                    message: `${zone}: ${message.replace('${0}', name)}`,
                    htmlMessage: `${zone}: ${message.replace('${0}', nameHtml)}`,
                    position: true,
                    info: { type: 'shooting' },
                    overrideIdentifier: 'System',
                });
            }
        }
        await this.weapon.recoil();
    }

    @OnEvent(ClientEvent.WEAPON_EXPLOSION)
    async onExplosion(x: number, y: number, z: number) {
        const zoneID = GetNameOfZone(x, y, z);
        if (zoneID == 'ISHEIST') {
            return;
        }
        const zone = GetLabelText(zoneID);

        const message = getRandomItem(ExplosionMessage);

        TriggerServerEvent('phone:sendSocietyMessage', 'phone:sendSocietyMessage:' + uuidv4(), {
            anonymous: true,
            number: '555-POLICE',
            message: message.replace('${0}', zone),
            htmlMessage: message.replace('${0}', `<span {class}>${zone}</span>`),
            position: false,
            info: { type: 'explosion' },
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

        if (this.voipRadioProvider.isRadioOpen()) {
            await this.weapon.clear();
            await this.weaponDrawingProvider.refreshDrawWeapons();
        }

        if (IsEntityPlayingAnim(ped, 'missfbi4prepp1', '_idle_garbage_man', 3)) {
            await this.weapon.clear();
            await this.weaponDrawingProvider.refreshDrawWeapons();
        }

        if (GetPedInVehicleSeat(vehicle, VehicleSeat.Driver) === ped && weaponDrawable) {
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

    @OnGameEvent(GameEvent.CEventNetworkEntityDamage)
    public gameEventTriggered(
        victim: number,
        attacker: number,
        unkInt1: number,
        unkBool1: number,
        unkBool2: number,
        isFatal: boolean,
        weaponHash: number
    ) {
        const playerPed = PlayerPedId();
        if (playerPed == victim && NonLethalWeapons.includes(weaponHash) && !IsPedRagdoll(playerPed)) {
            this.weapon.clear();
            SetPedToRagdoll(playerPed, 10000, 10000, 0, false, false, false);
            const attackerCoords = GetEntityCoords(attacker);
            const victimCoords = GetEntityCoords(victim);
            const vec = [
                victimCoords[0] - attackerCoords[0],
                victimCoords[1] - attackerCoords[1],
                victimCoords[2] - attackerCoords[2],
            ] as Vector3;
            const magnitude = Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2]);
            SetEntityVelocity(playerPed, (2 * vec[0]) / magnitude, (2 * vec[1]) / magnitude, (2 * vec[2]) / magnitude);
        }
    }

    @Tick(1)
    public async onStunnedTick() {
        const playerPed = PlayerPedId();
        if (IsPedBeingStunned(playerPed, 0)) {
            SetPedMinGroundTimeForStungun(playerPed, Math.round(Math.random() * 3000 + 4000));
        } else {
            await wait(1000);
        }
    }

    @Tick()
    public async onPetrolCanTick() {
        const ped = PlayerPedId();
        const weapon = GetSelectedPedWeapon(ped);
        if (weapon != weaponUnarmed) {
            if (IsPedArmed(ped, 6)) {
                DisableControlAction(1, 140, true);
                DisableControlAction(1, 141, true);
                DisableControlAction(1, 142, true);
            }

            if (weapon == weaponPetrolCan) {
                if (IsPedShooting(ped)) {
                    SetPedInfiniteAmmo(ped, true, weaponPetrolCan);
                }
            }
        } else {
            await wait(500);
        }
    }
}
