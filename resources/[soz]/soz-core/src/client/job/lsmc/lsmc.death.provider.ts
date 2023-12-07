import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { uuidv4, wait } from '@core/utils';
import { PlayerTalentService } from '@private/client/player/player.talent.service';
import { AnimationService } from '@public/client/animation/animation.service';
import { BlipFactory } from '@public/client/blip';
import { Monitor } from '@public/client/monitor/monitor';
import { Notifier } from '@public/client/notifier';
import { InputService } from '@public/client/nui/input.service';
import { NuiMenu } from '@public/client/nui/nui.menu';
import { PhoneService } from '@public/client/phone/phone.service';
import { PlayerInOutService } from '@public/client/player/player.inout.service';
import { PlayerService } from '@public/client/player/player.service';
import { PlayerWalkstyleProvider } from '@public/client/player/player.walkstyle.provider';
import { SoundService } from '@public/client/sound.service';
import { VehicleSeatbeltProvider } from '@public/client/vehicle/vehicle.seatbelt.provider';
import { WeaponDrawingProvider } from '@public/client/weapon/weapon.drawing.provider';
import { OnEvent } from '@public/core/decorators/event';
import { Tick, TickInterval } from '@public/core/decorators/tick';
import { emitRpc } from '@public/core/rpc';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import {
    BedLocations,
    FailoverLocationName,
    getBedName,
    KillData,
    KillerVehData,
    PatientClothes,
} from '@public/shared/job/lsmc';
import { BoxZone } from '@public/shared/polyzone/box.zone';
import { rad } from '@public/shared/polyzone/vector';
import { Ok } from '@public/shared/result';
import { RpcServerEvent } from '@public/shared/rpc';

import { Animation } from '../../../shared/animation';
import { PlayerZombieProvider } from '../../player/player.zombie.provider';
import { VoipService } from '../../voip/voip.service';

const deathAnim: Animation = {
    base: {
        dictionary: 'dead',
        name: 'dead_a',
        blendInSpeed: 8.0,
        blendOutSpeed: 8.0,
        options: {
            repeat: true,
        },
    },
};

const deathVehcleAnim: Animation = {
    base: {
        dictionary: 'veh@low@front_ps@idle_duck',
        name: 'sit',
        blendInSpeed: 8.0,
        blendOutSpeed: 8.0,
        options: {
            repeat: true,
            onlyUpperBody: true,
            enablePlayerControl: true,
        },
    },
};

const reviveAnim: Animation = {
    enter: {
        dictionary: 'mini@cpr@char_b@cpr_def',
        name: 'cpr_intro',
        duration: 15000.0,
    },
    base: {
        dictionary: 'mini@cpr@char_b@cpr_str',
        name: 'cpr_pumpchest',
        duration: 5000.0,
        options: {
            cancellable: false,
            repeat: true,
        },
    },
    exit: {
        dictionary: 'mini@cpr@char_b@cpr_str',
        name: 'cpr_success',
        duration: 25000.0,
    },
};

const reviveAnimDoc: Animation = {
    enter: {
        dictionary: 'mini@cpr@char_a@cpr_def',
        name: 'cpr_intro',
        duration: 15000.0,
    },
    base: {
        dictionary: 'mini@cpr@char_a@cpr_str',
        name: 'cpr_pumpchest',
        duration: 5000.0,
        options: {
            cancellable: false,
            repeat: true,
        },
    },
    exit: {
        dictionary: 'mini@cpr@char_a@cpr_str',
        name: 'cpr_success',
        duration: 25000.0,
    },
};

@Provider()
export class LSMCDeathProvider {
    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(InputService)
    private inputService: InputService;

    @Inject(AnimationService)
    private animationService: AnimationService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(PlayerInOutService)
    private playerInOutService: PlayerInOutService;

    @Inject(VehicleSeatbeltProvider)
    private vehicleSeatbeltProvider: VehicleSeatbeltProvider;

    @Inject(SoundService)
    public soundService: SoundService;

    @Inject(WeaponDrawingProvider)
    private weaponDrawingProvider: WeaponDrawingProvider;

    @Inject(PlayerTalentService)
    private playerTalentService: PlayerTalentService;

    @Inject(PlayerWalkstyleProvider)
    private playerWalkstyleProvider: PlayerWalkstyleProvider;

    @Inject(PhoneService)
    private phoneService: PhoneService;

    @Inject(Monitor)
    public monitor: Monitor;

    @Inject(VoipService)
    public voipService: VoipService;

    @Inject(PlayerZombieProvider)
    public playerZombieProvider: PlayerZombieProvider;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    private IsDead = false;
    private doFeeze = false;
    private hungerThristDeath = false;
    private radioactiveBeerEffect = false;

