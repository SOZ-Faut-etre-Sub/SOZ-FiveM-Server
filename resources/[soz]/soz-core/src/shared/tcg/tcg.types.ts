export const TCG_DAILY_FREE_CARDS = 2;
export const TCG_USERNAME_MIN = 3;
export const TCG_USERNAME_MAX = 20;
export const TCG_USERNAME_REGEX = /^[a-zA-Z0-9]+$/;
export const TCG_SHOWCASE_MAX = 3;
export const TCG_SHOWCASE_DESC_MAX = 30;
export const TCG_SHOWCASE_DESC_REGEX = /^[a-zA-Z0-9 ]*$/;

// --- Card data ---

export interface TcgCardData {
    id: number;
    name: string;
    image: string;
}

export interface TcgDailyStatus {
    dailyLimit: number;
    claimedToday: number;
    remainingToday: number;
    availableCards: number;
}

export interface TcgClaimResult {
    success: boolean;
    cards: TcgCardData[];
    remainingToday: number;
    message?: string;
}

export interface TcgCollectionCard {
    userCardId: number;
    cardId: number;
    name: string;
    image: string;
    obtainedAt: string;
    isWallpaper?: boolean;
    isShowcase?: boolean;
}

// --- Profile / Username ---

export interface TcgProfile {
    citizenid: string;
    username: string;
}

export interface TcgProfileResult {
    success: boolean;
    username?: string;
    message?: string;
}

// --- Wallpaper ---

export interface TcgWallpaperResult {
    success: boolean;
    image?: string;
    message?: string;
}

// --- Contacts ---

export type TcgContactStatus = 'pending' | 'accepted' | 'rejected';

export interface TcgContact {
    id: number;
    citizenid: string;
    targetId: string;
    displayName: string;
    status: TcgContactStatus;
    isSender: boolean;
    createdAt: string;
    message?: string;
}

export interface TcgContactRequest {
    success: boolean;
    message?: string;
}

export interface TcgContactCollectionCard {
    cardId: number;
    name: string;
    image: string;
    obtainedAt: string;
}

// --- Trade ---

export type TcgTradeOfferType = 'card' | 'money';

export type TcgTradeStatus = 'pending' | 'accepted' | 'refused' | 'cancelled' | 'counter';

export interface TcgTradeOffer {
    id: number;
    senderId: string;
    senderName: string;
    receiverId: string;
    receiverName: string;
    requestedCardId: number;
    requestedCardName: string;
    requestedCardImage: string;
    offerType: TcgTradeOfferType;
    offerCardId: number | null;
    offerCardName: string | null;
    offerCardImage: string | null;
    offerAmount: number | null;
    status: TcgTradeStatus;
    message: string | null;
    createdAt: string;
    isReceiver: boolean;
}

export interface TcgTradeResult {
    success: boolean;
    message?: string;
}

export interface TcgCreateTradeInput {
    receiverId: string;
    requestedCardId: number;
    offerType: TcgTradeOfferType;
    offerCardId?: number;
    offerAmount?: number;
}

export interface TcgRespondTradeInput {
    tradeId: number;
    action: 'accept' | 'refuse';
    message?: string;
}

// --- Showcase (Vitrine) ---

export interface TcgShowcaseItem {
    id: number;
	citizenid: string;
    cardId: number;
    cardName: string;
    cardImage: string;
    username: string;
    description: string;
    createdAt: string;
}

export interface TcgShowcaseResult {
    success: boolean;
    message?: string;
}
