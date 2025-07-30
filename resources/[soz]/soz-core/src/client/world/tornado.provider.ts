import { Once, OnceStep, OnEvent, OnNuiEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Tick } from '@public/core/decorators/tick';
import { Logger } from '@public/core/logger';
import { wait } from '@public/core/utils';
import { ClientEvent } from '@public/shared/event';
import { NuiEvent } from '@public/shared/event/nui';
import { ServerEvent } from '@public/shared/event/server';
import {
    add2Vector3,
    applyOffset,
    deg,
    getDistance,
    multVector3,
    sub2Vector3,
    toVector2Norm,
    toVectorNorm,
    Vector3,
} from '@public/shared/polyzone/vector';
import { getRandomInt } from '@public/shared/random';

import { Provider } from '../../core/decorators/provider';
import { Notifier } from '../notifier';
import { AudioService } from '../nui/audio.service';
import { ObjectService } from '../object/object.service';
import { FuelStationRepository } from '../repository/fuel.station.repository';
import { ResourceLoader } from '../repository/resource.loader';

const VORTEX_MOVE_SPEED = 10.0;
const VORTEX_MAX_ENTITY_DIST = 225.0;
const VORTEX_HORIZONTAL_PULL_FORCE = 300;
const VORTEX_HORIZONTAL_PULL_FORCE_VEH_BONUS = 5;
const VORTEX_ROTATION_SPEED = 150;
const VORTEX_MAX_PARTICLE_LAYERS = 18;
const VORTEX_PARTICLE_COUNT = 3;
const VORTEX_LAYER_SEPERATION_SCALE = 24.0;
const VORTEX_PARTICLE_NAME = 'soz_tornado';
const VORTEX_PARTICLE_ASSET = 'soz';
const VORTEX_PARTICLE2_NAME = 'scr_env_agency3b_smoke';
const VORTEX_PARTICLE2_ASSET = 'scr_agencyheistb';

type Particule = {
    rotation: number;
    prop: number;
    height: number;
    ptfxAsset: string;
    ptfxName: string;
    ptfxSize: number;
    ptfx: number;
    isCloud: boolean;
    radius: number;
};

const MODEL = 'prop_beachball_02';

@Provider()
export class TornadoProvider {
    @Inject(ObjectService)
    public objectService: ObjectService;

    @Inject(AudioService)
    public audioService: AudioService;

    @Inject(ResourceLoader)
    public resourceLoader: ResourceLoader;

    @Inject(FuelStationRepository)
    private fuelStationRepository: FuelStationRepository;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(Logger)
    private logger: Logger;

    private startLocation: Vector3;
    private startTime: number;
    private destination: Vector3;
    private exitSlowDown = 1;
    private particles: Particule[] = null;
    private movingNotifDist: Vector3 = null;
    private prevZ: number = null;

    @Once()
    public async init() {
        await wait(10_000);
        TriggerServerEvent(ServerEvent.TORNADO);
    }

    @OnEvent(ClientEvent.TORNADO)
    public async startTornado(startTime: number, startLocation: Vector3, destination: Vector3, immediate = false) {
        if (!startTime && !startLocation) {
            this.delete();
            return;
        }

        this.startLocation = startLocation;
        this.destination = destination;
        this.startTime = startTime;

        if (this.particles) {
            return;
        }

        this.particles = [];
        this.createVortex(immediate);
    }

    @Tick()
    public tornadoUpdate() {
        if (!this.particles) {
            return;
        }
        const frameDelta = GetFrameTime();
        const center = this.computePosition();

        for (const particle of this.particles) {
            this.particuleUpdate(particle, center, frameDelta);
        }
        this.tornadoPulledEntities(center);
    }

