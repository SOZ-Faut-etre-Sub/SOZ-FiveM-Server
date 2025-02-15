import { useAtomValue } from 'jotai/index';
import { useMemo } from 'react';

import { participantsAtom } from '../darkweb.atom';

export const useParticipant = (conversationId: string | number, participantNumber: string) => {
    const participants = useParticipants(conversationId?.toString());
    return useMemo(
        () => participants?.find(participant => participant.phoneNumber === participantNumber),
        [participants, conversationId, participantNumber]
    );
};

export const useParticipants = (conversationId: string) => {
    const participants = useAtomValue(participantsAtom);

    return useMemo(
        () => participants?.filter(participant => participant.conversation_id.toString() === conversationId),
        [participants, conversationId]
    );
};
