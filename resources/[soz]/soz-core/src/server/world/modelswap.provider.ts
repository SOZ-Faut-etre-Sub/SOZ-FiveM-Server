import { ServerEvent } from '@public/shared/event';
import { Vector3 } from '@public/shared/polyzone/vector';

import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { PermissionService } from '../permission.service';
import { ModelSwapRepository } from '../repository/modelswap.repository';

@Provider()
export class ModelSwapProvider {
    @Inject(PermissionService)
    private permissionService: PermissionService;

    @Inject(ModelSwapRepository)
    private modelSwapRepository: ModelSwapRepository;

    @OnEvent(ServerEvent.ADMIN_SWAPMODEL_ADD)
    public async onAdd(source: number, sourceModel: string, targetModel: string, range: number, position: Vector3) {
        if (!this.permissionService.isStaff(source)) {
            return;
        }

        await this.modelSwapRepository.addSwap({
            id: 0,
            source: sourceModel,
            target: targetModel,
            position,
            range,
        });
    }

    @OnEvent(ServerEvent.ADMIN_SWAPMODEL_DELETE)
    public async onDelete(source: number, id: number) {
        if (!this.permissionService.isStaff(source)) {
            return;
        }

        await this.modelSwapRepository.removeSwap(id);
    }
}
