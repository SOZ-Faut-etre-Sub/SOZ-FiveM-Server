import { BankData } from '@public/shared/phone/apps/bank';
import { LeaderboardInterface } from '@public/shared/phone/apps/game';
import { NewsMessage } from '@public/shared/phone/apps/news';
import { NoteItem } from '@public/shared/phone/apps/notes';
import { PhotoItem } from '@public/shared/phone/apps/photos';
import { SocietyMessage } from '@public/shared/phone/apps/society';
import { ActiveCall, CallHistory, Contact, Message, MessageConversation } from '@public/shared/phone/simcard';

export interface NuiPhoneMap {
    SetAvailability: boolean;
    SetVisibility: boolean;
    SetPhoneFreeCamera: boolean;
    SetTime: { hour: number; minute: number };

    SetSimCard: string;
    SetSimCardAvatar: string;

    SetSocietySimCard: string;

    SetCurrentCall: ActiveCall;
    SetCallsHistory: CallHistory[];

    SetConversations: MessageConversation[];
    UpdateConversation: MessageConversation;

    SetMessages: Message[];
    AddMessage: Message;

    SetContacts: Contact[];
    AddContact: Contact;
    UpdateContact: Contact;
    RemoveContact: number;

    // Apps
    AppDarkWebHasDongle: boolean;
    AppBankSetData: BankData;
    AppNewsSetData: NewsMessage[];
    AppNewsAddData: NewsMessage;
    AppNotesSetData: NoteItem[];
    AppPhotosSetData: PhotoItem[];
    AppPhotosAddData: PhotoItem;
    AppTetrisSetLeaderboard: LeaderboardInterface[];
    AppSnakeSetLeaderboard: LeaderboardInterface[];
    AppSocietySetData: SocietyMessage[];
    AppSocietyPatchData: SocietyMessage;
}
