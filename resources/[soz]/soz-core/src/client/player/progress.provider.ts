import { Exportable } from '@public/core/decorators/exports';
import { animationFlagsToOptions } from '@public/shared/animation';

import { OnEvent, OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { ClientEvent, NuiEvent, ServerEvent } from '../../shared/event';
import { Control } from '../../shared/input';
import { ProgressAnimation, ProgressOptions, ProgressProp } from '../../shared/progress';
import { ProgressService } from '../progress.service';

@Provider()
export class ProgressProvider {
    @Inject(ProgressService)
    private progressService: ProgressService;

    @Tick(TickInterval.EVERY_FRAME)
    async tick(): Promise<void> {
        if (!this.progressService.isDoingAction()) return;

        this.progressService.current.tick?.();

        if (IsEntityDead(PlayerPedId()) && !this.progressService.current.useWhileDead) {
            this.progressService.cancel();
            return;
        }

        if (this.progressService.current?.disableMouse) {
            DisableControlAction(0, Control.LookLeftRight, true);
            DisableControlAction(0, Control.LookUpDown, true);
            DisableControlAction(0, Control.VehicleMouseControlOverride, true);
        }

        if (this.progressService.current?.disableMovement) {
            DisableControlAction(0, Control.Jump, true);
            DisableControlAction(0, Control.Enter, true);
            DisableControlAction(0, Control.MoveLeftRight, true);
            DisableControlAction(0, Control.MoveUpDown, true);
            DisableControlAction(0, Control.Duck, true);
            DisableControlAction(0, Control.Sprint, true);
        }

        if (this.progressService.current?.disableCarMovement) {
            DisableControlAction(0, Control.VehicleMoveLeftOnly, true);
            DisableControlAction(0, Control.VehicleMoveRightOnly, true);
            DisableControlAction(0, Control.VehicleAccelerate, true);
            DisableControlAction(0, Control.VehicleBrake, true);
            DisableControlAction(0, Control.VehicleExit, true);
        }

        if (this.progressService.current?.disableCombat) {
            DisablePlayerFiring(PlayerId(), true);
            DisableControlAction(0, Control.Attack, true);
            DisableControlAction(0, Control.Aim, true);
            DisableControlAction(0, Control.SpecialAbilitySecondary, true);
            DisableControlAction(0, Control.Cover, true);
            DisableControlAction(1, Control.SelectWeapon, true);
            DisableControlAction(0, Control.Detonate, true);
            DisableControlAction(0, Control.ThrowGrenade, true);
            DisableControlAction(0, Control.MeleeAttackLight, true);
            DisableControlAction(0, Control.MeleeAttackHeavy, true);
            DisableControlAction(0, Control.MeleeAttackAlternate, true);
            DisableControlAction(0, Control.MeleeBlock, true);
            DisableControlAction(0, Control.MeleeAttack1, true);
            DisableControlAction(0, Control.MeleeAttack2, true);
            DisableControlAction(0, Control.Attack2, true);
        }

        if (!this.progressService.current?.canCancel) return;

        if (IsControlJustPressed(0, Control.FrontendRRight) || IsControlJustPressed(0, Control.CursorCancel)) {
            this.progressService.cancel();
        }
    }

    @OnNuiEvent(NuiEvent.ProgressFinish)
    async progressFinish(): Promise<void> {
        this.progressService.finish();
    }

    @OnEvent(ClientEvent.PROGRESS_START)
    async progress(
        id: string,
        name: string,
        label: string,
        duration: number,
        animation: ProgressAnimation,
        options: ProgressOptions
    ): Promise<void> {
        if (options.headingEntity) {
            options.headingEntity.entity = NetworkGetEntityFromNetworkId(options.headingEntity.entity);
        }

        const result = await this.progressService.progress(name, label, duration, animation, options);

        TriggerServerEvent(ServerEvent.PROGRESS_FINISH, id, result);
    }

    @OnEvent(ClientEvent.PROGRESS_STOP)
    async progressStop(): Promise<void> {
        this.progressService.cancel();
    }

    @Exportable('ProgressSynchrone')
    public async progressSynchrone(
        name: string,
        label: string,
        duration: number,
        useWhileDead: boolean,
        canCancel: boolean,
        disableControls,
        animation,
        prop: ProgressProp,
        propTwo: ProgressProp
    ) {
        try {
            const result = await this.progressService.progress(
                name.toLowerCase(),
                label,
                duration,
                {
                    task: animation.task,
                    dictionary: animation.animDict,
                    name: animation.anim,
                    options: animationFlagsToOptions(animation.flags),
                },
                {
                    useWhileDead: useWhileDead,
                    canCancel: canCancel,
                    disableCarMovement: disableControls.disableCarMovement,
                    disableCombat: disableControls.disableCombat,
                    disableMovement: disableControls.disableMovement,
                    disableMouse: disableControls.disableMouse,
                    firstProp: prop,
                    secondProp: propTwo,
                }
            );
            return result.completed;
        } catch (e) {
            console.log(e);
        }
    }

    @Exportable('IsDoingAction')
    public isDoingAction(): boolean {
        return this.progressService.isDoingAction();
    }
}
