import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { InjuriesPerGroup } from '@private/shared/injuries';
import { Once, OnceStep, OnGameEvent } from '@public/core/decorators/event';
import { Tick } from '@public/core/decorators/tick';
import { GameEvent, ServerEvent } from '@public/shared/event';
import { DamageData } from '@public/shared/job/lsmc';
import { PlayerData } from '@public/shared/player';
import { ExtraWeaponName, WeaponName } from '@public/shared/weapons/weapon';

import { PlayerDamageProvider } from '../../player/player.damage.provider';
import { PlayerService } from '../../player/player.service';

@Provider()
export class LSMCDamageProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(PlayerDamageProvider)
    private playerDamageProvider: PlayerDamageProvider;

    private lastHealth = null;
    private lastWeaponHash = 0;
    private lastAttacker = 0;

    private overrideLastDamageType: number = 0;
    private overrideLastDamageBone: number = null;

    @Once(OnceStep.PlayerLoaded)
    public onInit(player: PlayerData) {
        if (player) {
            this.lastHealth = player.metadata.health;
        }
    }

    @OnGameEvent(GameEvent.CEventNetworkEntityDamage)
    getlastinjury(
        victim: number,
        attacker: number,
        unkInt1: number,
        unkBool1: number,
        unkBool2: number,
        isFatal: boolean,
        weaponHash: number
    ) {
        const playerPed = PlayerPedId();
        if (playerPed != victim) {
            return;
        }

        this.lastWeaponHash = weaponHash;
        this.lastAttacker = attacker;
    }

    @Tick(100)
    private weaponInjuriesLoop() {
        if (this.lastHealth === null) {
            return;
        }

        const playerPed = PlayerPedId();
        const health = GetEntityHealth(playerPed);
        const damageQty = this.lastHealth - health;
        const playerData = this.playerService.getPlayer();

        this.lastHealth = health;
        if (damageQty <= 0) {
            return;
        }

        const [damaged, damagedBone] = GetPedLastDamageBone(playerPed);
        const attackerId = GetPlayerServerId(this.lastAttacker);
        let bone = 24818; // Torse
        if (damaged) {
            bone = damagedBone;
        }

        if (this.overrideLastDamageBone != null) {
            bone = this.overrideLastDamageBone;
            this.overrideLastDamageBone = null;
        }

        let damageType = 0;
        let weapon: string = Object.values(WeaponName).find(elem => GetHashKey(elem) == this.lastWeaponHash);
        if (!weapon) {
            weapon = Object.values(ExtraWeaponName).find(elem => GetHashKey(elem) == this.lastWeaponHash);
        }
        if (!weapon) {
            weapon = this.lastWeaponHash.toString();
        }

        if (this.overrideLastDamageType) {
            damageType = this.overrideLastDamageType;
            this.overrideLastDamageType = 0;
        } else {
            damageType = GetWeaponDamageType(this.lastWeaponHash);
        }
        const group = GetWeapontypeGroup(this.lastWeaponHash);
        this.lastWeaponHash = 0;

        if (damageType == 1) {
            return;
        }

        // Damage Type Management

        if (weapon == ExtraWeaponName.FALL) {
            if (IsEntityOnFire(playerPed)) {
                weapon = ExtraWeaponName.WEAPON_FIRE;
                damageType = 6;
            } else if (IsPedSwimmingUnderWater(playerPed)) {
                weapon = ExtraWeaponName.WEAPON_DROWNING;
                damageType = 906;
            } else {
                damageType = 8;
            }
        }

        if (weapon == ExtraWeaponName.RAMMED_BY_CAR || weapon == ExtraWeaponName.RUN_OVER_BY_CAR) {
            damageType = 905;
        }

        if (weapon == ExtraWeaponName.WEAPON_DROWNING || weapon == ExtraWeaponName.DROWNING_IN_VEHICLE) {
            damageType = 906;
            bone = 24818; // Torse
        }

        if (
            weapon == ExtraWeaponName.ROTORS ||
            weapon == WeaponName.DAGGER ||
            weapon == WeaponName.BOTTE ||
            weapon == WeaponName.KNIFE ||
            weapon == WeaponName.MACHETE ||
            weapon == WeaponName.SWITCHBLADE ||
            weapon == WeaponName.BATTLEAXE ||
            weapon == WeaponName.STONE_HATCHET ||
            weapon == ExtraWeaponName.WEAPON_COUGAR ||
            weapon == ExtraWeaponName.WEAPON_ANIMAL ||
            weapon == WeaponName.HATCHET
        ) {
            damageType = 907;
        }

        if (weapon == WeaponName.UNARMED) {
            damageType = 908;
        }

        if (playerData.metadata.thirst <= 0) {
            damageType = 901;
        }

        if (playerData.metadata.hunger <= 0) {
            damageType = 904;
        }

        if (playerData.metadata.alcohol >= 100) {
            damageType = 902;
        }

        if (playerData.metadata.drug >= 100) {
            damageType = 903;
        }

        if (damageType == 3 && InjuriesPerGroup[group] == 2) {
            damageType = 909;
        }

        if (damageType == 3 && InjuriesPerGroup[group] == 3) {
            damageType = 910;
        }

        if (bone == 39317) {
            bone = 31086;
        }

        const data: DamageData = {
            victimId: playerData.citizenid,
            attackerId: attackerId,
            bone: bone,
            damageQty: Math.min(damageQty, 100),
            damageType: damageType,
            isFatal: health < 100 ? true : false,
            weapon: weapon,
        };

        TriggerServerEvent(ServerEvent.LSMC_DAMAGE_ADD, data);
        this.playerDamageProvider.addDamageZone(bone);
    }

    public overrideLastDamage(type: number, bone: number) {
        this.overrideLastDamageType = type;
        this.overrideLastDamageBone = bone ?? 31086;
    }
}