    @Tick(10)
    public async deathLoop() {
        if (this.playerService.isLoggedIn()) {
            const playerPed = PlayerPedId();
            if (IsEntityDead(playerPed)) {
                await this.onDeath(playerPed);
            }
            this.doFeeze = this.IsDead;
            if (this.IsDead) {
                await this.animationCheck(playerPed);
            }
        }
    }

    @Tick(10000)
    public async deathResyncLoop() {
        if (this.doFeeze) {
            const playerPed = PlayerPedId();
            FreezeEntityPosition(playerPed, true);
            await wait(100);
            FreezeEntityPosition(playerPed, false);
        }
    }

    private getPedVehicleSeat(player: number) {
        const vehicle = GetVehiclePedIsIn(player, false);
        for (let i = -2; i < GetVehicleMaxNumberOfPassengers(vehicle); i++) {
            if (GetPedInVehicleSeat(vehicle, i) == player) {
                return i;
            }
        }
        return -2;
    }

    private async onDeath(player: number) {
        if (!this.IsDead) {
            this.IsDead = true;

            this.nuiMenu.closeAll(false);
            this.voipService.mutePlayer(true);

            // Skip death process if player is zombie
            if (this.playerZombieProvider.isZombie() || this.playerZombieProvider.isTransforming()) {
                await this.playerZombieProvider.handleOnDeath();

                this.IsDead = false;

                return;
            }

            TriggerScreenblurFadeIn(5);
            StartScreenEffect('DeathFailOut', 0, true);

            const playerid = PlayerId();
            let [killer, killerweapon] = NetworkGetEntityKillerOfPlayer(playerid);

            if (!killerweapon) {
                killerweapon = GetPedCauseOfDeath(player);
            }
            if (killer == -1) {
                killer = GetPedSourceOfDeath(player);
            }

            const killerentitytype = GetEntityType(killer);
            let killertype = -1;
            let killVehData: KillerVehData;
            if (killerentitytype == 1) {
                killertype = GetPedType(killer);
                const veh = GetVehiclePedIsUsing(killer);
                if (veh) {
                    killVehData = {
                        name: GetDisplayNameFromVehicleModel(GetEntityModel(veh)),
                        seat: this.getPedVehicleSeat(killer),
                        plate: GetVehicleNumberPlateText(veh),
                    };
                }
            }

            let killerid = NetworkGetPlayerIndexFromPed(killer);
            if (killer != playerid && killerid && NetworkIsPlayerActive(killerid)) {
                killerid = GetPlayerServerId(killerid);
            } else {
                killerid = -1;
            }

            const killData = {
                killerid: killerid,
                killertype: killertype,
                killerentitytype: killerentitytype,
                weaponhash: killerweapon,
                weapondamagetype: GetWeaponDamageType(killerweapon),
                weapongroup: GetWeapontypeGroup(killerweapon),
                killpos: GetEntityCoords(player),
                killerveh: killVehData,
                ejection: Date.now() - this.vehicleSeatbeltProvider.getLastEjectTime() < 10000,
                hungerThristDeath: this.hungerThristDeath,
            } as KillData;
            this.hungerThristDeath = false;

            this.playerService.updateState({
                isDead: true,
            });

            TriggerEvent(ClientEvent.PLAYER_ON_DEATH, killData);
            TriggerServerEvent(ServerEvent.LSMC_ON_DEATH);
            TriggerServerEvent(ServerEvent.LSMC_ON_DEATH2, killData);

            let ragdollTime = 20000;
            await wait(1000);
            while ((GetEntitySpeed(player) > 0.5 || IsPedRagdoll(player)) && ragdollTime > 0) {
                await wait(10);
                ragdollTime -= 10;
            }

            const pos = GetEntityCoords(player);
            const heading = GetEntityHeading(player);

            const veh = GetVehiclePedIsIn(player, false);
            if (veh) {
                const seat = this.getPedVehicleSeat(player);
                NetworkResurrectLocalPlayer(pos[0], pos[1], pos[2], heading, true, false);
                SetPedIntoVehicle(player, veh, seat);
            } else {
                NetworkResurrectLocalPlayer(pos[0], pos[1], pos[2] + 0.5, heading, true, false);
            }

            this.animationService.stop();
            ClearPedTasks(PlayerPedId());
            SetEntityInvincible(player, true);
            SetBlockingOfNonTemporaryEvents(player, true);
            SetEntityHealth(player, GetEntityMaxHealth(player));

            this.playerService.updateState({
                isInventoryBusy: false,
            });

            if (this.phoneService.isPhoneVisible()) {
                this.phoneService.setPhoneFocus(false);
            }

            const playerMetadata = this.playerService.getPlayer().metadata;
            const injuries = playerMetadata.injuries_count;
            const status =
                (playerMetadata.rp_death && !killData.hungerThristDeath) ||
                injuries >= this.playerTalentService.getMaxInjuries()
                    ? 'de ton décès'
                    : 'du coma';

            this.inputService
                .askInput(
                    {
                        title: `Explique la raison ${status}, celle-ci sera lue par les médecins lorsqu'ils te prendront en charge :`,
                        maxCharacters: 200,
                        defaultValue: '',
                    },
                    () => {
                        return Ok(true);
                    }
                )
                .then(reasonMort => {
                    TriggerServerEvent(ServerEvent.LSMC_SET_DEATH_REASON, reasonMort);
                    if (this.phoneService.isPhoneVisible()) {
                        this.phoneService.setPhoneFocus(true);
                    }
                });
        }
    }

