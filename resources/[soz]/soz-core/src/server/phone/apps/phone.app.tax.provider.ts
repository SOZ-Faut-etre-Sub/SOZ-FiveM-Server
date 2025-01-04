import { Provider } from '@public/core/decorators/provider';

import { Inject } from '../../../core/decorators/injectable';
import { Rpc } from '../../../core/decorators/rpc';
import { RpcServerEvent } from '../../../shared/rpc';
import { PrismaService } from '../../database/prisma.service';

@Provider()
export class PhoneAppTaxProvider {
    @Inject(PrismaService)
    private readonly prismaService: PrismaService;

    @Rpc(RpcServerEvent.PHONE_APP_TAX_GET)
    async getTaxes() {
        return this.prismaService.tax.findMany();
    }
}
