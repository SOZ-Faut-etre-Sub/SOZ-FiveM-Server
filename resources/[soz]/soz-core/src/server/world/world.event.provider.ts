import { OnEvent } from '../../core/decorators/event';
import { Get, Post } from '../../core/decorators/http';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { Request } from '../../core/http/request';
import { Response } from '../../core/http/response';
import { ClientEvent } from '../../shared/event/client';
import { ServerEvent } from '../../shared/event/server';
import { getDistance, Vector3 } from '../../shared/polyzone/vector';
import { getRandomInt, getRandomItem } from '../../shared/random';
import { RpcServerEvent } from '../../shared/rpc';
import { EventInfo, Scene, WorldEvent } from '../../shared/scene';
import { InventoryManager } from '../inventory/inventory.manager';
import { ItemService } from '../item/item.service';
import { Notifier } from '../notifier';
import { SceneRepository } from '../repository/scene.repository';
import { WorldEventRepository } from '../repository/world.event.repository';
import { SceneProvider } from '../scene/scene.provider';
import { ServerStateService } from '../server.state.service';
import { SoundService } from '../sound/sound.service';

type CurrentEvent = {
    event: WorldEvent;
    scene: Scene;
    startTimestamp: number | null;
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

    @Inject(SoundService)
    private readonly soundService: SoundService;

    @Inject(ServerStateService)
    private serverStateService: ServerStateService;

    private currentEvent: CurrentEvent = null;

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

        if (!this.currentEvent) {
            return null;
        }

        return {
            currentEventId: this.currentEvent.event.id,
            currentSceneId: this.currentEvent.scene.id,
            startTimestamp: this.currentEvent.startTimestamp,
        };
    }

    @OnEvent(ServerEvent.WORLD_EVENT_STOP)
    public async onStopWorldEvent(source: number) {
        if (this.currentEvent) {
            await this.stopCurrentEvent();

            this.notifier.notify(source, "L'événement en cours a été stoppé");
        }
    }

    @OnEvent(ServerEvent.WORLD_EVENT_SIGNAL_INVENTORY)
    public async onSignalInventory(source: number, inventoryId: string) {
        if (!this.currentEvent) {
            return;
        }

        const objects = Object.values(this.currentEvent.scene.entities);

        for (const object of objects) {
            if (object.inventoryId === inventoryId) {
                this.notifier.notify(source, `Le contenu a été signalé`);
                this.inventoryManager.clearInv(object.inventoryId);

                return;
            }
        }
    }

    @Tick(TickInterval.EVERY_MINUTE)
    public async checkEventToStop() {
        if (!this.currentEvent) {
            return;
        }

        const eventPosition = Object.values(this.currentEvent.scene.entities)[0]?.object.position;

        if (!eventPosition) {
            return;
        }

        const players = this.serverStateService.getPlayers();
        let hasPlayerNearby = false;

        for (const player of players) {
            const ped = GetPlayerPed(player.source);
            const playerPosition = GetEntityCoords(ped) as Vector3;

            if (getDistance(eventPosition, playerPosition) < 500) {
                hasPlayerNearby = true;
            }
        }

        if (hasPlayerNearby) {
            return;
        }

        // check inventory are empty
        const objects = Object.values(this.currentEvent.scene.entities);

        for (const object of objects) {
            if (object.inventoryId && this.inventoryManager.getAllItems(object.inventoryId).length > 0) {
                return;
            }
        }

        // no player nearby and all inventories are empty
        await this.stopCurrentEvent();
    }

    @Rpc(RpcServerEvent.WORLD_EVENT_GET_INFO)
    public getEventInfo(): EventInfo {
        if (!this.currentEvent) {
            return {
                currentEventId: null,
                currentSceneId: null,
                startTimestamp: null,
            };
        }

        return {
            currentEventId: this.currentEvent.event.id,
            currentSceneId: this.currentEvent.scene.id,
            startTimestamp: this.currentEvent.startTimestamp,
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
                if (this.inventoryManager.getWeight(inventoryId) > 250_000) {
                    break;
                }

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

        this.currentEvent = { event, scene, startTimestamp: Date.now() };
        const firstEntityPosition = Object.values(scene.entities)[0]?.object.position;

        TriggerClientEvent(ClientEvent.WORLD_EVENT_START, -1, event.id, scene.id, firstEntityPosition);
        this.sceneProvider.loadScene(scene.id);

        if (firstEntityPosition && event.startSound) {
            this.soundService.playAtPosition(event.startSound, firstEntityPosition, 2000, 1.0);
        }

        if (source) {
            this.notifier.notify(source, `La scène ${scene.name} pour l'event ${event.name} a été lancée avec succès`);
        }
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