    private async animationCheck(ped: number) {
        const anim = IsPedInAnyVehicle(ped, true) ? deathVehcleAnim : deathAnim;

        if (!IsEntityPlayingAnim(ped, anim.base.dictionary, anim.base.name, 3)) {
            ClearPedTasks(ped);
            ClearPedSecondaryTask(ped);
            this.animationService.playAnimation(anim);
            await wait(500);
        }
    }

    @Tick(TickInterval.EVERY_FRAME)
    public async controlDeathLoop() {
        if (!this.IsDead) {
            await wait(1000);
            return;
        }

        DisableAllControlActions(0);
        EnableControlAction(0, 1, true);
        EnableControlAction(0, 2, true);
        EnableControlAction(0, 245, true);
        EnableControlAction(0, 38, true);
        EnableControlAction(0, 0, true);
        EnableControlAction(0, 322, true);
        EnableControlAction(0, 288, true);
        EnableControlAction(0, 213, true);
        EnableControlAction(0, 249, true);
        EnableControlAction(0, 46, true);
        EnableControlAction(0, 200, true);
    }

    @OnEvent(ClientEvent.LSMC_REVIVE)
    public async revive(skipanim: boolean, uniteHU: boolean, uniteHUBed: number) {
        const player = PlayerPedId();

        if (uniteHU) {
            DoScreenFadeOut(1000);
            await wait(1000);
        }

        StopScreenEffect('DeathFailOut');
        if (this.IsDead) {
            this.IsDead = false;
            SetEntityInvincible(player, false);
            SetBlockingOfNonTemporaryEvents(player, false);

            if (IsEntityDead(player)) {
                const pos = GetEntityCoords(player);
                const heading = GetEntityHeading(player);
                NetworkResurrectLocalPlayer(pos[0], pos[1], pos[2], heading, true, false);
            }

            if (!skipanim) {
                await this.animationService.playAnimation(reviveAnim);
            }
        }

        FreezeEntityPosition(PlayerPedId(), false);
        SetEntityHealth(player, 200);
        ClearPedBloodDamage(player);
        SetPlayerSprint(PlayerId(), true);

        this.voipService.mutePlayer(false);

        TriggerServerEvent(ServerEvent.PLAYER_SET_CURRENT_DISEASE, false);

        this.playerWalkstyleProvider.updateWalkStyle('injury', null);

        if (uniteHU) {
            this.uniteHU(uniteHUBed);
        }

        this.notifier.notify('Vous êtes réanimé!');
    }

    private async uniteHU(uniteHUBed: number) {
        const ped = PlayerPedId();
        const player = this.playerService.getPlayer();

        this.monitor.publish('lsmx_uhu', {}, {});

        this.playerService.setTempClothes(PatientClothes[player.skin.Model.Hash]['Patient']);
        this.weaponDrawingProvider.refreshDrawWeapons();
        FreezeEntityPosition(ped, true);

        if (uniteHUBed == -1) {
            ClearPedTasksImmediately(ped);
            await emitRpc(RpcServerEvent.PLAYER_TELEPORT, FailoverLocationName);
        } else {
            await emitRpc(RpcServerEvent.PLAYER_TELEPORT, getBedName(uniteHUBed));

            this.playerInOutService.add(
                'UniteHU',
                new BoxZone(BedLocations[uniteHUBed], 3, 3, { heading: 320 }),
                isInside => {
                    if (isInside === false) {
                        TriggerServerEvent(ServerEvent.LSMC_FREE_BED);
                        this.playerInOutService.remove('UniteHU');
                    }
                }
            );

            await wait(2000);

            this.animationService.playAnimation(
                {
                    base: {
                        dictionary: 'anim@gangops@morgue@table@',
                        name: 'body_search',
                        blendInSpeed: 8.0,
                        blendOutSpeed: 8.0,
                        options: {
                            cancellable: true,
                            repeat: true,
                        },
                    },
                },
                {
                    clearTasksBefore: true,
                }
            );
        }
        await wait(2000);

        FreezeEntityPosition(ped, false);

        DoScreenFadeIn(1000);
    }

