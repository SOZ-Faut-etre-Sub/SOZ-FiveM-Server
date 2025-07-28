import { OnEvent, OnNuiEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Tick } from '@public/core/decorators/tick';
import { wait } from '@public/core/utils';
import { ClientEvent } from '@public/shared/event';
import { NuiEvent } from '@public/shared/event/nui';
import { ServerEvent } from '@public/shared/event/server';
import { FireType } from '@public/shared/fire';
import { applyOffset, deg, sub2Vector3, Vector3, Vector4 } from '@public/shared/polyzone/vector';

import { Provider } from '../../core/decorators/provider';
import { HudStateProvider } from '../hud/hud.state.provider';
import { InputService } from '../nui/input.service';
import { NuiMenu } from '../nui/nui.menu';
import { ThunderProvider } from './thunder.provider';

const SlineNodes: { coords?: Vector3; offset?: Vector3; rotation: Vector3; fov: number; delay: number }[] = [
    {
        offset: [0, 300, 120],
        rotation: [0, 0, -70],
        fov: 90,
        delay: 9000,
    },
    {
        offset: [0, 300, 140],
        rotation: [0, 0, -10],
        fov: 90,
        delay: 3000,
    },
    {
        offset: [0, 300, 160],
        rotation: [0, 0, 50],
        fov: 90,
        delay: 3000,
    },
    {
        offset: [0, 300, 180],
        rotation: [0, 0, 110],
        fov: 90,
        delay: 3000,
    },
    {
        offset: [0, 300, 200],
        rotation: [0, 0, 170],
        fov: 90,
        delay: 3000,
    },
    {
        coords: [-854.29, 1690.5, 293.79],
        rotation: [-14.365459442138672, 0, 206.82],
        fov: 30,
        delay: 6_000,
    },
    {
        coords: [-854.29, 1690.5, 293.79],
        rotation: [-14.365459442138672, 0, 206.82],
        fov: 90,
        delay: 6_000,
    },
    {
        coords: [-1138.52, 1699.74, 382.0],
        rotation: [-14.365459442138672, 0, 238.55],
        fov: 60,
        delay: 5_000,
    },
    {
        coords: [-1138.52, 1699.74, 382.0],
        rotation: [-14.365459442138672, 0, 238.55],
        fov: 60,
        delay: 10_000,
    },
];

const ThunderFirePositions: Vector4[] = [
    //zone1
    [-2507.19, 1160.7, 214.94, 0],
    [-2852.57, 914.49, 118.74, 0],
    [-2877.66, 532.87, 41.87, 0],
    [-2899.53, 1699.04, 56.77, 0],
    [-2592.64, 2332.81, 29.55, 0],
    [-1638.52, 980.5, 151.84, 0],

    //zone2
    [-593.89, 1879.05, 207.05, 0],
    [-820.02, 1753.45, 187.29, 0],
    [-820.06, 1619.68, 212.84, 0], //lightning
    [-370.01, 1600.63, 329.2, 0],
    [-347.28, 1275.58, 332.73, 0],

    //zone3
    [-73.57, 2916.64, 52.01, 0],
    [-203.87, 2738.69, 39.8, 0],
    [-18.66, 2517.32, 90.27, 0],

    //zone4
    [1030.73, 1906.68, 81.89, 0],
    [1055.02, 1547.85, 163.25, 0],
    [782.79, 1664.56, 179.08, 0],
    [899.83, 890.52, 185.3, 0],
    [486.97, 1057.79, 231.93, 0],

    //zone5
    [1371.16, 2782.59, 48.43, 0],
    [1614.64, 2976.11, 52.92, 0],
    [1959.54, 2775.57, 48.43, 0],
    [1234.09, 2290.91, 74.37, 0],
];
const ThunderPosition: Vector3 = [-821.53, 1618.92, 258.23];

@Provider()
export class FirestormProvider {
    @Inject(InputService)
    private readonly input: InputService;

    @Inject(HudStateProvider)
    private hudStateProvider: HudStateProvider;

    @Inject(ThunderProvider)
    private thunderProvider: ThunderProvider;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    private inProgress = false;
    private cam: number = null;

