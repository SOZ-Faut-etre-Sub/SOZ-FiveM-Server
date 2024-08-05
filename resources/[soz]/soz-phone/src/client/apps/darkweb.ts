import { DarkwebEvents } from '../../../typings/app/darkweb';
import { sendDarkwebEvent } from '../../utils/messages';
import { RegisterNuiProxy } from '../cl_utils';

RegisterNuiProxy(DarkwebEvents.FETCH_CONVERSATIONS);
RegisterNuiProxy(DarkwebEvents.FETCH_PARTICIPANTS);
RegisterNuiProxy(DarkwebEvents.FETCH_MESSAGES);
RegisterNuiProxy(DarkwebEvents.CREATE_CONVERSATION);
RegisterNuiProxy(DarkwebEvents.SEND_MESSAGE);
RegisterNuiProxy(DarkwebEvents.UPDATE_PARTICIPANT_ROLE);
RegisterNuiProxy(DarkwebEvents.ARCHIVE_CONVERSATION);
RegisterNuiProxy(DarkwebEvents.UPDATE_CONVERSATION);
RegisterNuiProxy(DarkwebEvents.SET_CONVERSATION_READ);

onNet(DarkwebEvents.UPDATE_BROADCAST_CONVERSATION_MESSAGES, (result: any) => {
    sendDarkwebEvent(DarkwebEvents.UPDATE_BROADCAST_CONVERSATION_MESSAGES_SUCCESS, result);
});

onNet(DarkwebEvents.UPDATE_BROADCAST_CONVERSATION, (result: any) => {
    sendDarkwebEvent(DarkwebEvents.UPDATE_BROADCAST_CONVERSATION_SUCCESS, result);
});

onNet(DarkwebEvents.UPDATE_BROADCAST_PARTICIPANTS, (result: any) => {
    sendDarkwebEvent(DarkwebEvents.UPDATE_BROADCAST_PARTICIPANTS_SUCCESS, result);
});