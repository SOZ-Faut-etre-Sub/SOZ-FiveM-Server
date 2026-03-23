// =============================================================================
// src/shared/ia-legal/ia-legal.types.ts
// Types partagés entre NUI, client et server pour l'app IA Legal
// =============================================================================

/**
 * Requête envoyée par le NUI vers le client/server
 */
export interface IaLegalRequest {
    question: string;
}

/**
 * Réponse retournée par l'API locale
 */
export interface IaLegalResponse {
    success: boolean;
    answer: string;
    error?: string;
}
