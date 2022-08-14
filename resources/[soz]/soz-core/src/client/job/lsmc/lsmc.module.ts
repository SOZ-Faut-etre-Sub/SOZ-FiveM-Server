import { Module } from '../../../core/decorators/module';
import { LSMCCheckHealthProvider } from './lsmc.check.health.provider';

@Module({
    providers: [LSMCCheckHealthProvider],
})
export class LSMCModule {}
