import PCancelable from 'p-cancelable';

import { Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
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

    @Once(OnceStep.RepositoriesLoaded)
    public async onStart() {
        // 50 % chance to launch an event at the start of the server
        const shouldLaunchEvent = Math.random() <= 0.5;

        if (!shouldLaunchEvent) {
            return;
        }

        const offsetTimezone = getOffsetForTimeZone('Europe/Paris');
        const hoursOffset = Math.round(offsetTimezone / 3600);

        const minDate = new Date();
        minDate.setUTCHours(12 - hoursOffset, 0, 0, 0);
        const minTimestamp = minDate.getTime();
        // Max date is 12 hours after the min date
        const maxTimestamp = minTimestamp + 12 * 60 * 60 * 1000;

        const randomTimestamp = getRandomInt(minTimestamp, maxTimestamp);
        const now = Date.now();

        // can happens if server is launched after
        if (randomTimestamp < now) {
            return;
        }

        this.eventLaunchTimestamp = randomTimestamp;

        setTimeout(async () => {
            await this.startRandomEvent();
        });
    }

    @Rpc(RpcServerEvent.WORLD_EVENT_START)
    public async onStartWorldEvent(source: number, eventId: string): Promise<EventInfo> {
        if (this.currentEvent) {
            await this.stopCurrentEvent();
        }

        const event = await this.worldEventRepository.find(eventId);

        if (!event) {
            return;
        }

        await this.startEvent(event, source);

        return {
            currentEventId: this.currentEvent.event.id,
            currentSceneId: this.currentEvent.scene.id,
            endEventTimestamp: Date.now() + 3600 * 1000,
            launchEventTimestamp: this.eventLaunchTimestamp,
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
                launchEventTimestamp: this.eventLaunchTimestamp,
            };
        }

        return {
            currentEventId: this.currentEvent.event.id,
            currentSceneId: this.currentEvent.scene.id,
            endEventTimestamp: Date.now() + 3600 * 1000,
            launchEventTimestamp: this.eventLaunchTimestamp,
        };
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

    private async startEvent(event: WorldEvent, source?: number) {
        const scenes = await this.sceneRepository.get(scene => {
            return scene.worldEventId === event.id && scene.persistent === true;
        });

        if (scenes.length === 0) {
            if (source) {
                this.notifier.error(source, 'Aucune scène persistée trouvée pour cet événement');
            }

            return;
        }

        const scene = getRandomItem(scenes);
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
