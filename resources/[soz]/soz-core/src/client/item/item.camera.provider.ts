import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import { wait } from '../../core/utils';
import { ClientEvent } from '../../shared/event';
import { Vector3 } from '../../shared/polyzone/vector';
import { AnimationRunner } from '../animation/animation.factory';
import { AnimationService } from '../animation/animation.service';
import { NuiDispatch } from '../nui/nui.dispatch';
import { PlayerService } from '../player/player.service';

const FOV_MAX = 70.0;
const FOV_MIN = 5.0;
const ZOOM_SPEED = 10.0;
const SPEED_LR = 8.0;
const SPEED_UD = 8.0;

const CAMERA_ANIMATION: { name: string; button1?: number; button2?: number }[] = [
    { name: '_bwd_180_loop', button1: 33, button2: null },
    { name: '_bwd_135_loop', button1: 33, button2: 35 },
    { name: '_bwd_-135_loop', button1: 33, button2: 34 },
    { name: '_bwd_-90_loop', button1: null, button2: 34 },
    { name: '_fwd_90_loop', button1: null, button2: 35 },
    { name: '_fwd_45_loop', button1: 32, button2: 35 },
    { name: '_fwd_-45_loop', button1: 32, button2: 34 },
    { name: '_fwd_0_loop', button1: 32, button2: null },
];

@Provider()
export class ItemCameraProvider {
    @Inject(AnimationService)
    private animationService: AnimationService;

    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    @Inject(PlayerService)
    private readonly playerService: PlayerService;

    private currentAnimation: AnimationRunner = null;

    private fov = (FOV_MAX + FOV_MIN) * 0.5;

    private cam = null;

    @Tick()
    public async onCameraHideHud() {
        if (!this.cam) {
            return;
        }

        this.hideHud();
    }

    @Tick()
    public async onCameraTick() {
        if (!this.cam) {
            return;
        }

        const zoomValue = (1.0 / (FOV_MAX - FOV_MIN)) * (this.fov - FOV_MIN);
        const ped = PlayerPedId();
        const isPedInVehicle = IsPedSittingInAnyVehicle(ped);

        const rotationHeading = this.checkInputRotation(this.cam, zoomValue);

        if (!IsPedSittingInAnyVehicle(ped)) {
            SetEntityHeading(ped, rotationHeading);
        }

        this.handleZoom(this.cam);

        let camHeading = GetGameplayCamRelativeHeading();
        let camPitch = GetGameplayCamRelativePitch();

        if (camPitch < -70.0) {
            camPitch = -70.0;
        }

        if (camPitch > 42.0) {
            camPitch = 42.0;
        }

        camPitch = (camPitch + 70.0) / 112.0;

        if (camHeading < -180.0) {
            camHeading = -180.0;
        }

        if (camHeading > 180.0) {
            camHeading = 180.0;
        }

        camHeading = (camHeading + 180.0) / 360.0;

        SetTaskMoveNetworkSignalFloat(ped, 'Pitch', camPitch);
        SetTaskMoveNetworkSignalFloat(ped, 'Heading', camHeading * -1.0 + 1.0);

        const isZPressed = IsControlPressed(0, 32);
        const isSPressed = IsControlPressed(0, 33);
        const isQPressed = IsControlPressed(0, 34);
        const isDPressed = IsControlPressed(0, 35);
        const isShiftPressed = IsControlPressed(0, 21);

        for (const animData of CAMERA_ANIMATION) {
            const isYAxisPressed =
                (animData.button1 === 32 && isZPressed) ||
                (animData.button1 === 33 && isSPressed) ||
                (animData.button1 === null && !isZPressed && !isSPressed);
            const isXAxisPressed =
                (animData.button2 === 34 && isQPressed) ||
                (animData.button2 === 35 && isDPressed) ||
                (animData.button2 === null && !isQPressed && !isDPressed);

            if (isXAxisPressed && isYAxisPressed && !isPedInVehicle) {
                const animationName = (isShiftPressed ? 'run' : 'walk') + animData.name;

                TaskPlayAnim(
                    ped,
                    'move_strafe@first_person@generic',
                    animationName,
                    5.0,
                    1.0,
                    -1,
                    1,
                    0.1,
                    false,
                    false,
                    false
                );

                while (
                    ((animData.button1 !== null && IsControlPressed(0, animData.button1)) ||
                        (animData.button1 === null && !IsControlPressed(0, 32) && !IsControlPressed(0, 33))) &&
                    ((animData.button2 !== null && IsControlPressed(0, animData.button2)) ||
                        (animData.button2 === null && !IsControlPressed(0, 34) && !IsControlPressed(0, 35))) &&
                    ((isShiftPressed && IsControlPressed(0, 21)) || (!isShiftPressed && !IsControlPressed(0, 21)))
                ) {
                    if (!this.cam) {
                        break;
                    }

                    const rotationHeading = this.checkInputRotation(this.cam, zoomValue);

                    if (!IsPedSittingInAnyVehicle(ped)) {
                        SetEntityHeading(ped, rotationHeading);
                    }

                    await wait(0);
                }

                StopAnimTask(ped, 'move_strafe@first_person@generic', animationName, 2.0);
            }
        }
    }