    private async createVortex(immediate: boolean) {
        await this.resourceLoader.requestScriptAudioBank('audiodirectory/tornado');
        const layerSize = VORTEX_LAYER_SEPERATION_SCALE;
        const particleCount = VORTEX_PARTICLE_COUNT;
        const maxLayers = VORTEX_MAX_PARTICLE_LAYERS;
        const particleAsset = VORTEX_PARTICLE_ASSET;
        const particleName = VORTEX_PARTICLE_NAME;
        const baseRadius = 5;
        const baseSize = 3;
        this.exitSlowDown = 1;

        const center = this.computePosition();

        await this.resourceLoader.loadModel(MODEL);
        await this.resourceLoader.loadPtfxAsset(VORTEX_PARTICLE2_ASSET);
        await this.resourceLoader.loadPtfxAsset(VORTEX_PARTICLE_ASSET);

        for (let layerIdx = 0; layerIdx < maxLayers; layerIdx++) {
            const particleLayerCount = layerIdx == maxLayers - 3 || layerIdx < 3 ? particleCount + 5 : particleCount;
            const particleSize = baseSize + 1.5 * layerIdx;
            const radius = baseRadius + layerIdx * 3;
            for (let angle = 0; angle < particleLayerCount; angle++) {
                const rotation = (angle * 360) / particleLayerCount;

                if (layerIdx < 1) {
                    //debris layer
                    const particle = await this.createParticule(
                        center,
                        rotation,
                        VORTEX_PARTICLE2_ASSET,
                        VORTEX_PARTICLE2_NAME,
                        layerIdx * layerSize,
                        radius,
                        4.7,
                        false
                    );
                    this.particles.push(particle);
                    AddShockingEventForEntity(86, particle.prop, 0);
                } else if (layerIdx > maxLayers - 3) {
                    const particle = await this.createParticule(
                        center,
                        rotation,
                        VORTEX_PARTICLE2_ASSET,
                        VORTEX_PARTICLE2_NAME,
                        layerIdx * layerSize + 200,
                        radius * 3.2,
                        100,
                        true
                    );
                    this.particles.push(particle);
                }

                const particle = await this.createParticule(
                    center,
                    rotation + getRandomInt(-20, 20),
                    particleAsset,
                    particleName,
                    layerIdx * layerSize + (angle * layerSize) / particleLayerCount,
                    radius,
                    particleSize,
                    false
                );
                this.particles.push(particle);
            }
        }

        for (const particle of this.particles) {
            UseParticleFxAsset(particle.ptfxAsset);
            particle.ptfx = StartParticleFxLoopedOnEntity(
                particle.ptfxName,
                particle.prop,
                0,
                0,
                0,
                0,
                0,
                0,
                particle.ptfxSize,
                false,
                false,
                false
            );

            if (!particle.ptfx) {
                console.log('Failed to create tornado ptfx');
            }

            if (!immediate) {
                await wait(200);
            }
        }

        this.resourceLoader.unloadModel(MODEL);
        this.resourceLoader.unloadPtfxAsset(VORTEX_PARTICLE2_ASSET);
        this.resourceLoader.unloadPtfxAsset(VORTEX_PARTICLE_ASSET);
    }

    private async createParticule(
        center: Vector3,
        rotation: number,
        ptfxAsset: string,
        ptfxName: string,
        height: number,
        radius: number,
        size: number,
        isTopParticle: boolean
    ): Promise<Particule> {
        const newPosition = applyOffset([center[0], center[1], center[2], rotation], [0, radius, height]);

        const prop = CreateObject(MODEL, newPosition[0], newPosition[1], newPosition[2], false, false, false);
        SetEntityCollision(prop, false, false);
        //SetEntityLodDist(prop, 0xffff);
        SetEntityVisible(prop, false, false);
        FreezeEntityPosition(prop, true);
        //SetEntityDrawOutline(prop, true);

        return {
            rotation,
            ptfxAsset,
            ptfxName,
            ptfxSize: size,
            ptfx: 0,
            height,
            prop,
            isCloud: isTopParticle,
            radius,
        };
    }

    private async delete() {
        if (!this.particles) {
            return;
        }

        const end = Date.now() + 20_000;
        for (const particle of this.particles) {
            StopParticleFxLooped(particle.ptfx, false);
            RemoveParticleFx(particle.ptfx, false);
            this.exitSlowDown = (end - Date.now()) / 20_000;
            await wait(200);
        }
        while (Date.now() < end) {
            await wait(0);
        }

        if (this.particles) {
            for (const particle of this.particles) {
                DeleteEntity(particle.prop);
            }
        }

        delete this.particles;
        delete this.startLocation;
        delete this.destination;
        delete this.startTime;
        delete this.prevZ;
        this.exitSlowDown = 1;
        SetWind(-1);
        SetWindDirection(-1);
    }