    private loc(pos: number[], w: number): number[] {
        return [pos[0] - Math.cos(rad(w)), pos[1] - Math.sin(rad(w)), (w + 270) % 360];
    }

    public async reviveTarget(target: number, bloodbag: boolean) {
        const coord = GetEntityCoords(target);
        const heading = GetEntityHeading(target);
        const array = this.loc(coord, heading);
        await this.animationService.walkToCoords([array[0], array[1], coord[2], array[2]], 3000);

        TriggerServerEvent(
            ServerEvent.LSMC_REVIVE,
            GetPlayerServerId(NetworkGetPlayerIndexFromPed(target)),
            false,
            false,
            bloodbag
        );
        TriggerServerEvent(ServerEvent.LSMC_REVIVE2, GetPlayerServerId(NetworkGetPlayerIndexFromPed(target)));
        this.monitor.publish(
            bloodbag ? 'job_lsmc_revive_bloodbag' : 'job_lsmc_revive_defibrillator',
            {},
            {
                target_source: GetPlayerServerId(NetworkGetPlayerIndexFromPed(target)),
                position: GetEntityCoords(target),
            },
            true
        );

        await this.animationService.playAnimation(reviveAnimDoc);
    }

    @OnEvent(ClientEvent.LSMC_CALL, false)
    public call() {
        const playerPed = PlayerPedId();
        const coords = GetEntityCoords(playerPed);
        const [street, street2] = GetStreetNameAtCoord(coords[0], coords[1], coords[2]);
        const zoneID = GetNameOfZone(coords[0], coords[1], coords[2]);

        const name = street
            ? `${GetStreetNameFromHashKey(street)}${street2 ? ` et ${GetStreetNameFromHashKey(street2)}` : ''}`
            : GetLabelText(zoneID);

        TriggerServerEvent('phone:sendSocietyMessage', 'phone:sendSocietyMessage:' + uuidv4(), {
            anonymous: true,
            number: '555-LSMC',
            message: `Besoin d'aide vers ${name}`,
            position: true,
        });
        TriggerServerEvent(ServerEvent.LSMC_NEW_URGENCY);
        this.notifier.notify('Vous avez appelé le ~g~LSMC~s~ !', 'info');
    }

    @OnEvent(ClientEvent.INJURY_DEATH)
    public injuryDeath(value: string) {
        if (value.length && this.playerService.getState().isDead) {
            this.soundService.play('death', 0.1);
        }
    }

    public enableRadioactiveBeerEffect() {
        this.radioactiveBeerEffect = true;
    }

    @Tick(5000)
    public async hungerThirstCheckLoop() {
        const playerData = this.playerService.getPlayer();

        if (!playerData || playerData.metadata.isdead) {
            return;
        }

        const ped = PlayerPedId();
        if (
            playerData.metadata.hunger <= 0 ||
            playerData.metadata.thirst <= 0 ||
            playerData.metadata.alcohol >= 100 ||
            playerData.metadata.drug >= 100
        ) {
            if (GetEntityHealth(ped) > 0) {
                ClearPedTasksImmediately(ped);
                await this.animationService.playAnimation({
                    base: {
                        dictionary: 'move_m@_idles@out_of_breath',
                        name: 'idle_c',
                        blendInSpeed: 8.0,
                        blendOutSpeed: -8.0,
                        duration: 8000,
                    },
                });

                this.hungerThristDeath = playerData.metadata.hunger <= 0 || playerData.metadata.thirst <= 0;
                SetEntityHealth(ped, 0);
            }
        }

        const health = GetEntityHealth(ped);
        if (this.radioactiveBeerEffect && health > 0) {
            const newHealth = health - 10;
            if (newHealth < 100) {
                this.hungerThristDeath = true;
                this.radioactiveBeerEffect = false;
            }
            SetEntityHealth(ped, newHealth);
        }
    }

    @OnEvent(ClientEvent.LSMC_NEW_URGENCY)
    public async newUrgency(player: number, coords: number[]) {
        this.blipFactory.create(`deathpoint_${player}`, {
            name: 'Coma',
            sprite: 153,
            color: 1,
            coords: {
                x: coords[0],
                y: coords[1],
                z: coords[2],
            },
            scale: 1.5,
        });
    }

    @OnEvent(ClientEvent.LSMC_END_URGENCY)
    public async playerRevived(player: number) {
        this.blipFactory.remove(`deathpoint_${player}`);
    }
}
