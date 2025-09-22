import { BlipAction, BlipFactory } from '@public/client/blip';
import { HudWatchProvider } from '@public/client/hud/hud.watch.provider';
import { Notifier } from '@public/client/notifier';
import { NuiDispatch } from '@public/client/nui/nui.dispatch';
import { PlayerService } from '@public/client/player/player.service';
import { HackedCamRepository } from '@public/client/repository/hacked.cam.repository';
import { TargetFactory } from '@public/client/target/target.factory';
import { TargetProvider } from '@public/client/target/target.provider';
import { Once } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { RepositoryInsert, RepositoryUpdate } from '@public/core/decorators/repository';
import { Tick, TickInterval } from '@public/core/decorators/tick';
import { wait } from '@public/core/utils';
import { Blip } from '@public/shared/blip';
import { CameraDef, CameraLocations, CameraOffsets } from '@public/shared/camera';
import { Control } from '@public/shared/input';
import { ALL_FDO_JOB_TARGETS, JobType } from '@public/shared/job';
import { HackedCam } from '@public/shared/job/police';
import { getLocationHash } from '@public/shared/locationhash';
import { BoxZone } from '@public/shared/polyzone/box.zone';
import { applyOffset, Vector3 } from '@public/shared/polyzone/vector';
import { RepositoryType } from '@public/shared/repository';

const FOV_MAX = 70.0;
const FOV_MIN = 5.0;
const SPEED_LR = 8.0;
const SPEED_UD = 8.0;
const ZOOM_SPEED = 10.0;

const CamZone = new BoxZone([1163.25, -432.66, 68.88], 1.2, 5.2, {
    heading: 166.02,
    minZ: 68.28,
    maxZ: 69.28,
});

@Provider()
export class PoliceCameraProvider {
    @Inject(TargetProvider)
    public targetProvider: TargetProvider;

    @Inject(TargetFactory)
    private readonly targetFactory: TargetFactory;

    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    @Inject(HudWatchProvider)
    private readonly hudWatchProvider: HudWatchProvider;

    @Inject(BlipFactory)
    private readonly blipFactory: BlipFactory;

    @Inject(PlayerService)
    private readonly playerService: PlayerService;

    @Inject(HackedCamRepository)
    private readonly hackedCamRepository: HackedCamRepository;

    @Inject(Notifier)
    private readonly notifier: Notifier;

    private fov = (FOV_MAX + FOV_MIN) * 0.5;
    private camera: number = null;
    private entity = 0;
    private coords: Vector3 = null;

    @Once()
    public init() {
        this.targetFactory.createForBoxZone('CamZone', CamZone, [
            {
                label: 'Caméra',
                icon: 'heist/camera',
                category: 'society',
                blackoutJob: JobType.LSPD,
                blackoutGlobal: true,
                job: ALL_FDO_JOB_TARGETS,
                action: () => this.showCameras(),
            },
        ]);
    }

    @Tick(TickInterval.EVERY_FRAME)
    public async onTick() {
        if (!this.camera) {
            return;
        }

        const player = this.playerService.getPlayer();
        if (player.metadata.isdead) {
            this.deleteCamera();
            return;
        }

        this.hideHud();
        DisableControlAction(0, Control.Attack, true);
        const zoomValue = (1.0 / (FOV_MAX - FOV_MIN)) * (this.fov - FOV_MIN);
        this.checkInputRotation(this.camera, zoomValue);
        this.handleZoom(this.camera);

        if (IsDisabledControlJustPressed(0, Control.FrontendCancel)) {
            const saveCoords = this.coords;
            const inter = setInterval(() => SetFakePausemapPlayerPositionThisFrame(saveCoords[0], saveCoords[1]), 0);
            this.deleteCamera();
            await this.showCameras();
            clearInterval(inter);
        }

        DisableAllControlActions(0);
        EnableControlAction(0, Control.PushToTalk, true);
    }

    private handleZoom(cam: number) {
        const ped = PlayerPedId();
        const isInVehicle = IsPedSittingInAnyVehicle(ped);
        const reduceFovControl = isInVehicle ? Control.SelectPrevWeapon : Control.CursorScrollUp;
        const increaseFovControl = isInVehicle ? Control.SelectNextWeapon : Control.CursorScrollDown;

        if (IsDisabledControlJustPressed(0, reduceFovControl)) {
            this.fov = Math.max(this.fov - ZOOM_SPEED, FOV_MIN);
        }

        if (IsDisabledControlJustPressed(0, increaseFovControl)) {
            this.fov = Math.min(this.fov + ZOOM_SPEED, FOV_MAX);
        }

        const currentFov = GetCamFov(cam);

        if (Math.abs(this.fov - currentFov) < 0.1) {
            this.fov = currentFov;
        }

        SetCamFov(cam, currentFov + (this.fov - currentFov) * 0.05);
    }

