import { Once, OnceStep } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Tick } from '@public/core/decorators/tick';
import { wait } from '@public/core/utils';
import { Control } from '@public/shared/input';
import { add2Vector3, multVector3, Vector3 } from '@public/shared/polyzone/vector';

import { VoipService } from '../voip/voip.service';
import { WeaponDrawingProvider } from '../weapon/weapon.drawing.provider';

const MOVE_UP_KEY = 20;
const MOVE_DOWN_KEY = 44;
const CHANGE_SPEED_KEY = 21;
const NO_CLIP_NORMAL_SPEED = 0.5;
const NO_CLIP_FAST_SPEED = 2.5;
const eps = 0.01;
const breakSpeed = 10.0;

@Provider()
export class NoClipProvider {
    @Inject(VoipService)
    public voipService: VoipService;

    @Inject(WeaponDrawingProvider)
    public weaponDrawingProvider: WeaponDrawingProvider;

    private input = [0, 0, 0];
    private previousVelocity: Vector3 = [0, 0, 0];
    private isNoClipping = false;
    private isClippedVeh = false;
    private noClippingEntity = 0;
    private speed = NO_CLIP_NORMAL_SPEED;

    private IsControlAlwaysPressed(inputGroup: number, control: Control) {
        return IsControlPressed(inputGroup, control) || IsDisabledControlPressed(inputGroup, control);
    }

    private Lerp(a: Vector3, b: Vector3, t: number): Vector3 {
        return add2Vector3(multVector3(add2Vector3(b, multVector3(a, -1)), t), a);
    }

    private IsPedDrivingVehicle(ped: number, veh: number) {
        return ped == GetPedInVehicleSeat(veh, -1);
    }

    private SetInvincible(val: boolean, id: number) {
        SetEntityInvincible(id, val);
        return SetPlayerInvincible(id, val);
    }

    private MoveInNoClip() {
        const camRot = GetGameplayCamRot(0);
        SetEntityRotation(this.noClippingEntity, camRot[0], camRot[1], camRot[2], 0, false);
        const [forward, right, up, c] = GetEntityMatrix(this.noClippingEntity);
        this.previousVelocity = this.Lerp(
            this.previousVelocity,
            add2Vector3(
                add2Vector3(
                    multVector3(right as Vector3, this.speed * this.input[0]),
                    multVector3(up as Vector3, this.speed * -this.input[2])
                ),
                multVector3(forward as Vector3, this.speed * -this.input[1])
            ),
            Timestep() * breakSpeed
        );

        SetEntityCoords(
            this.noClippingEntity,
            c[0] + this.previousVelocity[0],
            c[1] + this.previousVelocity[1],
            c[2] + this.previousVelocity[2] - 1,
            true,
            true,
            true,
            false
        );
    }

