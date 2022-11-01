import { Injectable } from '../../core/decorators/injectable';

@Injectable()
export class PhoneService {
    isPhoneVisible(): boolean {
        return exports['soz-phone'].isPhoneVisible();
    }

    setPhoneFocus(status: boolean): void {
        exports['soz-phone'].setPhoneFocus(status);
    }
}
