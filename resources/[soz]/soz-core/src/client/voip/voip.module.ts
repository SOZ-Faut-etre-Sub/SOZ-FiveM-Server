import { Module } from '../../core/decorators/module';
import { VoipProvider } from './voip.provider';

@Module({
    providers: [VoipProvider],
})
export class VoipModule {}
