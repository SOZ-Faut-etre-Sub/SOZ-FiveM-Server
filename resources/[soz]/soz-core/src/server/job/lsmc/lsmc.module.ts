import { Module } from '../../../core/decorators/module';
import { LSMCCheckHealthProvider } from './lsmc.check.health.provider';
import { LSMCDeathProvider } from './lsmc.death.provider';
import { LsmcHalloweenProvider } from './lsmc.halloween.provider';
import { LSMCItemProvider } from './lsmc.item.provider';
import { LSMCPharmacyProvider } from './lsmc.pharmacy.provider';
import { LSMCProvider } from './lsmc.provider';

@Module({
    providers: [
        LSMCCheckHealthProvider,
        LSMCPharmacyProvider,
        LsmcHalloweenProvider,
        LSMCDeathProvider,
        LSMCProvider,
        LSMCItemProvider,
    ],
})
export class LSMCModule {}
