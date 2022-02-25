import {useNuiEvent} from 'fivem-nui-react-lib';
import {useLocation} from "react-router-dom";
import {usePhoneVisibility} from "@os/phone/hooks/usePhoneVisibility";
import {useMessageNotifications} from "./useMessageNotifications";
import {SocietyEvents, SocietyMessage} from "@typings/society";
import {useMessageActions} from "./useMessageActions";
import {useMessagesState} from "./state";
import {fetchNui} from "@utils/fetchNui";
import {ServerPromiseResp} from "@typings/common";
import {buildRespObj} from "@utils/misc";
import {MockSocietyMessages} from "../utils/constants";

export const useSocietyMessagesService = () => {
    const {setNotification} = useMessageNotifications();
    const {updateLocalMessages} = useMessageActions();
    const {pathname} = useLocation();
    const {visibility} = usePhoneVisibility();
    const [, setMessages] = useMessagesState()

    const handleMessageBroadcast = ({id, conversation_id, source_phone, message, position, isTaken, isDone, createdAt, updatedAt}) => {
        if (visibility && pathname.includes('/society-messages')) {
            return;
        }

        setNotification({message});
        updateLocalMessages({id, conversation_id, source_phone, message, position, isTaken, isDone, createdAt, updatedAt});
    };

    const handleResetMessages = async () => {
        try {
            const resp = await fetchNui<ServerPromiseResp<SocietyMessage[]>>(
                SocietyEvents.FETCH_SOCIETY_MESSAGES,
                undefined,
                buildRespObj(MockSocietyMessages),
            );
            setMessages(resp.data.reverse())
        } catch (e) {
            console.error(e);
            setMessages([])
        }
    };

    useNuiEvent('SOCIETY_MESSAGES', SocietyEvents.CREATE_MESSAGE_BROADCAST, handleMessageBroadcast);
    useNuiEvent('SOCIETY_MESSAGES', SocietyEvents.RESET_SOCIETY_MESSAGES, handleResetMessages);
};
