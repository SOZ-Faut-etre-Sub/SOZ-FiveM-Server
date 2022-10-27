import { Module } from '../../../core/decorators/module';
import { LSMCCheckHealthProvider } from './lsmc.check.health.provider';
import { LsmcHalloweenProvider } from './lsmc.halloween.provider';
import { LSMCPharmacyProvider } from './lsmc.pharmacy.provider';

@Module({
    providers: [LSMCCheckHealthProvider, LSMCPharmacyProvider, LsmcHalloweenProvider],
})
export class LSMCModule {}
