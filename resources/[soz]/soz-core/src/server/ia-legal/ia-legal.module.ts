// =============================================================================
// src/server/ia-legal/ia-legal.module.ts
// Module serveur pour IA Legal
// =============================================================================

import { Module } from '../../core/decorators/module';

import { IaLegalProvider } from './ia-legal.provider';

@Module({
    providers: [IaLegalProvider],
})
export class IaLegalModule {}
