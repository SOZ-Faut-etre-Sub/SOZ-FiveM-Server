import { useAtomValue } from 'jotai/index';

import { participantsAtom } from '../darkweb.atom';

export const useParticipant = (participantNumber: string) => {
    return useAtomValue(participantsAtom).find(participant => participant.phoneNumber === participantNumber);
};

export const useParticipants = (conversationId: string) => {
    return useAtomValue(participantsAtom).filter(
        participant => participant.conversation_id.toString() === conversationId
    );
};
