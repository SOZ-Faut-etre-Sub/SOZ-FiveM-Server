import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { uuidv4, wait } from '@core/utils';
import { Animation, AnimationService } from '@public/client/animation/animation.service';
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
import { BoxZone } from '@public/shared/polyzone/box.zone';
import { rad } from '@public/shared/polyzone/vector';
import { Ok } from '@public/shared/result';

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

    private IsDead = false;

    @Tick(10)
    public async loop() {
        if (this.playerService.isLoggedIn()) {
            const playerPed = PlayerPedId();
            if (IsEntityDead(playerPed)) {
                this.onDeath(playerPed);
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
            } as KillData;

            TriggerEvent('inventory:client:StoreWeapon');
            TriggerEvent(ClientEvent.PLAYER_ON_DEATH, killData);
            TriggerServerEvent(ServerEvent.LSMC_ON_DEATH);
            TriggerServerEvent(ServerEvent.LSMC_ON_DEATH2, killData);

            let ragdollTime = 20000;
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

            this.animationService.purge();
            ClearPedTasks(PlayerPedId());
            SetEntityInvincible(player, true);
            SetBlockingOfNonTemporaryEvents(player, true);
            SetEntityHealth(player, GetEntityMaxHealth(player));

            LocalPlayer.state.set('inv_busy', false, true);

            const status = this.playerService.getPlayer().metadata.injuries_count < 10 ? 'du coma' : 'de ton décès';

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
        if (IsPedInAnyVehicle(ped, true)) {
            if (!IsEntityPlayingAnim(ped, deathVehcleAnim.base.dictionary, deathVehcleAnim.base.name, 3)) {
                this.animationService.purge();
                this.animationService.playAnimation(deathVehcleAnim);
            }
        } else {
            if (!IsEntityPlayingAnim(ped, deathAnim.base.dictionary, deathAnim.base.name, 3)) {
                this.animationService.purge();
                this.animationService.playAnimation(deathAnim);
            }
        }
    }

    @Tick(TickInterval.EVERY_FRAME)
    public async controlLoop() {
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

            ClearPedTasks(ped);
            this.animationService.purge();
            await wait(500);
            this.animationService.playAnimation({
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
            });
        }
        await wait(2000);

        FreezeEntityPosition(ped, false);

        DoScreenFadeIn(1000);
    }

    private loc(pos: number[], w: number): number[] {
        return [pos[0] - Math.cos(rad(w)), pos[1] - Math.sin(rad(w)), (w + 270) % 360];
    }

    @OnEvent(ClientEvent.LSMC_REAMINATE, false)
    public async reviveTarget(target: number) {
        const coord = GetEntityCoords(target);
        const heading = GetEntityHeading(target);
        const array = this.loc(coord, heading);
        await this.animationService.walkToCoords([array[0], array[1], coord[2], array[2]], 3000);

        TriggerServerEvent(ServerEvent.LSMC_REVIVE, GetPlayerServerId(NetworkGetPlayerIndexFromPed(target)));
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
    public injuryDeath(value: boolean) {
        if (value && LocalPlayer.state.isdead) {
            this.soundService.play('death', 0.1);
        }
    }
}
