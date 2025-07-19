import { OnEvent, OnNuiEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Tick } from '@public/core/decorators/tick';
import { wait } from '@public/core/utils';
import { ClientEvent } from '@public/shared/event';
import { NuiEvent } from '@public/shared/event/nui';
import { ServerEvent } from '@public/shared/event/server';
import { FireType } from '@public/shared/fire';
import { deg, sub2Vector3, Vector3, Vector4 } from '@public/shared/polyzone/vector';

import { Provider } from '../../core/decorators/provider';
import { HudStateProvider } from '../hud/hud.state.provider';
import { InputService } from '../nui/input.service';
import { NuiMenu } from '../nui/nui.menu';
import { ThunderProvider } from './thunder.provider';

const SlineNodes: { coords: Vector3; rotation: Vector3; fov: number; delay: number }[] = [
    {
        coords: [-840.3261144764728, 1389.5676750916075, 390.9132385253906],
        rotation: [0, 0, -70],
        fov: 30,
        delay: 10000,
    },
    {
        coords: [-534.4292817618823, 1129.4982079579552, 403.9132385253906],
        rotation: [0, 0, -10],
        fov: 30,
        delay: 3000,
    },
    {
        coords: [-153.43502225580437, 1265.40396288914, 416.9132385253906],
        rotation: [0, 0, 50],
        fov: 30,
        delay: 3000,
    },
    {
        coords: [-80.11478426067276, 1666.2619710420734, 429.9132385253906],
        rotation: [0, 0, 110],
        fov: 30,
        delay: 3000,
    },
    {
        coords: [-392.9060169633337, 1932.1165266629046, 432.9132385253906],
        rotation: [0, 0, 170],
        fov: 30,
        delay: 3000,
    },
    {
        coords: [-659.3856811523438, 1948.3482666015625, 268.4766540527344],
        rotation: [-16.35215377807617, 0, -137.4142608642578],
        fov: 30,
        delay: 6000,
    },
    {
        coords: [-659.3856811523438, 1948.3482666015625, 268.4766540527344],
        rotation: [-16.35215377807617, 0, -137.4142608642578],
        fov: 40,
        delay: 3000,
    },
    {
        coords: [-1100.6282958984375, 1806.9210205078125, 445.99755859375],
        rotation: [-14.365459442138672, 0, -122.4211730957031],
        fov: 60,
        delay: 20_000,
    },
];

const ThunderFirePositions: Vector4[] = [
    [-593.89, 1879.05, 207.05, 0],
    [-820.02, 1753.45, 187.29, 0],
    [-796.3, 1612.69, 213.19, 0],
    [-370.01, 1600.63, 329.2, 0],
];
const ThunderPosition: Vector3 = [-593.89, 1879.05, 257.05];

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
        const rotation = GetFinalRenderedCamRot(2);
        const fov = GetFinalRenderedCamFov();

        let newCam = CreateCamWithParams(
            'DEFAULT_SCRIPTED_CAMERA',
            coords[0],
            coords[1],
            coords[2] + 50,
            rotation[0],
            rotation[1],
            rotation[2],
            fov,
            false,
            2
        );
        AddCamSplineNodeUsingCamera(cam, newCam, 2_000, 0);
        tmpCams.push(newCam);

        const directionVect = sub2Vector3(position, coords);
        const angle = deg(Math.atan2(-directionVect[0], directionVect[1]));
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
        AddCamSplineNodeUsingCamera(cam, newCam, 2_000, 0);
        tmpCams.push(newCam);

        for (const node of SlineNodes) {
            const newCam = CreateCamWithParams(
                'DEFAULT_SCRIPTED_CAMERA',
                node.coords[0],
                node.coords[1],
                node.coords[2],
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

        newCam = CreateCamWithParams(
            'DEFAULT_SCRIPTED_CAMERA',
            coords[0],
            coords[1],
            coords[2] + 50,
            rotation[0],
            rotation[1],
            rotation[2],
            fov,
            false,
            2
        );
        AddCamSplineNodeUsingCamera(cam, newCam, 1_000, 0);
        tmpCams.push(newCam);
        AddCamSplineNodeUsingGameplayFrame(cam, 1_000, 0);

        SetCamActive(cam, true);
        RenderScriptCams(true, false, 0, false, false);

        while (GetCamSplineNodeIndex(cam) < 8) {
            const coords = GetFinalRenderedCamCoord();
            SetFocusArea(coords[0], coords[1], coords[2], 0, 0, 0);
            await wait(0);
        }

        await this.thunderProvider.thunder(target, ThunderPosition, true);
        if (target == GetPlayerServerId(PlayerId())) {
            for (const firePos of ThunderFirePositions) {
                TriggerServerEvent(ServerEvent.ADMIN_STAR_NEW_FIRE_PIT, firePos, FireType.Huge, -1);
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
