import { OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { ClientEvent, ServerEvent } from '@public/shared/event';

import { Provider } from '../../core/decorators/provider';
import { PermissionService } from '../permission.service';

@Provider()
export class OceanProvider {
    @Inject(PermissionService)
    private permissionService: PermissionService;

    private waterLevel = 0;
    private highWave = false;

    @OnEvent(ServerEvent.ADMIN_OCEAN_WATER_LEVEL)
    public async flood(source: number, targetLevel: number) {
        if (!this.permissionService.isStaff(source)) {
            return;
        }

        this.waterLevel = targetLevel;
        TriggerLatentClientEvent(ClientEvent.OCEAN_WATER_LEVEL, -1, 1024, this.waterLevel);
    }

    @OnEvent(ServerEvent.ADMIN_OCEAN_WATER_HIGH_WAVE)
    public async setHighWave(source: number, value: boolean) {
        if (!this.permissionService.isStaff(source)) {
            return;
        }

        this.highWave = value;
        TriggerLatentClientEvent(ClientEvent.OCEAN_WATER_HIGH_WAVE, -1, 1024, this.highWave);
    }
}
