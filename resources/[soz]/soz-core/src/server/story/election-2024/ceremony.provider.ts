import { ALL_LOCATIONS, CAMERA_TRANSITION_DURATION, Location } from '../../../config/ceremony';
import { Command } from '../../../core/decorators/command';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { wait } from '../../../core/utils';
import { ClientEvent } from '../../../shared/event/client';
import { Store } from '../../store/store';

@Provider()
export class Election2024CeremonyProvider {
    @Inject('Store')
    private readonly store: Store;

    @Command('c')
    async ceremony(): Promise<void> {
        TriggerClientEvent(ClientEvent.CEREMONY_CREATE_CAMERA, -1);
        await wait(2000);

        this.store.dispatch.global.update({
            blackout: true,
            blackoutLevel: 3,
            blackoutOverride: true,
        });

        for (const location of ALL_LOCATIONS) {
            await this.runLocation(location);
            await wait(CAMERA_TRANSITION_DURATION + location.duration);
            await this.cleanLocation(location);
        }

        TriggerClientEvent(ClientEvent.CEREMONY_DELETE_CAMERA, -1);

        this.store.dispatch.global.update({
            blackout: false,
            blackoutLevel: 0,
            blackoutOverride: false,
        });
    }

    async runLocation(location: Location) {
        TriggerClientEvent(ClientEvent.CEREMONY_SET_CAMERA, -1, location.camera, location.center);
        await wait(CAMERA_TRANSITION_DURATION);

        for (const position of location.positions) {
            setTimeout(() => {
                TriggerClientEvent(
                    ClientEvent.CEREMONY_MOVE_CAMERA,
                    -1,
                    position.position,
                    position.rotation,
                    position.duration
                );
            }, position.triggerAt);
        }

        for (const firework of location.fireworks) {
            setTimeout(() => {
                TriggerClientEvent(
                    ClientEvent.CREATE_FIREWORK,
                    -1,
                    firework.type,
                    firework.trigger,
                    firework.explosive
                );
            }, firework.triggerAt);
        }

        for (const spotlight of location.spotlights) {
            setTimeout(() => {
                if (spotlight.action === 'add') {
                    TriggerClientEvent(
                        ClientEvent.CREATE_SPOTLIGHT,
                        -1,
                        spotlight.id,
                        spotlight.position,
                        spotlight.target,
                        spotlight.color,
                        spotlight.distance,
                        spotlight.radius,
                        spotlight.brightness,
                        spotlight.roundness,
                        spotlight.duration
                    );
                } else if (spotlight.action === 'update') {
                    TriggerClientEvent(
                        ClientEvent.UPDATE_SPOTLIGHT,
                        -1,
                        spotlight.id,
                        spotlight.brightness,
                        spotlight.duration
                    );
                } else if (spotlight.action === 'remove') {
                    TriggerClientEvent(ClientEvent.DELETE_SPOTLIGHT, -1, spotlight.id);
                }
            }, spotlight.triggerAt);
        }
    }

    async cleanLocation(location: Location) {
        for (const spotlight of location.spotlights) {
            TriggerClientEvent(ClientEvent.DELETE_SPOTLIGHT, -1, spotlight.id);
        }
    }
}
