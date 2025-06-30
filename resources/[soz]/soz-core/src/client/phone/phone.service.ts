import { Inject, Injectable } from '@core/decorators/injectable';
import { wait } from '@core/utils';
import { PhoneSimCardCalls } from '@public/client/phone/phone.simcard.calls';
import { PhoneState } from '@public/client/phone/phone.state';
import { VoicePhoneProvider } from '@public/client/voip/voice/voice.phone.provider';
import { ClientEvent } from '@public/shared/event/client';

@Injectable()
export class PhoneService {
    @Inject(PhoneState)
    private readonly phoneState: PhoneState;

    @Inject(VoicePhoneProvider)
    private readonly voicePhoneProvider: VoicePhoneProvider;

    @Inject(PhoneSimCardCalls)
    private readonly phoneSimCardCalls: PhoneSimCardCalls;

    private disabledReasons = new Set<string>();

    isPhoneVisible(): boolean {
        return this.phoneState.isPhoneOpen();
    }

    hasAnActiveCall(): boolean {
        return this.voicePhoneProvider.hasActiveCall();
    }

    setPhoneFocus(status: boolean): void {
        this.phoneState.setPhoneFocus(status);
    }

    stopPhoneCall(): void {
        if (!this.phoneState.isInCall()) return;

        this.phoneSimCardCalls.onCallEnd(this.phoneState.getCurrentCall()?.transmitter);
    }

    setPhoneDisabled(reason: string, value: boolean): void {
        if (value) {
            this.disabledReasons.add(reason);
            this.stopPhoneCall();
            this.phoneState.setPhoneDisabled(value);
        } else {
            this.disabledReasons.delete(reason);
            if (this.disabledReasons.size == 0) {
                this.phoneState.setPhoneDisabled(value);
            }
        }
    }

    public async hidePhone() {
        this.phoneState.setPhoneFrontCameraEnabled(false);
        this.phoneState.setPhoneFlashlightEnabled(false);
        this.phoneState.setPhoneOpen(false);
        TriggerEvent(ClientEvent.PHONE_IS_INSIDE_INPUT, { insideInput: false });
        await wait(200);
    }
}
