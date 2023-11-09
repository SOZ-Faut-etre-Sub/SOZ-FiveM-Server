import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Rpc } from '@public/core/decorators/rpc';
import { RpcServerEvent } from '@public/shared/rpc';

import { BankService } from './bank.service';

@Provider()
export class BankProvider {
    @Inject(BankService)
    private bankService: BankService;

    @Rpc(RpcServerEvent.BANK_GET_ACCOUNT)
    public async getBankAccount(source: number, citizenId): Promise<string> {
        return await this.bankService.getAccountid(citizenId);
    }
}
