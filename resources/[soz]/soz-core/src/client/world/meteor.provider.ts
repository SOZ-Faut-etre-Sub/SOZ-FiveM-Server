import { Command } from '@public/core/decorators/command';
import { OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Tick } from '@public/core/decorators/tick';
import { wait } from '@public/core/utils';
import { ClientEvent } from '@public/shared/event';
import {
    add2Vector3,
    getDistance,
    multVector3,
    sub2Vector3,
    toVectorNorm,
    Vector3,
} from '@public/shared/polyzone/vector';
import { VehicleSeat } from '@public/shared/vehicle/vehicle';

import { HudStateProvider } from '../hud/hud.state.provider';
import { NuiDispatch } from '../nui/nui.dispatch';
import { PlayerHealthProvider } from '../player/player.health.provider';
import { ResourceLoader } from '../repository/resource.loader';

const start: Vector3 = [-2334.91, -12000.5, 2500.0];
const dest: Vector3 = [2538.05, 3306.49, 52.85];

const speed = 2000;

@Provider()
export class MeteorProvider {
    @Inject(ResourceLoader)
    public resourceLoader: ResourceLoader;

    @Inject(NuiDispatch)
    public nuiDispatch: NuiDispatch;

    @Inject(HudStateProvider)
    public hudStateProvider: HudStateProvider;

    @Inject(PlayerHealthProvider)
    public playerHealthProvider: PlayerHealthProvider;

    private entity: number = null;
    private prevPos: Vector3 = null;
    private meteorCam: number = null;
    private fixedCam: number = null;

    @OnEvent(ClientEvent.METEOR_START)
    public async meteorStart() {
        this.nuiDispatch.dispatch('meteor', 'start');
        await wait(5000);

        const rock = GetHashKey('soz_prop_rock_m');
        await this.resourceLoader.loadModel(rock);
        this.entity = CreateObject(rock, start[0], start[1], start[2], true, true, false);
        AddBlipForEntity(this.entity);
        SetEntityLodDist(this.entity, 0xffff);
        ActivatePhysics(this.entity);
        SetEntityCollision(this.entity, false, true);
        SetEntityCompletelyDisableCollision(this.entity, true, true);
        //ApplyForceToEntity(this.entity, 1, 0.02, 0.0, 0.0, 0.02, 0.0, 0.0, 0, false, true, true, false, true);
        this.resourceLoader.unloadModel(rock);

        await this.resourceLoader.loadPtfxAsset('scr_ar_planes');
        UseParticleFxAsset('scr_ar_planes');
        const fx = StartParticleFxLoopedOnEntity(
            'scr_ar_trail_smoke',
            this.entity,
            0.0,
            -3.0,
            0.0,
            0.0,
            0.0,
            0.0,
            15.0,
            false,
            false,
            false
        );
        SetParticleFxLoopedColour(fx, 0, 0, 0, false);
        SetParticleFxLoopedFarClipDist(fx, 0xfff);

        this.resourceLoader.unloadPtfxAsset('scr_ar_planes');

        await wait(0);

        await this.resourceLoader.loadPtfxAsset('core');
        UseParticleFxAsset('core');
        const fx2 = StartParticleFxLoopedOnEntity(
            'proj_flare_trail',
            this.entity,
            5.0,
            12.0,
            8.0,
            0.0,
            0.0,
            0.0,
            150.0,
            false,
            false,
            false
        );
        SetParticleFxLoopedFarClipDist(fx2, 0xfff);

        await wait(0);

        UseParticleFxAsset('core');
        const fx3 = StartParticleFxLoopedOnEntity(
            'proj_missile_trail',
            this.entity,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            10.0,
            false,
            false,
            false
        );
        SetParticleFxLoopedFarClipDist(fx3, 0xfff);

        this.resourceLoader.unloadPtfxAsset('core');

        await wait(2_000);
        this.playerHealthProvider.setNutritionDisabled(true);
        this.hudStateProvider.setHudVisible(false);
        this.hudStateProvider.setCinematicMode(true);

        const coords = GetGameplayCamCoord() as Vector3;
        const rots = GetGameplayCamRot(2);
        const fov = GetGameplayCamFov();
        this.fixedCam = CreateCamWithParams(
            'DEFAULT_SCRIPTED_CAMERA',
            coords[0],
            coords[1],
            coords[2] + 100,
            -80,
            rots[1],
            rots[2],
            fov,
            true,
            2
        );
        RenderScriptCams(true, true, 3_000, true, false);
        await wait(3_000);

        this.meteorCam = CreateCam('DEFAULT_SCRIPTED_CAMERA', true);
        AttachCamToEntity(this.meteorCam, this.entity, 200, -200, 200, true);
        PointCamAtEntity(this.meteorCam, this.entity, 0, 70, 30, true);
        SetCamActiveWithInterp(this.meteorCam, this.fixedCam, 10_000, 1, 1);
        RenderScriptCams(true, true, 10_000, true, false);

        await wait(7_000);
        SetFocusEntity(this.entity);

        await wait(20_000);

        PointCamAtEntity(this.fixedCam, this.entity, 0, 50, 0, true);
        SetCamCoord(this.fixedCam, 261.35, -2507.22, 9.43);
        SetFocusPosAndVel(261.35, -2507.22, 9.43, 0, 0, 0);
        await wait(100);
        SetCamActive(this.fixedCam, true);

        await wait(4_000);
        SetCamActive(this.meteorCam, true);
        await wait(4_000);

        SetCamCoord(this.fixedCam, -61.11, -395.41, 55.65);
        SetFocusPosAndVel(-61.11, -395.41, 55.65, 0, 0, 0);
        await wait(100);
        SetCamActive(this.fixedCam, true);
        await wait(7_000);
        SetCamActive(this.meteorCam, true);
        await wait(3_000);

        SetCamCoord(this.fixedCam, 1098.45, -257.45, 69.23);
        SetFocusPosAndVel(1098.45, -257.45, 69.23, 0, 0, 0);
        await wait(100);
        SetCamActive(this.fixedCam, true);
        await wait(5_000);
        SetCamActive(this.meteorCam, true);
        SetFocusEntity(this.entity);
    }