    private computePosition(): Vector3 {
        const diffTotal = sub2Vector3(this.destination, this.startLocation);
        const distTotal = toVectorNorm(diffTotal);
        const realdist = Math.min(distTotal, ((GetNetworkTimeAccurate() - this.startTime) / 1000) * VORTEX_MOVE_SPEED);
        if (realdist == distTotal) {
            if (JSON.stringify(this.movingNotifDist) == JSON.stringify(this.destination)) {
                this.notifier.notify('La tornade a fini son déplacement', 'success');
                delete this.movingNotifDist;
            }
            return this.destination;
        }
        const realDiff = multVector3(diffTotal, realdist / distTotal);

        const position = add2Vector3(this.startLocation, realDiff);
        if (this.prevZ == null) {
            this.prevZ = position[2];
        }

        const [ret, val] = GetGroundZFor_3dCoord(position[0], position[1], this.prevZ + 1000, true);
        const expected = ret ? val + 1 : position[2];
        if (expected > this.prevZ) {
            position[2] = Math.min(this.prevZ + 0.5, expected);
        } else {
            position[2] = Math.max(this.prevZ - 0.5, expected);
        }

        this.prevZ = position[2];
        return position;
    }

    private particuleUpdate(particle: Particule, center: Vector3, frameDelta: number) {
        if (particle.isCloud) {
            particle.rotation = particle.rotation + VORTEX_ROTATION_SPEED * 0.06 * frameDelta * this.exitSlowDown;
        } else {
            particle.rotation = particle.rotation + VORTEX_ROTATION_SPEED * frameDelta * this.exitSlowDown;
        }

        if (particle.rotation > 360) {
            particle.rotation -= 360;
        }

        const newPosition = applyOffset(
            [center[0], center[1], center[2], particle.rotation],
            [0, particle.radius, particle.height]
        );

        SetEntityCoords(particle.prop, newPosition[0], newPosition[1], newPosition[2], false, false, false, false);
    }

    @OnNuiEvent(NuiEvent.AdminMenuTornado)
    public async tornadoMenu(activate: boolean) {
        if (this.exitSlowDown < 1) {
            this.notifier.notify("La tornade en cours d'arret", 'error');
            return;
        }

        TriggerServerEvent(
            ServerEvent.ADMIN_TORNADO,
            activate,
            GetEntityCoords(PlayerPedId()),
            GetNetworkTimeAccurate()
        );
    }

    @OnNuiEvent(NuiEvent.AdminMenuTornadoMove)
    public async tornadoMove() {
        if (!this.particles || this.exitSlowDown < 1) {
            this.notifier.notify('Pas de tornade en cours', 'error');
            return;
        }

        const destination = GetEntityCoords(PlayerPedId()) as Vector3;
        this.notifier.notify('La tornade se déplace', 'success');
        this.movingNotifDist = destination;

        TriggerServerEvent(
            ServerEvent.ADMIN_TORNADO_MOVE,
            destination,
            this.computePosition(),
            GetNetworkTimeAccurate()
        );
    }

