import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Rpc } from '@public/core/decorators/rpc';
import { PrismaService } from '@public/server/database/prisma.service';
import { RpcEvent } from '@public/shared/rpc';

@Provider()
export class UpwFacilityProvider {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Rpc(RpcEvent.UPW_GET_FACILITIES)
    async onGetFacilities(source: number, type: string) {
        return await this.prismaService.upw_facility.findMany({
            where: {
                type: type,
            },
        });
    }
}