    @Tick()
    public async groundchecks() {
        if (!this.entity) {
            return;
        }

        const coords = GetEntityCoords(this.entity) as Vector3;

        const diff = sub2Vector3(dest, coords);
        const norm = multVector3(diff, 1 / toVectorNorm(diff));
        const speedVector = multVector3(norm, speed);

        if (
            this.prevPos &&
            coords[0] == this.prevPos[0] &&
            coords[1] == this.prevPos[1] &&
            coords[2] == this.prevPos[2]
        ) {
            const fakeSpeedVector = multVector3(norm, speed / 300);
            const newpos = add2Vector3(coords, fakeSpeedVector);
            SetEntityCoords(this.entity, newpos[0], newpos[1], newpos[2], false, false, false, false);
        }

        SetEntityVelocity(this.entity, speedVector[0], speedVector[1], speedVector[2]);

        const dist = getDistance(coords, dest);
        if (dist < 70.0) {
            this.nuiDispatch.dispatch('meteor', 'white');
            await wait(2500);
            DeleteEntity(this.entity);
            this.entity = null;
            ClearFocus();

            RenderScriptCams(false, true, 100, true, false);
            DestroyCam(this.meteorCam, false);
            DestroyCam(this.fixedCam, false);
            await wait(1500);

            const vehs = GetGamePool('CVehicle');
            for (const veh of vehs) {
                if (NetworkHasControlOfEntity(veh)) {
                    if (!IsVehicleEngineOn(veh)) {
                        SetVehicleAlarm(veh, true);
                        StartVehicleAlarm(veh);
                    } else {
                        const driver = GetPedInVehicleSeat(veh, VehicleSeat.Driver);
                        if (driver && !IsPedAPlayer(driver)) {
                            SetVehicleOutOfControl(veh, true, false);
                        }
                    }
                }
            }

            const peds = GetGamePool('CPed');
            for (const ped of peds) {
                if (NetworkHasControlOfEntity(ped)) {
                    const veh = GetVehiclePedIsIn(ped, false);
                    if (veh != null) {
                        SetPedToRagdoll(ped, 10_000, 10_000, 0, false, false, false);
                    }
                }
            }
            await wait(100);
            ShakeGameplayCam('LARGE_EXPLOSION_SHAKE', 1.0);

            await wait(3000);
            DoScreenFadeOut(2000);

            await wait(10_000);
            DoScreenFadeIn(100);

            this.playerHealthProvider.setNutritionDisabled(false);
            this.hudStateProvider.setHudVisible(true);
            this.hudStateProvider.setCinematicMode(false);
        }

        this.prevPos = coords;
    }

    @Command('delm')
    d() {
        RenderScriptCams(false, true, 100, true, false);
        DestroyCam(this.fixedCam, false);
        DestroyCam(this.meteorCam, false);

        if (this.entity) {
            DeleteEntity(this.entity);
            this.entity = null;
        }
        ClearFocus();

        this.nuiDispatch.dispatch('meteor', 'end');

        this.playerHealthProvider.setNutritionDisabled(false);
        this.hudStateProvider.setHudVisible(true);
        this.hudStateProvider.setCinematicMode(false);
    }

    @Tick(100)
    public async audioPositions() {
        if (!this.entity) {
            return;
        }

        const customCam = IsCamActive(this.fixedCam)
            ? this.fixedCam
            : IsCamActive(this.meteorCam)
              ? this.meteorCam
              : null;

        const coords = (customCam ? GetCamCoord(customCam) : GetGameplayCamCoord()) as Vector3;
        const heading = ((customCam ? GetCamRot(customCam, 2) : GetGameplayCamRot(2))[2] / 180) * Math.PI;
        const meteorCoords = GetEntityCoords(this.entity) as Vector3;

        this.nuiDispatch.dispatch('meteor', 'update', {
            heading: heading,
            playerPosition: coords,
            meteorPostion: meteorCoords,
        });
    }

    @OnEvent(ClientEvent.METEOR_MUSIC_ACTIVATE)
    public async meteorMusicActivate(value: boolean) {
        this.nuiDispatch.dispatch('meteor', 'music', value);
    }
}
