import { Inject, Injectable } from '@core/decorators/injectable';
import { PhoneState } from '@public/client/phone/phone.state';

@Injectable()
export class PhoneService {
    @Inject(PhoneState)
    private readonly phoneState: PhoneState;

    private disabledReasons = new Set<string>();

    isPhoneVisible(): boolean {
        return this.phoneState.isPhoneOpen();
    }

    hasAnActiveCall(): boolean {
        return false;
        // return exports['soz-phone'].hasAnActiveCall();
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
            // exports['soz-phone'].setPhoneDisabled(value);
        } else {
            this.disabledReasons.delete(reason);
            if (this.disabledReasons.size == 0) {
                // exports['soz-phone'].setPhoneDisabled(value);
            }
        }
    }
}
