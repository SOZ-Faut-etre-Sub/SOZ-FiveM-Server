import { Command } from '../../core/decorators/command';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import { Control } from '../../shared/input';
import { PlayerService } from '../player/player.service';
import { AnimationRunner } from './animation.factory';
import { AnimationService } from './animation.service';

@Provider()
export class AnimationHandsUpProvider {
    @Inject(AnimationService)
    private animationService: AnimationService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    private handsUp: AnimationRunner = null;

    @Tick()
    public async disableVehicleHandsUp() {
        if (this.handsUp === null) {
            return;
        }

        if (GetPedInVehicleSeat(GetVehiclePedIsIn(PlayerPedId(), false), -1) !== PlayerPedId()) {
            return;
        }

        DisableControlAction(0, Control.Sprint, true);
        DisableControlAction(0, Control.Attack, true);
        DisableControlAction(0, Control.Aim, true);
        DisableControlAction(0, Control.Detonate, true);
        DisableControlAction(0, Control.ThrowGrenade, true);
        DisableControlAction(0, Control.VehicleAccelerate, true);
        DisableControlAction(0, Control.VehicleBrake, true);
        DisableControlAction(0, Control.VehicleMoveLeftRight, true);
        DisableControlAction(0, Control.VehicleMoveLeftOnly, true);
        DisableControlAction(0, Control.VehicleMoveRightOnly, true);
        DisableControlAction(0, Control.MeleeAttack1, true);
        DisableControlAction(0, Control.MeleeAttack2, true);
        DisableControlAction(0, Control.Attack2, true);
        DisableControlAction(0, Control.MeleeAttackLight, true);
        DisableControlAction(0, Control.MeleeAttackHeavy, true);
        DisableControlAction(0, Control.MeleeAttackAlternate, true);
        DisableControlAction(0, Control.MeleeBlock, true);
        DisableControlAction(0, Control.VehicleExit, true);
        DisableControlAction(27, Control.VehicleExit, true);
    }

    @Command('animation_handsup', {
        description: "Mains en l'air",
        keys: [
            {
                mapper: 'keyboard',
                key: 'X',
            },
        ],
    })
    public async toggleHandsUp() {
        if (this.handsUp) {
            this.handsUp.cancel();

            return;
        }

        if (!this.playerService.canDoAction()) {
            return;
        }

        const ped = PlayerPedId();

        if (IsPedSittingInAnyVehicle(ped)) {
            return;
        }

        SetCurrentPedWeapon(ped, GetHashKey('WEAPON_UNARMED'), true);

        this.handsUp = this.animationService.playAnimation({
            base: {
                dictionary: 'missminuteman_1ig_2',
                name: 'handsup_base',
                duration: -1,
                options: {
                    freezeLastFrame: true,
                    enablePlayerControl: true,
                    onlyUpperBody: true,
                },
            },
        });

        await this.handsUp;

        this.handsUp = null;
    }
}
