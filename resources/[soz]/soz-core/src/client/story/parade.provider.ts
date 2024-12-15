import { OnEvent } from '@public/core/decorators/event';
import { Tick, TickInterval } from '@public/core/decorators/tick';
import { wait } from '@public/core/utils';
import { ClientEvent } from '@public/shared/event';
import {
    add2Vector3,
    applyOffset,
    deg,
    getDistance,
    sub2Vector3,
    toVector4Object,
    Vector3,
    Vector4,
} from '@public/shared/polyzone/vector';
import { Parade, Spotlights } from '@public/shared/story/parade';
import { getDefaultVehicleConfiguration } from '@public/shared/vehicle/modification';
import { VehicleSeat } from '@public/shared/vehicle/vehicle';

import { SENAT_LOCATION } from '../../config/ceremony.senat';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { CameraService } from '../camera';
import { PedFactory } from '../factory/ped.factory';
import { HudStateProvider } from '../hud/hud.state.provider';
import { NuiDispatch } from '../nui/nui.dispatch';
import { PlayerHealthProvider } from '../player/player.health.provider';
import { ResourceLoader } from '../repository/resource.loader';
import { VehicleService } from '../vehicle/vehicle.service';
import { VoipService } from '../voip/voip.service';
import { SpotlightProvider } from '../world/spotlight.provider';

@Provider()
export class ParadeProvider {
    @Inject(PedFactory)
    private pedFactory: PedFactory;

    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

    @Inject(VehicleService)
    private vehicleService: VehicleService;

    @Inject(SpotlightProvider)
    private spotlightProvider: SpotlightProvider;

    @Inject(CameraService)
    private readonly cameraService: CameraService;

    @Inject(NuiDispatch)
    public nuiDispatch: NuiDispatch;

    @Inject(HudStateProvider)
    public hudStateProvider: HudStateProvider;

    @Inject(PlayerHealthProvider)
    public playerHealthProvider: PlayerHealthProvider;

    @Inject(VoipService)
    public voipService: VoipService;

    private running = false;
    private peds: { index: number; peds: number[]; vehs: number[][] }[] = [];
    private camera: number;
    private isMutedBeforeLaunch = false;

    private senatPilarSpotlights = SENAT_LOCATION.spotlights.filter(
        spotlight => spotlight.action === 'add' && spotlight.id.startsWith('senat-spotlight-pilar')
    );

    get isRunning() {
        return this.running;
    }

    @Tick()
    async onTick() {
        if (!this.running) return;

        DisableAllControlActions(0);
    }

    @OnEvent(ClientEvent.PARADE_INIT)
    public async onInit() {
        this.running = true;

        this.senatPilarSpotlights.forEach(spotlight => {
            this.spotlightProvider.createSpotlight(
                spotlight.id,
                spotlight.position,
                spotlight.target,
                spotlight.color,
                spotlight.distance,
                spotlight.radius,
                spotlight.brightness,
                spotlight.roundness,
                10_000
            );
        });

        Spotlights.forEach((coords, index) => {
            this.spotlightProvider.createSpotlight(
                'parade' + index,
                coords,
                [coords[0], coords[1], coords[2] - 10],
                [10, 49, 255],
                50,
                200,
                1,
                0,
                10_000
            );
        });

        this.camera = this.cameraService.createCamera([-533.97, -686.75, 45.31], 60);
        this.cameraService.setCameraActive(this.camera, true);
        this.cameraService.setCameraPointAt(this.camera, [-553.84, -641.39, 35.27]);
        this.cameraService.renderCamera(5000);

        this.isMutedBeforeLaunch = this.voipService.isPlayerMuted();

        this.playerHealthProvider.setNutritionDisabled(true);
        this.hudStateProvider.setHudVisible(false);
        await this.voipService.mutePlayer(true);
    }