    private async tornadoPulledEntities(center: Vector3) {
        if (!this.particles || this.exitSlowDown < 1) {
            return;
        }

        const playerCoords = GetEntityCoords(PlayerPedId()) as Vector3;
        if (getDistance(playerCoords, center) < 500) {
            SetWind(70.0);
            SetWindSpeed(70.0);
            const directionVect = sub2Vector3(center, playerCoords);
            const angle = deg(Math.atan2(-directionVect[0], directionVect[1]));
            SetWindDirection(angle);
            Citizen.invokeNative('0x31950ebe600e22b4', true, GetHashKey('WEATHER_TYPES_HIGH_ELEVATION_BASE_JUMP_HELI'));
        } else {
            SetWind(-1);
            SetWindDirection(-1);
            Citizen.invokeNative(
                '0x31950ebe600e22b4',
                false,
                GetHashKey('WEATHER_TYPES_HIGH_ELEVATION_BASE_JUMP_HELI')
            );
            return;
        }

        const allEntities = {
            peds: GetGamePool('CPed'),
            cars: GetGamePool('CVehicle'),
            objs: GetGamePool('CObject'),
        };
        for (const [type, entities] of Object.entries(allEntities)) {
            for (const entity of entities) {
                if (IsEntityPositionFrozen(entity) || IsEntityAttached(entity)) {
                    continue;
                }

                if (!NetworkGetEntityIsNetworked(entity) || NetworkHasControlOfEntity(entity)) {
                    if (GetInteriorFromEntity(entity)) {
                        continue;
                    }

                    const model = GetEntityModel(entity);
                    if (this.fuelStationRepository.getModels().includes(model)) {
                        continue;
                    }

                    const coords = GetEntityCoords(entity) as Vector3;
                    const vect = sub2Vector3(center, coords);
                    const dist = toVector2Norm(vect);
                    if (dist > (3 * VORTEX_MAX_ENTITY_DIST) / 4) {
                        continue;
                    }

                    const isPed = type == 'peds';

                    if (isPed && GetVehiclePedIsIn(entity, false)) {
                        continue;
                    }
                    if (isPed && GetVehiclePedIsIn(entity, false)) {
                        continue;
                    }

                    const coefDiff = (VORTEX_MAX_ENTITY_DIST - dist) / VORTEX_MAX_ENTITY_DIST;
                    let coefType = 1;
                    let aircraft = false;
                    if (type == 'cars') {
                        coefType = VORTEX_HORIZONTAL_PULL_FORCE_VEH_BONUS;
                        if (['heli', 'plane'].includes(GetVehicleType(entity))) {
                            coefType = VORTEX_HORIZONTAL_PULL_FORCE_VEH_BONUS * 10;
                            aircraft = true;
                        }
                    }

                    const height = aircraft ? 1 : coords[2] - (250 + center[2]);
                    const angle = deg(Math.atan2(-vect[0], vect[1]));
                    const correctedAngle =
                        angle - deg(Math.atan(height / 10) + (3 * Math.PI) / 4) * (height < 0 ? coefDiff : 1);
                    const newCenter = applyOffset([coords[0], coords[1], coords[2], correctedAngle], [0, dist, 0]);
                    const forceVect = sub2Vector3(newCenter, coords);

                    const forceCoef = (VORTEX_HORIZONTAL_PULL_FORCE / dist + 5) * coefDiff * coefType;

                    if (isPed && forceCoef > 2 && !IsPedRagdoll(entity)) {
                        if (IsPedRagdoll(entity)) {
                            ResetPedRagdollTimer(entity);
                        } else {
                            SetPedToRagdoll(entity, 15000, 15000, 0, false, false, false);
                            SetPedRagdollForceFall(entity);
                        }
                    }

                    const force = multVector3(forceVect, forceCoef);
                    const speed = multVector3(GetEntityVelocity(entity) as Vector3, 5);
                    force[2] = 10 * coefDiff * coefType * 30;

                    if (type == 'objs' && forceCoef > 2) {
                        BreakObjectFragmentChild(entity, 0, false);
                    }
                    if (!IsEntityAMissionEntity(entity)) {
                        SetEntityProofs(entity, false, false, true, true, false, false, false, false);
                    }

                    ApplyForceToEntityCenterOfMass(
                        entity,
                        1,
                        force[0] - speed[0],
                        force[1] - speed[1],
                        force[2] - speed[2],
                        false,
                        false,
                        false,
                        false
                    );

                    //await wait(0);
                }
            }
        }
    }

    @Once(OnceStep.Stop)
    public onStop() {
        if (!this.particles) {
            return;
        }

        for (const particle of this.particles) {
            StopParticleFxLooped(particle.ptfx, false);
            RemoveParticleFx(particle.ptfx, false);
            DeleteEntity(particle.prop);
        }

        delete this.particles;
        delete this.startLocation;
        delete this.destination;
        delete this.startTime;
        delete this.prevZ;
        SetWind(-1);
        SetWindDirection(-1);
    }
}
