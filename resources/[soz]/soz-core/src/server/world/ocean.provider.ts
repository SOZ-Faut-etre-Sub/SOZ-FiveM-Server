import { OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Rpc } from '@public/core/decorators/rpc';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { RpcServerEvent } from '@public/shared/rpc';

import { Provider } from '../../core/decorators/provider';
import { PermissionService } from '../permission.service';

@Provider()
export class OceanProvider {
    @Inject(PermissionService)
    private permissionService: PermissionService;

    private waterCurrentLevel = 0;
    private waterLevel = 0;
    private highWave = false;

    @Rpc(RpcServerEvent.METEOR_OCEAN)
    public async getOceanInfo() {
        return [this.waterCurrentLevel, this.waterLevel, this.highWave];
    }

    @OnEvent(ServerEvent.ADMIN_OCEAN_WATER_CURRENT_LEVEL)
    public async setWaterCurrentLevel(source: number, targetLevel: number) {
        if (!this.permissionService.isStaff(source)) {
            return;
        }

        this.waterCurrentLevel = targetLevel;
    }

    @OnEvent(ServerEvent.ADMIN_OCEAN_WATER_LEVEL)
    public async flood(source: number, targetLevel: number, force: boolean) {
        if (!this.permissionService.isStaff(source)) {
            return;
        }

        this.waterLevel = targetLevel;
        if (force) {
            this.waterCurrentLevel = targetLevel;
        }

        TriggerLatentClientEvent(ClientEvent.OCEAN_WATER_LEVEL, -1, 1024, this.waterLevel, source, force);
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
