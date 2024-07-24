import { Once, OnceStep, OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Rpc } from '@public/core/decorators/rpc';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { RpcServerEvent } from '@public/shared/rpc';

import { Provider } from '../../core/decorators/provider';
import { PermissionService } from '../permission.service';
import { ConfigurationRepository } from '../repository/configuration.repository';

@Provider()
export class OceanProvider {
    @Inject(PermissionService)
    private permissionService: PermissionService;

    @Inject(ConfigurationRepository)
    private configurationRepository: ConfigurationRepository;

    private waterCurrentLevel = 10;
    private waterLevel = 10;
    private highWave = false;

    @Once(OnceStep.DatabaseConnected)
    public async databaseReady() {
        const waterConf = await this.configurationRepository.getValue('Water');
        this.waterCurrentLevel = waterConf.level;
        this.waterLevel = waterConf.level;
    }

    @Rpc(RpcServerEvent.METEOR_OCEAN)
    public getOceanInfo() {
        return [this.waterCurrentLevel, this.waterLevel, this.highWave];
    }

    public getHighWave() {
        return this.highWave;
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
        this.configurationRepository.update('Water', {
            level: this.waterLevel,
        });

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
