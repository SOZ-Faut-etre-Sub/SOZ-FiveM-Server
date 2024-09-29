import { Once, OnceStep } from '@core/decorators/event';
import { Provider } from '@core/decorators/provider';

@Provider()
export class InteractionDistanceProvider {
    private interactionDrawDistance = new Map<string, number>();
    private interactionInteractionDistance = new Map<string, number>();

    private modelOverride = new Map<number, { draw?: number; interaction?: number }>();

    private readonly defaultDrawDistance = 2.5;
    private readonly defaultInteractionDistance = 1;

    public getDrawDistance(key: string, entity?: number) {
        const distance = this.interactionDrawDistance.get(key) ?? this.defaultDrawDistance;

        if (entity) {
            const model = GetEntityModel(entity);
            const override = this.modelOverride.get(model);
            if (!override) return distance;

            if (override.draw) return override.draw;
        }

        return distance;
    }

    public getInteractionDistance(key: string, entity?: number) {
        const distance = this.interactionInteractionDistance.get(key) ?? this.defaultInteractionDistance;

        if (entity) {
            const model = GetEntityModel(entity);
            const override = this.modelOverride.get(model);
            if (!override) return distance;

            if (override.interaction) return override.interaction;
        }

        return distance;
    }

    public updateDrawDistance(key: string, distance?: number) {
        this.interactionDrawDistance.set(key, distance ?? this.defaultDrawDistance);
    }

    public updateInteractionDistance(key: string, distance?: number) {
        this.interactionInteractionDistance.set(key, distance ?? this.defaultInteractionDistance);
    }

    public createModelOverride(model: number, drawDistance: number, interactionDistance: number) {
        this.modelOverride.set(model, { draw: drawDistance, interaction: interactionDistance });
    }

    @Once(OnceStep.Stop)
    public async onServerStop() {
        this.interactionDrawDistance.clear();
        this.interactionInteractionDistance.clear();
    }
}
