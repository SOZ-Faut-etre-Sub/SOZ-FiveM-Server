import {
    DarkwebConversation,
    DarkwebConversationArchiveResult,
    DarkwebConversationResult,
    DarkwebConversationUpdateResult,
    DarkwebMessage,
    DarkwebMessageResult,
    DarkwebParticipant,
    DarkwebParticipantUpdateResult,
} from '../../../typings/app/darkweb';
import PlayerService from '../players/player.service';
import {mainLogger} from '../sv_logger';
import DarkwebDB from './darkweb.db';

export const darkwebLogger = mainLogger.child({module: 'darkweb'});

// Functions

export async function createDarkwebConversation(
    label: string,
    password: string,
    source: number
): Promise<Partial<DarkwebConversationResult>> {
    const player = await PlayerService.getPlayer(source);
    const userIdentifier = player.getIdentifier();
    const phoneNumber = player.getPhoneNumber();

    if (!userIdentifier || !password || !label) {
        throw new Error('userIdentifier was null');
    }

    await DarkwebDB.addParticipant(conversationId, userIdentifier, 'ADMIN', phoneNumber);

    const conversation = await DarkwebDB.getDarkwebConversation(conversationId);
    const conversationParicipants = await DarkwebDB.getDarkwebConversationParticipants(conversationId);

    return {
        error: false,
        conversation: conversation,
        conversationParticipants: conversationParicipants,
    };
}

export async function getDarkwebConversationParticipants(conversationId: number) {
    const conversationParicipants: DarkwebParticipant[] = await DarkwebDB.getDarkwebConversationParticipants(
        conversationId
    );
    return conversationParicipants;
}

export async function sendDarkwebMessage(
    conversationId: number,
    message: string,
    source: number
): Promise<Partial<DarkwebMessageResult>> {
    const player = await PlayerService.getPlayer(source);
    const userIdentifier = player.getIdentifier();
    const phoneNumber = player.getPhoneNumber();

    if (!userIdentifier || !conversationId || !message) {
        throw new Error('userIdentifier was null');
    }

    const messageId = await DarkwebDB.sendMessage(userIdentifier, phoneNumber, conversationId, message);
    const participants: DarkwebParticipant[] = await DarkwebDB.getDarkwebConversationParticipants(conversationId);
    if (!messageId) {
        return {
            error: true,
        };
    }

    if (participants.filter(participant => participant.phoneNumber === phoneNumber).length === 0) {
        await DarkwebDB.addParticipant(conversationId, userIdentifier, 'USER', phoneNumber);
    }

    const createdMessage = await DarkwebDB.getDarkwebMessage(messageId);
    return {
        error: false,
        message: createdMessage,
    };
}

export async function updateDarkwebConversationParticipantRole(
    conversationId: number,
    phoneNumber: string,
    role: string
): Promise<Partial<DarkwebParticipantUpdateResult>> {
    if (!phoneNumber || !conversationId) {
        throw new Error('At least on params was null');
    }

    const participation = await DarkwebDB.updateDarkwebConversationParticipant(role, phoneNumber, conversationId);

    if (!participation) {
        return {
            error: true,
        };
    }

    if (participation['affectedRows'] === 0) {
        const identifier = await PlayerService.getIdentifierFromPhoneNumber(phoneNumber, true);
        await DarkwebDB.addParticipant(conversationId, identifier, role, phoneNumber);
    }

    const participant = await DarkwebDB.getDarkwebParticipant(conversationId, phoneNumber);

    return {
        error: false,
        participant: participant.find(
            darkwebParticipant =>
                darkwebParticipant.phoneNumber === phoneNumber && darkwebParticipant.conversation_id === conversationId
        ),
    };
}