    @OnEvent(ClientEvent.PARADE_SPAWN)
    public async onSpawn(blockIndex: number) {
        const block = Parade.blocks[blockIndex];
        if (!block) {
            return;
        }

        const delta = sub2Vector3(Parade.end, Parade.start);
        const heading = Math.atan(-delta[0] / delta[1]);
        const headingDeg = deg(heading);

        await this.resourceLoader.loadAnimationSet('move_m@multiplayer');

        const peds = new Map<number, Vector4>();
        const vehs = new Map<number, number[]>();
        const boost = new Map<number, number>();
        let hair = 0;
        let offsetY = 0;
        for (const row of block.peds) {
            offsetY += row.offsetY;
            for (const elem of row.peds) {
                hair++;
                if (hair == 24) {
                    hair++;
                }
                const coords = applyOffset([...Parade.start, headingDeg] as Vector4, [elem.offsetX, -offsetY, 0]);
                const ped = await this.pedFactory.createPed({
                    ...block.pedConfig[elem.config],
                    coords: toVector4Object(coords),
                    network: false,
                    blockevents: true,
                    invincible: true,
                    skin: {
                        Model: {
                            Hash: 0,
                            Father: 0,
                            Mother: 0,
                            ShapeMix: 0,
                            SkinMix: 0,
                        },
                        Hair: {
                            HairColor: 61,
                            HairSecondaryColor: 54,
                            HairType: hair,
                        },
                    },
                });
                SetPedConfigFlag(ped, 35, false);
                SetPedMovementClipset(ped, 'move_m@multiplayer', 0.0);

                const dest = applyOffset([...Parade.end, headingDeg] as Vector4, [elem.offsetX, -offsetY, 0]);
                peds.set(ped, dest);
                boost.set(ped, elem.speedBoost ?? 0);

                if (elem.car) {
                    const hash = GetHashKey(elem.car);
                    await this.resourceLoader.loadModel(hash);
                    const z = IsThisModelAHeli(hash) ? 15 : 0;
                    const vehicle = CreateVehicle(hash, coords[0], coords[1], coords[2] + z, coords[3], false, false);
                    this.vehicleService.applyVehicleConfiguration(vehicle, {
                        ...getDefaultVehicleConfiguration(),
                        ...elem.carConfig,
                    });
                    SetVehicleEngineOn(vehicle, true, true, false);
                    SetVehicleSiren(vehicle, true);
                    SetVehicleHasMutedSirens(vehicle, true);
                    vehs.set(ped, [vehicle]);
                    TaskWarpPedIntoVehicle(ped, vehicle, VehicleSeat.Driver);
                    SetHeliBladesSpeed(vehicle, 1.0);

                    this.resourceLoader.unloadModel(hash);

                    if (elem.boat) {
                        const boattrailerHash = GetHashKey('tr2');
                        await this.resourceLoader.loadModel(boattrailerHash);
                        const trailer = CreateVehicle(
                            boattrailerHash,
                            coords[0],
                            coords[1],
                            coords[2],
                            coords[3],
                            false,
                            false
                        );
                        AttachVehicleToTrailer(vehicle, trailer, 5);

                        const boatHash = GetHashKey(elem.boat);
                        await this.resourceLoader.loadModel(boatHash);
                        const boat = CreateVehicle(
                            boatHash,
                            coords[0],
                            coords[1],
                            coords[2] + z,
                            coords[3],
                            false,
                            false
                        );
                        this.vehicleService.applyVehicleConfiguration(boat, {
                            ...getDefaultVehicleConfiguration(),
                            ...elem.boatConfig,
                        });
                        let offset: Vector3 = [0, 0, -3];
                        if (elem.boatOffset) {
                            offset = add2Vector3(offset, elem.boatOffset);
                        }
                        AttachVehicleOnToTrailer(boat, trailer, offset[0], offset[1], offset[2], 0, 0, 0, 0, 0, 180, 0);
                        SetVehicleSiren(boat, true);
                        SetVehicleHasMutedSirens(boat, true);
                        vehs.get(ped).push(trailer);
                        vehs.get(ped).push(boat);

                        this.resourceLoader.unloadModel(boattrailerHash);
                        this.resourceLoader.unloadModel(boatHash);
                    }
                }
            }
        }
        await wait(500);

        for (const [ped, pedVehs] of vehs.entries()) {
            if (pedVehs.length > 0) {
                ClearPedTasks(ped);
                TaskWarpPedIntoVehicle(ped, pedVehs[0], VehicleSeat.Driver);
            }
        }

        await wait(500);

        for (const [ped, dest] of peds.entries()) {
            const veh = vehs.get(ped);
            if (veh) {
                TaskVehicleDriveToCoord(
                    ped,
                    veh[0],
                    dest[0],
                    dest[1],
                    dest[2],
                    1.8 + boost.get(ped),
                    0,
                    0,
                    16777216,
                    0.2,
                    -1.0
                );
            } else {
                TaskGoStraightToCoord(ped, dest[0], dest[1], dest[2], 1.0, -1, dest[3], 0.0);
            }
        }

        this.peds.push({
            index: blockIndex,
            peds: Array.from(peds.keys()),
            vehs: Array.from(vehs.values()),
        });
    }

    @Tick(TickInterval.EVERY_SECOND * 5)
    public paradeloop() {
        const delta = sub2Vector3(Parade.end, Parade.start);
        const heading = Math.PI + Math.atan(delta[0] / -delta[1]);
        const headingDeg = deg(heading);

        for (let indexBlock = this.peds.length - 1; indexBlock >= 0; indexBlock--) {
            const block = this.peds[indexBlock];

            const coords = GetEntityCoords(block.peds[0]) as Vector3;
            const dest = applyOffset([...Parade.end, headingDeg] as Vector4, [
                Parade.blocks[block.index].peds[0].peds[0].offsetX,
                -Parade.blocks[block.index].peds[0].offsetY,
                0,
            ]);
            if (getDistance(coords, dest) < 5.0) {
                for (const ped of block.peds) {
                    this.pedFactory.unspawnEntity(ped);
                }
                for (const vehs of block.vehs) {
                    for (const veh of vehs) {
                        DeleteVehicle(veh);
                    }
                }
                this.peds.splice(indexBlock, 1);
            }
        }
    }

    @OnEvent(ClientEvent.PARADE_DELETE)
    public async onParadeClear() {
        this.running = false;

        for (const block of this.peds) {
            for (const ped of block.peds) {
                this.pedFactory.unspawnEntity(ped);
            }
            for (const vehs of block.vehs) {
                for (const veh of vehs) {
                    DeleteVehicle(veh);
                }
            }
        }
        this.peds = [];

        Spotlights.forEach((_coords, index) => {
            this.spotlightProvider.updateSpotlight('parade' + index, 0, 500);
        });
        this.senatPilarSpotlights.forEach(spotlight => {
            this.spotlightProvider.updateSpotlight(spotlight.id, 0, 500);
        });

        await wait(500);

        Spotlights.forEach((_coords, index) => {
            this.spotlightProvider.deleteSpotlight('parade' + index);
        });
        this.senatPilarSpotlights.forEach(spotlight => {
            this.spotlightProvider.deleteSpotlight(spotlight.id);
        });

        this.cameraService.deleteCamera();
        this.hudStateProvider.setHudVisible(true);
        this.playerHealthProvider.setNutritionDisabled(false);

        if (!this.isMutedBeforeLaunch) {
            await this.voipService.mutePlayer(false);
        }
    }
}
