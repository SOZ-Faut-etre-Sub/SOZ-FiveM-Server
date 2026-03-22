import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';

import { OnNuiEvent } from '../../../core/decorators/event';
import { emitRpc } from '../../../core/rpc';
import { NuiEvent } from '../../../shared/event/nui';
import { RpcServerEvent } from '../../../shared/rpc';
import { TcgClaimResult, TcgCollectionCard, TcgDailyStatus } from '../../../shared/tcg/tcg.types';

@Provider()
export class PhoneAppTcgProvider {
    @OnNuiEvent(NuiEvent.PhoneAppTcgGetDailyStatus)
    async getDailyStatus(): Promise<TcgDailyStatus> {
        return await emitRpc<TcgDailyStatus>(RpcServerEvent.PHONE_APP_TCG_GET_DAILY_STATUS);
    }

    @OnNuiEvent(NuiEvent.PhoneAppTcgClaimDailyCards)
    async claimDailyCards(): Promise<TcgClaimResult> {
        return await emitRpc<TcgClaimResult>(RpcServerEvent.PHONE_APP_TCG_CLAIM_DAILY_CARDS);
    }

    @OnNuiEvent(NuiEvent.PhoneAppTcgGetCollection)
    async getCollection(): Promise<TcgCollectionCard[]> {
        return await emitRpc<TcgCollectionCard[]>(RpcServerEvent.PHONE_APP_TCG_GET_COLLECTION);
    }
}
