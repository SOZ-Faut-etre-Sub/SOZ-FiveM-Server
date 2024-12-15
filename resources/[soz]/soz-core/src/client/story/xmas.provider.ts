import { Once, OnceStep, OnEvent, OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { emitRpc } from '../../core/rpc';
import { wait } from '../../core/utils';
import { ClientEvent } from '../../shared/event/client';
import { NuiEvent } from '../../shared/event/nui';
import { ServerEvent } from '../../shared/event/server';
import { BLACK_SCREEN_URL } from '../../shared/global';
import { BoxZone } from '../../shared/polyzone/box.zone';
import { getDistance, getRotationForATargetingB, Vector3 } from '../../shared/polyzone/vector';
import { RpcServerEvent } from '../../shared/rpc';
import { LightState } from '../../shared/spotlight';
import {
    SCENE_COLOR_TEXTURE_NAMES,
    SCENE_COLORS,
    Spot,
    SPOT_RELATIVE_POSITIONS,
    XmasSceneState,
} from '../../shared/story/story';
import { PlayerFinderService } from '../player/player.finder.service';
import { StreamScreen } from '../stream/stream.screen';
import { LightObject } from '../world/light.object';

const SCENE_POSITION = [-550, -694, 33] as Vector3;
const SPOTLIGHT_MODEL_HASH = 1400279820;

type LoadedScene = {
    spots: Record<Spot, LightObject>;
    scene_bottom: number;
    scene_middle: number;
    scene_top: number;
};

const SCENE_TOP_BASE_TEXTURE_NAME = 'soz_gouv_white';
const SCENE_MIDDLE_BASE_TEXTURE_NAME = 'soz_gouv_white02';
const SCENE_BOTTOM_BASE_TEXTURE_NAME = 'soz_gouv_white03';
const SCENE_TEXTURE_DICTIONARY = 'soz_xmas_gouv_txd';
const TRIGGER_DISTANCE = 100;
const SCENE_CENTER_POSITION = [-545.42, -698.82, 33.6] as Vector3;

@Provider()
export class XmasProvider {
    @Inject(PlayerFinderService)
    private playerFinderService: PlayerFinderService;

    public sceneState: XmasSceneState = null;

    private loadedSceneObjects: LoadedScene = null;

    private sceneStream: StreamScreen;

    private isTracking = false;

    @OnNuiEvent(NuiEvent.AdminMenuXmasSetState)
    public async onAdminMenuXmasSetState(state: XmasSceneState) {
        TriggerServerEvent(ServerEvent.ADMIN_XMAS_UPDATE_SCENE, state);
    }

    @Once(OnceStep.PlayerLoaded)
    public async onStartXmas() {
        this.sceneState = await emitRpc<XmasSceneState>(RpcServerEvent.XMAS_GET_SCENE_STATE);

        this.sceneStream = new StreamScreen(
            new BoxZone(SCENE_POSITION, 80, 80, {
                maxZ: SCENE_POSITION[2] + 80,
                minZ: SCENE_POSITION[2] - 80,
            }),
            'xmas',
            'soz_xmas_gouv_tv',
            'big_disp2',
            2048,
            1024
        );
    }

    @OnEvent(ClientEvent.XMAS_UPDATE_SCENE_STATE)
    public onXmasSceneStateUpdate(sceneState: XmasSceneState) {
        this.sceneState = sceneState;

        if (this.loadedSceneObjects) {
            this.applySceneState();
        }
    }

    @Tick(TickInterval.EVERY_SECOND)
    public async tick() {
        if (!this.sceneState || !this.sceneStream) {
            return;
        }

        const position = GetEntityCoords(PlayerPedId(), true) as Vector3;
        const distance = getDistance(position, SCENE_POSITION);

        if (distance > TRIGGER_DISTANCE && this.loadedSceneObjects) {
            this.loadedSceneObjects = null;
        }

        if (distance <= TRIGGER_DISTANCE && !this.loadedSceneObjects) {
            this.loadSceneObjects();
            this.applySceneState();
        }
    }

    private loadSceneObjects() {
        const spots = {};

        for (const object of GetGamePool('CObject')) {
            const model = GetEntityModel(object);

            if (model === SPOTLIGHT_MODEL_HASH) {
                const position = GetEntityCoords(object, true) as Vector3;

                let closestSpot = null;

                for (const spotName of Object.keys(SPOT_RELATIVE_POSITIONS)) {
                    const relativePosition = SPOT_RELATIVE_POSITIONS[spotName];
                    const distance = getDistance(position, relativePosition);

                    if (!closestSpot || distance < closestSpot.distance) {
                        closestSpot = {
                            name: spotName,
                            distance,
                        };
                    }
                }

                if (closestSpot) {
                    spots[closestSpot.name] = new LightObject(object, [0, 0, 90]);
                }
            }
        }

        if (Object.keys(spots).length !== Object.keys(SPOT_RELATIVE_POSITIONS).length) {
            // Not all spots are loaded
            return;
        }

        this.loadedSceneObjects = {
            spots: spots as Record<Spot, LightObject>,
            scene_bottom: 0,
            scene_middle: 0,
            scene_top: 0,
        };
    }

    private async applySceneState() {
        if (!this.loadedSceneObjects || !this.sceneState) {
            return;
        }

        if (this.sceneStream) {
            const position = GetEntityCoords(PlayerPedId(), true) as Vector3;

            this.sceneStream.update(position, this.sceneState?.video_url || BLACK_SCREEN_URL);
        }

        let trackedPosition = null;
        let resetRotation = null;

        if (!this.isTracking && this.sceneState.track_player) {
            const closestPlayerToCenter = this.playerFinderService.getClosestPlayer(SCENE_CENTER_POSITION, true);

            if (closestPlayerToCenter && closestPlayerToCenter.distance < 10) {
                trackedPosition = closestPlayerToCenter.position;
            } else {
                trackedPosition = SCENE_CENTER_POSITION;
            }
        }

        if (this.isTracking && !this.sceneState.track_player) {
            resetRotation = true;
        }

        // Apply spot state
        for (const spotName of Object.keys(this.loadedSceneObjects.spots)) {
            const spotObject = this.loadedSceneObjects.spots[spotName as Spot];
            const spotState = this.sceneState.spots[spotName as Spot];
            const newState: Partial<LightState> = { enabled: false };

            if (spotState) {
                const color = SCENE_COLORS[spotState.color] || [0, 0, 0];

                newState.enabled = true;
                newState.color = color;
            }

            if (trackedPosition) {
                newState.direction = getRotationForATargetingB(spotObject.initialState.position, trackedPosition);
            }

            if (resetRotation) {
                newState.direction = spotObject.initialState.direction;
            }

            spotObject.applyTransition({
                duration: 1000,
                next: newState,
            });
        }

        // Apply scene color
        RemoveReplaceTexture(SCENE_TEXTURE_DICTIONARY, SCENE_BOTTOM_BASE_TEXTURE_NAME);
        RemoveReplaceTexture(SCENE_TEXTURE_DICTIONARY, SCENE_MIDDLE_BASE_TEXTURE_NAME);
        RemoveReplaceTexture(SCENE_TEXTURE_DICTIONARY, SCENE_TOP_BASE_TEXTURE_NAME);

        AddReplaceTexture(
            SCENE_TEXTURE_DICTIONARY,
            SCENE_BOTTOM_BASE_TEXTURE_NAME,
            SCENE_TEXTURE_DICTIONARY,
            SCENE_COLOR_TEXTURE_NAMES[this.sceneState.scene_bottom_color]
        );
        AddReplaceTexture(
            SCENE_TEXTURE_DICTIONARY,
            SCENE_MIDDLE_BASE_TEXTURE_NAME,
            SCENE_TEXTURE_DICTIONARY,
            SCENE_COLOR_TEXTURE_NAMES[this.sceneState.scene_middle_color]
        );
        AddReplaceTexture(
            SCENE_TEXTURE_DICTIONARY,
            SCENE_TOP_BASE_TEXTURE_NAME,
            SCENE_TEXTURE_DICTIONARY,
            SCENE_COLOR_TEXTURE_NAMES[this.sceneState.scene_top_color]
        );

        if (!this.sceneState.track_player) {
            this.isTracking = false;
        }

        // wait if set to true so there is no flickering
        await wait(1000);

        this.isTracking = this.sceneState.track_player;
    }

    @Tick(TickInterval.EVERY_FRAME)
    async streamXmasVideo(): Promise<void> {
        if (this.sceneStream) {
            if (!this.loadedSceneObjects) {
                const position = GetEntityCoords(PlayerPedId(), true) as Vector3;

                this.sceneStream.update(position, BLACK_SCREEN_URL);
            }

            this.sceneStream.stream();
        }

        if (this.loadedSceneObjects) {
            for (const spotName of Object.keys(this.loadedSceneObjects.spots)) {
                const spot = this.loadedSceneObjects.spots[spotName as Spot];

                if (!DoesEntityExist(spot.object)) {
                    this.loadedSceneObjects = null;

                    return;
                }

                spot.update();
            }
        }
    }

    @Tick(500)
    public async trackPlayerTick() {
        if (!this.isTracking || !this.loadedSceneObjects || !this.sceneState) {
            return;
        }

        const closestPlayerToCenter = this.playerFinderService.getClosestPlayer(SCENE_CENTER_POSITION, true);
        const trackedPosition =
            closestPlayerToCenter && closestPlayerToCenter.distance < 10
                ? closestPlayerToCenter.position
                : SCENE_CENTER_POSITION;

        for (const spotName of Object.keys(this.loadedSceneObjects.spots)) {
            const spotObject = this.loadedSceneObjects.spots[spotName as Spot];
            const newState: Partial<LightState> = {
                direction: getRotationForATargetingB(spotObject.initialState.position, trackedPosition),
            };

            spotObject.applyTransition({
                duration: 500,
                next: newState,
            });
        }
    }
}