    private checkInputRotation(cam: number, zoom: number): number {
        if (this.targetProvider.isActive()) {
            return;
        }

        const rightAxisX = GetDisabledControlNormal(0, Control.ScriptRightAxisX);
        const rightAxisY = GetDisabledControlNormal(0, Control.ScriptRightAxisY);
        const rotation = GetCamRot(cam, 2) as Vector3;

        if (rightAxisX !== 0.0 || rightAxisY !== 0.0) {
            const newZ = rotation[2] + rightAxisX * -1.0 * SPEED_UD * (zoom + 0.1);
            const newX = Math.max(Math.min(60.0, rotation[0] + rightAxisY * -1.0 * SPEED_LR * (zoom + 0.1)), -89.5);

            SetCamRot(cam, newX, 0.0, newZ, 2);

            return newZ;
        }

        return rotation[2];
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

    private async createWebcam(data: CameraDef) {
        this.coords = data.position;
        const position = applyOffset(
            [data.position[0], data.position[1], data.position[2], data.heading],
            CameraOffsets[data.model]
        );

        this.camera = CreateCam('DEFAULT_SCRIPTED_CAMERA', true);
        SetCamParams(
            this.camera,
            position[0],
            position[1],
            position[2] + 0.5,
            0,
            0,
            data.heading + 180,
            50.0,
            0.0,
            1,
            3,
            0
        );
        this.hudWatchProvider.disableWatch(true);

        SetFocusPosAndVel(position[0], position[1], position[2], 0.0, 0.0, 0.0);

        SetTimecycleModifier('CAMERA_BW');
        SetTimecycleModifierStrength(1.0);

        RenderScriptCams(true, true, 0.0, true, false);
        this.nuiDispatch.dispatch('police', 'OpenScientistCamera');

        for (let i = 0; i < 50; i++) {
            await wait(100);

            this.entity = GetClosestObjectOfType(
                data.position[0],
                data.position[1],
                data.position[2],
                0.2,
                data.model,
                false,
                false,
                false
            );

            if (this.entity) {
                SetEntityCollision(this.entity, false, true);
                SetEntityVisible(this.entity, false, false);
                break;
            }
        }
    }

    @RepositoryInsert(RepositoryType.HackedCam)
    @RepositoryUpdate(RepositoryType.HackedCam)
    public async onHacked(hackedCam: HackedCam) {
        if (!this.coords || getLocationHash(this.coords) !== hackedCam.hash) {
            return;
        }

        if (hackedCam.date < Date.now()) {
            return;
        }

        this.notifier.notify('Cette caméra est temporairement désactivée.', 'warning');
        this.deleteCamera();
    }

    private deleteCamera() {
        RenderScriptCams(false, true, 100, true, false);
        DestroyCam(this.camera, false);

        this.targetProvider.setPlayerPosition(null);

        SetEntityVisible(this.entity, true, false);
        SetEntityCollision(this.entity, true, true);

        ClearFocus();

        this.camera = null;
        this.entity = null;
        this.coords = null;
        this.fov = (FOV_MAX + FOV_MIN) * 0.5;

        ClearTimecycleModifier();

        this.nuiDispatch.dispatch('police', 'CloseScientistCamera');
        this.hudWatchProvider.disableWatch(false);
    }

    public async showCameras() {
        let blips: string[] = [];
        let i = 0;
        let savedBlips: Record<string, Blip> = {};
        for (const existingBlip of this.blipFactory.getAll().values()) {
            savedBlips[existingBlip.id] = existingBlip.blip;
            this.blipFactory.remove(existingBlip.id);
        }

        for (const camInfo of CameraLocations) {
            if (camInfo.disabledReason) {
                continue;
            }

            const hash = getLocationHash(camInfo.position);
            const hackedCam = this.hackedCamRepository.find(hash);
            const hacked = hackedCam && hackedCam.date >= Date.now();

            const id = 'policeccam_' + getLocationHash(camInfo.position);
            blips.push(id);

            const actions: Omit<BlipAction<CameraDef>, 'id'>[] = [];
            if (!hacked) {
                actions.push({
                    label: 'Caméra',
                    action: async (blip: Blip, data: CameraDef) => {
                        await this.cleanBlips(blips, savedBlips);
                        blips = [];
                        savedBlips = {};
                        SetFrontendActive(false);
                        this.createWebcam(data);
                    },
                    data: camInfo,
                });
            }

            this.blipFactory.create(
                id,
                {
                    position: camInfo.position,
                    name: 'Caméra',
                    sprite: 629,
                    rotation: -90,
                    color: hacked ? 1 : 39,
                },
                actions
            );
            if (i++ % 50 == 0) {
                await wait(0);
            }
        }

        SetFrontendActive(true);
        await wait(1000);
        while (IsPauseMenuActive()) {
            await wait(0);
        }
        await this.cleanBlips(blips, savedBlips);
        blips = [];
        savedBlips = {};
    }

    private async cleanBlips(blips: string[], savedBlips: Record<string, Blip>) {
        for (const blipId of blips) {
            this.blipFactory.remove(blipId);
        }
        await wait(100);
        for (const [blipId, blip] of Object.entries(savedBlips)) {
            this.blipFactory.create(blipId, blip);
        }
    }
}
