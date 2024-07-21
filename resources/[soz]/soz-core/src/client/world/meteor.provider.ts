import { Once, OnceStep, OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Tick } from '@public/core/decorators/tick';
import { emitRpc } from '@public/core/rpc';
import { wait } from '@public/core/utils';
import { MeteorSubMenuState } from '@public/shared/admin/admin';
import { ClientEvent } from '@public/shared/event';
import { Control } from '@public/shared/input';
import {
    add2Vector3,
    getDistance,
    multVector3,
    sub2Vector3,
    toVectorNorm,
    Vector3,
} from '@public/shared/polyzone/vector';
import { RpcServerEvent } from '@public/shared/rpc';
import { Bunkers } from '@public/shared/utils/bunkers';
import { VehicleSeat } from '@public/shared/vehicle/vehicle';

import { HudStateProvider } from '../hud/hud.state.provider';
import { Monitor } from '../monitor/monitor';
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

    @Inject(Monitor)
    public monitor: Monitor;

    private entity: number = null;
    private inEnd = false;
    private inExplosion = false;
    private prevPos: Vector3 = null;
    private meteorCam: number = null;
    private fixedCam: number = null;

    @Once(OnceStep.NuiLoaded)
    public async init() {
        const data = await emitRpc<MeteorSubMenuState>(RpcServerEvent.ADMIN_METEOR_STATE);
        this.nuiDispatch.dispatch('meteor', 'siren', data.siren);
        this.nuiDispatch.dispatch('meteor', 'music', data.music);
    }

    @OnEvent(ClientEvent.METEOR_START)
    public async meteorStart() {
        this.nuiDispatch.dispatch('meteor', 'load');

        const intId = GetInteriorFromEntity(PlayerPedId());

        if (!Bunkers.map(b => b.interiorId).includes(intId)) {
            this.monitor.traceEvent('meteor_outside', {});
        }

        const rock = GetHashKey('soz_prop_meteor');
        await this.resourceLoader.loadPtfxAsset('scr_ar_planes');
        await this.resourceLoader.loadPtfxAsset('core');
        await this.resourceLoader.loadModel(rock);

        await wait(2000);
        this.nuiDispatch.dispatch('meteor', 'start');

        this.entity = CreateObject(rock, start[0], start[1], start[2], false, false, false);
        SetEntityLodDist(this.entity, 0xffff);
        ActivatePhysics(this.entity);
        SetEntityCollision(this.entity, false, true);
        SetEntityCompletelyDisableCollision(this.entity, true, true);
        ApplyForceToEntity(this.entity, 1, 0.02, 0.0, 0.0, 0.02, 0.0, 0.0, 0, false, true, true, false, true);

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

        await wait(0);

        UseParticleFxAsset('core');
        const fx2 = StartParticleFxLoopedOnEntity(
            'proj_flare_trail',
            this.entity,
            0.0,
            10.0,
            0.0,
            90.0,
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
        this.resourceLoader.unloadPtfxAsset('scr_ar_planes');
        this.resourceLoader.unloadModel(rock);

        this.playerHealthProvider.setNutritionDisabled(true);
        this.hudStateProvider.setHudVisible(false);
        this.hudStateProvider.setCinematicMode(true, 3000);

        const coords = GetGameplayCamCoord() as Vector3;
        const rots = GetGameplayCamRot(2);
        const fov = GetGameplayCamFov();
        this.fixedCam = CreateCamWithParams(
            'DEFAULT_SCRIPTED_CAMERA',
            coords[0],
            coords[1],
            coords[2] + 300,
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
        AttachCamToEntity(this.meteorCam, this.entity, 200, -200, 200, false);
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
        SetEntityCoordsNoOffset(
            this.entity,
            56.947933197021484,
            -4487.18701171875,
            1295.6885986328125,
            false,
            false,
            false
        );
        SetCamActive(this.fixedCam, true);

        await wait(4_000);
        SetEntityCoordsNoOffset(
            this.entity,
            355.79681396484375,
            -3548.439697265625,
            1145.459716796875,
            false,
            false,
            false
        );
        SetCamActive(this.meteorCam, true);
        await wait(4_000);
        SetEntityCoordsNoOffset(
            this.entity,
            653.9935302734375,
            -2611.737060546875,
            995.6317138671875,
            false,
            false,
            false
        );

        SetCamCoord(this.fixedCam, -61.11, -395.41, 55.65);
        SetFocusPosAndVel(-61.11, -395.41, 55.65, 0, 0, 0);
        await wait(100);
        SetCamActive(this.fixedCam, true);
        await wait(7_000);
        SetEntityCoordsNoOffset(
            this.entity,
            1184.2420654296875,
            -946.111145019531,
            729.455322265625,
            false,
            false,
            false
        );
        SetCamActive(this.meteorCam, true);
        await wait(3_000);
        SetEntityCoordsNoOffset(
            this.entity,
            1406.410888671875,
            -248.2335205078125,
            618.0159912109375,
            false,
            false,
            false
        );

        SetCamCoord(this.fixedCam, 1098.45, -257.45, 69.23);
        SetFocusPosAndVel(1098.45, -257.45, 69.23, 0, 0, 0);
        await wait(100);
        SetCamActive(this.fixedCam, true);
        await wait(5_000);
        SetEntityCoordsNoOffset(this.entity, 1785.986328125, 944.097473144531, 427.8587951660156, false, false, false);
        SetCamActive(this.meteorCam, true);
        SetFocusEntity(this.entity);
    }

    @Tick()
    public async groundchecks() {
        if (!this.entity) {
            return;
        }

        DisableAllControlActions(0);
        DisableAllControlActions(2);

        EnableControlAction(0, Control.PushToTalk, true);
        EnableControlAction(0, Control.MpTextChatAll, true);

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
        if (dist < 350.0) {
            this.end();
        }
        if (dist < 200.0) {
            this.explosion(coords);
        }

        this.prevPos = coords;
    }

    private async explosion(coords: Vector3) {
        if (this.inExplosion) {
            return;
        }
        await this.resourceLoader.loadPtfxAsset('des_gas_station');
        UseParticleFxAsset('des_gas_station');
        StartParticleFxNonLoopedAtCoord(
            'ent_ray_paleto_gas_explosion',
            coords[0],
            coords[1],
            coords[2],
            0.0,
            0.0,
            0.0,
            50.0,
            false,
            false,
            false
        );
        this.resourceLoader.unloadPtfxAsset('des_gas_station');
        await wait(5000);

        this.inExplosion = false;
    }

    private async end() {
        if (this.inEnd) {
            return;
        }
        this.inEnd = true;

        SetEntityCollision(this.entity, false, false);
        SetEntityCompletelyDisableCollision(this.entity, true, false);

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

        await wait(30_000);
        DoScreenFadeIn(100);

        this.playerHealthProvider.setNutritionDisabled(false);
        this.hudStateProvider.setHudVisible(true);
        this.hudStateProvider.setCinematicMode(false);

        this.inEnd = false;
    }

    @OnEvent(ClientEvent.METEOR_MUSIC)
    public async meteorMusic(value: number) {
        this.nuiDispatch.dispatch('meteor', 'music', value);
    }

    @OnEvent(ClientEvent.METEOR_SIREN)
    public async meteorSiren(value: number) {
        this.nuiDispatch.dispatch('meteor', 'siren', value);
    }
}
