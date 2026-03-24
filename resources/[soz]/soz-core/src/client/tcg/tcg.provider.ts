// =====================================================================
// resources/[soz]/soz-core/src/client/tcg/tcg.provider.ts
// Bridge client-side : reçoit les appels NUI du phone et forward au server
//
// IMPORTANT : Dans SOZ, le phone NUI envoie des callbacks au CLIENT,
// qui les forward ensuite au SERVER via RPC.
// Ce fichier suit le même pattern que les autres apps du phone.
// =====================================================================

import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { emitRpc } from '../../core/rpc';
import { TcgEvents } from '../../shared/tcg/tcg.types';

@Provider()
export class TcgClientProvider {
    @Rpc(TcgEvents.GetDailyStatus)
    async getDailyStatus() {
        return emitRpc(TcgEvents.GetDailyStatus);
    }

    @Rpc(TcgEvents.ClaimDailyCards)
    async claimDailyCards() {
        return emitRpc(TcgEvents.ClaimDailyCards);
    }

    @Rpc(TcgEvents.GetCollection)
    async getCollection() {
        return emitRpc(TcgEvents.GetCollection);
    }
}
