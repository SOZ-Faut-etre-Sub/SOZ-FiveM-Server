import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { uuidv4, wait } from '@core/utils';
import { PlayerTalentService } from '@private/client/player/player.talent.service';
import { AnimationService } from '@public/client/animation/animation.service';
import { Notifier } from '@public/client/notifier';
import { InputService } from '@public/client/nui/input.service';
import { NuiMenu } from '@public/client/nui/nui.menu';
import { PlayerInOutService } from '@public/client/player/player.inout.service';
import { PlayerService } from '@public/client/player/player.service';
import { ProgressService } from '@public/client/progress.service';
import { SoundService } from '@public/client/sound.service';
import { VehicleSeatbeltProvider } from '@public/client/vehicle/vehicle.seatbelt.provider';
import { WeaponDrawingProvider } from '@public/client/weapon/weapon.drawing.provider';
import { OnEvent } from '@public/core/decorators/event';
import { Tick, TickInterval } from '@public/core/decorators/tick';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { BedLocations, FailoverLocation, KillData, KillerVehData, PatientClothes } from '@public/shared/job/lsmc';
import { Monitor } from '@public/shared/monitor';
import { BoxZone } from '@public/shared/polyzone/box.zone';
import { rad } from '@public/shared/polyzone/vector';
import { Ok } from '@public/shared/result';

import { Animation } from '../../../shared/animation';

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

    @Inject(ProgressService)
    private progressService: ProgressService;

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

    @Inject(Monitor)
    public monitor: Monitor;

    private IsDead = false;
    private hungerThristDeath = false;

    @Tick(10)
    public async deathLoop() {
        if (this.playerService.isLoggedIn()) {
            const playerPed = PlayerPedId();
            if (IsEntityDead(playerPed)) {
                await this.onDeath(playerPed);
            }
            if (this.IsDead) {
                this.animationCheck(playerPed);
            }
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

            TriggerScreenblurFadeIn(5);
            StartScreenEffect('DeathFailOut', 0, true);

            this.nuiMenu.closeAll(false);

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
                killpos: GetEntityCoords(player),
                killerveh: killVehData,
                ejection: Date.now() - this.vehicleSeatbeltProvider.getLastEjectTime() < 10000,
                hungerThristDeath: this.hungerThristDeath,
            } as KillData;
            this.hungerThristDeath = false;

            LocalPlayer.state.set('isdead', true, true);
            TriggerEvent('inventory:client:StoreWeapon');
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

            LocalPlayer.state.set('inv_busy', false, true);

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
                .then(reasonMort => TriggerServerEvent(ServerEvent.LSMC_SET_DEATH_REASON, reasonMort));
        }
    }

    private animationCheck(ped: number) {
        const anim = IsPedInAnyVehicle(ped, true) ? deathVehcleAnim : deathAnim;

        if (!IsEntityPlayingAnim(ped, anim.base.dictionary, anim.base.name, 3)) {
            this.animationService.playAnimation(anim, {
                clearTasksBefore: true,
            });
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
                const reviveAnimPromise = this.animationService.playAnimation(reviveAnim);
                await wait(20000);

                this.animationService.stop();

                await reviveAnimPromise;
            }
        }

        SetEntityHealth(player, 200);
        ClearPedBloodDamage(player);
        SetPlayerSprint(PlayerId(), true);

        TriggerServerEvent(ServerEvent.PLAYER_SET_CURRENT_DISEASE, false);

        TriggerEvent(ClientEvent.PLAYER_REFRESH_WALK_STYLE);

        if (uniteHU) {
            this.uniteHU(uniteHUBed);
        }

        this.notifier.notify('Vous êtes réanimé!');
    }

    private async uniteHU(uniteHUBed: number) {
        const ped = PlayerPedId();
        const player = this.playerService.getPlayer();

        this.playerService.setTempClothes(PatientClothes[player.skin.Model.Hash]['Patient']);
        this.weaponDrawingProvider.refreshDrawWeapons();
        FreezeEntityPosition(ped, true);

        if (uniteHUBed == -1) {
            ClearPedTasksImmediately(ped);
            SetEntityCoords(
                ped,
                FailoverLocation[0],
                FailoverLocation[1],
                FailoverLocation[2],
                false,
                false,
                false,
                false
            );
            SetEntityHeading(ped, FailoverLocation[3]);
        } else {
            SetEntityCoords(
                ped,
                BedLocations[uniteHUBed][0],
                BedLocations[uniteHUBed][1],
                BedLocations[uniteHUBed][2] + 0.5,
                false,
                false,
                false,
                false
            );
            SetEntityHeading(ped, 320);

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

        const reviveAnimPromise = this.animationService.playAnimation(reviveAnimDoc);

        await wait(20000);

        this.animationService.stop();

        await reviveAnimPromise;
    }

    @OnEvent(ClientEvent.LSMC_CALL, false)
    public call() {
        const ped = PlayerPedId();
        const coords = GetEntityCoords(ped);
        const street = GetStreetNameAtCoord(coords[0], coords[1], coords[2])[0];
        const streetname = GetStreetNameFromHashKey(street);

        TriggerServerEvent('phone:sendSocietyMessage', 'phone:sendSocietyMessage:' + uuidv4(), {
            anonymous: true,
            number: '555-LSMC',
            message: `Besoin d'aide vers ${streetname}`,
            position: true,
        });
        this.notifier.notify('Vous avez appelé le ~g~LSMC~s~ !', 'info');
    }

    @OnEvent(ClientEvent.INJURY_DEATH)
    public injuryDeath(value: string) {
        if (value.length && LocalPlayer.state.isdead) {
            this.soundService.play('death', 0.1);
        }
    }

    @Tick(5000)
    public async hungerThirstCheckLoop() {
        if (LocalPlayer.state.isLoggedIn) {
            const playerData = this.playerService.getPlayer();

            if (!playerData || playerData.metadata.isdead) {
                return;
            }

            if (
                playerData.metadata.hunger <= 0 ||
                playerData.metadata['thirst'] <= 0 ||
                playerData.metadata['alcohol'] >= 100
            ) {
                const ped = PlayerPedId();

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

                    this.hungerThristDeath = true;
                    SetEntityHealth(ped, 0);
                }
            }
        }
    }
}
