import {
    CAMERA_TRANSITION_DURATION,
    FINAL_CEREMONY,
    PUBLIC_CEREMONY,
    WAIT_BETWEEN_CEREMONY,
} from '../../../config/ceremony';
import { OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { wait } from '../../../core/utils';
import { ClientEvent } from '../../../shared/event/client';
import { ServerEvent } from '../../../shared/event/server';
import { PermissionService } from '../../permission.service';

@Provider()
export class Election2024CeremonyProvider {
    @Inject(PermissionService)
    private readonly permissionService: PermissionService;

    private showRunning = false;

    @OnEvent(ServerEvent.ADMIN_CEREMONY_PUBLIC_PART_START)
    async publicCeremony(source: number): Promise<void> {
        if (!this.permissionService.isStaff(source)) {
            return;
        }

        if (this.showRunning) return;

        this.showRunning = true;

        TriggerClientEvent(ClientEvent.CEREMONY_CREATE_CAMERA, -1);
        await wait(5_000);

        for (const [id, location] of Object.entries(PUBLIC_CEREMONY)) {
            TriggerClientEvent(ClientEvent.CEREMONY_RUN_LOCATION, -1, id);
            await wait(CAMERA_TRANSITION_DURATION + WAIT_BETWEEN_CEREMONY + location.duration);
        }

        TriggerClientEvent(ClientEvent.CEREMONY_DELETE_CAMERA, -1);

        this.showRunning = false;
    }

    @OnEvent(ServerEvent.ADMIN_CEREMONY_FINAL_PART_START)
    async finalCeremony(source: number): Promise<void> {
        if (!this.permissionService.isStaff(source)) {
            return;
        }

        if (this.showRunning) return;

        this.showRunning = true;

        TriggerClientEvent(ClientEvent.CEREMONY_CREATE_CAMERA, -1, true);
        await wait(10_000);

        for (const [id, location] of Object.entries(FINAL_CEREMONY)) {
            TriggerClientEvent(ClientEvent.CEREMONY_RUN_LOCATION, -1, id);
            await wait(CAMERA_TRANSITION_DURATION + location.duration);
        }

        TriggerClientEvent(ClientEvent.CEREMONY_DELETE_CAMERA, -1);

        this.showRunning = false;
    }

    @OnEvent(ServerEvent.ADMIN_CEREMONY_TIME)
    async time(source: number, value: number): Promise<void> {
        if (!this.permissionService.isStaff(source)) {
            return;
        }

        TriggerClientEvent(ClientEvent.STATE_FORCE_TIME, -1, value);
    }
}