    @OnEvent(ClientEvent.ITEM_CAMERA_TOGGLE)
    public async onToggleCamera() {
        const player = this.playerService.getPlayer();

        if (!player) {
            return;
        }

        if (this.currentAnimation) {
            this.currentAnimation.cancel();

            return;
        }

        this.currentAnimation = this.animationService.playAnimation(
            {
                base: {
                    dictionary: 'missfinale_c2mcs_1',
                    name: 'fin_c2_mcs_1_camman',
                    duration: -1,
                    options: {
                        freezeLastFrame: true,
                        enablePlayerControl: true,
                        onlyUpperBody: true,
                    },
                },
                props: [
                    {
                        model: 'prop_v_cam_01',
                        position: [0.0, 0.0, 0.0],
                        rotation: [0.0, 0.0, 0.0],
                        bone: 28422,
                    },
                ],
            },
            {
                resetWeapon: true,
            }
        );

        this.cam = this.createCamera();

        this.nuiDispatch.dispatch('hud', 'SetTwitchNewsOverlay', player.job.id);

        await this.currentAnimation;

        this.deleteCamera();

        this.currentAnimation = null;
        this.nuiDispatch.dispatch('hud', 'SetTwitchNewsOverlay', null);
    }

    private createCamera(): number {
        this.fov = (FOV_MAX + FOV_MIN) * 0.5;

        const ped = PlayerPedId();
        const cam = CreateCam('DEFAULT_SCRIPTED_FLY_CAMERA', true);

        if (!IsPedSittingInAnyVehicle(ped)) {
            AttachCamToEntity(cam, ped, 0.05, 0.5, 0.7, true);
        } else {
            AttachCamToEntity(cam, ped, 0.0, 0.0, 0.7, true);
        }

        SetCamRot(cam, 2.0, 1.0, GetEntityHeading(ped), 0);
        SetCamFov(cam, this.fov);

        RenderScriptCams(true, true, 100, true, false);

        return cam;
    }

    private deleteCamera() {
        RenderScriptCams(false, true, 100, true, false);
        DestroyCam(this.cam, false);
        this.cam = null;
    }

    private checkInputRotation(cam: number, zoom: number): number {
        const rightAxisX = GetDisabledControlNormal(0, 220);
        const rightAxisY = GetDisabledControlNormal(0, 221);
        const rotation = GetCamRot(cam, 2) as Vector3;

        if (rightAxisX !== 0.0 || rightAxisY !== 0.0) {
            const newZ = rotation[2] + rightAxisX * -1.0 * SPEED_UD * (zoom + 0.1);
            const newX = Math.max(Math.min(60.0, rotation[0] + rightAxisY * -1.0 * SPEED_LR * (zoom + 0.1)), -89.5);

            SetCamRot(cam, newX, 0.0, newZ, 2);

            return newZ;
        }

        return rotation[2];
    }

    private handleZoom(cam: number) {
        const ped = PlayerPedId();
        const isInVehicle = IsPedSittingInAnyVehicle(ped);
        const reduceFovControl = isInVehicle ? 17 : 241;
        const increaseFovControl = isInVehicle ? 16 : 242;

        if (IsControlJustPressed(0, reduceFovControl)) {
            this.fov = Math.max(this.fov - ZOOM_SPEED, FOV_MIN);
        }

        if (IsControlJustPressed(0, increaseFovControl)) {
            this.fov = Math.min(this.fov + ZOOM_SPEED, FOV_MAX);
        }

        const currentFov = GetCamFov(cam);

        if (Math.abs(this.fov - currentFov) < 0.1) {
            this.fov = currentFov;
        }

        SetCamFov(cam, currentFov + (this.fov - currentFov) * 0.05);
    }

    private hideHud() {
        HideHelpTextThisFrame();
        HideHudAndRadarThisFrame();
        HideHudComponentThisFrame(1);
        HideHudComponentThisFrame(2);
        HideHudComponentThisFrame(3);
        HideHudComponentThisFrame(4);
        HideHudComponentThisFrame(6);
        HideHudComponentThisFrame(7);
        HideHudComponentThisFrame(8);
        HideHudComponentThisFrame(9);
        HideHudComponentThisFrame(13);
        HideHudComponentThisFrame(11);
        HideHudComponentThisFrame(12);
        HideHudComponentThisFrame(15);
        HideHudComponentThisFrame(18);
        HideHudComponentThisFrame(19);
    }
}
