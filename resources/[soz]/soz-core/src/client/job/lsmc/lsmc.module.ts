import { Module } from '../../../core/decorators/module';
import { LSMCCheckHealthProvider } from './lsmc.check.health.provider';
import { LSMCCloakroomProvider } from './lsmc.cloakroom.provider';
import { LSMCDeathProvider } from './lsmc.death.provider';
import { LSMCHalloweenProvider } from './lsmc.halloween.provider';
import { LSMCInteractionProvider } from './lsmc.interaction.provider';
import { LSMCPharmacyProvider } from './lsmc.pharmacy.provider';
import { LSMCProvider } from './lsmc.provider';
import { LSMCSurgeryProvider } from './lsmc.surgery.provider';

@Module({
    providers: [
        LSMCCheckHealthProvider,
        LSMCPharmacyProvider,
        LSMCHalloweenProvider,
        LSMCDeathProvider,
        LSMCCloakroomProvider,
        LSMCInteractionProvider,
        LSMCSurgeryProvider,
        LSMCProvider,
    ],
})
export class LSMCModule {}
