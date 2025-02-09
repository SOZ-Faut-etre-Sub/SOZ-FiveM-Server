import {
    CreateMessageBroadcast,
    MessageConversationResponse,
    MessageEvents,
    PreDBMessage,
} from '../../typings/messages';
import { SocietyEvents } from '../../typings/society';
import { Delay } from '../utils/fivem';
import { sendMessageEvent } from '../utils/messages';
import { RegisterNuiCB, RegisterNuiProxy } from './cl_utils';

RegisterNuiProxy(MessageEvents.FETCH_MESSAGE_CONVERSATIONS);
RegisterNuiProxy(MessageEvents.FETCH_MESSAGES);
RegisterNuiProxy(MessageEvents.CREATE_MESSAGE_CONVERSATION);
RegisterNuiProxy(MessageEvents.DELETE_CONVERSATION);
RegisterNuiProxy(MessageEvents.SEND_MESSAGE);
RegisterNuiProxy(MessageEvents.SET_MESSAGE_READ);
RegisterNuiProxy(MessageEvents.SET_CONVERSATION_ARCHIVED);

RegisterNuiCB<void>(MessageEvents.SET_WAYPOINT, async (position: any, cb) => {
    if (position['x'] !== 0 && position['y'] !== 0 && position['radius'] != null) {
        const blip = AddBlipForRadius(
            parseInt(position['x']),
            parseInt(position['y']),
            parseInt(position['z']),
            parseInt(position['radius'])
        );
        SetBlipAlpha(blip, parseInt(position['alpha']));
        if (position['flash']) {
            SetBlipFlashes(blip, true);
        }
        if (position['color']) {
            SetBlipColour(blip, parseInt(position['color']));
        }
        if (position['alpha']) {
            SetBlipAlpha(blip, parseInt(position['alpha']));
        }

        setTimeout(() => RemoveBlip(blip), 60_000);
    }
    if (position['x'] !== 0 && position['y'] !== 0) {
        SetNewWaypoint(parseInt(position['x']), parseInt(position['y']));
    }
    cb({});
});

RegisterNuiCB<void>(MessageEvents.DELETE_WAYPOINT, async (any, cb) => {
    DeleteWaypoint();
    cb({});
});

RegisterNuiCB<void>(MessageEvents.GET_POSITION, async (position: any, cb) => {
    const [posX, posY, posZ] = GetEntityCoords(PlayerPedId(), true);
    cb({ data: { x: posX, y: posY, z: posZ } });
});

RegisterNuiCB<void>(MessageEvents.GET_DESTINATION, async (position: any, cb) => {
    const [posX, posY, posZ] = GetBlipInfoIdCoord(GetFirstBlipInfoId(8));
    cb({ data: { x: posX, y: posY, z: posZ } });
});

RegisterNuiCB<void>(SocietyEvents.SEND_CLIENT_POLICE_NOTIFICATION, async (message: any, cb) => {
    cb(exports['soz-core'].SendPoliceNotification(message));
});

RegisterNuiCB<void>(MessageEvents.GET_STREET_NAME, async (position: any, cb) => {
    const x = Number(position.x);
    const y = Number(position.y);
    const z = Number(position.z);

    const start = Date.now();
    while (!AreNodesLoadedForArea(x - 100, y - 100, x + 100, y + 100)) {
        await Delay(0);
        Citizen.invokeNative('0x2ee5fff3e1e3400d', x - 100, y - 100, x + 100, y + 100); //REQUEST_PATH_NODES_IN_AREA_THIS_FRAME
        if (Date.now() - start > 5000) {
            break;
        }
    }

    const [streetA, streetB] = GetStreetNameAtCoord(x, y, z);
    let street = `${GetStreetNameFromHashKey(streetA)}`;

    if (streetB && streetA !== streetB) {
        street += ` & ${GetStreetNameFromHashKey(streetB)}`;
    }
    cb({ data: street });
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
