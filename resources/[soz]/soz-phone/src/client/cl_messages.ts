import { CreateMessageBroadcast, MessageConversationResponse, MessageEvents, PreDBMessage } from "../../typings/messages";
import { SocietyEvents } from "../../typings/society";
import { Delay } from "../utils/fivem";
import { sendMessageEvent } from "../utils/messages";
import { RegisterNuiCB, RegisterNuiProxy } from "./cl_utils";

RegisterNuiCB<void>(SocietyEvents.SEND_CLIENT_POLICE_NOTIFICATION, async (message: any, cb) => {
    cb(exports["soz-core"].SendPoliceNotification(message));
});
