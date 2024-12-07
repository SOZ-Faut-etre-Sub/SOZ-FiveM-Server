import { ALL_LOCATIONS, CAMERA_TRANSITION_DURATION, WAIT_BETWEEN_CEREMONY } from '../../../config/ceremony';
import { OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { wait } from '../../../core/utils';
import { ClientEvent } from '../../../shared/event/client';
import { ServerEvent } from '../../../shared/event/server';
import { PermissionService } from '../../permission.service';
import { NpcProvider } from '../../utils/npc.provider';

@Provider()
export class Election2024CeremonyProvider {
    @Inject(PermissionService)
    private readonly permissionService: PermissionService;

    @Inject(NpcProvider)
    private readonly npcProvider: NpcProvider;

    private showRunning = false;

    @OnEvent(ServerEvent.ADMIN_CEREMONY_START)
    async ceremony(source: number): Promise<void> {
        if (!this.permissionService.isStaff(source)) {
            return;
        }

        if (this.showRunning) return;

        this.showRunning = true;

        TriggerClientEvent(ClientEvent.CEREMONY_CREATE_CAMERA, -1);
        await wait(5_000);

        this.npcProvider.disableNPC(true);

        for (const [id, location] of Object.entries(ALL_LOCATIONS)) {
            TriggerClientEvent(ClientEvent.CEREMONY_RUN_LOCATION, -1, id);
            await wait(CAMERA_TRANSITION_DURATION + WAIT_BETWEEN_CEREMONY + location.duration);
        }

        TriggerClientEvent(ClientEvent.CEREMONY_DELETE_CAMERA, -1);

        this.npcProvider.disableNPC(false);
        this.showRunning = false;
    }
}
