import { BankData } from '@public/shared/phone/apps/bank';
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
    AppNotesSetData: NoteItem[];
    AppPhotosSetData: PhotoItem[];
    AppBankSetData: BankData;
}
