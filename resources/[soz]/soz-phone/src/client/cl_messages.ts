import {
    CreateMessageBroadcast,
    MessageConversationResponse,
    MessageEvents,
    PreDBMessage,
} from '../../typings/messages';
import { sendMessageEvent } from '../utils/messages';
import { RegisterNuiCB, RegisterNuiProxy } from './cl_utils';

RegisterNuiProxy(MessageEvents.FETCH_MESSAGE_CONVERSATIONS);
RegisterNuiProxy(MessageEvents.FETCH_MESSAGES);
RegisterNuiProxy(MessageEvents.CREATE_MESSAGE_CONVERSATION);
RegisterNuiProxy(MessageEvents.DELETE_CONVERSATION);
RegisterNuiProxy(MessageEvents.SEND_MESSAGE);
/*RegisterNuiProxy(MessageEvents.SET_MESSAGE_READ);*/
RegisterNuiProxy(MessageEvents.SET_CONVERSATION_ARCHIVED);

RegisterNuiCB<void>(MessageEvents.SET_WAYPOINT, async (position: any) => {
    if (position['x'] !== 0 && position['y'] !== 0) {
        SetNewWaypoint(parseInt(position['x']), parseInt(position['y']));
    }
});

RegisterNuiCB<void>(MessageEvents.GET_POSITION, async (position: any, cb) => {
    const [posX, posY] = GetEntityCoords(PlayerPedId(), true);
    cb({ data: { x: posX, y: posY } });
});

RegisterNuiCB<void>(MessageEvents.GET_DESTINATION, async (position: any, cb) => {
    const [posX, posY] = GetBlipInfoIdCoord(GetFirstBlipInfoId(8));
    cb({ data: { x: posX, y: posY } });
});

onNet(MessageEvents.SEND_MESSAGE_SUCCESS, (messageDto: PreDBMessage) => {
    sendMessageEvent(MessageEvents.SEND_MESSAGE_SUCCESS, messageDto);
});

onNet(MessageEvents.CREATE_MESSAGE_BROADCAST, (result: CreateMessageBroadcast) => {
    sendMessageEvent(MessageEvents.CREATE_MESSAGE_BROADCAST, result);
});

onNet(MessageEvents.CREATE_MESSAGE_CONVERSATION_SUCCESS, (result: MessageConversationResponse) => {
    sendMessageEvent(MessageEvents.CREATE_MESSAGE_CONVERSATION_SUCCESS, result);
});

onNet(MessageEvents.UPDATE_MESSAGE_CONVERSATION_SUCCESS, (result: MessageConversationResponse) => {
    sendMessageEvent(MessageEvents.UPDATE_MESSAGE_CONVERSATION_SUCCESS, result);
});
