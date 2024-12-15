import { ALL_LOCATIONS, TriggerableAction } from '../../../config/ceremony';
import { FINAL_LOCATION } from '../../../config/ceremony.final';
import { OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { Tick } from '../../../core/decorators/tick';
import { wait } from '../../../core/utils';
import { ClientEvent } from '../../../shared/event/client';
import { Control } from '../../../shared/input';
import { Vector3 } from '../../../shared/polyzone/vector';
import { CameraService } from '../../camera';
import { HudStateProvider } from '../../hud/hud.state.provider';
import { NuiDispatch } from '../../nui/nui.dispatch';
import { FireworkProvider } from '../../world/firework.provider';
import { SpotlightProvider } from '../../world/spotlight.provider';

@Provider()
export class Election2024CeremonyProvider {
    @Inject(CameraService)
    private readonly cameraService: CameraService;

    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    @Inject(FireworkProvider)
    private readonly fireworkProvider: FireworkProvider;

    @Inject(SpotlightProvider)
    private readonly spotlightProvider: SpotlightProvider;

    @Inject(HudStateProvider)
    private readonly hudStateProvider: HudStateProvider;

    private readonly startCameraPosition: Vector3 = [-557.12, -629.84, 48.63];
    private readonly startCameraTarget: Vector3 = [-545.13, -688.23, 36.52];
    private readonly finalStartCameraPosition: Vector3 = [-562.97, -596.48, 83.45];

    private _running = false;

    private camera: number;

    @Tick()
    async onTick() {
        if (!this._running) return;

        DisableAllControlActions(0);

        EnableControlAction(0, Control.LookLeftRight, true);
        EnableControlAction(0, Control.LookUpDown, true);
    }

    @OnEvent(ClientEvent.CEREMONY_SET_RUNNING)
    async updateRunning(running: boolean) {
        this._running = running;
    }

    @OnEvent(ClientEvent.CEREMONY_CREATE_CAMERA)
    async createCamera(isFinal: boolean) {
        if (isFinal) {
            this.camera = this.cameraService.createCamera(this.finalStartCameraPosition, 80);
            this.cameraService.setCameraActive(this.camera, true);
            this.cameraService.setCameraPointAt(this.camera, FINAL_LOCATION.center);

            this.cameraService.renderCamera(5_000);
            await wait(5_000);

            this.moveCamera(FINAL_LOCATION.camera, [0, 0, 0], 5_000);
        } else {
            this.camera = this.cameraService.createCamera(this.startCameraPosition, 80);
            this.cameraService.setCameraActive(this.camera, true);
            this.cameraService.setCameraPointAt(this.camera, this.startCameraTarget);
        }

        this.hudStateProvider.setHudVisible(false);
        this.hudStateProvider.setCinematicMode(true, 5_000);

        this.cameraService.renderCamera(5_000);
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
        DoScreenFadeOut(500);
        await wait(500);

        this.cameraService.deleteCamera();
        this.hudStateProvider.setHudVisible(true);
        this.hudStateProvider.setCinematicMode(false);

        await wait(1000);
        DoScreenFadeIn(500);
    }

    @OnEvent(ClientEvent.CEREMONY_RUN_LOCATION)
    async runLocation(locationName: string) {
        const location = ALL_LOCATIONS[locationName];
        if (!location) return;

        if (!this._running && !this.camera) {
            // When player crash and rejoin we need to reset the loadscreen before creating the camera
            exports['soz-loadscreen'].Shutdown();

            this._running = true;

            this.camera = this.cameraService.createCamera(location.camera, 80);
            this.cameraService.setCameraActive(this.camera, true);
            this.cameraService.setCameraPointAt(this.camera, location.center);
            this.cameraService.renderCamera(500);

            this.hudStateProvider.setHudVisible(false);
            this.hudStateProvider.setCinematicMode(true, 500);

            if (IsScreenFadedOut()) {
                DoScreenFadeIn(500);
            }
        }

        if (locationName !== 'final') {
            await this.setCamera(location.camera, location.center);
        }

        if (locationName === 'senat') {
            this.cameraService.setCameraActive(this.camera, false);

            SetGameplayCamRelativeHeading(180);
            TaskTurnPedToFaceCoord(PlayerPedId(), location.center[0], location.center[1], location.center[2], 0);

            await wait(1000);
            SetGameplayCamRelativeHeading(0);
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

        if (location.music) {
            setTimeout(async () => {
                this.nuiDispatch.dispatch('election', location.music.name, 0);
            }, location.duration - 2_000);
        }

        setTimeout(async () => {
            DoScreenFadeOut(500);
            await wait(500);

            if (locationName === 'senat') {
                this.cameraService.setCameraActive(this.camera, true);
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
