import PCancelable from 'p-cancelable';

import { Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Get, Post } from '../../core/decorators/http';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { Request } from '../../core/http/request';
import { Response } from '../../core/http/response';
import { wait } from '../../core/utils';
import { getOffsetForTimeZone } from '../../shared/date';
import { ClientEvent } from '../../shared/event/client';
import { ServerEvent } from '../../shared/event/server';
import { getRandomInt, getRandomItem } from '../../shared/random';
import { RpcServerEvent } from '../../shared/rpc';
import { EventInfo, Scene, WorldEvent } from '../../shared/scene';
import { InventoryManager } from '../inventory/inventory.manager';
import { ItemService } from '../item/item.service';
import { Notifier } from '../notifier';
import { SceneRepository } from '../repository/scene.repository';
import { WorldEventRepository } from '../repository/world.event.repository';
import { SceneProvider } from '../scene/scene.provider';

type CurrentEvent = {
    event: WorldEvent;
    scene: Scene;
    endTimestamp: number;
    cancelable?: PCancelable<boolean>;
};

@Provider()
export class WorldEventProvider {
    @Inject(WorldEventRepository)
    private readonly worldEventRepository: WorldEventRepository;

    @Inject(SceneProvider)
    private readonly sceneProvider: SceneProvider;

    @Inject(SceneRepository)
    private readonly sceneRepository: SceneRepository;

    @Inject(InventoryManager)
    private readonly inventoryManager: InventoryManager;

    @Inject(Notifier)
    private readonly notifier: Notifier;

    @Inject(ItemService)
    private readonly itemService: ItemService;

    private currentEvent: CurrentEvent = null;

    private eventLaunchTimestamp: number = null;

    @Rpc(RpcServerEvent.WORLD_EVENT_START)
    public async onStartWorldEvent(source: number, eventId: string): Promise<EventInfo> {
        if (this.currentEvent) {
            await this.stopCurrentEvent();
        }

        const event = await this.worldEventRepository.find(eventId);

        if (!event) {
            return;
        }

        await this.startEvent(event, null, source);

        return {
            currentEventId: this.currentEvent.event.id,
            currentSceneId: this.currentEvent.scene.id,
            endEventTimestamp: Date.now() + 3600 * 1000,
        };
    }

    @OnEvent(ServerEvent.WORLD_EVENT_STOP)
    public async onStopWorldEvent(source: number) {
        if (this.currentEvent) {
            this.currentEvent.cancelable?.cancel();

            this.notifier.notify(source, "L'événement en cours a été stoppé");
        }
    }

    @Rpc(RpcServerEvent.WORLD_EVENT_GET_INFO)
    public getEventInfo(): EventInfo {
        if (!this.currentEvent) {
            return {
                currentEventId: null,
                currentSceneId: null,
                endEventTimestamp: null,
            };
        }

        return {
            currentEventId: this.currentEvent.event.id,
            currentSceneId: this.currentEvent.scene.id,
            endEventTimestamp: Date.now() + 3600 * 1000,
        };
    }

    @Post('/event/start')
    public async httpStartEvent(request: Request): Promise<Response> {
        if (this.currentEvent) {
            return Response.badRequest('Il y a déjà un événement en cours');
        }

        const data = JSON.parse(await request.body) as {
            eventId: string;
            sceneId?: string;
        };

        const event = await this.worldEventRepository.find(data.eventId);

        if (!event) {
            return Response.notFound("L'événement n'existe pas");
        }

        await this.startEvent(event, data.sceneId);

        return Response.json(this.currentEvent);
    }

    @Post('/event/stop')
    public async httpStopEvent(): Promise<Response> {
        if (!this.currentEvent) {
            return Response.badRequest("Il n'y a pas d'événement en cours");
        }

        await this.stopCurrentEvent();

        return Response.ok();
    }

    @Get('/event/current')
    public async httpCurrentEvent(): Promise<Response> {
        if (!this.currentEvent) {
            return Response.notFound("Il n'y a pas d'événement en cours");
        }

        return Response.json(this.currentEvent);
    }

    public async startRandomEvent() {
        if (this.currentEvent) {
            return;
        }

        const events = await this.worldEventRepository.get();

        if (events.length === 0) {
            return;
        }

        const event = getRandomItem(events);

        await this.startEvent(event);
    }

    private async startEvent(event: WorldEvent, sceneId?: string, source?: number) {
        const scenes = await this.sceneRepository.get(scene => {
            return scene.worldEventId === event.id && scene.persistent === true;
        });

        if (scenes.length === 0) {
            if (source) {
                this.notifier.error(source, 'Aucune scène persistée trouvée pour cet événement');
            }

            return;
        }

        let scene: Scene = null;

        if (sceneId) {
            scene = scenes.find(scene => scene.id === sceneId);
        }

        if (!scene) {
            scene = getRandomItem(scenes);
        }

        const inventories = [];

        for (const entity of Object.values(scene.entities)) {
            if (entity.inventoryId) {
                inventories.push(entity.inventoryId);
            }
        }

        for (const reward of event.reward) {
            for (const inventoryId of inventories) {
                const shouldAddItem = Math.random() * 100 <= reward.chance;

                if (!shouldAddItem) {
                    continue;
                }

                const amount = getRandomInt(reward.min, reward.max);
                const item = this.itemService.getItem(reward.item);

                if (!item) {
                    continue;
                }

                if (item.unique) {
                    for (let i = 0; i < amount; i++) {
                        this.inventoryManager.addItemToInventory(inventoryId, reward.item, 1);
                    }
                } else {
                    this.inventoryManager.addItemToInventory(inventoryId, reward.item, amount);
                }
            }
        }

        // Event for 1 hour
        const eventDuration = 3600 * 1000;

        this.currentEvent = { event, scene, endTimestamp: Date.now() + eventDuration };

        TriggerClientEvent(ClientEvent.WORLD_EVENT_START, -1, event.id, scene.id);
        this.sceneProvider.loadScene(scene.id);

        if (source) {
            this.notifier.notify(source, `La scène ${scene.name} pour l'event ${event.name} a été lancée avec succès`);
        }

        this.currentEvent.cancelable = wait(eventDuration);
        this.currentEvent.cancelable.then(() => {
            this.stopCurrentEvent();
        });
    }

    private async stopCurrentEvent() {
        if (!this.currentEvent) {
            return;
        }

        const { event, scene } = this.currentEvent;
        this.currentEvent = null;

        TriggerClientEvent(ClientEvent.WORLD_EVENT_END, -1, event.id, scene.id);
        this.sceneProvider.unloadScene(scene.id);

        for (const entity of Object.values(scene.entities)) {
            if (entity.inventoryId) {
                this.inventoryManager.clearInv(entity.inventoryId);
            }
        }
    }
}
