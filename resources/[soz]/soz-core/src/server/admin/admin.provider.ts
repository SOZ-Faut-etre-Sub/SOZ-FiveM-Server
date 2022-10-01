import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { RpcEvent } from '../../shared/rpc';
import { PermissionService } from '../permission.service';

@Provider()
export class AdminProvider {
    @Inject(PermissionService)
    private permissionService: PermissionService;

    @Rpc(RpcEvent.ADMIN_IS_ALLOWED)
    public isAllowed(source: number): [boolean, string] {
        const isAllowed = this.permissionService.isHelper(source);
        if (isAllowed) {
            return [true, this.permissionService.getPermission(source)];
        }
        return [false, ''];
    }
}
