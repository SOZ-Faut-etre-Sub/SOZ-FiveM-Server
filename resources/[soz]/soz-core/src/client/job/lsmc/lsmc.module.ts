import { Module } from '../../../core/decorators/module';
import { LSMCCheckHealthProvider } from './lsmc.check.health.provider';
import { LSMCPharmacyProvider } from './lsmc.pharmacy.provider';

@Module({
    providers: [LSMCCheckHealthProvider, LSMCPharmacyProvider],
})
export class LSMCModule {}
