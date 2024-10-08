import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { wait } from '../../core/utils';
import { ClientEvent } from '../../shared/event/client';
import { FDO, JobType } from '../../shared/job';
import { Vector3 } from '../../shared/polyzone/vector';
import { BlipFactory } from '../blip';
import { PlayerService } from '../player/player.service';
import { SceneRepository } from '../repository/scene.repository';
import { WorldEventRepository } from '../repository/world.event.repository';

@Provider()
export class WorldEventProvider {
    @Inject(WorldEventRepository)
    private worldEventRepository: WorldEventRepository;

    @Inject(SceneRepository)
    private sceneRepository: SceneRepository;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @OnEvent(ClientEvent.WORLD_EVENT_START)
    public async onStartWorldEvent(eventId: string, sceneId: string, position: Vector3 | null) {
        const event = this.worldEventRepository.find(eventId);

        if (!event) {
            return;
        }

        const player = this.playerService.getPlayer();

        if (!player) {
            return;
        }

        if (position && (player.gang.id || FDO.includes(player.job.id))) {
            // show blip after 2 minutes
            await wait(120 * 1000);

            this.blipFactory.create('world_event', {
                position: position,
                name: event.name,
                sprite: 303,
            });
        }
    }

    @OnEvent(ClientEvent.WORLD_EVENT_END)
    public async onStopWorldEvent() {
        this.blipFactory.remove('world_event');
    }
}
