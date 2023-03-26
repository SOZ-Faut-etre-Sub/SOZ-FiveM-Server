import { On } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { wait } from '@core/utils';
import { Tick } from '@public/core/decorators/tick';
import { Component } from '@public/shared/cloth';
import { JobType } from '@public/shared/job';
import { Vector3 } from '@public/shared/polyzone/vector';

import { PlayerService } from '../player/player.service';
import { ResourceLoader } from '../resources/resource.loader';

const holsterableWeaponGroups = [GetHashKey('GROUP_PISTOL'), GetHashKey('GROUP_STUNGUN')];
const excludeWeapon = [GetHashKey('WEAPON_BRIEFCASE'), 966099553 /*WEAPON_OBJECT*/];

const AllowedJob = [JobType.FBI, JobType.BCSO, JobType.LSPD];

const hosterDrawable = {
    [GetHashKey('mp_m_freemode_01')]: 130,
    [GetHashKey('mp_f_freemode_01')]: 160,
};

@Provider()
export class WeaponHolsterProvider {
    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

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
    public async loop() {
        const ped = PlayerPedId();
        const player = this.playerService.getPlayer();
        if (
            DoesEntityExist(ped) &&
            player &&
            !player.metadata.isdead &&
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

                const pos = GetEntityCoords(ped, true) as Vector3;
                const rot = GetEntityHeading(ped);

                this.resourceLoader.loadAnimationDictionary('reaction@intimidation@1h');
                this.resourceLoader.loadAnimationDictionary('reaction@intimidation@cop@unarmed');
                this.resourceLoader.loadAnimationDictionary('rcmjosh4');
                this.resourceLoader.loadAnimationDictionary('weapons@pistol@');

                if (this.currWeapon != GetHashKey('WEAPON_UNARMED')) {
                    if (
                        this.isWeaponHolsterable(this.currWeapon) &&
                        ((AllowedJob.includes(player.job.id) && player.cloth_config.JobClothSet) ||
                            hosterDrawable[GetEntityModel(ped)] == GetPedDrawableVariation(ped, Component.Undershirt))
                    ) {
                        await this.putWeaponInHolster(ped, pos, rot);
                    } else {
                        await this.putWeaponBehind(ped, pos, rot);
                    }
                    SetCurrentPedWeapon(ped, GetHashKey('WEAPON_UNARMED'), true);
                }

                if (newWeap != GetHashKey('WEAPON_UNARMED')) {
                    if (
                        this.isWeaponHolsterable(newWeap) &&
                        ((AllowedJob.includes(player.job.id) && player.cloth_config.JobClothSet) ||
                            hosterDrawable[GetEntityModel(ped)] == GetPedDrawableVariation(ped, Component.Undershirt))
                    ) {
                        await this.drawWeaponFromHolster(ped, pos, rot, newWeap);
                    } else {
                        await this.drawWeaponFromBehind(ped, pos, rot, newWeap);
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

    @Tick(3)
    public async blockFireLoop() {
        if (this.inAnimation) {
            DisableControlAction(0, 25, true);
            DisablePlayerFiring(PlayerPedId(), true);
        } else {
            await wait(250);
        }
    }

    @Tick(3)
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

    private async drawWeaponFromHolster(ped: number, pos: Vector3, rot: number, newWeap: number) {
        TaskPlayAnimAdvanced(
            ped,
            'rcmjosh4',
            'josh_leadout_cop2',
            pos[0],
            pos[1],
            pos[2],
            0,
            0,
            rot,
            3.0,
            3.0,
            -1,
            50,
            0,
            0,
            0
        );
        await wait(300);
        SetCurrentPedWeapon(ped, newWeap, true);
        await wait(500);
    }

    private async drawWeaponFromBehind(ped: number, pos: Vector3, rot: number, newWeap: number) {
        TaskPlayAnimAdvanced(
            ped,
            'reaction@intimidation@1h',
            'intro',
            pos[0],
            pos[1],
            pos[2],
            0,
            0,
            rot,
            8.0,
            3.0,
            -1,
            50,
            0,
            0,
            0
        );
        await wait(1000);
        SetCurrentPedWeapon(ped, newWeap, true);
        await wait(1400);
    }

    private async putWeaponInHolster(ped: number, pos: Vector3, rot: number) {
        TaskPlayAnimAdvanced(
            ped,
            'reaction@intimidation@cop@unarmed',
            'intro',
            pos[0],
            pos[1],
            pos[2],
            0,
            0,
            rot,
            3.0,
            3.0,
            -1,
            50,
            0,
            0,
            0
        );
        await wait(500);
    }

    private async putWeaponBehind(ped: number, pos: Vector3, rot: number) {
        TaskPlayAnimAdvanced(
            ped,
            'reaction@intimidation@1h',
            'outro',
            pos[0],
            pos[1],
            pos[2],
            0,
            0,
            rot,
            8.0,
            3.0,
            -1,
            50,
            0,
            0,
            0
        );
        await wait(1400);
    }

    public isInAnimation() {
        return this.inAnimation;
    }
}
