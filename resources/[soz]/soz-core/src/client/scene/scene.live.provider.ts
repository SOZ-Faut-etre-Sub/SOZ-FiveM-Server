import '../repository/scene.live.repository';

import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { RepositoryDelete, RepositoryInsert, RepositoryUpdate } from '../../core/decorators/repository';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { ClientEvent } from '../../shared/event/client';
import { joaat } from '../../shared/joaat';
import { RepositoryType } from '../../shared/repository';
import { SceneLiveElement } from '../../shared/scene';
import { ObjectProvider } from '../object/object.provider';
import { LightObject } from '../world/light.object';

const LIGHT_OBJECT_MODELS = [
    joaat('prop_spot_clamp_02'),
    joaat('prop_spot_01'),
    joaat('sm_prop_smug_hangar_lamp_led_b'),
];

@Provider()
export class SceneLiveProvider {
    @Inject(ObjectProvider)
    private objectProvider: ObjectProvider;

    private lightObjects: Map<string, LightObject> = new Map();

    private liveStates: Map<string, SceneLiveElement> = new Map();

    @RepositoryInsert(RepositoryType.SceneLive)
    @RepositoryUpdate(RepositoryType.SceneLive)
    async onSceneUpdate(element: SceneLiveElement) {
        this.liveStates.set(element.id, element);

        if (element.type === 'live_effect') {
            // @TODO: live effects
        }

        if (element.type === 'live_light') {
            const lightObject = this.getLightObject(element.id);

            if (!lightObject) {
                return;
            }

            lightObject.applyState(element.state);
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

        const lightObject = new LightObject(entity);
        this.lightObjects.set(objectId, lightObject);

        return lightObject;
    }
}
