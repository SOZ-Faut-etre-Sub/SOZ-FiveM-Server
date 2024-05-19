import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent } from '../../shared/event/client';
import { SceneRepository } from '../repository/scene.repository';
import { WorldEventRepository } from '../repository/world.event.repository';

@Provider()
export class WorldEventProvider {
    @Inject(WorldEventRepository)
    private worldEventRepository: WorldEventRepository;

    @Inject(SceneRepository)
    private sceneRepository: SceneRepository;

    @OnEvent(ClientEvent.WORLD_EVENT_START)
    public onStartWorldEvent(source: number, eventId: string) {
        const event = this.worldEventRepository.find(eventId);

        if (!event) {
            return;
        }
    }
}
