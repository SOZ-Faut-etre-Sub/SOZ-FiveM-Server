import { NuiCallbackFunc } from '@project-error/pe-utils';

import { IAlertProps } from '../../../typings/alerts';
import {
    ActiveCall,
    CallEvents,
    CallHistoryItem,
    EndCallDTO,
    InitializeCallDTO,
    MuteCallDTO,
    StartCallEventData,
    TransmitterNumDTO,
} from '../../../typings/call';
import { ServerPromiseResp } from '../../../typings/common';
import { emitNetTyped, onNetTyped } from '../../server/utils/miscUtils';
import { sendDialerEvent } from '../../utils/messages';
import { animationService } from '../animations/animation.controller';
import { hidePhone } from '../cl_main';
import { RegisterNuiCB, RegisterNuiProxy } from '../cl_utils';
import { ClUtils } from '../client';
import { CallService } from './cl_calls.service';

export const callService = new CallService();

export const initializeCallHandler = async (data: InitializeCallDTO, cb?: NuiCallbackFunc) => {
    if (callService.isInCall()) return;

    try {
        const serverRes = await ClUtils.emitNetPromise<ServerPromiseResp<ActiveCall>>(CallEvents.INITIALIZE_CALL, data);
        // If something went wrong lets inform the client
        if (serverRes.status !== 'ok') {
            return cb(serverRes);
        }

        animationService.startPhoneCall();
        const { transmitter, isTransmitter, receiver, isUnavailable } = serverRes.data;
        // Start the process of giving NUI feedback by opening NUI modal
        callService.handleStartCall(transmitter, receiver, isTransmitter, isUnavailable);
        cb({ status: 'ok' });
    } catch (e) {
        console.error(e);
        cb({ status: 'error', errorMsg: 'CLIENT_TIMED_OUT' });
    }
};

// Will trigger whenever somebody initializes a call to any number
RegisterNuiCB<InitializeCallDTO>(CallEvents.INITIALIZE_CALL, initializeCallHandler);

onNetTyped<StartCallEventData>(CallEvents.START_CALL, data => {
    const { transmitter, isTransmitter, receiver, isUnavailable } = data;
    callService.handleStartCall(transmitter, receiver, isTransmitter, isUnavailable);
});

RegisterNuiCB<TransmitterNumDTO>(CallEvents.ACCEPT_CALL, (data, cb) => {
    animationService.startPhoneCall();
    emitNetTyped<TransmitterNumDTO>(CallEvents.ACCEPT_CALL, data);
    cb({});
});

onNetTyped<ActiveCall>(CallEvents.WAS_ACCEPTED, callData => {
    callService.handleCallAccepted(callData);
});

RegisterNuiCB<MuteCallDTO>(CallEvents.MUTE_PLAYER_CALL, (data, cb) => {
    emitNetTyped<MuteCallDTO>(CallEvents.MUTE_PLAYER_CALL, data);
    cb({});
});

// Rejected call
RegisterNuiCB<TransmitterNumDTO>(CallEvents.REJECTED, (data, cb) => {
    emitNetTyped<TransmitterNumDTO>(CallEvents.REJECTED, data);
    cb({});
});

onNet(CallEvents.WAS_REJECTED, async () => {
    callService.handleRejectCall();
    animationService.endPhoneCall();
});

RegisterNuiCB<EndCallDTO>(CallEvents.END_CALL, async (data, cb) => {
    try {
        const serverRes: ServerPromiseResp<void> = await ClUtils.emitNetPromise(CallEvents.END_CALL, data);
        if (serverRes.status === 'error') console.error(serverRes.errorMsg);
        callService.handleEndCall();
        cb({});
    } catch (e) {
        console.error(e);
        cb({ status: 'error', errorMsg: 'CLIENT_TIMED_OUT' });
    }
    animationService.endPhoneCall();
});

onNet(CallEvents.WAS_ENDED, () => {
    callService.handleEndCall();
    animationService.endPhoneCall();
});

onNet('ems:client:onDeath', () => {
    callService.handleEndCall();
    animationService.endPhoneCall();
    hidePhone();
});

// Simple fetch so lets just proxy it
RegisterNuiProxy(CallEvents.FETCH_CALLS);

onNet(CallEvents.SEND_ALERT, (alert: IAlertProps) => {
    callService.handleSendAlert(alert);
});

onNet(CallEvents.ADD_CALL, (item: CallHistoryItem) => {
    sendDialerEvent(CallEvents.ADD_CALL, item);
});

onNet(CallEvents.UPDATE_CALL, (item: CallHistoryItem) => {
    sendDialerEvent(CallEvents.UPDATE_CALL, item);
});
