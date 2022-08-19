import { PhoneEvents } from '../../typings/phone';
import { sendMessage } from '../utils/messages';
import { animationService } from './animations/animation.controller';
import { callService, initializeCallHandler } from './calls/cl_calls.controller';
import { hidePhone, showPhone } from './cl_main';
import { verifyExportArgType } from './cl_utils';

const exps = global.exports;

// Will open an app based on ID
exps('openApp', (app: string) => {
    verifyExportArgType('openApp', app, ['string']);

    sendMessage('PHONE', PhoneEvents.OPEN_APP, app);
});

// Will set the phone to open or closed based on based value
exps('setPhoneVisible', async (bool: boolean | number) => {
    verifyExportArgType('setPhoneVisible', bool, ['boolean', 'number']);

    const isPhoneDisabled = global.isPhoneDisabled;
    const isPhoneOpen = global.isPhoneOpen;
    // We need to make sure that the phone isn't disabled before we use the setter
    if (isPhoneDisabled && !bool && isPhoneOpen) return;

    const coercedType = !!bool;

    if (coercedType) await showPhone();
    else await hidePhone();
});

// Getter equivalent of above
exps('isPhoneVisible', () => global.isPhoneOpen);

exps('setPhoneFocus', (bool: boolean) => {
    SetNuiFocus(bool, bool);
    SetNuiFocusKeepInput(bool);
});

// Will prevent the phone from being opened
exps('setPhoneDisabled', (bool: boolean | number) => {
    verifyExportArgType('setPhoneVisible', bool, ['boolean', 'number']);
    const coercedType = !!bool;
    global.isPhoneDisabled = coercedType;
});

exps('isPhoneDisabled', () => global.isPhoneDisabled);

// Takes in a number to start the call with
exps('startPhoneCall', (number: string) => {
    verifyExportArgType('startPhoneCall', number, ['string']);

    initializeCallHandler({ receiverNumber: number });
});

exps('stopPhoneCall', async () => {
    if (global.isPhoneOpen) {
        await hidePhone();
    }
    if (callService.isInCall()) {
        callService.handleEndCall();
        await animationService.endPhoneCall();
    }
});
