import { Once, OnceStep, OnEvent, OnNuiEvent } from '../../core/decorators/event';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { emitRpc } from '../../core/rpc';
import { ClientEvent } from '../../shared/event/client';
import { NuiEvent } from '../../shared/event/nui';
import { ServerEvent } from '../../shared/event/server';
import { BLACK_SCREEN_URL } from '../../shared/global';
import { BoxZone } from '../../shared/polyzone/box.zone';
import { getDistance, Vector3 } from '../../shared/polyzone/vector';
import { RpcServerEvent } from '../../shared/rpc';
import { SCENE_COLORS, Spot, SPOT_RELATIVE_POSITIONS, XmasSceneState } from '../../shared/story/story';
import { StreamScreen } from '../stream/stream.screen';

const SCENE_POSITION = [-550, -694, 33] as Vector3;
const SPOTLIGHT_MODEL_HASH = 1400279820;

type LoadedScene = {
    spots: Record<Spot, number>;
    scene_bottom: number;
    scene_middle: number;
    scene_top: number;
};

// const SCENE_BOTTOM_MODEL_HASH = GetHashKey('soz_xmas_gouv_scene03');
// const SCENE_MIDDLE_MODEL_HASH = GetHashKey('soz_xmas_gouv_scene02');
// const SCENE_TOP_MODEL_HASH = GetHashKey('soz_xmas_gouv_scene01');
const TRIGGER_DISTANCE = 100;

@Provider()
export class XmasProvider {
    public sceneState: XmasSceneState = null;

    private loadedSceneObjects: LoadedScene = null;

    private sceneStream: StreamScreen;

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
            'big_disp2'
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
        }

        if (this.loadedSceneObjects) {
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
                    spots[closestSpot.name] = object;
                }
            }
        }

        if (Object.keys(spots).length !== Object.keys(SPOT_RELATIVE_POSITIONS).length) {
            // Not all spots are loaded
            return;
        }

        this.loadedSceneObjects = {
            spots: spots as Record<Spot, number>,
            scene_bottom: 0,
            scene_middle: 0,
            scene_top: 0,
        };
    }

    private applySceneState() {
        if (!this.loadedSceneObjects || !this.sceneState) {
            return;
        }

        if (this.sceneStream) {
            const position = GetEntityCoords(PlayerPedId(), true) as Vector3;

            this.sceneStream.update(position, this.sceneState?.video_url || BLACK_SCREEN_URL);
        }

        for (const spotName of Object.keys(this.loadedSceneObjects.spots)) {
            const spotObject = this.loadedSceneObjects.spots[spotName as Spot];
            const spotState = this.sceneState.spots[spotName as Spot];

            if (spotState) {
                const color = SCENE_COLORS[spotState.color] || [0, 0, 0];
                SetObjectLightColor(spotObject, true, color[0], color[1], color[2]);
            } else {
                SetObjectLightColor(spotObject, true, 0, 0, 0);
            }
        }
    }

    @Tick(TickInterval.EVERY_FRAME)
    async streamXmasVideo(): Promise<void> {
        if (!this.sceneStream) {
            return;
        }

        if (!this.loadedSceneObjects) {
            const position = GetEntityCoords(PlayerPedId(), true) as Vector3;

            this.sceneStream.update(position, BLACK_SCREEN_URL);
        }

        this.sceneStream.stream();
    }
}
