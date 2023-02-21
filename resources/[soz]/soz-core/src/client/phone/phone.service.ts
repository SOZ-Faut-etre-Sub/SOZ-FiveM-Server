import { Injectable } from '../../core/decorators/injectable';

@Injectable()
export class PhoneService {
    isPhoneVisible(): boolean {
        return exports['soz-phone'].isPhoneVisible();
    }

    setPhoneFocus(status: boolean): void {
        exports['soz-phone'].setPhoneFocus(status);
    }

    stopPhoneCall(): void {
        exports['soz-phone'].stopPhoneCall();
    }

    setPhoneDisabled(value: boolean): void {
        exports['soz-phone'].setPhoneDisabled(value);
    }
}