    private async SetNoClip(val: boolean) {
        if (this.isNoClipping == val) {
            return;
        }
        const playerPed = PlayerPedId();
        this.noClippingEntity = playerPed;
        if (IsPedInAnyVehicle(playerPed, false)) {
            const veh = GetVehiclePedIsIn(playerPed, false);
            if (this.IsPedDrivingVehicle(playerPed, veh)) {
                this.noClippingEntity = veh;
            }
        }
        this.isClippedVeh = IsEntityAVehicle(this.noClippingEntity);
        SetUserRadioControlEnabled(!val);

        if (this.isNoClipping) {
            PlaySoundFromEntity(-1, 'CANCEL', playerPed, 'HUD_LIQUOR_STORE_SOUNDSET', false, 0);
            this.weaponDrawingProvider.drawAdminWeapons();
            ResetEntityAlpha(this.noClippingEntity);
            this.isNoClipping = val;

            FreezeEntityPosition(this.noClippingEntity, false);
            SetEntityCollision(this.noClippingEntity, true, true);
            SetEntityVisible(this.noClippingEntity, true, false);
            SetLocalPlayerVisibleLocally(true);
            SetEveryoneIgnorePlayer(playerPed, false);
            SetPoliceIgnorePlayer(playerPed, false);
            this.voipService.mutePlayer(false);
            await wait(5000);
            if (this.isClippedVeh) {
                while (!IsVehicleOnAllWheels(this.noClippingEntity) && !this.isNoClipping) {
                    await wait(0);
                }
                while (!this.isNoClipping) {
                    await wait(0);
                    if (IsVehicleOnAllWheels(this.noClippingEntity)) {
                        return this.SetInvincible(false, this.noClippingEntity);
                    }
                }
            } else {
                if (
                    IsPedFalling(this.noClippingEntity) &&
                    Math.abs(1 - GetEntityHeightAboveGround(this.noClippingEntity)) > eps
                ) {
                    while (
                        IsPedStopped(this.noClippingEntity) ||
                        (!IsPedFalling(this.noClippingEntity) && !this.isNoClipping)
                    ) {
                        await wait(0);
                    }
                }
                while (!this.isNoClipping) {
                    await wait(0);
                    if (!IsPedFalling(this.noClippingEntity) && !IsPedRagdoll(this.noClippingEntity)) {
                        return this.SetInvincible(false, this.noClippingEntity);
                    }
                }
            }
        } else {
            PlaySoundFromEntity(-1, 'SELECT', playerPed, 'HUD_LIQUOR_STORE_SOUNDSET', false, 0);

            this.weaponDrawingProvider.undrawAdminWeapons();
            SetEntityAlpha(this.noClippingEntity, 51, false);
            this.voipService.mutePlayer(true);

            this.SetInvincible(true, this.noClippingEntity);
            if (!this.isClippedVeh) {
                ClearPedTasksImmediately(playerPed);
            }
            this.isNoClipping = val;
        }
    }

    public ToggleNoClipMode() {
        //return exports['soz-core'].isNoClipping();
        return this.SetNoClip(!this.isNoClipping);
    }

    public IsNoClipMode() {
        //return exports['soz-core'].IsNoClipMode();
        return this.isNoClipping;
    }

    @Tick()
    private noClipTick() {
        if (!this.isNoClipping) {
            return;
        }

        const playerPed = PlayerPedId();
        FreezeEntityPosition(this.noClippingEntity, true);
        SetEntityCollision(this.noClippingEntity, false, false);
        SetEntityVisible(this.noClippingEntity, false, false);
        SetLocalPlayerVisibleLocally(true);
        SetEntityAlpha(this.noClippingEntity, 51, false);
        SetEveryoneIgnorePlayer(playerPed, true);
        SetPoliceIgnorePlayer(playerPed, true);
        this.input = [
            GetControlNormal(0, Control.MoveLeftRight),
            GetControlNormal(0, Control.MoveUpDown),
            this.IsControlAlwaysPressed(1, MOVE_UP_KEY) ? 1 : this.IsControlAlwaysPressed(1, MOVE_DOWN_KEY) ? -1 : 0,
        ];
        this.speed =
            (this.IsControlAlwaysPressed(1, CHANGE_SPEED_KEY) ? NO_CLIP_FAST_SPEED : NO_CLIP_NORMAL_SPEED) *
            (this.isClippedVeh ? 2.75 : 1);
        this.MoveInNoClip();
    }

    @Once(OnceStep.Stop)
    private onStop() {
        this.SetNoClip(false);
        const playerPed = PlayerPedId();
        FreezeEntityPosition(this.noClippingEntity, false);
        SetEntityCollision(this.noClippingEntity, true, true);
        SetEntityVisible(this.noClippingEntity, true, false);
        SetLocalPlayerVisibleLocally(true);
        ResetEntityAlpha(this.noClippingEntity);
        SetEveryoneIgnorePlayer(playerPed, false);
        SetPoliceIgnorePlayer(this.noClippingEntity, false);
        ResetEntityAlpha(this.noClippingEntity);
        this.SetInvincible(false, this.noClippingEntity);
    }
}
