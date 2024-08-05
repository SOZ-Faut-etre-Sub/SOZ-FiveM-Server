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
import { mainLogger } from '../sv_logger';
import DarkwebDB from './darkweb.db';

export const darkwebLogger = mainLogger.child({ module: 'darkweb' });

// Functions

export async function getFormattedDarkwebConversations(): Promise<DarkwebConversation[]> {
    const darkwebConversations = await DarkwebDB.getDarkwebConversations();
    return darkwebConversations;
}

export async function getFormattedDarkwebParticipants(): Promise<DarkwebParticipant[]> {
    const darkwebParticipants = await DarkwebDB.getDarkwebParticipants();
    return darkwebParticipants;
}

export async function getFormattedDarkwebMessages(conversationId: number): Promise<DarkwebMessage[]> {
    const darkwebMessages = await DarkwebDB.getDarkwebMessages(conversationId);
    return darkwebMessages;
}

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

    const conversationId = await DarkwebDB.createDarkwebConversation(userIdentifier, password, label);

    if (!conversationId) {
        return {
            error: true,
        };
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

export async function getDarkwebConversation(conversationId: number) {
    const conversation: DarkwebConversation = await DarkwebDB.getDarkwebConversation(conversationId);
    return conversation;
}

export async function handleDarkwebUpdateParticipantUnreadStatus(
    conversationId: number,
    phoneNumber: string,
    status: boolean
) {
    return await DarkwebDB.setMessageUnread(conversationId, phoneNumber, status);
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

export async function archiveConversation(conversationId: number): Promise<Partial<DarkwebConversationArchiveResult>> {
    if (!conversationId) {
        throw new Error('conversationId was null');
    }

    const archiveREsult = await DarkwebDB.archiveConversation(conversationId);

    if (!archiveREsult) {
        return {
            error: true,
        };
    }

    const conversation = await DarkwebDB.getDarkwebConversation(conversationId);

    return {
        error: false,
        conversation: conversation,
    };
}
export async function updateConversation(
    conversationId: number,
    label: string,
    password: string
): Promise<Partial<DarkwebConversationUpdateResult>> {
    if (!conversationId || !label || !password) {
        throw new Error('At least one params was null');
    }

    const updateResult = await DarkwebDB.updateConversation(conversationId, label, password);

    if (!updateResult) {
        return {
            error: true,
        };
    }

    const conversation = await DarkwebDB.getDarkwebConversation(conversationId);

    return {
        error: false,
        conversation: conversation,
    };
}