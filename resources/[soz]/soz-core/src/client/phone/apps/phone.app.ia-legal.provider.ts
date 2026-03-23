// =============================================================================
// src/client/phone/apps/phone.app.ia-legal.provider.ts
// Provider client : reçoit l'event NUI, émet le RPC vers le serveur
// =============================================================================

import { Provider } from '@public/core/decorators/provider';

import { OnNuiEvent } from '../../../core/decorators/event';
import { emitRpcTimeout } from '../../../core/rpc';
import { NuiEvent } from '../../../shared/event/nui';
import { RpcServerEvent } from '../../../shared/rpc';
import { IaLegalRequest, IaLegalResponse } from '../../../shared/ia-legal/ia-legal.types';

const RPC_TIMEOUT_MS = 60000; // 60 secondes — Ollama peut être lent

@Provider()
export class PhoneAppIaLegalProvider {
    @OnNuiEvent(NuiEvent.PhoneAppIaLegalAskQuestion)
    async askQuestion(request: IaLegalRequest): Promise<IaLegalResponse> {
        return await emitRpcTimeout<IaLegalResponse>(
            RpcServerEvent.PHONE_APP_IA_LEGAL_ASK_QUESTION,
            RPC_TIMEOUT_MS,
            request
        );
    }
}
