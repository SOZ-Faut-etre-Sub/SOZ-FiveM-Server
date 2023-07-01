import { Injectable } from '../../core/decorators/injectable';

@Injectable()
export class PhoneService {
    private disabledReasons = new Set<string>();

    isPhoneVisible(): boolean {
        return exports['soz-phone'].isPhoneVisible();
    }

    setPhoneFocus(status: boolean): void {
        exports['soz-phone'].setPhoneFocus(status);
    }

    stopPhoneCall(): void {
        exports['soz-phone'].stopPhoneCall();
    }

    setPhoneDisabled(reason: string, value: boolean): void {
        if (value) {
            this.disabledReasons.add(reason);
            exports['soz-phone'].stopPhoneCall();
            exports['soz-phone'].setPhoneDisabled(value);
        } else {
            this.disabledReasons.delete(reason);
            if (this.disabledReasons.size == 0) {
                exports['soz-phone'].setPhoneDisabled(value);
            }
        }
    }
}
