import { Animation, AnimationService } from '@public/client/animation/animation.service';
import { Notifier } from '@public/client/notifier';
import { NuiMenu } from '@public/client/nui/nui.menu';
import { PlayerInOutService } from '@public/client/player/player.inout.service';
import { PlayerService } from '@public/client/player/player.service';
import { ProgressService } from '@public/client/progress.service';
import { OnEvent } from '@public/core/decorators/event';
import { Tick, TickInterval } from '@public/core/decorators/tick';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { BedLocations, FailoverLocation, PatientClothes } from '@public/shared/job/lsmc';
import { BoxZone } from '@public/shared/polyzone/box.zone';

import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { uuidv4, wait } from '../../../core/utils';
import { Ok } from '../../../shared/result';
import { InputService } from '../../nui/input.service';

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

    private async onDeath(player: number) {
        if (!this.IsDead) {
            this.IsDead = true;

            TriggerScreenblurFadeIn(5);
            StartScreenEffect('DeathFailOut', 0, true);

            this.nuiMenu.closeAll(false);

            TriggerEvent('inventory:client:StoreWeapon');
            TriggerEvent(ClientEvent.PLAYER_ON_DEATH);
            TriggerServerEvent(ServerEvent.LSMC_ON_DEATH);

            let ragdollTime = 20000;
            while ((GetEntitySpeed(player) > 0.5 || IsPedRagdoll(player)) && ragdollTime > 0) {
                await wait(10);
                ragdollTime -= 10;
            }

            const pos = GetEntityCoords(player);
            const heading = GetEntityHeading(player);

            const veh = GetVehiclePedIsIn(player, false);
            if (veh) {
                const vehseats = GetVehicleModelNumberOfSeats(GetEntityModel(veh));
                for (let i = -1; i < vehseats - 1; i++) {
                    const occupant = GetPedInVehicleSeat(veh, i);
                    if (occupant == player) {
                        NetworkResurrectLocalPlayer(pos[0], pos[1], pos[2], heading, true, false);
                        SetPedIntoVehicle(player, veh, i);
                        break;
                    }
                }
            } else {
                NetworkResurrectLocalPlayer(pos[0], pos[1], pos[2] + 0.5, heading, true, false);
            }

            this.animationService.purge();
            ClearPedTasks(PlayerPedId());
            SetEntityInvincible(player, true);
            SetBlockingOfNonTemporaryEvents(player, true);
            SetEntityHealth(player, GetEntityMaxHealth(player));

            LocalPlayer.state.set('inv_busy', false, true);

            this.inputService
                .askInput(
                    {
                        title: "Explique la raison du coma, celle-ci sera lue par les médecins lorsqu'ils te relèveront :",
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

    private rad(x: number): number {
        return (x * Math.PI) / 180;
    }

    private loc(pos: number[], w: number): number[] {
        return [pos[0] - Math.cos(this.rad(w)), pos[1] - Math.sin(this.rad(w)), (w + 270) % 360];
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
}
