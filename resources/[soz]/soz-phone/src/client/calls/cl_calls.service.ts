import { IAlertProps } from '../../../typings/alerts';
import { ActiveCall, CallEvents, CallRejectReasons } from '../../../typings/call';

export class CallService {
    private currentCall: number;
    private currentCallData: ActiveCall | null;

    constructor() {
        this.currentCall = 0;
        this.currentCallData = null;
    }

    static sendCallAction<T>(method: CallEvents, data: T): void {
        SendNUIMessage({
            app: 'CALL',
            method,
            data,
        });
    }

    isInCall() {
        return this.currentCall !== 0;
    }

    isCallAccepted() {
        return this.currentCallData?.is_accepted;
    }

    openCallModal(show: boolean) {
        CallService.sendCallAction<boolean>(CallEvents.SET_CALL_MODAL, show);
    }

    handleRejectCall() {
        // we don't want to reset our UI if we're in a call already.
        if (this.currentCall > 0) return;
        this.currentCall = 0;
        this.currentCallData = null;
        this.openCallModal(false);
        CallService.sendCallAction(CallEvents.SET_CALLER, null);
    }

    handleStartCall(transmitter: string, receiver: string, isTransmitter: boolean, isUnavailable: boolean) {
        // If we're already in a call we want to automatically reject
        if (this.isCallAccepted()) return emitNet(CallEvents.REJECTED, transmitter, CallRejectReasons.BUSY_LINE);

        // We set -1 to notify that comminucation is about to be etablished. So i'll respond 'BUSY_LINE'
        this.currentCall = -1;
        this.openCallModal(true);

        SendNUIMessage({
            app: 'CALL',
            method: CallEvents.SET_CALLER,
            data: {
                active: true,
                transmitter: transmitter,
                receiver: receiver,
                isTransmitter: isTransmitter,
                accepted: false,
                isUnavailable: isUnavailable,
            },
        });
    }

    handleCallAccepted(callData: ActiveCall) {
        this.currentCall = callData.channelId;
        this.currentCallData = callData;
        emitNet('voip:server:call:start', callData.transmitter, callData.receiver);
        CallService.sendCallAction<ActiveCall>(CallEvents.SET_CALLER, callData);
    }

    handleEndCall() {
        if (this.isCallAccepted()) {
            emitNet('voip:server:call:end');
        }

        this.currentCall = 0;
        this.currentCallData = null;
        this.openCallModal(false);

        CallService.sendCallAction<null>(CallEvents.SET_CALLER, null);
    }

    handleSendAlert(alert: IAlertProps) {
        SendNUIMessage({
            app: 'DIALER',
            method: CallEvents.SEND_ALERT,
            data: alert,
        });
    }
}
