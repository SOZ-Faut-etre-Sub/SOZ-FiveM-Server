import { BankData } from '@public/shared/phone/apps/bank';
import { LeaderboardInterface } from '@public/shared/phone/apps/game';
import { NewsMessage } from '@public/shared/phone/apps/news';
import { NoteItem } from '@public/shared/phone/apps/notes';
import { PhotoItem } from '@public/shared/phone/apps/photos';

export interface NuiPhoneMap {
    SetAvailability: boolean;
    SetVisibility: boolean;
    SetTime: { hour: number; minute: number };

    SetSimCard: string;
    SetSimCardAvatar: string;

    SetSocietySimCard: string;

    // Apps
    AppBankSetData: BankData;
    AppNewsSetData: NewsMessage[];
    AppNewsAddData: NewsMessage;
    AppNotesSetData: NoteItem[];
    AppPhotosSetData: PhotoItem[];
    AppTetrisSetLeaderboard: LeaderboardInterface[];
}
