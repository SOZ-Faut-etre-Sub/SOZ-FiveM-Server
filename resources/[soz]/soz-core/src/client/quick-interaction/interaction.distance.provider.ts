import { Once, OnceStep } from '@core/decorators/event';
import { Provider } from '@core/decorators/provider';
import { defaultDrawDistance, defaultInteractionDistance } from '@public/shared/interaction';

@Provider()
export class InteractionDistanceProvider {
    private interactionDrawDistance = new Map<string, number>();
    private interactionInteractionDistance = new Map<string, number>();

    public getDrawDistance(key: string) {
        return this.interactionDrawDistance.get(key) ?? defaultDrawDistance;
    }

    public getInteractionDistance(key: string) {
        return this.interactionInteractionDistance.get(key) ?? defaultInteractionDistance;
    }

    public updateDrawDistance(key: string, distance?: number) {
        this.interactionDrawDistance.set(key, distance ?? defaultDrawDistance);
    }

    public updateInteractionDistance(key: string, distance?: number) {
        this.interactionInteractionDistance.set(key, distance ?? defaultInteractionDistance);
    }

    @Once(OnceStep.Stop)
    public async onServerStop() {
        this.interactionDrawDistance.clear();
        this.interactionInteractionDistance.clear();
    }
}
