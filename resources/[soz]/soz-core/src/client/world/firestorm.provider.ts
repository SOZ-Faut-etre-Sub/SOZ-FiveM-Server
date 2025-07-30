import { OnEvent, OnNuiEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Tick } from '@public/core/decorators/tick';
import { wait } from '@public/core/utils';
import { ClientEvent } from '@public/shared/event';
import { NuiEvent } from '@public/shared/event/nui';
import { ServerEvent } from '@public/shared/event/server';
import { FireType } from '@public/shared/fire';
import { applyOffset, deg, sub2Vector3, Vector3 } from '@public/shared/polyzone/vector';
import { getRandomItem } from '@public/shared/random';

import { Provider } from '../../core/decorators/provider';
import { HudStateProvider } from '../hud/hud.state.provider';
import { InputService } from '../nui/input.service';
import { NuiDispatch } from '../nui/nui.dispatch';
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

const ThunderFirePositions: Vector3[] = [
    [-820.06, 1619.68, 213.237], //lightning

    [651.982971191406, 1846.8204345703125, 188.6777648925781],
    [1049.304931640625, 1860.4730224609375, 87.92979431152344],
    [660.5355224609375, 2237.455078125, 55.056907653808594],
    [356.906982421875, 2380.454833984375, 57.230934143066406],
    [206.9198760986328, 2017.8629150390625, 131.2091064453125],
    [53.48219680786133, 1927.70263671875, 190.8819885253906],
    [140.88043212890625, 2543.914794921875, 54.62744140625],
    [-121.8082275390625, 2031.232421875, 191.29147338867188],
    [-372.20654296875, 2155.973388671875, 178.0392150878906],
    [-86.7380676269531, 2879.409423828125, 52.59638214111328],
    [-69.34907531738281, 2690.638427734375, 68.91353607177734],
    [-327.6528625488281, 2259.945068359375, 136.6593322753906],
    [-477.8333740234375, 1944.3035888671875, 224.68954467773438],
    [-364.0010070800781, 2608.6171875, 84.6806945800781],
    [-523.4008178710938, 2268.137939453125, 121.48753356933594],
    [-604.486145019531, 1767.3592529296875, 211.4132385253906],
    [-814.3786010742188, 1915.3421630859375, 166.56488037109375],
    [-249.3444366455078, 1583.9835205078125, 335.0859069824219],
    [110.7459716796875, 2343.8427734375, 112.28221893310547],
    [-192.756103515625, 2371.759765625, 98.24796295166016],
    [-722.139709472656, 2548.550048828125, 57.83619689941406],
    [-956.553771972656, 2090.635009765625, 114.61012268066406],
    [-982.0704345703125, 2570.389404296875, 76.93160247802734],
    [-783.5214233398438, 1744.47216796875, 193.4712219238281],
    [-116.37676239013672, 1765.5167236328125, 239.0946350097656],
    [-518.206604003906, 1827.3516845703125, 242.59544372558594],
    [-739.696044921875, 1690.5833740234375, 206.53964233398438],
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

    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    private inProgress = false;
    private cam: number = null;

    @OnEvent(ClientEvent.FIRESTORM)
    public async firestorm(position: Vector3, target: number) {
        this.nuiMenu.closeMenu();
        this.hudStateProvider.setHudVisible(false);
        this.hudStateProvider.setCinematicMode(true, 3000);
        this.nuiDispatch.dispatch('meteor', 'destruction', true);
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
                TriggerServerEvent(
                    ServerEvent.ADMIN_STAR_NEW_FIRE_PIT,
                    [firePos[0], firePos[1], firePos[2], 0],
                    getRandomItem([FireType.Huge, FireType.Medium]),
                    -1,
                    false
                );
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
        this.hudStateProvider.setCinematicMode(false);
        this.nuiDispatch.dispatch('meteor', 'destruction', false);
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
