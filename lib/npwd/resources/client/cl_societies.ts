import {SocietyEvents, SocietyMessage} from '../../typings/society';
import { RegisterNuiProxy } from './cl_utils';
import {sendMessage} from "../utils/messages";
import apps from "../utils/apps";

RegisterNuiProxy(SocietyEvents.SEND_SOCIETY_MESSAGE);
RegisterNuiProxy(SocietyEvents.FETCH_SOCIETY_MESSAGES);
RegisterNuiProxy(SocietyEvents.RESET_SOCIETY_MESSAGES);
RegisterNuiProxy(SocietyEvents.UPDATE_SOCIETY_MESSAGE);

onNet(SocietyEvents.CREATE_MESSAGE_BROADCAST, (result: SocietyMessage) => {
  sendMessage(apps.SOCIETY_MESSAGES, SocietyEvents.CREATE_MESSAGE_BROADCAST, result);
});

onNet(SocietyEvents.RESET_SOCIETY_MESSAGES, () => {
  sendMessage(apps.SOCIETY_MESSAGES, SocietyEvents.RESET_SOCIETY_MESSAGES, null);
});