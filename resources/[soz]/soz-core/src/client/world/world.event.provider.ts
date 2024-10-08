import { Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { emitRpc } from '../../core/rpc';
import { wait } from '../../core/utils';
import { ClientEvent } from '../../shared/event/client';
import { FDO } from '../../shared/job';
import { Vector3 } from '../../shared/polyzone/vector';
import { RpcServerEvent } from '../../shared/rpc';
import { EventInfo } from '../../shared/scene';
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

    private currentEvent: EventInfo | null = null;

    @Once(OnceStep.PlayerLoaded)
    public async onStartEventProvider() {
        const eventInfo = await emitRpc<EventInfo>(RpcServerEvent.WORLD_EVENT_GET_INFO);

        if (eventInfo.currentEventId) {
            this.currentEvent = eventInfo;
        } else {
            this.currentEvent = null;
        }

        if (this.currentEvent) {
            const event = this.worldEventRepository.find(this.currentEvent.currentEventId);

            if (!event) {
                return;
            }

            const scene = this.sceneRepository.find(this.currentEvent.currentSceneId);

            if (!scene) {
                return;
            }

            const position = Object.values(scene.entities)[0]?.object.position || null;

            if (!position) {
                return;
            }

            const now = Date.now();
            const blipSpawnTime = this.currentEvent.startTimestamp + 120 * 1000;

            if (now < blipSpawnTime) {
                await wait(blipSpawnTime - now);
            }

            this.blipFactory.create('world_event', {
                position: position,
                name: event.name,
                sprite: 303,
            });
        }
    }

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

        this.currentEvent = {
            currentEventId: eventId,
            currentSceneId: sceneId,
            startTimestamp: Date.now(),
        };

        if (position && (player.gang.id || FDO.includes(player.job.id))) {
            // show blip after 2 minutes
            await wait(120 * 1000);

            if (!this.currentEvent) {
                return;
            }

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
        this.currentEvent = null;
    }
}
