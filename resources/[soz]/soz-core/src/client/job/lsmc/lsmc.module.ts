import { Module } from '../../../core/decorators/module';
import { LSMCCheckHealthProvider } from './lsmc.check.health.provider';
import { LSMCHalloweenProvider } from './lsmc.halloween.provider';
import { LSMCPharmacyProvider } from './lsmc.pharmacy.provider';

@Module({
    providers: [LSMCCheckHealthProvider, LSMCPharmacyProvider, LSMCHalloweenProvider],
})
export class LSMCModule {}
