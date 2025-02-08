import { BankData } from '@public/shared/phone/apps/bank';
import { LeaderboardInterface } from '@public/shared/phone/apps/game';
import { NewsMessage } from '@public/shared/phone/apps/news';
import { NoteItem } from '@public/shared/phone/apps/notes';
import { PhotoItem } from '@public/shared/phone/apps/photos';
import { SocietyMessage } from '@public/shared/phone/apps/society';
import { ActiveCall, CallHistory, Contact, Message, MessageConversation } from '@public/shared/phone/simcard';
import { ForecastWithTemperature } from '@public/shared/weather';

export interface NuiPhoneMap {
    SetAvailability: boolean;
    SetVisibility: boolean;
    SetPhoneFreeCamera: boolean;
    SetPhoneDisableFocus: boolean;
    SetTime: { hour: number; minute: number };

    SetEmergency: boolean;
    SetEmergencyDeath: string;

    SetSimCard: string;
    SetSimCardAvatar: string;

    SetSocietySimCard: string;

    SetCallSound: boolean;
    SetDialSound: boolean;
    SetEndSound: never;
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
    AppWeatherSetData: ForecastWithTemperature[];
    AppWeatherSetStormAlert: number;
}
