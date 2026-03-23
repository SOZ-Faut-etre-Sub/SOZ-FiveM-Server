// =============================================================================
// src/server/ia-legal/ia-legal.provider.ts
// Provider serveur : reçoit la question via RPC, appelle l'API locale
// =============================================================================

import axios from 'axios';

import { Provider } from '@public/core/decorators/provider';

import { Inject } from '../../core/decorators/injectable';
import { Rpc } from '../../core/decorators/rpc';
import { Logger } from '../../core/logger';
import { RpcServerEvent } from '../../shared/rpc';
import { IaLegalRequest, IaLegalResponse } from '../../shared/ia-legal/ia-legal.types';

const API_URL = 'http://127.0.0.1:3000/api/legal';
const TIMEOUT_MS = 60000; // 60s — Ollama peut être lent

@Provider()
export class IaLegalProvider {
    @Inject(Logger)
    private readonly logger: Logger;

    @Rpc(RpcServerEvent.PHONE_APP_IA_LEGAL_ASK_QUESTION)
    async askQuestion(source: number, request: IaLegalRequest): Promise<IaLegalResponse> {
        const question = request?.question?.trim();

        if (!question) {
            return {
                success: false,
                answer: '',
                error: 'Question vide.',
            };
        }

        this.logger.info(`[IA Legal] Joueur ${source} pose : "${question.substring(0, 80)}"`);

        try {
            const response = await axios.post(
                API_URL,
                { question },
                {
                    timeout: TIMEOUT_MS,
                    headers: { 'Content-Type': 'application/json' },
                    validateStatus: () => true,
                }
            );

            if (response.status !== 200 || !response.data?.success) {
                this.logger.error(
                    `[IA Legal] Erreur API : status=${response.status}, data=${JSON.stringify(response.data)}`
                );
                return {
                    success: false,
                    answer: '',
                    error: response.data?.error ?? 'Erreur de l\'API Legal.',
                };
            }

            this.logger.info(`[IA Legal] Réponse OK (${response.data.answer.length} chars)`);

            return {
                success: true,
                answer: response.data.answer,
            };
        } catch (err) {
            this.logger.error(`[IA Legal] Appel API échoué : ${err.message}`);
            return {
                success: false,
                answer: '',
                error: 'Service IA Legal indisponible.',
            };
        }
    }
}
