import { ALL_LOCATIONS, CAMERA_TRANSITION_DURATION } from '../../../config/ceremony';
import { Command } from '../../../core/decorators/command';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { wait } from '../../../core/utils';
import { ClientEvent } from '../../../shared/event/client';
import { NpcProvider } from '../../utils/npc.provider';

@Provider()
export class Election2024CeremonyProvider {
    @Inject(NpcProvider)
    private readonly npcProvider: NpcProvider;

    private showRunning = false;

    @Command('c')
    async ceremony(): Promise<void> {
        if (this.showRunning) return;

        this.showRunning = true;

        TriggerClientEvent(ClientEvent.CEREMONY_CREATE_CAMERA, -1);
        await wait(1_000);

        this.npcProvider.disableNPC(true);

        for (const [id, location] of Object.entries(ALL_LOCATIONS)) {
            TriggerClientEvent(ClientEvent.CEREMONY_RUN_LOCATION, -1, id);
            await wait(CAMERA_TRANSITION_DURATION + location.duration);
        }

        TriggerClientEvent(ClientEvent.CEREMONY_DELETE_CAMERA, -1);

        this.npcProvider.disableNPC(false);
        this.showRunning = false;
    }
}
