import { GangRepository } from '@private/client/repository/gang.repository';

import { Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { emitRpc } from '../../core/rpc';
import { wait } from '../../core/utils';
import { ClientEvent } from '../../shared/event/client';
import { FDO } from '../../shared/job';
import { Vector3 } from '../../shared/polyzone/vector';
import { RpcServerEvent } from '../../shared/rpc';
import { EventInfo, Scene } from '../../shared/scene';
import { BlipFactory } from '../blip';
import { ObjectProvider } from '../object/object.provider';
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

    @Inject(GangRepository)
    private gangRepository: GangRepository;

    @Inject(ObjectProvider)
    private objectProvider: ObjectProvider;

    private currentEvent: EventInfo | null = null;

    @Once(OnceStep.RepositoriesLoaded)
    public async onStartEventProvider() {
        const player = this.playerService.getPlayer();

        if (!player) {
            return;
        }

        const eventInfo = await emitRpc<EventInfo>(RpcServerEvent.WORLD_EVENT_GET_INFO);

        if (eventInfo.currentEventId) {
            this.currentEvent = eventInfo;
        } else {
            this.currentEvent = null;
        }

        const gang = this.gangRepository.find(player.gang.id);
        if (!gang && !FDO.includes(player.job.id)) {
            return;
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

            if (this.areAllInvSignaled(scene, eventInfo.signaledInvs)) {
                return;
            }

            if (this.blipFactory.exist('world_event')) {
                this.blipFactory.remove('world_event');
            }
            this.blipFactory.create('world_event', {
                position: position,
                name: event.name,
                sprite: 303,
            });
        }
    }

    private areAllInvSignaled(scene: Scene, signaled: string[]) {
        const objects = Object.values(scene.entities);
        for (const object of objects) {
            if (object.inventoryId && !signaled.includes(object.inventoryId)) {
                return false;
            }
        }

        return true;
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
            signaledInvs: [],
        };

        const gang = this.gangRepository.find(player.gang.id);
        if (position && (gang || FDO.includes(player.job.id))) {
            // show blip after 2 minutes
            await wait(120 * 1000);

            if (!this.currentEvent) {
                return;
            }

            if (this.blipFactory.exist('world_event')) {
                this.blipFactory.remove('world_event');
            }

            const scene = this.sceneRepository.find(this.currentEvent.currentSceneId);

            if (!scene) {
                return;
            }

            if (this.areAllInvSignaled(scene, this.currentEvent.signaledInvs)) {
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

    @OnEvent(ClientEvent.WORLD_EVENT_SIGNAL_INVENTORY)
    public async onSignalInventory(signaledInvs: string[]) {
        if (!this.currentEvent) {
            return;
        }
        this.currentEvent.signaledInvs = signaledInvs;

        const scene = this.sceneRepository.find(this.currentEvent.currentSceneId);

        if (!scene) {
            return;
        }

        const objects = Object.values(scene.entities);
        for (const object of objects) {
            if (!signaledInvs.includes(object.inventoryId)) {
                continue;
            }

            if (!object.object.vfx) {
                continue;
            }

            const obj = this.objectProvider.findObject(object.object.id);
            if (!obj) {
                continue;
            }

            if (obj.vfx?.id) {
                StopParticleFxLooped(obj.vfx?.id, false);
            }
            obj.vfx = null;
        }

        if (this.areAllInvSignaled(scene, signaledInvs)) {
            this.blipFactory.remove('world_event');
        }
    }

    public isSignaled(inventoryId: string) {
        return this.currentEvent && this.currentEvent.signaledInvs.includes(inventoryId);
    }
}
