import { OnEvent } from '../../core/decorators/event';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { ClientEvent } from '../../shared/event/client';
import { ServerEvent } from '../../shared/event/server';
import { RpcServerEvent } from '../../shared/rpc';
import { SceneColor, XmasSceneState } from '../../shared/story/story';

@Provider()
export class XmasProvider {
    private sceneState: XmasSceneState = {
        video_url: null,
        spots: {},
        scene_bottom_color: SceneColor.White,
        scene_middle_color: SceneColor.White,
        scene_top_color: SceneColor.White,
    };

    @OnEvent(ServerEvent.ADMIN_XMAS_UPDATE_SCENE)
    updateSceneState(source: number, state: XmasSceneState) {
        this.sceneState = state;

        TriggerLatentClientEvent(ClientEvent.XMAS_UPDATE_SCENE_STATE, -1, 16 * 1024, state);
    }

    @Rpc(RpcServerEvent.XMAS_GET_SCENE_STATE)
    fetchSceneState() {
        return this.sceneState;
    }
}
