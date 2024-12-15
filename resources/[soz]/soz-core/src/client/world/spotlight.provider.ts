import { OnEvent } from '../../core/decorators/event';
import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import { RGBColor } from '../../shared/color';
import { ClientEvent } from '../../shared/event/client';
import { sub2Vector3, Vector3 } from '../../shared/polyzone/vector';
import { Spotlight } from '../../shared/spotlight';

@Provider()
export class SpotlightProvider {
    private spotlights: Record<string, Spotlight> = {};

    @OnEvent(ClientEvent.CREATE_SPOTLIGHT)
    public async createSpotlight(
        id: string,
        position: Vector3,
        target: Vector3,
        color: RGBColor,
        distance: number,
        radius: number,
        brightness: number,
        roundness: number,
        duration: number,
        falloff = 0
    ): Promise<string> {
        const getDirVector = sub2Vector3(target, position);

        this.spotlights[id] = {
            position,
            direction: getDirVector,
            color,

            distance,
            radius,
            roundness,
            falloff,

            currentBrightness: 0,
            targetBrightness: brightness,

            currentDuration: 0,
            targetDuration: duration,
        };

        return id;
    }

    @OnEvent(ClientEvent.UPDATE_SPOTLIGHT)
    public async updateSpotlight(id: string, brightness: number, duration: number): Promise<void> {
        if (!this.spotlights[id]) return;

        this.spotlights[id].currentDuration = 0;
        this.spotlights[id].targetDuration = duration;
        this.spotlights[id].targetBrightness = brightness;
    }

    @OnEvent(ClientEvent.DELETE_SPOTLIGHT)
    public async deleteSpotlight(id: string): Promise<void> {
        delete this.spotlights[id];
    }

    @Tick()
    public async tick() {
        for (const spotlight of Object.values(this.spotlights)) {
            DrawSpotLight(
                spotlight.position[0],
                spotlight.position[1],
                spotlight.position[2],
                spotlight.direction[0],
                spotlight.direction[1],
                spotlight.direction[2],
                spotlight.color[0],
                spotlight.color[1],
                spotlight.color[2],
                spotlight.distance,
                spotlight.currentBrightness,
                spotlight.roundness,
                spotlight.radius,
                spotlight.falloff
            );

            const remainingDuration = spotlight.targetDuration - spotlight.currentDuration;
            const durationDelta = (GetFrameTime() * 1000) / remainingDuration;

            if (spotlight.currentBrightness < spotlight.targetDuration) {
                const brightnessDelta = (spotlight.targetBrightness - spotlight.currentBrightness) * durationDelta;

                if (spotlight.currentDuration >= spotlight.targetDuration) {
                    spotlight.currentBrightness = spotlight.targetBrightness;
                    continue;
                }

                spotlight.currentDuration += GetFrameTime() * 1000;
                spotlight.currentBrightness += brightnessDelta;
            } else if (spotlight.currentBrightness > spotlight.targetDuration) {
                const brightnessDelta = (spotlight.currentBrightness - spotlight.targetBrightness) * durationDelta;

                if (spotlight.currentDuration >= spotlight.targetDuration) {
                    spotlight.currentBrightness = spotlight.targetBrightness;
                    continue;
                }

                spotlight.currentDuration += GetFrameTime() * 1000;
                spotlight.currentBrightness -= brightnessDelta;
            }
        }
    }
}
