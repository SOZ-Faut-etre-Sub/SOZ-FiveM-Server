export const TCG_DAILY_FREE_CARDS = 3;
export const TCG_USERNAME_MIN = 3;
export const TCG_USERNAME_MAX = 20;
export const TCG_USERNAME_REGEX = /^[a-zA-Z0-9]+$/;
export const TCG_SHOWCASE_MAX = 3;
export const TCG_SHOWCASE_DESC_MAX = 30;
export const TCG_SHOWCASE_DESC_REGEX = /^[a-zA-Z0-9 ]*$/;
export const TCG_SET_SIZE = 7;
export const TCG_BIO_MAX = 50;
export const TCG_BIO_REGEX = /^[a-zA-Z0-9àâäéèêëïîôùûüÿçœæÀÂÄÉÈÊËÏÎÔÙÛÜŸÇŒÆ !?.,'\-]*$/;
export const TCG_AVATAR_MAX_SIZE = 500000; // 500KB max for base64 avatar

// --- Archetypes ---

export const TCG_ARCHETYPES = [
    'Pompier',
    'Medical',
    'Militaire',
    "Forces de l'ordre",
    'Clandestin',
    'Plage',
    'Nature',
    'Academique',
    'Luxe',
    'Streetwear',
    'Festif',
    'Sportif',
    'Hotelier',
    'Bureau',
    'Commerce',
    'Ouvrier',
    'Transport',
    'Artiste',
    'Post-Apo',
    'Urbain Nocturne',
    'Urbain Interieur',
    'Urbain Street',
    // Cosplay
    'Fox',
    'Cat',
    'Bunny',
    'Loup',
    'Elf',
    'Demon',
    'Ange',
    // Events (ajouter ici au fur et à mesure)
    'Halloween',
] as const;

export type TcgArchetype = (typeof TCG_ARCHETYPES)[number];

// Catégories d'archétypes pour les compteurs
export const TCG_CUTE_ARCHETYPES: string[] = ['Fox', 'Cat', 'Bunny', 'Loup', 'Elf', 'Demon', 'Ange'];
export const TCG_EVENT_ARCHETYPES: string[] = ['Halloween']; // Ajouter les events ici
export type TcgArchetypeCategory = 'classic' | 'cute' | 'event';

export function getArchetypeCategory(archetype: string | null): TcgArchetypeCategory {
    if (!archetype) return 'classic';
    if (TCG_CUTE_ARCHETYPES.includes(archetype)) return 'cute';
    if (TCG_EVENT_ARCHETYPES.includes(archetype)) return 'event';
    return 'classic';
}

// --- Card data ---

export interface TcgCardData {
    id: number;
    name: string;
    image: string;
    archetype: string | null;
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
    archetype: string | null;
    obtainedAt: string;
    isShowcase?: boolean;
    isProtected?: boolean;
}

// --- Profile / Username ---

export interface TcgProfile {
    citizenid: string;
    username: string;
}

export interface TcgProfileResult {
    success: boolean;
    username?: string;
    avatar?: string | null;
    border?: TcgBorderData | null;
    message?: string;
}

// --- Profile Page (public profile visible by others) ---

export interface TcgProfilePage {
    citizenid: string;
    username: string;
    bio: string | null;
    avatar: string | null;
    border: TcgBorderData | null;
    showcase: TcgShowcaseItem[];
    badges: TcgBadge[];
    allBadges?: TcgBadge[]; // only on own profile: full list with progression
    isContact: boolean;
    hasPendingRequest: boolean;
    isOwnProfile: boolean;
    availableBorders: TcgBorderData[];
}

export interface TcgBadge {
    id: string;
    label: string;
    description: string;
    icon: string;
    image: string | null; // path to .webp badge image, null = fallback to icon emoji
    category: 'collector' | 'trader' | 'merchant';
    earned: boolean;
    progress?: number;
    target?: number;
}

export interface TcgBorderData {
    id: number;
    name: string;
    image: string; // relative path for getPath()
}

// --- Avatar ---

export interface TcgAvatarSource {
    type: 'gallery' | 'card';
    imageUrl: string; // full URL for gallery, or card image path for card
}

export interface TcgSetAvatarResult {
    success: boolean;
    avatar?: string;
    message?: string;
}

export interface TcgSetBorderResult {
    success: boolean;
    message?: string;
}

// --- Contacts ---

export type TcgContactStatus = 'pending' | 'accepted' | 'rejected';

export interface TcgContact {
    id: number;
    citizenid: string;
    targetId: string;
    displayName: string;
    avatar: string | null;
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
    archetype: string | null;
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
    cardArchetype: string | null;
    username: string;
    avatar: string | null;
    description: string;
    createdAt: string;
}

export interface TcgShowcaseResult {
    success: boolean;
    message?: string;
}

// --- Sell Set ---

export interface TcgSellSetResult {
    success: boolean;
    message?: string;
    releasedCount?: number;
}