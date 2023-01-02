import { Module } from '../../../core/decorators/module';
import { LSMCCheckHealthProvider } from './lsmc.check.health.provider';
import { LSMCCloakroomProvider } from './lsmc.cloakroom.provider';
import { LSMCDeathProvider } from './lsmc.death.provider';
import { LSMCHalloweenProvider } from './lsmc.halloween.provider';
import { LSMCPharmacyProvider } from './lsmc.pharmacy.provider';

@Module({
    providers: [
        LSMCCheckHealthProvider,
        LSMCPharmacyProvider,
        LSMCHalloweenProvider,
        LSMCDeathProvider,
        LSMCCloakroomProvider,
    ],
})
export class LSMCModule {}
