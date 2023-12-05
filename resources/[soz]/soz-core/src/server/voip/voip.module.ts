import { Module } from '../../core/decorators/module';
import { VoipProvider } from './voip.provider';
import { VoipRadioProvider } from './voip.radio.provider';

@Module({
    providers: [VoipProvider, VoipRadioProvider],
})
export class VoipModule {}
