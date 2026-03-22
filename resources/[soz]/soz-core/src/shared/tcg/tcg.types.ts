export const TCG_DAILY_FREE_CARDS = 2;

export interface TcgCardData {
    id: number;
    name: string;
    image: string;
}

export interface TcgDailyStatus {
    dailyLimit: number;
    claimedToday: number;
    remainingToday: number;
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
}
