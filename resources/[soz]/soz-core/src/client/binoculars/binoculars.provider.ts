import { ResourceLoader } from '@public/client/resources/resource.loader';
import { ClientEvent } from '@public/shared/event';

import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { wait } from '../../core/utils';
import { PlayerService } from '../player/player.service';
import { FOV, FOV_MAX, FOV_MIN, SPEED_LR, SPEED_UD, ZOOMSPEED } from './binoculars.config';

@Provider()
export class BinocularsProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

    private binocularsConfig = { enabled: false, newZ: 0, fov: FOV };

    // -- FUNCTIONS--
    public HideHUDThisFrame() {
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

    public CheckInputRotation(cam, zoomvalue) {
        const rightAxisX = GetDisabledControlNormal(0, 220);
        const rightAxisY = GetDisabledControlNormal(0, 221);
        const rotation = GetCamRot(cam, 2);
        if (rightAxisX !== 0.0 || rightAxisY !== 0.0) {
            this.binocularsConfig.newZ = rotation[2] + rightAxisX * -1.0 * SPEED_UD * (zoomvalue + 0.1);
            const new_x = Math.max(
                Math.min(20.0, rotation[0] + rightAxisY * -1.0 * SPEED_LR * (zoomvalue + 0.1)),
                -89.5
            );
            SetCamRot(cam, new_x, 0.0, this.binocularsConfig.newZ, 2);
        }
    }

    public HandleZoom(cam) {
        console.log('HandleZoom');
        if (IsControlJustPressed(0, 241)) {
            this.binocularsConfig.fov = Math.max(this.binocularsConfig.fov - ZOOMSPEED, FOV_MIN);
        }
        if (IsControlJustPressed(0, 242)) {
            this.binocularsConfig.fov = Math.min(this.binocularsConfig.fov + ZOOMSPEED, FOV_MAX);
        }
        const currentFov = GetCamFov(cam);
        if (Math.abs(this.binocularsConfig.fov - currentFov) < 0.1) {
            this.binocularsConfig.fov = currentFov;
        }
        console.log(`${currentFov} + (${this.binocularsConfig.fov} - ${currentFov})`);
        console.log('set cam FOV  toooo:', currentFov + (this.binocularsConfig.fov - currentFov) * 0.05);
        SetCamFov(cam, currentFov + (this.binocularsConfig.fov - currentFov) * 0.05);
    }

    private async createCameraThread() {
        const player = PlayerPedId();

        const text = '~INPUT_FRONTEND_RRIGHT~ Ranger les jumelles\n';

        AddTextEntry('binoculars_help_text', text);
        DisplayHelpTextThisFrame('binoculars_help_text', false);

        if (!IsPedSittingInAnyVehicle(player)) {
            TaskStartScenarioInPlace(PlayerPedId(), 'WORLD_HUMAN_BINOCULARS', 0, true);
            PlayAmbientSpeech1(PlayerPedId(), 'GENERIC_CURSE_MED', 'SPEECH_PARAMS_FORCE');

            await wait(2000);
        }

        const cam = CreateCam('DEFAULT_SCRIPTED_FLY_CAMERA', true);
        AttachCamToEntity(cam, player, 0.05, 0.5, 0.7, true);
        SetCamRot(cam, 2.0, 1.0, GetEntityHeading(player), 2);
        SetCamFov(cam, this.binocularsConfig.fov);
        RenderScriptCams(true, false, 0, true, false);

        const scaleform = await this.resourceLoader.loadScaleformMovie('BINOCULARS');

        while (this.binocularsConfig.enabled) {
            LocalPlayer.state.set('inv_busy', true, true);

            SetPauseMenuActive(false);
            if (!IsPedSittingInAnyVehicle(player)) {
                SetEntityHeading(player, this.binocularsConfig.newZ);
            }

            DisableAllControlActions(0);
            DisableAllControlActions(2);

            EnableControlAction(2, 241, true); // INPUT_CURSOR_SCROLL_UP
            EnableControlAction(2, 242, true); // INPUT_CURSOR_SCROLL_DOWN
            EnableControlAction(2, 202, true); // INPUT_FRONTEND_CANCEL

            if (IsControlJustPressed(0, 202)) {
                this.toggleBinoculars();
            }

            const zoomvalue = (1.0 / (FOV_MAX - FOV_MIN)) * (this.binocularsConfig.fov - FOV_MIN);
            this.CheckInputRotation(cam, zoomvalue);
            this.HandleZoom(cam);
            this.HideHUDThisFrame();
            DrawScaleformMovieFullscreen(scaleform, 255, 255, 255, 255, 0);

            let camHeading = GetGameplayCamRelativeHeading();
            let camPitch = GetGameplayCamRelativePitch();
            if (camPitch < -70.0) {
                camPitch = -70.0;
            } else if (camPitch > 42.0) {
                camPitch = 42.0;
            }
            camPitch = (camPitch + 70.0) / 112.0;
            if (camHeading < -180.0) {
                camHeading = -180.0;
            } else if (camHeading > 180.0) {
                camHeading = 180.0;
            }
            camHeading = (camHeading + 180.0) / 360.0;
            SetTaskMoveNetworkSignalFloat(player, 'Pitch', camPitch);
            SetTaskMoveNetworkSignalFloat(player, 'Heading', camHeading * -1.0 + 1.0);
            console.log('BINOCULARS', this.binocularsConfig.enabled);

            await wait(5);
        }

        ClearPedTasks(PlayerPedId());
        RenderScriptCams(false, false, 0, true, false);
        DestroyCam(cam, false);

        LocalPlayer.state.set('inv_busy', false, true);
    }

    private cameraOperator() {
        if (this.binocularsConfig.enabled) {
            this.createCameraThread();
        }
    }

    // Toggle Events
    @OnEvent(ClientEvent.BINOCULARS_TOGGLE)
    public toggleBinoculars() {
        this.binocularsConfig.enabled = !this.binocularsConfig.enabled;
        this.cameraOperator();
    }

    // Set state Events
    @OnEvent(ClientEvent.BINOCULARS_SET)
    public setBinoculars(value) {
        this.binocularsConfig.enabled = value;
        this.cameraOperator();
    }

    @OnEvent(ClientEvent.PLAYER_ON_DEATH, false)
    public onDead() {
        this.binocularsConfig.enabled = false;
    }
}
