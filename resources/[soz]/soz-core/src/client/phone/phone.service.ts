import { Inject, Injectable } from '@core/decorators/injectable';
import { PhoneState } from '@public/client/phone/phone.state';
import { VoicePhoneProvider } from '@public/client/voip/voice/voice.phone.provider';

@Injectable()
export class PhoneService {
    @Inject(PhoneState)
    private readonly phoneState: PhoneState;

    @Inject(PhoneState)
    private readonly voicePhoneProvider: VoicePhoneProvider;

    private disabledReasons = new Set<string>();

    isPhoneVisible(): boolean {
        return this.phoneState.isPhoneOpen();
    }

    hasAnActiveCall(): boolean {
        return this.voicePhoneProvider.hasActiveCall();
    }

    setPhoneFocus(status: boolean): void {
        // exports['soz-phone'].setPhoneFocus(status);
    }

    stopPhoneCall(): void {
        // exports['soz-phone'].stopPhoneCall();
    }

    setPhoneDisabled(reason: string, value: boolean): void {
        if (value) {
            this.disabledReasons.add(reason);
            // exports['soz-phone'].stopPhoneCall();
            this.phoneState.setPhoneDisabled(value);
        } else {
            this.disabledReasons.delete(reason);
            if (this.disabledReasons.size == 0) {
                this.phoneState.setPhoneDisabled(value);
            }
        }
    }
}
