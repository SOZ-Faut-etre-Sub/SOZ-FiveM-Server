import { useNuiEvent } from '@libs/nui/hooks/useNuiEvent';
import { DarkwebEvents } from '@typings/app/darkweb';
import { useEffect } from 'react';

import { store } from '../../store';

export const useAppDarkWebService = () => {
    useEffect(() => {
        store.dispatch.appDarkweb.loadDarkwebParticipants();
    }, []);

    useNuiEvent(
        'DARKWEB',
        DarkwebEvents.UPDATE_BROADCAST_CONVERSATION_MESSAGES_SUCCESS,
        store.dispatch.appDarkweb.handleMessageBroadcast
    );

    useNuiEvent(
        'DARKWEB',
        DarkwebEvents.UPDATE_BROADCAST_CONVERSATION_SUCCESS,
        store.dispatch.appDarkweb.handleConversationBroadcast
    );

    useNuiEvent(
        'DARKWEB',
        DarkwebEvents.UPDATE_BROADCAST_PARTICIPANTS_SUCCESS,
        store.dispatch.appDarkweb.handleParticipantsBroadcast
    );
};
