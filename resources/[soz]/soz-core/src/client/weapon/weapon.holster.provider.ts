import { On } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { wait } from '@core/utils';
import { Tick } from '@public/core/decorators/tick';
import { Component } from '@public/shared/cloth';
import { VanillaComponentDrawableIndexMaxValue } from '@public/shared/drawable';
import { JobType } from '@public/shared/job';
import { PlayerPedHash } from '@public/shared/player';

import { AnimationService } from '../animation/animation.service';
import { PlayerService } from '../player/player.service';

const holsterableWeaponGroups = [GetHashKey('GROUP_PISTOL'), GetHashKey('GROUP_STUNGUN')];
const excludeWeapon = [
    0,
    GetHashKey('WEAPON_BRIEFCASE'),
    GetHashKey('WEAPON_UVFLASHLIGHT'),
    GetHashKey('WEAPON_GADGETPISTOL'),
    966099553 /*WEAPON_OBJECT*/,
];

const AllowedJob = [JobType.FBI, JobType.BCSO, JobType.LSPD, JobType.SASP, JobType.LSCS];

const UndershirtHolster: Record<PlayerPedHash, number> = {
    [PlayerPedHash.Male]: 130,
    [PlayerPedHash.Female]: 160,
};

const AccessoriesHolster: Record<PlayerPedHash, number> = {
    [PlayerPedHash.Male]: VanillaComponentDrawableIndexMaxValue[PlayerPedHash.Male][Component.Accessories] + 4,
    [PlayerPedHash.Female]: VanillaComponentDrawableIndexMaxValue[PlayerPedHash.Female][Component.Accessories] + 4,
};

@Provider()
export class WeaponHolsterProvider {
    @Inject(AnimationService)
    private animationService: AnimationService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    private inAnimation = false;
    private currWeapon = GetHashKey('WEAPON_UNARMED');

    @On('weapons:ResetHolster')
    public resetHolster() {
        this.inAnimation = false;
        this.currWeapon = GetHashKey('WEAPON_UNARMED');
    }

    @Tick(5)
    public async checkWeaponLoop() {
        const ped = PlayerPedId();
        const player = this.playerService.getPlayer();

        if (
            DoesEntityExist(ped) &&
            player &&
            !player.metadata?.isdead &&
            !IsPedInParachuteFreeFall(ped) &&
            !IsPedFalling(ped) &&
            (GetPedParachuteState(ped) == -1 || GetPedParachuteState(ped) == 0)
        ) {
            const newWeap = GetSelectedPedWeapon(ped);
            if (
                this.currWeapon != newWeap &&
                !excludeWeapon.includes(newWeap) &&
                !excludeWeapon.includes(this.currWeapon)
            ) {
                this.inAnimation = true;
                SetCurrentPedWeapon(ped, this.currWeapon, true);

                if (this.currWeapon != GetHashKey('WEAPON_UNARMED')) {
                    if (
                        this.isWeaponHolsterable(this.currWeapon) &&
                        ((AllowedJob.includes(player.job.id) && player.cloth_config.JobClothSet) ||
                            UndershirtHolster[GetEntityModel(ped)] ==
                                GetPedDrawableVariation(ped, Component.Undershirt) ||
                            AccessoriesHolster[GetEntityModel(ped)] ==
                                GetPedDrawableVariation(ped, Component.Accessories))
                    ) {
                        await this.putWeaponInHolster();
                    } else {
                        await this.putWeaponBehind();
                    }
                    SetCurrentPedWeapon(ped, GetHashKey('WEAPON_UNARMED'), true);
                }

                if (newWeap != GetHashKey('WEAPON_UNARMED')) {
                    if (
                        this.isWeaponHolsterable(newWeap) &&
                        ((AllowedJob.includes(player.job.id) && player.cloth_config.JobClothSet) ||
                            UndershirtHolster[GetEntityModel(ped)] ==
                                GetPedDrawableVariation(ped, Component.Undershirt) ||
                            AccessoriesHolster[GetEntityModel(ped)] ==
                                GetPedDrawableVariation(ped, Component.Accessories))
                    ) {
                        await this.drawWeaponFromHolster(ped, newWeap);
                    } else {
                        await this.drawWeaponFromBehind(ped, newWeap);
                    }
                }

                ClearPedTasks(ped);
                this.inAnimation = false;
            }
            this.currWeapon = newWeap;
        } else {
            await wait(250);
        }
    }

    @Tick(0)
    public async blockFireLoop() {
        if (this.inAnimation) {
            DisableControlAction(0, 25, true);
            DisablePlayerFiring(PlayerPedId(), true);
        } else {
            await wait(250);
        }
    }

    @Tick(0)
    public async holsterToAim() {
        const player = PlayerPedId();
        if (IsControlPressed(0, 25) && IsEntityPlayingAnim(player, 'move_m@intimidation@cop@unarmed', 'idle', 3)) {
            ClearPedSecondaryTask(player);
        }
    }

    private isWeaponHolsterable(weap: number) {
        const weaponGroup = GetWeapontypeGroup(weap);
        return holsterableWeaponGroups.some(elem => elem == weaponGroup);
    }

    private async drawWeaponFromHolster(ped: number, newWeap: number) {
        this.animationService.playAnimation({
            base: {
                dictionary: 'rcmjosh4',
                name: 'josh_leadout_cop2',
                blendInSpeed: 3.0,
                blendOutSpeed: 3.0,
                options: {
                    onlyUpperBody: true,
                    freezeLastFrame: true,
                    enablePlayerControl: true,
                },
            },
        });
        await wait(300);
        SetCurrentPedWeapon(ped, newWeap, true);
        await wait(500);
    }

    private async drawWeaponFromBehind(ped: number, newWeap: number) {
        this.animationService.playAnimation({
            base: {
                dictionary: 'reaction@intimidation@1h',
                name: 'intro',
                blendInSpeed: 8.0,
                blendOutSpeed: 3.0,
                options: {
                    onlyUpperBody: true,
                    freezeLastFrame: true,
                    enablePlayerControl: true,
                },
            },
        });
        await wait(1000);
        SetCurrentPedWeapon(ped, newWeap, true);
        await wait(1400);
    }

    private async putWeaponInHolster() {
        this.animationService.playAnimation({
            base: {
                dictionary: 'reaction@intimidation@cop@unarmed',
                name: 'intro',
                blendInSpeed: 3.0,
                blendOutSpeed: 3.0,
                options: {
                    onlyUpperBody: true,
                    freezeLastFrame: true,
                    enablePlayerControl: true,
                },
            },
        });
        await wait(500);
    }

    private async putWeaponBehind() {
        this.animationService.playAnimation({
            base: {
                dictionary: 'reaction@intimidation@1h',
                name: 'outro',
                blendInSpeed: 8.0,
                blendOutSpeed: 3.0,
                options: {
                    onlyUpperBody: true,
                    freezeLastFrame: true,
                    enablePlayerControl: true,
                },
            },
        });
        await wait(1400);
    }

    public isInAnimation() {
        return this.inAnimation;
    }
}
