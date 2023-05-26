import { Module } from '../../core/decorators/module';
import { VoipMegaphoneProvider } from './voip.megaphone.provider';
import { VoipMicrophoneProvider } from './voip.microphone.provider';
import { VoipProvider } from './voip.provider';
import { VoipRadioProvider } from './voip.radio.provider';
import { VoipRadioVehicleProvider } from './voip.radio.vehicle.provider';

@Module({
    providers: [
        VoipMegaphoneProvider,
        VoipMicrophoneProvider,
        VoipProvider,
        VoipRadioProvider,
        VoipRadioVehicleProvider,
    ],
})
export class VoipModule {}