    @OnEvent(ClientEvent.FIRESTORM)
    public async firestorm(position: Vector3, target: number) {
        this.nuiMenu.closeMenu();
        this.hudStateProvider.setHudVisible(false);
        this.inProgress = true;

        const tmpCams = [];
        const cam = CreateCam('DEFAULT_SPLINE_CAMERA', false);
        AddCamSplineNodeUsingGameplayFrame(cam, 0, 0);
        this.cam = cam;

        const coords = GetFinalRenderedCamCoord() as Vector3;
        const fov = GetFinalRenderedCamFov();

        const directionVect = sub2Vector3(position, coords);
        const angle = deg(Math.atan2(-directionVect[0], directionVect[1]));
        const fixedCoords = applyOffset([coords[0], coords[1], coords[2], angle], [0, 10, 100]);
        let newCam = CreateCamWithParams(
            'DEFAULT_SCRIPTED_CAMERA',
            fixedCoords[0],
            fixedCoords[1],
            fixedCoords[2],
            0,
            0,
            angle,
            fov,
            false,
            2
        );
        AddCamSplineNodeUsingCamera(cam, newCam, 4_000, 0);
        tmpCams.push(newCam);

        const midCoords = applyOffset([position[0], position[1], position[2], 180 + angle], [0, 800, 120]);
        newCam = CreateCamWithParams(
            'DEFAULT_SCRIPTED_CAMERA',
            midCoords[0],
            midCoords[1],
            midCoords[2],
            0,
            0,
            angle,
            fov,
            false,
            2
        );
        AddCamSplineNodeUsingCamera(cam, newCam, 8_000, 0);
        tmpCams.push(newCam);

        for (const node of SlineNodes) {
            const coords =
                node.coords ??
                applyOffset([position[0], position[1], position[2], node.rotation[2] + 180], node.offset);
            const newCam = CreateCamWithParams(
                'DEFAULT_SCRIPTED_CAMERA',
                coords[0],
                coords[1],
                coords[2],
                node.rotation[0],
                node.rotation[1],
                node.rotation[2],
                node.fov,
                false,
                2
            );

            AddCamSplineNodeUsingCamera(cam, newCam, node.delay, 0);

            tmpCams.push(newCam);
        }

        newCam = CreateCamWithParams(
            'DEFAULT_SCRIPTED_CAMERA',
            coords[0],
            coords[1],
            coords[2] + 100,
            0,
            0,
            angle,
            fov,
            false,
            2
        );
        AddCamSplineNodeUsingCamera(cam, newCam, 10_000, 0);
        tmpCams.push(newCam);

        AddCamSplineNodeUsingGameplayFrame(cam, 1_000, 0);

        SetCamActive(cam, true);
        RenderScriptCams(true, false, 0, false, false);

        while (GetCamSplineNodeIndex(cam) < 8) {
            const coords = GetFinalRenderedCamCoord();
            SetFocusArea(coords[0], coords[1], coords[2], 0, 0, 0);
            await wait(0);
        }

        await this.thunderProvider.thunder(target, ThunderPosition, true, 0.6);
        if (target == GetPlayerServerId(PlayerId())) {
            for (const firePos of ThunderFirePositions) {
                TriggerServerEvent(ServerEvent.ADMIN_STAR_NEW_FIRE_PIT, firePos, FireType.Huge, -1, false);
            }
        }

        while (GetCamSplinePhase(cam) < 1) {
            const coords = GetFinalRenderedCamCoord();
            SetFocusArea(coords[0], coords[1], coords[2], 0, 0, 0);
            await wait(0);
        }

        RenderScriptCams(false, true, 0, true, false);
        ClearFocus();

        for (const tmpcam of tmpCams) {
            DestroyCam(tmpcam, true);
        }
        delete this.cam;
        DestroyCam(cam, true);

        this.hudStateProvider.setHudVisible(true);
        this.inProgress = false;
    }

    @Tick()
    public fireStormControl() {
        if (!this.inProgress) {
            return;
        }

        DisableAllControlActions(0);
    }

    @OnNuiEvent(NuiEvent.AdminMenuFireStorm)
    public async tornadoMenu() {
        const confirmed = await this.input.askConfirm('Confirmer le lancement de la cinématique Firestorm (oui)');
        if (!confirmed) {
            return;
        }

        TriggerServerEvent(ServerEvent.ADMIN_FIRESTORM);
    }
}
