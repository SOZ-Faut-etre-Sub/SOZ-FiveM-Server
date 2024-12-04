import { Command } from '@core/decorators/command';

import { ALL_LOCATIONS, TriggerableAction } from '../../../config/ceremony';
import { OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { Tick } from '../../../core/decorators/tick';
import { SozRole } from '../../../core/permissions';
import { wait } from '../../../core/utils';
import { ClientEvent } from '../../../shared/event/client';
import { add2Vector3, getDistance, Vector3 } from '../../../shared/polyzone/vector';
import { CameraService } from '../../camera';
import { HudStateProvider } from '../../hud/hud.state.provider';
import { NuiDispatch } from '../../nui/nui.dispatch';
import { ObjectService } from '../../object/object.service';
import { FireworkProvider } from '../../world/firework.provider';
import { SpotlightProvider } from '../../world/spotlight.provider';

@Provider()
export class Election2024CeremonyProvider {
    @Inject(CameraService)
    private readonly cameraService: CameraService;

    @Inject(ObjectService)
    private readonly objectService: ObjectService;

    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    @Inject(FireworkProvider)
    private readonly fireworkProvider: FireworkProvider;

    @Inject(SpotlightProvider)
    private readonly spotlightProvider: SpotlightProvider;

    @Inject(HudStateProvider)
    private readonly hudStateProvider: HudStateProvider;

    private readonly skyCameraPosition: Vector3 = [-417.33, 1153.93, 3000.0];
    private readonly skyCameraTarget: Vector3 = [-351.17, 1171.26, 1000.0];

    private debug = false;
    private camera: number;

    @Command('debug-ceremony', { role: ['admin', 'staff'] as SozRole[] })
    async toggleDebug() {
        this.debug = !this.debug;
    }

    @Tick()
    async debugLoop() {
        if (!this.debug) return;

        const playerPosition = GetEntityCoords(PlayerPedId(), true) as Vector3;

        for (const location of Object.values(ALL_LOCATIONS)) {
            for (const [index, firework] of Object.entries(location.fireworks)) {
                const isNear = getDistance(playerPosition, firework.position) < 10;

                if (isNear) {
                    SetDrawOrigin(firework.position[0], firework.position[1], firework.position[2], 0);
                    SetTextScale(0.0, 0.25);
                    SetTextEntry('STRING');
                    AddTextComponentString(`Firework ${index}`);
                    SetTextCentre(true);
                    DrawText(0, 0);
                    ClearDrawOrigin();
                }

                DrawLine(
                    firework.position[0],
                    firework.position[1],
                    firework.position[2],
                    firework.position[0],
                    firework.position[1],
                    firework.position[2] + (firework.height || 1),
                    255,
                    0,
                    0,
                    255
                );
            }

            for (const spotlight of location.spotlights) {
                if (spotlight.action !== 'add') continue;

                DrawLine(
                    spotlight.position[0],
                    spotlight.position[1],
                    spotlight.position[2],
                    spotlight.target[0],
                    spotlight.target[1],
                    spotlight.target[2],
                    255,
                    255,
                    255,
                    255
                );
            }
        }
    }

    @OnEvent(ClientEvent.CEREMONY_CREATE_CAMERA)
    async createCamera() {
        const playerPosition = GetEntityCoords(PlayerPedId(), true) as Vector3;

        this.camera = this.cameraService.createCamera(add2Vector3(playerPosition, [0, 0, 1]), 80);
        this.cameraService.setCameraActive(this.camera, true);
        this.cameraService.setCameraPointAt(this.camera, this.skyCameraTarget);

        this.cameraService.renderCamera();

        this.hudStateProvider.setHudVisible(false);
        this.hudStateProvider.setCinematicMode(true, 3000);

        this.cameraService.updateCameraPosition(
            this.camera,
            add2Vector3(playerPosition, [0, 0, 1000]),
            [0, 0, 0],
            5_000
        );
        this.cameraService.setCameraPointAt(this.camera, playerPosition);

        await wait(5_000);

        this.cameraService.updateCameraPosition(this.camera, this.skyCameraPosition, [0, 0, 0], 5_000);
        this.cameraService.setCameraPointAt(this.camera, this.skyCameraTarget);
    }

    @OnEvent(ClientEvent.CEREMONY_SET_CAMERA)
    async setCamera(position: Vector3, target: Vector3) {
        DoScreenFadeOut(500);
        await wait(500);

        this.cameraService.setCameraPosition(this.camera, position);
        this.cameraService.setCameraPointAt(this.camera, target);
        this.cameraService.renderCamera();

        await wait(1_000);
        DoScreenFadeIn(500);
    }

    @OnEvent(ClientEvent.CEREMONY_MOVE_CAMERA)
    moveCamera(position: Vector3, rotation: Vector3, duration: number) {
        this.cameraService.updateCameraPosition(this.camera, position, rotation, duration);
        this.cameraService.renderCamera();
    }

    @OnEvent(ClientEvent.CEREMONY_DELETE_CAMERA)
    async deleteCamera() {
        this.cameraService.updateCameraPosition(this.camera, this.skyCameraPosition, [0, 0, 0], 5_000);
        this.cameraService.setCameraPointAt(this.camera, this.skyCameraTarget);

        await wait(5_000);

        DoScreenFadeOut(500);
        await wait(500);

        this.cameraService.deleteCamera();
        this.hudStateProvider.setHudVisible(true);
        this.hudStateProvider.setCinematicMode(false);

        await wait(500);
        DoScreenFadeIn(500);
    }

    @OnEvent(ClientEvent.CEREMONY_RUN_LOCATION)
    async runLocation(locationName: string) {
        const location = ALL_LOCATIONS[locationName];
        if (!location) return;

        if (locationName === 'final') {
            this.moveCamera(location.camera, [0, 0, 0], 2_000);
            this.cameraService.setCameraPointAt(this.camera, location.center);
            await wait(2_000);
        } else {
            await this.setCamera(location.camera, location.center);
        }

        if (location.music) {
            this.nuiDispatch.dispatch('election', location.music.name, location.music.volume);
        }

        for (const position of location.positions) {
            this.triggerAction(position, () => {
                this.moveCamera(position.position, position.rotation, position.duration);
            });
        }

        for (const target of location.targets ?? []) {
            this.triggerAction(target, () => {
                this.cameraService.setCameraPointAt(this.camera, target.position);
                this.cameraService.renderCamera();
            });
        }

        for (const firework of location.fireworks) {
            this.triggerAction(firework, () => {
                this.fireworkProvider.onCreateFirework(
                    firework.type,
                    firework.position,
                    firework.height,
                    firework.scale,
                    firework.color
                );
            });
        }

        for (const spotlight of location.spotlights) {
            if (spotlight.action === 'add') {
                this.triggerAction(spotlight, () => {
                    this.spotlightProvider.createSpotlight(
                        spotlight.id,
                        spotlight.position,
                        spotlight.target,
                        spotlight.color,
                        spotlight.distance,
                        spotlight.radius,
                        spotlight.brightness,
                        spotlight.roundness,
                        spotlight.duration
                    );
                });
            } else if (spotlight.action === 'update') {
                this.triggerAction(spotlight, () => {
                    this.spotlightProvider.updateSpotlight(spotlight.id, spotlight.brightness, spotlight.duration);
                });
            } else if (spotlight.action === 'remove') {
                this.triggerAction(spotlight, () => {
                    this.spotlightProvider.deleteSpotlight(spotlight.id);
                });
            }
        }

        setTimeout(async () => {
            DoScreenFadeOut(500);

            if (location.music) {
                this.nuiDispatch.dispatch('election', location.music.name, 0);
            }

            for (const spotlight of location.spotlights) {
                setTimeout(async () => {
                    await this.spotlightProvider.updateSpotlight(spotlight.id, 0, 1000);
                    await wait(1000);
                    await this.spotlightProvider.deleteSpotlight(spotlight.id);
                }, 0);
            }
        }, location.duration);
    }

    private triggerAction(action: TriggerableAction<any>, cb: () => void) {
        if (action.triggerAt instanceof Array) {
            for (const triggerAt of action.triggerAt) {
                setTimeout(cb, triggerAt);
            }
        } else {
            setTimeout(cb, action.triggerAt);
        }
    }
}
