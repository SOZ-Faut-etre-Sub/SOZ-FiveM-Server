import { OnEvent } from '../../core/decorators/event';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { ClientEvent } from '../../shared/event/client';
import { ServerEvent } from '../../shared/event/server';
import { RpcServerEvent } from '../../shared/rpc';
import { SceneColor, SenatSceneState, Spot, SpotColor } from '../../shared/story/story';

@Provider()
export class XmasProvider {
    public sceneState: SenatSceneState = {
        video_url: null,
        spots: {
            [Spot.SPOT_SCENE_BOTTOM_BACK_LEFT]: { enabled: false, color: SpotColor.White },
            [Spot.SPOT_SCENE_BOTTOM_BACK_RIGHT]: { enabled: false, color: SpotColor.White },
            [Spot.SPOT_SCENE_BOTTOM_FRONT_LEFT]: { enabled: false, color: SpotColor.White },
            [Spot.SPOT_SCENE_BOTTOM_FRONT_RIGHT]: { enabled: false, color: SpotColor.White },
            [Spot.SPOT_SCENE_UP_FIRST_ROW_1]: { enabled: false, color: SpotColor.White },
            [Spot.SPOT_SCENE_UP_FIRST_ROW_2]: { enabled: false, color: SpotColor.White },
            [Spot.SPOT_SCENE_UP_FIRST_ROW_3]: { enabled: false, color: SpotColor.White },
            [Spot.SPOT_SCENE_UP_FIRST_ROW_4]: { enabled: false, color: SpotColor.White },
            [Spot.SPOT_SCENE_UP_FIRST_ROW_5]: { enabled: false, color: SpotColor.White },
            [Spot.SPOT_SCENE_UP_FIRST_ROW_6]: { enabled: false, color: SpotColor.White },
            [Spot.SPOT_SCENE_UP_SECOND_ROW_1]: { enabled: false, color: SpotColor.White },
            [Spot.SPOT_SCENE_UP_SECOND_ROW_2]: { enabled: false, color: SpotColor.White },
            [Spot.SPOT_SCENE_UP_SECOND_ROW_3]: { enabled: false, color: SpotColor.White },
            [Spot.SPOT_SCENE_UP_SECOND_ROW_4]: { enabled: false, color: SpotColor.White },
            [Spot.SPOT_SCENE_UP_SECOND_ROW_5]: { enabled: false, color: SpotColor.White },
            [Spot.SPOT_SCENE_UP_SECOND_ROW_6]: { enabled: false, color: SpotColor.White },
        },
        scene_bottom_color: SceneColor.White,
        scene_middle_color: SceneColor.White,
        scene_top_color: SceneColor.White,
        track_player: false,
    };

    @OnEvent(ServerEvent.ADMIN_XMAS_UPDATE_SCENE)
    updateSceneState(source: number, state: SenatSceneState) {
        this.sceneState = state;

        TriggerLatentClientEvent(ClientEvent.XMAS_UPDATE_SCENE_STATE, -1, 16 * 1024, state);
    }

    @Rpc(RpcServerEvent.XMAS_GET_SCENE_STATE)
    fetchSceneState() {
        return this.sceneState;
    }
}
