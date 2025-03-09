import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { wait } from '@core/utils';
import { Tick } from '@public/core/decorators/tick';
import { Component } from '@public/shared/cloth';
import { JobType } from '@public/shared/job';
import { PlayerData, PlayerPedHash } from '@public/shared/player';

import { AnimationService } from '../animation/animation.service';
import { PlayerService } from '../player/player.service';

const holsterableWeaponGroups = [GetHashKey('GROUP_PISTOL'), GetHashKey('GROUP_STUNGUN')];
const objectWeapons = [0, GetHashKey('WEAPON_BRIEFCASE'), 966099553 /*WEAPON_OBJECT*/];
const excludeWeapon = [
    0,
    GetHashKey('WEAPON_BRIEFCASE'),
    GetHashKey('WEAPON_UVFLASHLIGHT'),
    GetHashKey('WEAPON_GADGETPISTOL'),
];
const switchblade = GetHashKey('weapon_switchblade');
const unarmed = GetHashKey('WEAPON_UNARMED');

const AllowedJob = [JobType.FBI, JobType.BCSO, JobType.LSPD, JobType.SASP, JobType.LSCS];

const UndershirtHolster: Record<PlayerPedHash, number> = {
    [PlayerPedHash.Male]: 130,
    [PlayerPedHash.Female]: 160,
};

const AccessoriesHolster: Record<PlayerPedHash, number> = {
    [PlayerPedHash.Male]: 4,
    [PlayerPedHash.Female]: 4,
};

@Provider()
export class WeaponHolsterProvider {
    @Inject(AnimationService)
    private animationService: AnimationService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    private inAnimation = false;
    private currWeapon = unarmed;

    private isFastAllowed(player: PlayerData, ped: number) {
        if (AllowedJob.includes(player.job.id) && player.cloth_config.JobClothSet) {
            return true;
        }

        if (UndershirtHolster[GetEntityModel(ped)] == GetPedDrawableVariation(ped, Component.Undershirt)) {
            return true;
        }

        if (
            AccessoriesHolster[GetEntityModel(ped)] ==
                GetPedDrawableVariationCollectionLocalIndex(ped, Component.Accessories) &&
            GetPedDrawableVariationCollectionName(ped, Component.Accessories) == 'soz_bcso'
        ) {
            return true;
        }

        return false;
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
                !objectWeapons.includes(newWeap) &&
                !objectWeapons.includes(this.currWeapon)
            ) {
                this.inAnimation = true;
                SetCurrentPedWeapon(ped, this.currWeapon, true);

                await this.storeWeapon(player, ped);

                if (newWeap != unarmed) {
                    ClearPedTasks(ped);
                    if (newWeap === switchblade) {
                        SetCurrentPedWeapon(ped, switchblade, false);
                        await wait(800);
                    } else if (excludeWeapon.includes(newWeap)) {
                        SetCurrentPedWeapon(ped, newWeap, false);
                    } else if (this.isWeaponHolsterable(newWeap) && this.isFastAllowed(player, ped)) {
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

    public async storeWeapon(player: PlayerData, ped: number) {
        if (this.currWeapon == unarmed || objectWeapons.includes(this.currWeapon)) {
            return;
        }

        const inAnimation = this.inAnimation;
        this.inAnimation = true;

        if (this.currWeapon === switchblade) {
            SetCurrentPedWeapon(ped, unarmed, false);
            await wait(1300);
        } else if (this.isWeaponHolsterable(this.currWeapon) && this.isFastAllowed(player, ped)) {
            await this.putWeaponInHolster();
        } else if (!excludeWeapon.includes(this.currWeapon)) {
            await this.putWeaponBehind();
        }
        SetCurrentPedWeapon(ped, unarmed, true);
        this.currWeapon = unarmed;

        if (!inAnimation) {
            this.inAnimation = false;
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
