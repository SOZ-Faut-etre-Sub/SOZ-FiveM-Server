import '../repository/scene.live.repository';

import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { RepositoryDelete, RepositoryInsert, RepositoryUpdate } from '../../core/decorators/repository';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { ClientEvent } from '../../shared/event/client';
import { joaat } from '../../shared/joaat';
import { Vector3 } from '../../shared/polyzone/vector';
import { RepositoryType } from '../../shared/repository';
import { SceneLiveElement } from '../../shared/scene';
import { ObjectProvider } from '../object/object.provider';
import { ResourceLoader } from '../repository/resource.loader';
import { SceneRepository } from '../repository/scene.repository';
import { LightObject } from '../world/light.object';

const LIGHT_OBJECT_MODELS = [
    joaat('prop_spot_clamp_02'),
    joaat('prop_spot_01'),
    joaat('sm_prop_smug_hangar_lamp_led_b'),
];

const LIGHT_OBJECT_OFFSET: Record<number, Vector3> = {
    [joaat('prop_spot_01')]: [0, 0, 90],
    [joaat('prop_spot_clamp_02')]: [0, 0, 90],
    [joaat('sm_prop_smug_hangar_lamp_led_b')]: [0, 0, 90],
};

@Provider()
export class SceneLiveProvider {
    @Inject(ObjectProvider)
    private objectProvider: ObjectProvider;

    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

    @Inject(SceneRepository)
    private sceneRepository: SceneRepository;

    private lightObjects: Map<string, LightObject> = new Map();

    private liveStates: Map<string, SceneLiveElement> = new Map();

    private effectHandles: Map<string, number> = new Map();

    @RepositoryInsert(RepositoryType.SceneLive)
    @RepositoryUpdate(RepositoryType.SceneLive)
    async onSceneUpdate(element: SceneLiveElement) {
        this.liveStates.set(element.id, element);

        if (element.type === 'live_effect') {
            const scene = this.sceneRepository.find(element.sceneId);

            if (!scene) {
                return;
            }

            let position = null;

            if (scene.markers[element.id]) {
                position = scene.markers[element.id].position;
            }

            if (scene.entities[element.id]) {
                position = scene.entities[element.id].object.position;
            }

            if (!position) {
                return;
            }

            if (this.effectHandles.has(element.id)) {
                StopParticleFxLooped(this.effectHandles.get(element.id), false);
            }

            await this.resourceLoader.loadPtfxAsset(element.dictionary);
            UseParticleFxAsset(element.dictionary);

            const fx = element.loop
                ? StartParticleFxLoopedAtCoord(
                      element.effect,
                      position[0],
                      position[1],
                      position[2],
                      0,
                      0,
                      0,
                      1.0,
                      false,
                      false,
                      false,
                      false
                  )
                : StartParticleFxNonLoopedAtCoord(
                      element.effect,
                      position[0],
                      position[1],
                      position[2],
                      0,
                      0,
                      0,
                      1.0,
                      false,
                      false,
                      false
                  );

            this.effectHandles.set(element.id, fx);
            this.resourceLoader.unloadPtfxAsset(element.dictionary);
        }

        if (element.type === 'live_light') {
            const lightObject = this.getLightObject(element.id);

            if (!lightObject) {
                return;
            }

            lightObject.applyState(element.state, element.merge);
        }

        if (element.type === 'live_light_transition') {
            const lightObject = this.getLightObject(element.id);

            if (!lightObject) {
                return;
            }

            lightObject.applyTransition(element.transition);
        }

        if (element.type === 'live_light_animation') {
            const lightObject = this.getLightObject(element.id);

            if (!lightObject) {
                return;
            }

            lightObject.applyAnimation(element.animation);
        }
    }

    @RepositoryDelete(RepositoryType.SceneLive)
    async onSceneDelete(element: SceneLiveElement) {
        if (this.effectHandles.has(element.id)) {
            StopParticleFxLooped(this.effectHandles.get(element.id), false);
        }

        this.liveStates.delete(element.id);

        const lightObject = this.lightObjects.get(element.id);

        if (!lightObject) {
            return;
        }

        lightObject.reset();
        this.lightObjects.delete(element.id);
    }

    @Tick(TickInterval.EVERY_FRAME)
    async updateLightObjects(): Promise<void> {
        for (const [objectId, lightObject] of this.lightObjects) {
            if (!DoesEntityExist(lightObject.object)) {
                this.lightObjects.delete(objectId);
                continue;
            }

            lightObject.update();
        }
    }

    @OnEvent(ClientEvent.OBJECT_SPAWN)
    public onSpawn(id: string): void {
        const state = this.liveStates.get(id);

        if (!state) {
            return;
        }

        if (state.type === 'live_light') {
            const lightObject = this.getLightObject(id);

            if (!lightObject) {
                return;
            }

            lightObject.applyState(state.state);
        }

        if (state.type === 'live_light_transition') {
            const lightObject = this.getLightObject(id);

            if (!lightObject) {
                return;
            }

            lightObject.applyTransition(state.transition);
        }

        if (state.type === 'live_light_animation') {
            const lightObject = this.getLightObject(id);

            if (!lightObject) {
                return;
            }

            lightObject.applyAnimation(state.animation);
        }
    }

    @OnEvent(ClientEvent.OBJECT_DESPAWN)
    public onDespawn(id: string): void {
        if (this.lightObjects.has(id)) {
            this.lightObjects.delete(id);
        }
    }

    private getLightObject(objectId: string): LightObject | null {
        if (this.lightObjects.has(objectId)) {
            return this.lightObjects.get(objectId);
        }

        const entity = this.objectProvider.getEntityFromId(objectId);

        if (!entity || !DoesEntityExist(entity)) {
            return null;
        }

        const model = GetEntityModel(entity);

        if (!LIGHT_OBJECT_MODELS.includes(model)) {
            return null;
        }

        const lightObject = new LightObject(entity, LIGHT_OBJECT_OFFSET[model] || [0, 0, 0]);
        this.lightObjects.set(objectId, lightObject);

        return lightObject;
    }
}
